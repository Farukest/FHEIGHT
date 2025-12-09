'use strict';

/**
 * Wallet Connection Manager
 * Handles MetaMask/injected provider connections for FHEIGHT
 */

var Promise = require('bluebird');
var Logger = require('app/common/logger');

// Network configurations
var NETWORKS = {
  sepolia: {
    chainId: '0xaa36a7',  // 11155111
    chainName: 'Sepolia Testnet',
    rpcUrls: ['https://rpc.sepolia.org'],
    nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: ['https://sepolia.etherscan.io']
  },
  hardhat: {
    chainId: '0x7a69',  // 31337
    chainName: 'Hardhat Local',
    rpcUrls: ['http://127.0.0.1:8545'],
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
    blockExplorerUrls: []
  }
};

// Get target network - default to sepolia for browser
var TARGET_NETWORK = (typeof process !== 'undefined' && process.env && process.env.WALLET_NETWORK)
  ? process.env.WALLET_NETWORK
  : 'sepolia';

/**
 * Wallet Manager Class - uses Backbone.Events for event handling
 */
function WalletManager() {
  this.address = null;
  this.connected = false;
  this.provider = null;
  this._eventHandlers = {};
}

// Simple event emitter methods
WalletManager.prototype.on = function(event, callback) {
  if (!this._eventHandlers[event]) {
    this._eventHandlers[event] = [];
  }
  this._eventHandlers[event].push(callback);
};

WalletManager.prototype.off = function(event, callback) {
  if (!this._eventHandlers[event]) return;
  var index = this._eventHandlers[event].indexOf(callback);
  if (index > -1) {
    this._eventHandlers[event].splice(index, 1);
  }
};

WalletManager.prototype.emit = function(event, data) {
  if (!this._eventHandlers[event]) return;
  this._eventHandlers[event].forEach(function(callback) {
    callback(data);
  });
};

WalletManager.prototype.removeListener = WalletManager.prototype.off;

/**
 * Check if wallet provider is available
 */
WalletManager.prototype.isProviderAvailable = function() {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

/**
 * Get the ethereum provider
 */
WalletManager.prototype.getProvider = function() {
  if (!this.isProviderAvailable()) {
    return null;
  }
  return window.ethereum;
};

/**
 * Connect to wallet
 * @returns {Promise<string>} wallet address
 */
WalletManager.prototype.connect = function() {
  var self = this;
  Logger.module('WALLET').log('connect: starting');

  return new Promise(function(resolve, reject) {
    if (!self.isProviderAvailable()) {
      reject(new Error('No wallet provider found. Please install MetaMask.'));
      return;
    }

    var provider = self.getProvider();

    // Request account access
    provider.request({ method: 'eth_requestAccounts' })
      .then(function(accounts) {
        if (!accounts || accounts.length === 0) {
          throw new Error('No accounts found');
        }

        self.address = accounts[0];
        self.connected = true;
        self.provider = provider;

        Logger.module('WALLET').log('connect: success', self.address);

        // Detect and cache current network
        return self.getChainId();
      })
      .then(function(chainId) {
        var networkName = self.getNetworkName(chainId);
        currentNetwork = networkName;
        Logger.module('WALLET').log('connect: network detected', networkName, chainId);

        self.emit('connected', self.address);

        // Listen for account changes
        provider.on('accountsChanged', function(newAccounts) {
          if (newAccounts.length === 0) {
            self.disconnect();
          } else if (newAccounts[0] !== self.address) {
            self.address = newAccounts[0];
            self.emit('accountChanged', self.address);
          }
        });

        // Listen for chain changes
        provider.on('chainChanged', function(chainId) {
          var networkName = self.getNetworkName(chainId);
          currentNetwork = networkName;
          Logger.module('WALLET').log('chainChanged:', chainId, '-> network:', networkName);
          self.emit('chainChanged', { chainId: chainId, network: networkName });
        });

        // Listen for disconnect
        provider.on('disconnect', function() {
          self.disconnect();
        });

        resolve(self.address);
      })
      .catch(function(error) {
        Logger.module('WALLET').error('connect: error', error);
        if (error.code === 4001) {
          reject(new Error('User rejected the connection request'));
        } else {
          reject(error);
        }
      });
  });
};

/**
 * Disconnect wallet
 */
WalletManager.prototype.disconnect = function() {
  Logger.module('WALLET').log('disconnect');
  this.address = null;
  this.connected = false;
  this.provider = null;
  this.emit('disconnected');
};

/**
 * Sign a message for authentication
 * @param {string} message - Message to sign
 * @returns {Promise<string>} signature
 */
WalletManager.prototype.signMessage = function(message) {
  var self = this;
  Logger.module('WALLET').log('signMessage: starting');

  return new Promise(function(resolve, reject) {
    if (!self.connected || !self.provider) {
      reject(new Error('Wallet not connected'));
      return;
    }

    // Use personal_sign for human-readable message
    self.provider.request({
      method: 'personal_sign',
      params: [message, self.address]
    })
    .then(function(signature) {
      Logger.module('WALLET').log('signMessage: success');
      resolve(signature);
    })
    .catch(function(error) {
      Logger.module('WALLET').error('signMessage: error', error);
      if (error.code === 4001) {
        reject(new Error('User rejected the signature request'));
      } else {
        reject(error);
      }
    });
  });
};

/**
 * Generate login message
 * @returns {string} formatted login message
 */
WalletManager.prototype.generateLoginMessage = function() {
  var timestamp = Date.now();
  return 'Sign this message to login to FHEIGHT.\n\n' +
         'Wallet: ' + this.address + '\n' +
         'Timestamp: ' + timestamp + '\n\n' +
         'This request will not trigger a blockchain transaction or cost any gas fees.';
};

/**
 * Get current chain ID
 * @returns {Promise<string>} chain ID in hex
 */
WalletManager.prototype.getChainId = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (!self.provider) {
      reject(new Error('Wallet not connected'));
      return;
    }

    self.provider.request({ method: 'eth_chainId' })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Switch to target network
 * @param {string} networkName - 'sepolia' or 'hardhat'
 * @returns {Promise}
 */
WalletManager.prototype.switchNetwork = function(networkName) {
  var self = this;
  var network = NETWORKS[networkName || TARGET_NETWORK];

  if (!network) {
    return Promise.reject(new Error('Unknown network: ' + networkName));
  }

  return new Promise(function(resolve, reject) {
    if (!self.provider) {
      reject(new Error('Wallet not connected'));
      return;
    }

    // Try to switch to the network
    self.provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: network.chainId }]
    })
    .then(resolve)
    .catch(function(error) {
      // If the chain hasn't been added, add it
      if (error.code === 4902) {
        return self.provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: network.chainId,
            chainName: network.chainName,
            rpcUrls: network.rpcUrls,
            nativeCurrency: network.nativeCurrency,
            blockExplorerUrls: network.blockExplorerUrls
          }]
        }).then(resolve);
      }
      reject(error);
    });
  });
};

/**
 * Check if on correct network
 * @returns {Promise<boolean>}
 */
WalletManager.prototype.isCorrectNetwork = function() {
  var self = this;
  var targetChainId = NETWORKS[TARGET_NETWORK].chainId;

  return this.getChainId().then(function(currentChainId) {
    return currentChainId.toLowerCase() === targetChainId.toLowerCase();
  });
};

/**
 * Format wallet address for display
 * @param {string} address - Full wallet address
 * @returns {string} Shortened address (0x1234...5678)
 */
WalletManager.prototype.formatAddress = function(address) {
  if (!address) return '';
  return address.slice(0, 6) + '...' + address.slice(-4);
};

/**
 * Get formatted address for username
 * @returns {string}
 */
WalletManager.prototype.getFormattedAddress = function() {
  return this.formatAddress(this.address);
};

/**
 * Get current network name from chain ID
 * @param {string} chainId - Chain ID in hex (e.g. '0xaa36a7')
 * @returns {string} Network name ('sepolia', 'hardhat', or 'unknown')
 */
WalletManager.prototype.getNetworkName = function(chainId) {
  if (!chainId) return 'unknown';
  var normalizedChainId = chainId.toLowerCase();

  for (var networkName in NETWORKS) {
    if (NETWORKS[networkName].chainId.toLowerCase() === normalizedChainId) {
      return networkName;
    }
  }
  return 'unknown';
};

/**
 * Get current network name (async - queries wallet)
 * @returns {Promise<string>} Network name
 */
WalletManager.prototype.getCurrentNetwork = function() {
  var self = this;
  return this.getChainId().then(function(chainId) {
    return self.getNetworkName(chainId);
  });
};

/**
 * Check if FHE is supported on current network
 * @returns {Promise<boolean>}
 */
WalletManager.prototype.isFHESupported = function() {
  return this.getCurrentNetwork().then(function(network) {
    return network === 'sepolia' || network === 'hardhat';
  });
};

// Singleton instance
var instance = null;

// Current detected network (updated on connect and chainChanged)
var currentNetwork = null;

module.exports = {
  getInstance: function() {
    if (!instance) {
      instance = new WalletManager();
    }
    return instance;
  },
  NETWORKS: NETWORKS,
  TARGET_NETWORK: TARGET_NETWORK,
  getCurrentNetwork: function() {
    return currentNetwork;
  },
  setCurrentNetwork: function(network) {
    currentNetwork = network;
  }
};
