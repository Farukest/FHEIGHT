'use strict';

/**
 * FHE Game Mode
 *
 * Oyun baslatilirken FHE modunu etkinlestirir.
 * Mevcut GameSession ile entegre olur.
 *
 * AKIS:
 * 1. Oyun olusturulurken FHE modu kontrol edilir
 * 2. FHE aktifse, contract'ta oyun olusturulur
 * 3. Kart islemleri FHE uzerinden yapilir
 * 4. El kartlari KMS ile decrypt edilir
 */

var Promise = require('bluebird');
var Logger = require('app/common/logger');
var CONFIG = require('app/common/config');
var FHESession = require('app/common/fhe_session');
var FHEGameSession = require('./fheGameSession');
var FHECardHandler = require('./fheCardHandler');

// FHE Game Mode States
var FHEModeState = {
  DISABLED: 'disabled',
  INITIALIZING: 'initializing',
  ACTIVE: 'active',
  ERROR: 'error'
};

/**
 * FHE Game Mode Manager
 */
function FHEGameMode() {
  this.state = FHEModeState.DISABLED;
  this.contractAddress = null;
  this.gameId = null;
  this.playerIndex = null;
  this.fheSession = null;
  this.fheGameSession = null;
  this.cardHandler = null;
  this.error = null;

  // Cached data
  this._decryptedHand = [];
  this._lastSyncTime = 0;
}

/**
 * FHE modunu baslat
 * Oyun olusturulmadan once cagirilmali
 *
 * @param {string} contractAddress - GameSession contract adresi
 * @returns {Promise}
 */
FHEGameMode.prototype.initialize = function(contractAddress) {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (self.state === FHEModeState.ACTIVE) {
      resolve();
      return;
    }

    self.state = FHEModeState.INITIALIZING;
    self.contractAddress = contractAddress;

    Logger.module('FHE_MODE').log('Initializing FHE mode with contract:', contractAddress);

    // FHE Session'i baslat (session key + signature)
    self.fheSession = FHESession.getInstance();

    self.fheSession.initializeSession(contractAddress)
      .then(function(sessionInfo) {
        Logger.module('FHE_MODE').log('FHE Session initialized', {
          fromCache: sessionInfo.fromCache
        });

        // FHE Game Session'i baslat
        self.fheGameSession = FHEGameSession.getInstance();
        return self.fheGameSession.connect(contractAddress);
      })
      .then(function() {
        // Card Handler'i baslat
        self.cardHandler = FHECardHandler.getInstance();

        self.state = FHEModeState.ACTIVE;
        Logger.module('FHE_MODE').log('FHE mode active');
        resolve();
      })
      .catch(function(error) {
        self.state = FHEModeState.ERROR;
        self.error = error;
        Logger.module('FHE_MODE').error('FHE initialization failed:', error);
        reject(error);
      });
  });
};

/**
 * Yeni FHE oyunu olustur
 *
 * @param {number} generalCardId - General kart ID
 * @param {number[]} deckCardIds - 40 kartlik deste
 * @returns {Promise<number>} gameId
 */
FHEGameMode.prototype.createGame = function(generalCardId, deckCardIds) {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (self.state !== FHEModeState.ACTIVE) {
      reject(new Error('FHE mode not active. Call initialize() first.'));
      return;
    }

    Logger.module('FHE_MODE').log('Creating FHE game');

    self.fheGameSession.createGame(generalCardId, deckCardIds)
      .then(function(gameId) {
        self.gameId = gameId;
        self.playerIndex = 0;

        // Card handler'i etkinlestir
        return self.cardHandler.enable(self.contractAddress, gameId);
      })
      .then(function() {
        self.cardHandler.fheGameSession.playerIndex = 0;
        Logger.module('FHE_MODE').log('FHE game created:', self.gameId);
        resolve(self.gameId);
      })
      .catch(reject);
  });
};

/**
 * Mevcut FHE oyununa katil
 *
 * @param {number} gameId - Oyun ID
 * @param {number} generalCardId - General kart ID
 * @param {number[]} deckCardIds - 40 kartlik deste
 * @returns {Promise}
 */
FHEGameMode.prototype.joinGame = function(gameId, generalCardId, deckCardIds) {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (self.state !== FHEModeState.ACTIVE) {
      reject(new Error('FHE mode not active. Call initialize() first.'));
      return;
    }

    Logger.module('FHE_MODE').log('Joining FHE game:', gameId);

    self.fheGameSession.joinGame(gameId, generalCardId, deckCardIds)
      .then(function() {
        self.gameId = gameId;
        self.playerIndex = 1;

        // Card handler'i etkinlestir
        return self.cardHandler.enable(self.contractAddress, gameId);
      })
      .then(function() {
        self.cardHandler.fheGameSession.playerIndex = 1;
        Logger.module('FHE_MODE').log('Joined FHE game:', gameId);
        resolve();
      })
      .catch(reject);
  });
};

/**
 * El kartlarini decrypt et
 *
 * @returns {Promise<number[]>} Decrypt edilmis kart ID'leri
 */
FHEGameMode.prototype.decryptHand = function() {
  var self = this;

  if (self.state !== FHEModeState.ACTIVE || !self.cardHandler) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return self.cardHandler.decryptHand()
    .then(function(hand) {
      self._decryptedHand = hand;
      self._lastSyncTime = Date.now();
      return hand;
    });
};

/**
 * Cached decrypt edilmis eli al
 */
FHEGameMode.prototype.getDecryptedHand = function() {
  return this._decryptedHand;
};

/**
 * Kart cek
 */
FHEGameMode.prototype.drawCard = function() {
  var self = this;

  if (self.state !== FHEModeState.ACTIVE || !self.cardHandler) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return self.fheGameSession.drawCard()
    .then(function(hand) {
      self._decryptedHand = hand;
      return hand;
    });
};

/**
 * Kart oyna
 */
FHEGameMode.prototype.playCard = function(handSlot, x, y) {
  if (this.state !== FHEModeState.ACTIVE || !this.cardHandler) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return this.cardHandler.playCard(handSlot, x, y);
};

/**
 * Kart degistir
 */
FHEGameMode.prototype.replaceCard = function(handSlot) {
  var self = this;

  if (self.state !== FHEModeState.ACTIVE || !self.cardHandler) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return self.cardHandler.replaceCard(handSlot)
    .then(function(hand) {
      self._decryptedHand = hand;
      return hand;
    });
};

/**
 * Mulligan tamamla
 */
FHEGameMode.prototype.completeMulligan = function(mulliganSlots) {
  var self = this;

  if (self.state !== FHEModeState.ACTIVE || !self.fheGameSession) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return self.fheGameSession.completeMulligan(mulliganSlots)
    .then(function(hand) {
      self._decryptedHand = hand;
      return hand;
    });
};

/**
 * Turu bitir
 */
FHEGameMode.prototype.endTurn = function() {
  if (this.state !== FHEModeState.ACTIVE || !this.fheGameSession) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return this.fheGameSession.endTurn();
};

/**
 * Birim hareket ettir
 */
FHEGameMode.prototype.moveUnit = function(fromX, fromY, toX, toY) {
  if (this.state !== FHEModeState.ACTIVE || !this.fheGameSession) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return this.fheGameSession.moveUnit(fromX, fromY, toX, toY);
};

/**
 * Saldir
 */
FHEGameMode.prototype.attack = function(attackerX, attackerY, targetX, targetY) {
  if (this.state !== FHEModeState.ACTIVE || !this.fheGameSession) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return this.fheGameSession.attack(attackerX, attackerY, targetX, targetY);
};

/**
 * Teslim ol
 */
FHEGameMode.prototype.resign = function() {
  if (this.state !== FHEModeState.ACTIVE || !this.fheGameSession) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return this.fheGameSession.resign();
};

/**
 * Oyun durumunu al
 */
FHEGameMode.prototype.getGameState = function() {
  if (this.state !== FHEModeState.ACTIVE || !this.fheGameSession) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return this.fheGameSession.getGameState();
};

/**
 * Oyuncu bilgilerini al
 */
FHEGameMode.prototype.getPlayerInfo = function(playerIndex) {
  if (this.state !== FHEModeState.ACTIVE || !this.fheGameSession) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return this.fheGameSession.getPlayerInfo(playerIndex);
};

/**
 * Board unit bilgisi al
 */
FHEGameMode.prototype.getBoardUnit = function(x, y) {
  if (this.state !== FHEModeState.ACTIVE || !this.fheGameSession) {
    return Promise.reject(new Error('FHE mode not active'));
  }

  return this.fheGameSession.getBoardUnit(x, y);
};

/**
 * FHE modu aktif mi?
 */
FHEGameMode.prototype.isActive = function() {
  return this.state === FHEModeState.ACTIVE;
};

/**
 * Mevcut state
 */
FHEGameMode.prototype.getState = function() {
  return this.state;
};

/**
 * Hata mesaji
 */
FHEGameMode.prototype.getError = function() {
  return this.error;
};

/**
 * FHE modunu kapat
 */
FHEGameMode.prototype.shutdown = function() {
  if (this.cardHandler) {
    this.cardHandler.disable();
  }
  if (this.fheGameSession) {
    this.fheGameSession.disconnect();
  }

  this.state = FHEModeState.DISABLED;
  this.contractAddress = null;
  this.gameId = null;
  this.playerIndex = null;
  this._decryptedHand = [];
  this.error = null;

  Logger.module('FHE_MODE').log('FHE mode shutdown');
};

// Singleton instance
var instance = null;

module.exports = {
  getInstance: function() {
    if (!instance) {
      instance = new FHEGameMode();
    }
    return instance;
  },
  FHEModeState: FHEModeState
};
