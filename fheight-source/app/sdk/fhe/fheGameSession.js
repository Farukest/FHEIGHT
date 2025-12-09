'use strict';

/**
 * FHE Game Session - ZAMA FHEVM entegrasyonu
 *
 * Bu modul mevcut oyun SDK'sini FHE contract'a baglar.
 * Sifreli kart cekme, el yonetimi ve decrypt islemleri.
 *
 * AKIS:
 * 1. initializeGame() - Contract'ta oyun olustur (joinGame TX)
 * 2. drawCard() - Contract'tan sifreli kart cek
 * 3. decryptHand() - KMS ile el kartlarini gor
 * 4. playCard() - Karti public decrypt ile oyna
 */

var Promise = require('bluebird');
var Logger = require('app/common/logger');
var Wallet = require('app/common/wallet');
var FHESession = require('app/common/fhe_session');
var CONFIG = require('app/common/config');

// GameSession ABI (sadece gerekli fonksiyonlar)
var GAME_SESSION_ABI = [
  // Write fonksiyonlari
  'function createGame(address sessionKey, uint32 generalCardId, uint16[40] calldata deckCardIds) external returns (uint256 gameId)',
  'function joinGame(uint256 gameId, address sessionKey, uint32 generalCardId, uint16[40] calldata deckCardIds) external',
  'function completeMulligan(uint256 gameId, bool[5] calldata mulliganSlots) external',
  'function drawCard(uint256 gameId) external',
  'function playCard(uint256 gameId, uint8 handSlot, uint8 x, uint8 y, bytes calldata clearCardId, bytes calldata decryptionProof) external',
  'function moveUnit(uint256 gameId, uint8 fromX, uint8 fromY, uint8 toX, uint8 toY) external',
  'function attack(uint256 gameId, uint8 attackerX, uint8 attackerY, uint8 targetX, uint8 targetY) external',
  'function replaceCard(uint256 gameId, uint8 handSlot) external',
  'function endTurn(uint256 gameId) external',
  'function resign(uint256 gameId) external',

  // View fonksiyonlari
  'function getHand(uint256 gameId) external view returns (uint256[6] memory)',
  'function getGameState(uint256 gameId) external view returns (uint8 state, uint8 currentTurn, uint8 turnNumber, address winner)',
  'function getPlayerInfo(uint256 gameId, uint8 playerIndex) external view returns (address wallet, uint8 handSize, uint8 deckRemaining, uint8 currentMana, uint8 maxMana, uint8 generalHp)',
  'function getBoardUnit(uint256 gameId, uint8 x, uint8 y) external view returns (uint16 cardId, uint8 ownerIndex, uint8 currentHp, uint8 currentAtk, bool exhausted, bool isGeneral)',

  // Events
  'event GameCreated(uint256 indexed gameId, address indexed player1, address sessionKey1)',
  'event PlayerJoined(uint256 indexed gameId, address indexed player2, address sessionKey2)',
  'event GameStarted(uint256 indexed gameId)',
  'event TurnStarted(uint256 indexed gameId, uint8 playerIndex, uint8 turnNumber)',
  'event CardDrawn(uint256 indexed gameId, uint8 playerIndex)',
  'event CardPlayed(uint256 indexed gameId, uint8 playerIndex, uint16 cardId, uint8 x, uint8 y)',
  'event UnitMoved(uint256 indexed gameId, uint8 fromX, uint8 fromY, uint8 toX, uint8 toY)',
  'event UnitAttacked(uint256 indexed gameId, uint8 attackerX, uint8 attackerY, uint8 targetX, uint8 targetY)',
  'event UnitDied(uint256 indexed gameId, uint8 x, uint8 y, uint16 cardId)',
  'event CardReplaced(uint256 indexed gameId, uint8 playerIndex, uint8 handSlot)',
  'event TurnEnded(uint256 indexed gameId, uint8 playerIndex)',
  'event GameEnded(uint256 indexed gameId, address winner)'
];

// Game state enum
var GameState = {
  NotStarted: 0,
  WaitingForPlayer2: 1,
  Mulligan: 2,
  InProgress: 3,
  Ended: 4
};

/**
 * FHE Game Session Manager
 */
function FHEGameSession() {
  this.contract = null;
  this.contractAddress = null;
  this.gameId = null;
  this.playerIndex = null;
  this.fheSession = FHESession.getInstance();
  this.decryptedHand = []; // Decrypt edilmis el kartlari
  this.handHandles = []; // Sifreli el handle'lari
}

/**
 * Contract'i baglat
 * @param {string} contractAddress - GameSession contract adresi
 */
FHEGameSession.prototype.connect = function(contractAddress) {
  var self = this;
  var walletManager = Wallet.getInstance();

  return new Promise(function(resolve, reject) {
    if (!walletManager.connected) {
      reject(new Error('Wallet not connected'));
      return;
    }

    try {
      // ethers.js ile contract instance olustur
      var ethers = window.ethers;
      if (!ethers) {
        reject(new Error('ethers.js not loaded'));
        return;
      }

      self.contractAddress = contractAddress;
      self.contract = new ethers.Contract(
        contractAddress,
        GAME_SESSION_ABI,
        walletManager.signer
      );

      Logger.module('FHE_GAME').log('Connected to GameSession at:', contractAddress);
      resolve(self.contract);
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Yeni oyun olustur
 * @param {number} generalCardId - General kart ID'si
 * @param {number[]} deckCardIds - 40 kartlik deste
 * @returns {Promise<number>} gameId
 */
FHEGameSession.prototype.createGame = function(generalCardId, deckCardIds) {
  var self = this;
  var walletManager = Wallet.getInstance();

  return new Promise(function(resolve, reject) {
    if (!self.contract) {
      reject(new Error('Contract not connected'));
      return;
    }

    if (deckCardIds.length !== 40) {
      reject(new Error('Deck must have exactly 40 cards'));
      return;
    }

    Logger.module('FHE_GAME').log('Creating game with general:', generalCardId);

    // Session key olarak ana cuzdani kullan (basitlestirilmis)
    // Gercek implementasyonda ayri session key kullanilir
    var sessionKey = walletManager.address;

    // uint16 array'e cevir
    var deck = deckCardIds.map(function(id) { return id; });

    self.contract.createGame(sessionKey, generalCardId, deck)
      .then(function(tx) {
        Logger.module('FHE_GAME').log('createGame TX sent:', tx.hash);
        return tx.wait();
      })
      .then(function(receipt) {
        // GameCreated event'inden gameId al
        var event = receipt.logs.find(function(log) {
          try {
            var parsed = self.contract.interface.parseLog(log);
            return parsed && parsed.name === 'GameCreated';
          } catch (e) {
            return false;
          }
        });

        if (event) {
          var parsed = self.contract.interface.parseLog(event);
          self.gameId = parsed.args.gameId.toNumber();
          self.playerIndex = 0;
          Logger.module('FHE_GAME').log('Game created with ID:', self.gameId);
          resolve(self.gameId);
        } else {
          // Event bulunamadiysa nextGameId - 1 kullan
          self.contract.nextGameId().then(function(nextId) {
            self.gameId = nextId.toNumber() - 1;
            self.playerIndex = 0;
            resolve(self.gameId);
          });
        }
      })
      .catch(reject);
  });
};

/**
 * Mevcut oyuna katil
 * @param {number} gameId - Katilacak oyun ID'si
 * @param {number} generalCardId - General kart ID'si
 * @param {number[]} deckCardIds - 40 kartlik deste
 */
FHEGameSession.prototype.joinGame = function(gameId, generalCardId, deckCardIds) {
  var self = this;
  var walletManager = Wallet.getInstance();

  return new Promise(function(resolve, reject) {
    if (!self.contract) {
      reject(new Error('Contract not connected'));
      return;
    }

    if (deckCardIds.length !== 40) {
      reject(new Error('Deck must have exactly 40 cards'));
      return;
    }

    Logger.module('FHE_GAME').log('Joining game:', gameId);

    var sessionKey = walletManager.address;
    var deck = deckCardIds.map(function(id) { return id; });

    self.contract.joinGame(gameId, sessionKey, generalCardId, deck)
      .then(function(tx) {
        Logger.module('FHE_GAME').log('joinGame TX sent:', tx.hash);
        return tx.wait();
      })
      .then(function(receipt) {
        self.gameId = gameId;
        self.playerIndex = 1;
        Logger.module('FHE_GAME').log('Joined game:', gameId);

        // Session baslat (FHE decrypt icin)
        return self.fheSession.initializeSession(self.contractAddress);
      })
      .then(function() {
        resolve(gameId);
      })
      .catch(reject);
  });
};

/**
 * El kartlarini decrypt et (KMS uzerinden)
 * @returns {Promise<number[]>} Decrypt edilmis kart ID'leri
 */
FHEGameSession.prototype.decryptHand = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (!self.contract || self.gameId === null) {
      reject(new Error('Not in a game'));
      return;
    }

    Logger.module('FHE_GAME').log('Decrypting hand for game:', self.gameId);

    // 1. Handle'lari al (view call - popup yok)
    self.contract.getHand(self.gameId)
      .then(function(handles) {
        self.handHandles = handles;
        Logger.module('FHE_GAME').log('Got', handles.length, 'handles');

        // 2. El boyutunu al
        return self.contract.getPlayerInfo(self.gameId, self.playerIndex);
      })
      .then(function(playerInfo) {
        var handSize = playerInfo.handSize;
        Logger.module('FHE_GAME').log('Hand size:', handSize);

        if (handSize === 0) {
          self.decryptedHand = [];
          return [];
        }

        // 3. FHE Session ile decrypt
        var handleStrings = [];
        for (var i = 0; i < handSize; i++) {
          handleStrings.push(self.handHandles[i].toString());
        }

        return self.fheSession.decrypt(handleStrings, self.contractAddress);
      })
      .then(function(decryptedValues) {
        self.decryptedHand = decryptedValues.map(function(v) {
          return Number(v);
        });

        Logger.module('FHE_GAME').log('Decrypted hand:', self.decryptedHand);
        resolve(self.decryptedHand);
      })
      .catch(function(error) {
        Logger.module('FHE_GAME').error('Decrypt failed:', error);
        reject(error);
      });
  });
};

/**
 * Kart cek (contract uzerinden)
 * @returns {Promise} TX tamamlaninca resolve
 */
FHEGameSession.prototype.drawCard = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (!self.contract || self.gameId === null) {
      reject(new Error('Not in a game'));
      return;
    }

    Logger.module('FHE_GAME').log('Drawing card for game:', self.gameId);

    self.contract.drawCard(self.gameId)
      .then(function(tx) {
        return tx.wait();
      })
      .then(function(receipt) {
        Logger.module('FHE_GAME').log('Card drawn');
        // Yeni eli decrypt et
        return self.decryptHand();
      })
      .then(resolve)
      .catch(reject);
  });
};

/**
 * Kart oyna (public decrypt ile)
 * @param {number} handSlot - Eldeki kart indexi
 * @param {number} x - Board X pozisyonu
 * @param {number} y - Board Y pozisyonu
 */
FHEGameSession.prototype.playCard = function(handSlot, x, y) {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (!self.contract || self.gameId === null) {
      reject(new Error('Not in a game'));
      return;
    }

    Logger.module('FHE_GAME').log('Playing card from slot', handSlot, 'to', x, y);

    var Wallet = require('app/common/wallet');
    var currentNetwork = Wallet.getCurrentNetwork();

    // Zaten decrypt edilmis kart ID'sini al
    var clearCardId = self.decryptedHand[handSlot];

    if (clearCardId === undefined || clearCardId === null) {
      reject(new Error('Card not decrypted yet'));
      return;
    }

    var encodedCardId = self._encodeCardId(clearCardId);

    // Mock mode (Hardhat) - proof gerekmez
    if (currentNetwork === 'hardhat' || currentNetwork === 'localhost') {
      Logger.module('FHE_GAME').log('Mock mode - skipping KMS proof');
      var proof = '0x'; // Mock'ta bos proof kabul edilir

      self.contract.playCard(
        self.gameId,
        handSlot,
        x,
        y,
        encodedCardId,
        proof
      )
        .then(function(tx) {
          return tx.wait();
        })
        .then(function(receipt) {
          Logger.module('FHE_GAME').log('Card played (mock mode)');
          self._removeCardFromHand(handSlot);
          resolve(receipt);
        })
        .catch(reject);
      return;
    }

    // Gercek mode - KMS'ten public decrypt proof al
    Logger.module('FHE_GAME').log('Requesting public decrypt proof from KMS...');
    self._getPublicDecryptProof(self.handHandles[handSlot])
      .then(function(result) {
        return self.contract.playCard(
          self.gameId,
          handSlot,
          x,
          y,
          result.encodedValue,
          result.proof
        );
      })
      .then(function(tx) {
        return tx.wait();
      })
      .then(function(receipt) {
        Logger.module('FHE_GAME').log('Card played');
        self._removeCardFromHand(handSlot);
        resolve(receipt);
      })
      .catch(reject);
  });
};

/**
 * Elden kart cikar
 * @private
 */
FHEGameSession.prototype._removeCardFromHand = function(handSlot) {
  this.decryptedHand.splice(handSlot, 1);
  this.handHandles.splice(handSlot, 1);
};

/**
 * KMS'ten public decrypt proof al
 * @private
 */
FHEGameSession.prototype._getPublicDecryptProof = function(handle) {
  var self = this;
  var Wallet = require('app/common/wallet');

  return new Promise(function(resolve, reject) {
    var kmsEndpoint = 'https://kms.testnet.zama.ai/public-decrypt';

    var requestBody = {
      handle: handle.toString(),
      contractAddress: self.contractAddress,
      userAddress: Wallet.getInstance().address
    };

    fetch(kmsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    .then(function(response) {
      if (!response.ok) {
        throw new Error('KMS public decrypt failed: ' + response.status);
      }
      return response.json();
    })
    .then(function(result) {
      resolve({
        encodedValue: result.abiEncodedValue,
        proof: result.decryptionProof
      });
    })
    .catch(reject);
  });
};

/**
 * Birim hareket ettir
 */
FHEGameSession.prototype.moveUnit = function(fromX, fromY, toX, toY) {
  var self = this;

  return self.contract.moveUnit(self.gameId, fromX, fromY, toX, toY)
    .then(function(tx) { return tx.wait(); });
};

/**
 * Saldir
 */
FHEGameSession.prototype.attack = function(attackerX, attackerY, targetX, targetY) {
  var self = this;

  return self.contract.attack(self.gameId, attackerX, attackerY, targetX, targetY)
    .then(function(tx) { return tx.wait(); });
};

/**
 * Kart degistir (replace)
 */
FHEGameSession.prototype.replaceCard = function(handSlot) {
  var self = this;

  return self.contract.replaceCard(self.gameId, handSlot)
    .then(function(tx) { return tx.wait(); })
    .then(function() {
      // Yeni eli decrypt et
      return self.decryptHand();
    });
};

/**
 * Turu bitir
 */
FHEGameSession.prototype.endTurn = function() {
  var self = this;

  return self.contract.endTurn(self.gameId)
    .then(function(tx) { return tx.wait(); });
};

/**
 * Teslim ol
 */
FHEGameSession.prototype.resign = function() {
  var self = this;

  return self.contract.resign(self.gameId)
    .then(function(tx) { return tx.wait(); });
};

/**
 * Mulligan tamamla
 * @param {boolean[]} mulliganSlots - Degistirilecek slotlar
 */
FHEGameSession.prototype.completeMulligan = function(mulliganSlots) {
  var self = this;

  return self.contract.completeMulligan(self.gameId, mulliganSlots)
    .then(function(tx) { return tx.wait(); })
    .then(function() {
      // Yeni eli decrypt et
      return self.decryptHand();
    });
};

/**
 * Oyun durumunu al
 */
FHEGameSession.prototype.getGameState = function() {
  var self = this;

  return self.contract.getGameState(self.gameId)
    .then(function(result) {
      return {
        state: result.state,
        currentTurn: result.currentTurn,
        turnNumber: result.turnNumber,
        winner: result.winner
      };
    });
};

/**
 * Oyuncu bilgilerini al
 */
FHEGameSession.prototype.getPlayerInfo = function(playerIndex) {
  var self = this;

  return self.contract.getPlayerInfo(self.gameId, playerIndex)
    .then(function(result) {
      return {
        wallet: result.wallet,
        handSize: result.handSize,
        deckRemaining: result.deckRemaining,
        currentMana: result.currentMana,
        maxMana: result.maxMana,
        generalHp: result.generalHp
      };
    });
};

/**
 * Board unitini al
 */
FHEGameSession.prototype.getBoardUnit = function(x, y) {
  var self = this;

  return self.contract.getBoardUnit(self.gameId, x, y)
    .then(function(result) {
      return {
        cardId: result.cardId,
        ownerIndex: result.ownerIndex,
        currentHp: result.currentHp,
        currentAtk: result.currentAtk,
        exhausted: result.exhausted,
        isGeneral: result.isGeneral
      };
    });
};

/**
 * Kart ID'yi ABI encode et
 * @private
 */
FHEGameSession.prototype._encodeCardId = function(cardId) {
  var ethers = window.ethers;
  return ethers.AbiCoder.defaultAbiCoder().encode(['uint16'], [cardId]);
};

/**
 * Event listener ekle
 */
FHEGameSession.prototype.on = function(eventName, callback) {
  var self = this;

  if (!self.contract) {
    Logger.module('FHE_GAME').warn('Contract not connected, cannot listen for events');
    return;
  }

  self.contract.on(eventName, callback);
};

/**
 * Event listener kaldir
 */
FHEGameSession.prototype.off = function(eventName, callback) {
  var self = this;

  if (self.contract) {
    self.contract.off(eventName, callback);
  }
};

/**
 * Baglanti kes
 */
FHEGameSession.prototype.disconnect = function() {
  if (this.contract) {
    this.contract.removeAllListeners();
  }
  this.contract = null;
  this.contractAddress = null;
  this.gameId = null;
  this.playerIndex = null;
  this.decryptedHand = [];
  this.handHandles = [];
};

// Singleton instance
var instance = null;

module.exports = {
  getInstance: function() {
    if (!instance) {
      instance = new FHEGameSession();
    }
    return instance;
  },
  GameState: GameState,
  GAME_SESSION_ABI: GAME_SESSION_ABI
};
