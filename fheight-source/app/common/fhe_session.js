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
var ethers = require('ethers');

// FHEVM Contract adresleri (Sepolia)
var DEPLOYED_CONTRACTS = {
  sepolia: {
    GameSession: '0xeDAbEB1A3540e7A6b319d2BA38B7d6598E33675a', // v12 - ACL fix: FHE.allow for all deck cards (TX-free card draw)
    CardRegistry: '0x1BD8190C546D58518E438eCC65E7aE01fEd4c169', // with 18 generals + 17 minions
    SpiritOrb: '0xD0C7a512BAEaCe7a52E9BEe47A1B13868A0345B3',
    CardNFT: '0xD200776dE5A8472382F5b8b902a676E2117d7A31',
    GameGold: '0xdB1274A736812A28b782879128f237f35fed7B81'
  },
  hardhat: {
    GameGold: '0x9E545E3C0baAB3E08CdfD552C960A1050f373042',
    CardNFT: '0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9',
    SpiritOrb: '0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8',
    CardRegistry: '0x998abeb3E57409262aE5b751f60747921B33613E',
    FHECounter: '0x809d550fca64d94Bd9F66E60752A544199cfAC3D',
    GameSession: '0xb7278A61aa25c888815aFC32Ad3cC52fF24fE575' // v7 - single player mode support
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
  this._fhevmInstance = null; // SDK instance for decrypt
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

    // Key format kontrolu - ML-KEM keyleri cok daha uzun
    // Eski sahte hex key'ler ~70 karakter, gercek ML-KEM public key binlerce byte
    // Public key Uint8Array olmali veya cok uzun bir hex string
    var pubKey = session.publicKey;
    var isValidKeyFormat = false;

    if (pubKey) {
      // Uint8Array ise gecerli
      if (pubKey instanceof Uint8Array || (pubKey.type === 'Buffer' && pubKey.data)) {
        isValidKeyFormat = true;
      }
      // String ise uzunlugunu kontrol et (ML-KEM public key ~1600 byte = ~3200 hex char)
      else if (typeof pubKey === 'string') {
        // 0x04 ile baslayan kisa key eski sahte key
        if (pubKey.startsWith('0x04') && pubKey.length < 200) {
          isValidKeyFormat = false;
          Logger.module('FHE_SESSION').warn('Detected old mock key format, clearing session');
        } else if (pubKey.length > 1000) {
          // Uzun key muhtemelen gecerli ML-KEM key
          isValidKeyFormat = true;
        }
      }
      // Object ise (serialized Uint8Array) gecerli
      else if (typeof pubKey === 'object') {
        isValidKeyFormat = true;
      }
    }

    if (!isValidKeyFormat) {
      Logger.module('FHE_SESSION').log('Invalid key format detected, clearing session');
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
    // Signature parametrelerini yukle - userDecrypt'te kullanilacak
    this.sessionStartTimeStamp = session.sessionStartTimeStamp;
    this.sessionDurationDays = session.sessionDurationDays;
    this.initialized = true;

    Logger.module('FHE_SESSION').log('Session loaded from storage');
    Logger.module('FHE_SESSION').log('Session params:', {
      startTimeStamp: this.sessionStartTimeStamp,
      durationDays: this.sessionDurationDays
    });
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
      contractAddresses: this.contractAddresses,
      // Signature parametreleri - userDecrypt'te AYNI degerler kullanilmali!
      sessionStartTimeStamp: this.sessionStartTimeStamp,
      sessionDurationDays: this.sessionDurationDays
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
  this.sessionStartTimeStamp = null;
  this.sessionDurationDays = null;
  this.contractAddresses = null;
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
 * Keypair olustur (ZAMA SDK ile - ML-KEM keypair)
 * SDK'nin generateKeypair fonksiyonu dogru formatta key cifti uretir
 */
FHESessionManager.prototype.generateKeypair = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    // Oncelikle SDK instance'ini hazirla
    self._initFhevmInstance()
      .then(function() {
        // SDK instance varsa onun generateKeypair'ini kullan
        if (self._fhevmInstance && typeof self._fhevmInstance.generateKeypair === 'function') {
          Logger.module('FHE_SESSION').log('Generating keypair using SDK instance...');
          var keypair = self._fhevmInstance.generateKeypair();
          self.keypair = {
            publicKey: keypair.publicKey,
            privateKey: keypair.privateKey
          };
          Logger.module('FHE_SESSION').log('Keypair generated via SDK');
          resolve(self.keypair);
          return;
        }

        // Global SDK'da generateKeypair varsa kullan
        var sdk = window.relayerSDK || window.fhevm;
        if (sdk && typeof sdk.generateKeypair === 'function') {
          Logger.module('FHE_SESSION').log('Generating keypair using global SDK...');
          var keypair = sdk.generateKeypair();
          self.keypair = {
            publicKey: keypair.publicKey,
            privateKey: keypair.privateKey
          };
          Logger.module('FHE_SESSION').log('Keypair generated via global SDK');
          resolve(self.keypair);
          return;
        }

        // SDK yoksa fallback - mock mode icin basit key
        Logger.module('FHE_SESSION').warn('SDK not available, using mock keypair (only works on local network)');
        var privateKeyBytes = new Uint8Array(32);
        window.crypto.getRandomValues(privateKeyBytes);
        var privateKey = '0x' + Array.from(privateKeyBytes)
          .map(function(b) { return b.toString(16).padStart(2, '0'); })
          .join('');
        var publicKey = self._derivePublicKey(privateKey);

        self.keypair = {
          publicKey: publicKey,
          privateKey: privateKey
        };

        Logger.module('FHE_SESSION').log('Mock keypair generated');
        resolve(self.keypair);
      })
      .catch(function(err) {
        Logger.module('FHE_SESSION').error('Keypair generation failed:', err);
        reject(err);
      });
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
 * SDK'nin createEIP712 fonksiyonunu kullanarak dogru formatta signature olustur
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

    if (!self._fhevmInstance) {
      reject(new Error('FHEVM instance not initialized'));
      return;
    }

    var userAddress = walletManager.address;
    var contracts = Array.isArray(contractAddresses) ? contractAddresses : [contractAddresses];

    // Timestamp ve duration - bunlar signature ile eslesmeli!
    var startTimeStamp = Math.floor(Date.now() / 1000).toString();
    var durationDays = SESSION_DURATION_DAYS.toString();

    // SDK'nin createEIP712 fonksiyonunu kullan - DOKUMANTASYONA GORE
    var eip712 = self._fhevmInstance.createEIP712(
      self.keypair.publicKey,
      contracts,
      startTimeStamp,
      durationDays
    );

    Logger.module('FHE_SESSION').log('Requesting session signature via SDK createEIP712...');
    Logger.module('FHE_SESSION').log('EIP712 params:', { startTimeStamp: startTimeStamp, durationDays: durationDays });

    // Signature parametrelerini sakla - userDecrypt'te AYNI degerleri kullanmamiz lazim!
    self.sessionStartTime = parseInt(startTimeStamp) * 1000; // ms cinsinden
    self.sessionDurationDays = durationDays;
    self.sessionStartTimeStamp = startTimeStamp; // String olarak sakla
    self.contractAddresses = contracts;

    // ethers.js v5 signer ile imzala - v5'te _signTypedData kullanilir
    var signer = walletManager.getSigner();
    signer._signTypedData(
      eip712.domain,
      { UserDecryptRequestVerification: eip712.types.UserDecryptRequestVerification },
      eip712.message
    )
    .then(function(signature) {
      self.signature = signature;
      self.initialized = true;

      // localStorage'a kaydet
      self.saveSession();

      Logger.module('FHE_SESSION').log('Session signature obtained via SDK');
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
    // FHEVM instance'i da yukle
    return self._initFhevmInstance()
      .then(function() {
        return {
          publicKey: self.keypair.publicKey,
          signature: self.signature,
          fromCache: true
        };
      });
  }

  // Yeni session olustur
  return self.generateKeypair()
    .then(function() {
      return self.createSessionSignature(contractAddresses);
    })
    .then(function(signature) {
      // FHEVM instance'i yukle
      return self._initFhevmInstance()
        .then(function() {
          return {
            publicKey: self.keypair.publicKey,
            signature: signature,
            fromCache: false
          };
        });
    });
};

/**
 * FHEVM SDK instance'ini baslat
 * @private
 */
FHESessionManager.prototype._initFhevmInstance = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    var sdk = window.relayerSDK || window.fhevm;

    if (!sdk) {
      Logger.module('FHE_SESSION').warn('FHEVM SDK not available, decrypt will use mock');
      resolve();
      return;
    }

    // Zaten varsa kullan
    if (self._fhevmInstance) {
      resolve();
      return;
    }

    Logger.module('FHE_SESSION').log('Initializing FHEVM SDK instance...');

    // initSDK varsa cagir (WASM yukler)
    var initPromise = (typeof sdk.initSDK === 'function')
      ? sdk.initSDK()
      : Promise.resolve();

    initPromise
      .then(function() {
        // Sepolia config
        var config = {
          aclContractAddress: '0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D',
          kmsContractAddress: '0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A',
          inputVerifierContractAddress: '0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0',
          verifyingContractAddressDecryption: '0x5D8BD78e2ea6bbE41f26dFe9fdaEAa349e077478',
          verifyingContractAddressInputVerification: '0x483b9dE06E4E4C7D35CCf5837A1668487406D955',
          chainId: 11155111,
          gatewayChainId: 10901,
          network: window.ethereum,
          relayerUrl: 'https://relayer.testnet.zama.org'
        };

        return sdk.createInstance(config);
      })
      .then(function(instance) {
        self._fhevmInstance = instance;
        Logger.module('FHE_SESSION').log('FHEVM SDK instance ready');
        resolve();
      })
      .catch(function(err) {
        Logger.module('FHE_SESSION').error('Failed to init FHEVM SDK:', err);
        // Hata olsa bile devam et, mock kullanilir
        resolve();
      });
  });
};

/**
 * FHEVM instance'i disaridan set et
 * @param {object} instance - SDK instance
 */
FHESessionManager.prototype.setFhevmInstance = function(instance) {
  this._fhevmInstance = instance;
  Logger.module('FHE_SESSION').log('FHEVM instance set externally');
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

    Logger.module('FHE_SESSION').log('Requesting decrypt...', { handles: handles.length });

    // Mock mode icin (local Hardhat) - direkt contract'tan oku
    var currentNetwork = Wallet.getCurrentNetwork();
    if (currentNetwork === 'hardhat' || currentNetwork === 'localhost') {
      Logger.module('FHE_SESSION').log('Using mock decrypt (local network)');
      self._mockDecrypt(handles, contractAddress)
        .then(resolve)
        .catch(reject);
      return;
    }

    // SDK'nin userDecrypt fonksiyonunu kullan
    // SDK relayerUrl uzerinden decrypt yapar (https://relayer.testnet.zama.org)
    var sdk = window.relayerSDK || window.fhevm;

    if (!sdk || !self._fhevmInstance) {
      Logger.module('FHE_SESSION').error('SDK or FHEVM instance not available');
      reject(new Error('SDK not available for decrypt'));
      return;
    }

    // Handles'i HandleContractPair formatina cevir
    var handlePairs = handles.map(function(h) {
      return { handle: h, contractAddress: contractAddress };
    });

    // SDK checksum'li adres bekliyor - ethers.utils.getAddress ile normalize et
    var rawAddress = Wallet.getInstance().address;
    var userAddress = ethers.utils.getAddress(rawAddress);

    // KRITIK: Signature olusturulurken kullanilan AYNI degerleri kullanmaliyiz!
    // Yoksa signature dogrulamasi basarisiz olur ve 500 hatasi aliriz
    var startTimestamp = self.sessionStartTimeStamp;
    var durationDays = self.sessionDurationDays;

    // Eger kaydedilmemisse (eski session) yeni olustur - ama bu calismayacak!
    if (!startTimestamp || !durationDays) {
      Logger.module('FHE_SESSION').warn('Session params missing - signature mismatch will occur!');
      Logger.module('FHE_SESSION').warn('Please clear session and reconnect wallet');
      reject(new Error('Session parameters missing. Please clear session (Settings > Clear FHE Session) and reconnect.'));
      return;
    }

    // Signature 0x prefix olmadan gitmeli - dokumantasyona gore
    var signatureWithoutPrefix = self.signature;
    if (signatureWithoutPrefix && signatureWithoutPrefix.startsWith('0x')) {
      signatureWithoutPrefix = signatureWithoutPrefix.slice(2);
    }

    Logger.module('FHE_SESSION').log('Calling SDK userDecrypt...', {
      handles: handles.length,
      contractAddress: contractAddress,
      userAddress: userAddress,
      startTimestamp: startTimestamp,
      durationDays: durationDays,
      signaturePrefix: signatureWithoutPrefix ? signatureWithoutPrefix.substring(0, 10) + '...' : 'null'
    });

    self._fhevmInstance.userDecrypt(
      handlePairs,
      self.keypair.privateKey,
      self.keypair.publicKey,
      signatureWithoutPrefix,
      [contractAddress],
      userAddress,
      startTimestamp,
      durationDays
    )
    .then(function(result) {
      // SDK response formati: result = { [handle]: value, [handle]: value, ... }
      // Dokumantasyona gore: const decryptedValue = result[ciphertextHandle];
      Logger.module('FHE_SESSION').log('=== SDK userDecrypt RESPONSE ===');
      Logger.module('FHE_SESSION').log('Result type:', typeof result);
      Logger.module('FHE_SESSION').log('Result keys:', result ? Object.keys(result) : 'null');

      // Handle string'lerini kullanarak degerleri cikar
      var decrypted = [];
      if (result && typeof result === 'object') {
        // handlePairs sirasina gore degerleri al
        for (var i = 0; i < handlePairs.length; i++) {
          var handle = handlePairs[i].handle;
          var value = result[handle];
          Logger.module('FHE_SESSION').log('  Handle[' + i + ']:', handle.substring(0, 20) + '... =', value);
          if (value !== undefined) {
            decrypted.push(value);
          }
        }
      }

      Logger.module('FHE_SESSION').log('Decrypt successful', {
        count: decrypted.length,
        values: decrypted
      });
      resolve(decrypted);
    })
    .catch(function(error) {
      Logger.module('FHE_SESSION').error('Decrypt failed:', error);
      reject(error);
    });
  });
};

/**
 * Mock decrypt - Hardhat local network icin
 * FHE mock kullandiginda handle'lar aslinda plaintext deger icerir
 * @private
 */
FHESessionManager.prototype._mockDecrypt = function(handles, contractAddress) {
  var self = this;

  return new Promise(function(resolve, reject) {
    try {
      var walletManager = Wallet.getInstance();

      Logger.module('FHE_SESSION').log('[FHE MOCK] === MOCK DECRYPT START ===');
      Logger.module('FHE_SESSION').log('[FHE MOCK] Contract:', contractAddress);
      Logger.module('FHE_SESSION').log('[FHE MOCK] Number of handles:', handles.length);

      // Mock FHE'de handle aslinda encrypted degerin kendisidir
      // Hardhat fhevm mock'u kullaniyor, handles direkt decode edilebilir
      var decrypted = handles.map(function(handle, idx) {
        // Handle BigInt veya hex string olabilir
        var bigIntValue;
        if (typeof handle === 'string') {
          bigIntValue = BigInt(handle);
        } else if (typeof handle === 'bigint') {
          bigIntValue = handle;
        } else {
          bigIntValue = BigInt(handle.toString());
        }

        // Mock'ta handle'in son 2 byte'i genellikle degeri icerir
        // Veya tum handle decode edilir
        var value = Number(bigIntValue & BigInt(0xFFFF));

        Logger.module('FHE_SESSION').log('[FHE MOCK]   Handle[' + idx + ']: ' + handle.toString().slice(0, 20) + '... -> CardID=' + value);

        return value;
      });

      Logger.module('FHE_SESSION').log('[FHE MOCK] === MOCK DECRYPT RESULT ===');
      Logger.module('FHE_SESSION').log('[FHE MOCK] Decrypted card IDs:', JSON.stringify(decrypted));
      Logger.module('FHE_SESSION').log('[FHE MOCK] ==============================');

      resolve(decrypted);
    } catch (e) {
      Logger.module('FHE_SESSION').error('[FHE MOCK] Mock decrypt error:', e);
      reject(e);
    }
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
  var addresses = this.getContractAddresses();
  Logger.module('FHE_SESSION').log('=== CONTRACT ADDRESS DEBUG ===');
  Logger.module('FHE_SESSION').log('Network:', Wallet.getCurrentNetwork());
  Logger.module('FHE_SESSION').log('All addresses:', JSON.stringify(addresses));
  Logger.module('FHE_SESSION').log('GameSession:', addresses.GameSession);
  Logger.module('FHE_SESSION').log('==============================');
  return addresses.GameSession;
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
