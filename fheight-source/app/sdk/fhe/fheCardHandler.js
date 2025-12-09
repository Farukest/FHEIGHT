'use strict';

/**
 * FHE Card Handler
 *
 * DrawCardAction ve PutCardInHandAction icin FHE entegrasyonu.
 * Mevcut oyun akisini bozmadan FHE destegi ekler.
 *
 * KULLANIM:
 * 1. FHE modu aktifse, kart cekme islemleri contract uzerinden yapilir
 * 2. Kart reveal islemi KMS decrypt ile gerceklesir
 * 3. Eski sistem (server-side scrubbing) FHE yoksa calisir
 */

var Logger = require('app/common/logger');
var FHEGameSession = require('./fheGameSession');

/**
 * FHE Card Handler
 * GameSession ile entegre olup kart islemlerini yonetir
 */
function FHECardHandler() {
  this.enabled = false;
  this.fheGameSession = null;
  this.pendingDecrypts = new Map(); // handSlot -> Promise
}

/**
 * FHE modunu aktifle
 * @param {string} contractAddress - GameSession contract adresi
 * @param {number} gameId - Oyun ID
 * @returns {Promise}
 */
FHECardHandler.prototype.enable = function(contractAddress, gameId) {
  var self = this;

  return new Promise(function(resolve, reject) {
    self.fheGameSession = FHEGameSession.getInstance();

    self.fheGameSession.connect(contractAddress)
      .then(function() {
        self.fheGameSession.gameId = gameId;
        self.enabled = true;
        Logger.module('FHE_CARD').log('FHE Card Handler enabled for game:', gameId);
        resolve();
      })
      .catch(function(error) {
        Logger.module('FHE_CARD').error('Failed to enable FHE:', error);
        reject(error);
      });
  });
};

/**
 * FHE modunu deaktif et
 */
FHECardHandler.prototype.disable = function() {
  this.enabled = false;
  if (this.fheGameSession) {
    this.fheGameSession.disconnect();
    this.fheGameSession = null;
  }
  this.pendingDecrypts.clear();
};

/**
 * FHE modu aktif mi?
 */
FHECardHandler.prototype.isEnabled = function() {
  return this.enabled && this.fheGameSession !== null;
};

/**
 * Kart cek (FHE uzerinden)
 * DrawCardAction._execute() yerine kullanilir
 *
 * @param {object} gameSession - Mevcut GameSession instance
 * @param {string} playerId - Kart ceken oyuncu
 * @returns {Promise<object>} Cekilen kart verisi
 */
FHECardHandler.prototype.drawCard = function(gameSession, playerId) {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (!self.isEnabled()) {
      reject(new Error('FHE not enabled'));
      return;
    }

    Logger.module('FHE_CARD').log('Drawing card via FHE for player:', playerId);

    // 1. Contract'ta drawCard cagir (TX)
    self.fheGameSession.drawCard()
      .then(function(decryptedHand) {
        // 2. Decrypt edilmis el'in son karti yeni cekilen karttir
        var newCardId = decryptedHand[decryptedHand.length - 1];

        Logger.module('FHE_CARD').log('Drew card ID:', newCardId);

        // 3. Mevcut SDK'ya kart verisini dondur
        resolve({
          cardId: newCardId,
          index: decryptedHand.length - 1,
          fromFHE: true
        });
      })
      .catch(function(error) {
        Logger.module('FHE_CARD').error('FHE drawCard failed:', error);
        reject(error);
      });
  });
};

/**
 * El kartlarini decrypt et
 * Oyuncu kendi elini gormek istediginde cagirilir
 *
 * @returns {Promise<number[]>} Decrypt edilmis kart ID'leri
 */
FHECardHandler.prototype.decryptHand = function() {
  var self = this;

  if (!self.isEnabled()) {
    return Promise.reject(new Error('FHE not enabled'));
  }

  return self.fheGameSession.decryptHand();
};

/**
 * Tek bir karti decrypt et
 * Lazy decryption icin kullanilir
 *
 * @param {number} handSlot - El'deki slot indexi
 * @returns {Promise<number>} Decrypt edilmis kart ID
 */
FHECardHandler.prototype.decryptCard = function(handSlot) {
  var self = this;

  // Zaten pending decrypt var mi?
  if (self.pendingDecrypts.has(handSlot)) {
    return self.pendingDecrypts.get(handSlot);
  }

  var decryptPromise = self.decryptHand()
    .then(function(hand) {
      self.pendingDecrypts.delete(handSlot);
      return hand[handSlot];
    })
    .catch(function(error) {
      self.pendingDecrypts.delete(handSlot);
      throw error;
    });

  self.pendingDecrypts.set(handSlot, decryptPromise);
  return decryptPromise;
};

/**
 * Kart oyna (public decrypt ile)
 * PlayCardFromHandAction icin kullanilir
 *
 * @param {number} handSlot - El'deki slot indexi
 * @param {number} x - Board X pozisyonu
 * @param {number} y - Board Y pozisyonu
 * @returns {Promise}
 */
FHECardHandler.prototype.playCard = function(handSlot, x, y) {
  var self = this;

  if (!self.isEnabled()) {
    return Promise.reject(new Error('FHE not enabled'));
  }

  return self.fheGameSession.playCard(handSlot, x, y);
};

/**
 * Kart degistir (replace)
 *
 * @param {number} handSlot - Degistirilecek slot
 * @returns {Promise<number[]>} Yeni el
 */
FHECardHandler.prototype.replaceCard = function(handSlot) {
  var self = this;

  if (!self.isEnabled()) {
    return Promise.reject(new Error('FHE not enabled'));
  }

  return self.fheGameSession.replaceCard(handSlot);
};

/**
 * Mevcut decrypted eli al
 * Cache'den doner, decrypt gerekiyorsa yapilir
 *
 * @returns {number[]} Decrypt edilmis el (veya bos array)
 */
FHECardHandler.prototype.getDecryptedHand = function() {
  if (!this.isEnabled() || !this.fheGameSession) {
    return [];
  }
  return this.fheGameSession.decryptedHand || [];
};

/**
 * Oyun durumunu sync et
 * Contract'taki state ile local state'i esle
 */
FHECardHandler.prototype.syncGameState = function() {
  var self = this;

  if (!self.isEnabled()) {
    return Promise.resolve(null);
  }

  return self.fheGameSession.getGameState();
};

/**
 * Oyuncu bilgilerini al
 */
FHECardHandler.prototype.getPlayerInfo = function(playerIndex) {
  if (!this.isEnabled()) {
    return Promise.resolve(null);
  }

  return this.fheGameSession.getPlayerInfo(playerIndex);
};

/**
 * Event listener ekle
 */
FHECardHandler.prototype.onCardDrawn = function(callback) {
  if (!this.isEnabled()) return;

  this.fheGameSession.on('CardDrawn', function(gameId, playerIndex) {
    callback({
      gameId: gameId.toNumber(),
      playerIndex: playerIndex
    });
  });
};

FHECardHandler.prototype.onCardPlayed = function(callback) {
  if (!this.isEnabled()) return;

  this.fheGameSession.on('CardPlayed', function(gameId, playerIndex, cardId, x, y) {
    callback({
      gameId: gameId.toNumber(),
      playerIndex: playerIndex,
      cardId: cardId,
      x: x,
      y: y
    });
  });
};

FHECardHandler.prototype.onGameEnded = function(callback) {
  if (!this.isEnabled()) return;

  this.fheGameSession.on('GameEnded', function(gameId, winner) {
    callback({
      gameId: gameId.toNumber(),
      winner: winner
    });
  });
};

// Singleton instance
var instance = null;

module.exports = {
  getInstance: function() {
    if (!instance) {
      instance = new FHECardHandler();
    }
    return instance;
  }
};
