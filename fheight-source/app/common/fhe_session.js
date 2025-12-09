'use strict';

/**
 * FHE Session Manager
 * ZAMA FHEVM session key ve decrypt yonetimi
 *
 * AKIS:
 * 1. generateKeypair() - Session key cifti olustur (tarayicida)
 * 2. createSessionSignature() - MetaMask ile imzala (1 popup)
 * 3. Artik popup'siz decrypt yapilabilir
 */

var Promise = require('bluebird');
var Logger = require('app/common/logger');
var Wallet = require('app/common/wallet');

// FHEVM Contract adresleri (Sepolia)
var DEPLOYED_CONTRACTS = {
  sepolia: {
    GameSession: '0x64A19A560643Cf39BA3FbbcF405F3545f6E813CB',
    CardRegistry: '0xf9EB68605c1df066fC944c28770fFF8476ADE8fc',
    SpiritOrb: '0xD0C7a512BAEaCe7a52E9BEe47A1B13868A0345B3',
    CardNFT: '0xD200776dE5A8472382F5b8b902a676E2117d7A31',
    GameGold: '0xdB1274A736812A28b782879128f237f35fed7B81'
  },
  hardhat: {
    GameSession: '0x322813Fd9A801c5507c9de605d63CEA4f2CE6c44',
    CardRegistry: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82',
    SpiritOrb: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    CardNFT: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    GameGold: '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853'
  }
};

// Session storage key
var SESSION_STORAGE_KEY = 'fheight_fhe_session';

// Session suresi (24 saat)
var SESSION_DURATION_DAYS = 1;

/**
 * FHE Session Manager
 */
function FHESessionManager() {
  this.keypair = null;
  this.signature = null;
  this.sessionStartTime = null;
  this.sessionExpiry = null;
  this.contractAddresses = null;
  this.initialized = false;
}

/**
 * Session'i localStorage'dan yukle
 */
FHESessionManager.prototype.loadSession = function() {
  try {
    var stored = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return false;

    var session = JSON.parse(stored);

    // Suresi dolmus mu kontrol et
    if (session.expiry && Date.now() > session.expiry) {
      Logger.module('FHE_SESSION').log('Session expired, clearing');
      this.clearSession();
      return false;
    }

    this.keypair = {
      publicKey: session.publicKey,
      privateKey: session.privateKey
    };
    this.signature = session.signature;
    this.sessionStartTime = session.startTime;
    this.sessionExpiry = session.expiry;
    this.contractAddresses = session.contractAddresses;
    this.initialized = true;

    Logger.module('FHE_SESSION').log('Session loaded from storage');
    return true;
  } catch (e) {
    Logger.module('FHE_SESSION').error('Failed to load session:', e);
    return false;
  }
};

/**
 * Session'i localStorage'a kaydet
 */
FHESessionManager.prototype.saveSession = function() {
  try {
    var session = {
      publicKey: this.keypair.publicKey,
      privateKey: this.keypair.privateKey,
      signature: this.signature,
      startTime: this.sessionStartTime,
      expiry: this.sessionExpiry,
      contractAddresses: this.contractAddresses
    };

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    Logger.module('FHE_SESSION').log('Session saved to storage');
  } catch (e) {
    Logger.module('FHE_SESSION').error('Failed to save session:', e);
  }
};

/**
 * Session'i temizle
 */
FHESessionManager.prototype.clearSession = function() {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  this.keypair = null;
  this.signature = null;
  this.sessionStartTime = null;
  this.sessionExpiry = null;
  this.initialized = false;
  Logger.module('FHE_SESSION').log('Session cleared');
};

/**
 * Session gecerli mi?
 */
FHESessionManager.prototype.isSessionValid = function() {
  if (!this.initialized || !this.keypair || !this.signature) {
    return false;
  }

  if (this.sessionExpiry && Date.now() > this.sessionExpiry) {
    return false;
  }

  return true;
};

/**
 * Keypair olustur (tarayicida, random)
 */
FHESessionManager.prototype.generateKeypair = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    try {
      // Crypto API ile random bytes olustur
      var privateKeyBytes = new Uint8Array(32);
      window.crypto.getRandomValues(privateKeyBytes);

      // Hex string'e cevir
      var privateKey = '0x' + Array.from(privateKeyBytes)
        .map(function(b) { return b.toString(16).padStart(2, '0'); })
        .join('');

      // PublicKey = privateKey'den turetilir
      // Gercek implementasyonda elliptic curve kullanilir
      // Simdilik basit hash kullaniyoruz
      var publicKey = self._derivePublicKey(privateKey);

      self.keypair = {
        publicKey: publicKey,
        privateKey: privateKey
      };

      Logger.module('FHE_SESSION').log('Keypair generated');
      resolve(self.keypair);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * PublicKey'i privateKey'den turet
 * Not: Gercek implementasyonda secp256k1 kullanilir
 */
FHESessionManager.prototype._derivePublicKey = function(privateKey) {
  // Basitlesitirilmis - gercekte ethers.js SigningKey kullanilir
  // Simdilik privateKey'in hash'ini publicKey olarak kullan
  var hash = this._simpleHash(privateKey);
  return '0x04' + hash.slice(2); // 0x04 = uncompressed public key prefix
};

/**
 * Basit hash fonksiyonu
 */
FHESessionManager.prototype._simpleHash = function(input) {
  var hash = 0;
  for (var i = 0; i < input.length; i++) {
    var char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
};

/**
 * EIP-712 typed data olustur
 */
FHESessionManager.prototype.createEIP712TypedData = function(contractAddresses, userAddress) {
  var self = this;
  var chainId = Wallet.TARGET_NETWORK === 'sepolia' ? 11155111 : 31337;
  var startTime = Math.floor(Date.now() / 1000);
  var duration = SESSION_DURATION_DAYS * 24 * 60 * 60; // saniye cinsinden

  // Contract adreslerini array'e cevir
  var contracts = Array.isArray(contractAddresses) ? contractAddresses : [contractAddresses];

  self.contractAddresses = contracts;
  self.sessionStartTime = startTime * 1000; // ms cinsinden sakla
  self.sessionExpiry = (startTime + duration) * 1000;

  return {
    domain: {
      name: 'FHEVM Reencryption',
      version: '1',
      chainId: chainId
    },
    types: {
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' }
      ],
      Reencrypt: [
        { name: 'publicKey', type: 'bytes' },
        { name: 'contracts', type: 'address[]' },
        { name: 'user', type: 'address' },
        { name: 'startTime', type: 'uint256' },
        { name: 'duration', type: 'uint256' }
      ]
    },
    primaryType: 'Reencrypt',
    message: {
      publicKey: self.keypair.publicKey,
      contracts: contracts,
      user: userAddress,
      startTime: startTime,
      duration: duration
    }
  };
};

/**
 * Session signature al (MetaMask popup)
 * @param {string|string[]} contractAddresses - Izin verilecek contract adresleri
 * @returns {Promise<string>} signature
 */
FHESessionManager.prototype.createSessionSignature = function(contractAddresses) {
  var self = this;
  var walletManager = Wallet.getInstance();

  return new Promise(function(resolve, reject) {
    if (!walletManager.connected) {
      reject(new Error('Wallet not connected'));
      return;
    }

    if (!self.keypair) {
      reject(new Error('Keypair not generated. Call generateKeypair() first'));
      return;
    }

    var userAddress = walletManager.address;
    var typedData = self.createEIP712TypedData(contractAddresses, userAddress);

    Logger.module('FHE_SESSION').log('Requesting session signature...');

    // EIP-712 imza iste
    walletManager.provider.request({
      method: 'eth_signTypedData_v4',
      params: [userAddress, JSON.stringify(typedData)]
    })
    .then(function(signature) {
      self.signature = signature;
      self.initialized = true;

      // localStorage'a kaydet
      self.saveSession();

      Logger.module('FHE_SESSION').log('Session signature obtained');
      resolve(signature);
    })
    .catch(function(error) {
      Logger.module('FHE_SESSION').error('Signature request failed:', error);
      if (error.code === 4001) {
        reject(new Error('User rejected session signature'));
      } else {
        reject(error);
      }
    });
  });
};

/**
 * Tam session baslatma akisi
 * 1. Keypair olustur
 * 2. Signature al
 * @param {string|string[]} contractAddresses
 * @returns {Promise<object>} { publicKey, signature }
 */
FHESessionManager.prototype.initializeSession = function(contractAddresses) {
  var self = this;

  // Once mevcut session'i kontrol et
  if (self.loadSession() && self.isSessionValid()) {
    Logger.module('FHE_SESSION').log('Using existing valid session');
    return Promise.resolve({
      publicKey: self.keypair.publicKey,
      signature: self.signature,
      fromCache: true
    });
  }

  // Yeni session olustur
  return self.generateKeypair()
    .then(function() {
      return self.createSessionSignature(contractAddresses);
    })
    .then(function(signature) {
      return {
        publicKey: self.keypair.publicKey,
        signature: signature,
        fromCache: false
      };
    });
};

/**
 * KMS'e decrypt istegi gonder
 * @param {string[]} handles - Encrypted deger handle'lari
 * @param {string} contractAddress - Contract adresi
 * @returns {Promise<any[]>} Decrypted degerler
 */
FHESessionManager.prototype.decrypt = function(handles, contractAddress) {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (!self.isSessionValid()) {
      reject(new Error('Session not valid. Call initializeSession() first'));
      return;
    }

    // KMS endpoint (Sepolia testnet)
    var kmsEndpoint = 'https://kms.testnet.zama.ai/decrypt';

    var requestBody = {
      handles: handles,
      publicKey: self.keypair.publicKey,
      signature: self.signature,
      contractAddress: contractAddress,
      userAddress: Wallet.getInstance().address
    };

    Logger.module('FHE_SESSION').log('Requesting decrypt from KMS...', { handles: handles.length });

    fetch(kmsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('KMS request failed: ' + response.status);
      }
      return response.json();
    })
    .then(function(result) {
      // KMS encrypted degerler doner (senin publicKey ile)
      // Bunlari privateKey ile decrypt et
      var decrypted = result.encryptedValues.map(function(encValue) {
        return self._decryptWithPrivateKey(encValue);
      });

      Logger.module('FHE_SESSION').log('Decrypt successful', { count: decrypted.length });
      resolve(decrypted);
    })
    .catch(function(error) {
      Logger.module('FHE_SESSION').error('Decrypt failed:', error);
      reject(error);
    });
  });
};

/**
 * PrivateKey ile decrypt (KMS'ten gelen reencrypted degeri ac)
 * Not: Gercek implementasyonda ECIES kullanilir
 */
FHESessionManager.prototype._decryptWithPrivateKey = function(encryptedValue) {
  // Basitlestirilmis - gercek ECIES decrypt
  // KMS, publicKey ile sifrelemis, biz privateKey ile aciyoruz
  // Simdilik direkt deger dondur (test icin)
  return encryptedValue;
};

/**
 * Network'e gore contract adreslerini al
 * Dinamik olarak wallet'in bagli oldugu network'u kullanir
 */
FHESessionManager.prototype.getContractAddresses = function(network) {
  var self = this;

  // Eger network verilmisse onu kullan
  if (network) {
    return DEPLOYED_CONTRACTS[network] || DEPLOYED_CONTRACTS.sepolia;
  }

  // Wallet'tan guncel network'u al
  var walletManager = Wallet.getInstance();
  var currentNet = Wallet.getCurrentNetwork();

  // Eger cached network varsa kullan
  if (currentNet && DEPLOYED_CONTRACTS[currentNet]) {
    return DEPLOYED_CONTRACTS[currentNet];
  }

  // Fallback: TARGET_NETWORK
  return DEPLOYED_CONTRACTS[Wallet.TARGET_NETWORK] || DEPLOYED_CONTRACTS.sepolia;
};

/**
 * Async olarak guncel network'e gore contract adreslerini al
 * @returns {Promise<object>}
 */
FHESessionManager.prototype.getContractAddressesAsync = function() {
  var self = this;
  var walletManager = Wallet.getInstance();

  return walletManager.getCurrentNetwork().then(function(network) {
    // Cache'e kaydet
    Wallet.setCurrentNetwork(network);
    Logger.module('FHE_SESSION').log('Detected network:', network);

    var contracts = DEPLOYED_CONTRACTS[network];
    if (!contracts) {
      Logger.module('FHE_SESSION').warn('Unknown network, falling back to sepolia');
      return DEPLOYED_CONTRACTS.sepolia;
    }
    return contracts;
  });
};

/**
 * GameSession contract adresi
 */
FHESessionManager.prototype.getGameSessionAddress = function() {
  return this.getContractAddresses().GameSession;
};

// Singleton instance
var instance = null;

module.exports = {
  getInstance: function() {
    if (!instance) {
      instance = new FHESessionManager();
    }
    return instance;
  },
  DEPLOYED_CONTRACTS: DEPLOYED_CONTRACTS,
  SESSION_DURATION_DAYS: SESSION_DURATION_DAYS
};
