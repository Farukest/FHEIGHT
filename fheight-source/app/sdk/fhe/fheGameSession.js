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
var ethers = require('ethers');

// GameSession ABI (v10 - encrypted deck input)
// Contract artik sifreli deck kabul ediyor: externalEuint16[40] + inputProof
// Frontend shuffle yapar -> encrypt yapar -> contract'a gonderir
var GAME_SESSION_ABI = [
  // Write fonksiyonlari (v10 - encrypted deck)
  'function createGame(address sessionKey, uint32 generalCardId, bytes32[40] calldata encryptedDeck, bytes calldata inputProof) external returns (uint256 gameId)',
  'function createSinglePlayerGame(address sessionKey, uint32 generalCardId, bytes32[40] calldata encryptedDeck, bytes calldata inputProof) external returns (uint256 gameId)',
  'function joinGame(uint256 gameId, address sessionKey, uint32 generalCardId, bytes32[40] calldata encryptedDeck, bytes calldata inputProof) external',
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
  'function getCardFromDeck(uint256 gameId, uint8 deckIndex) external view returns (uint256)',
  'function getDeckIndex(uint256 gameId) external view returns (uint8)',
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
  this.localDeckIndex = 5; // Local deck index takibi (baslangicta 5 kart cekilmis)
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
      self.contractAddress = contractAddress;

      Logger.module('FHE_GAME').log('Creating contract with signer:', !!walletManager.signer);

      self.contract = new ethers.Contract(
        contractAddress,
        GAME_SESSION_ABI,
        walletManager.signer
      );

      Logger.module('FHE_GAME').log('Connected to GameSession at:', contractAddress);
      Logger.module('FHE_GAME').log('Contract signer:', self.contract.signer ? 'attached' : 'NOT attached');
      resolve(self.contract);
    } catch (e) {
      Logger.module('FHE_GAME').error('Contract creation failed:', e);
      reject(e);
    }
  });
};

/**
 * Yeni oyun olustur (Multiplayer)
 * v10: Deck shuffle edilir ve sifreli olarak gonderilir
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

    Logger.module('FHE_GAME').log('Creating multiplayer game with general:', generalCardId, 'deck size:', deckCardIds.length);

    var sessionKey = walletManager.address;

    // 1. Deck'i 40 karta tamamla
    var deck = self._padDeckTo40(deckCardIds);
    Logger.module('FHE_GAME').log('Deck padded to 40 cards');

    // 2. Deck'i shuffle et (Fisher-Yates)
    var shuffledDeck = self._shuffleDeck(deck);
    Logger.module('FHE_GAME').log('Deck shuffled');

    // 3. Deck'i sifrele
    Logger.module('FHE_GAME').log('Encrypting deck...');
    self._encryptDeck(shuffledDeck)
      .then(function(encryptedResult) {
        Logger.module('FHE_GAME').log('Deck encrypted, handles:', encryptedResult.handles.length);

        // 4. ABI encode with ethers Interface
        var iface = new ethers.utils.Interface(GAME_SESSION_ABI);
        var data = iface.encodeFunctionData('createGame', [
          sessionKey,
          generalCardId,
          encryptedResult.handles,
          encryptedResult.inputProof
        ]);

        Logger.module('FHE_GAME').log('Sending TX via wallet API...');

        // Direkt wallet API ile TX gonder (ethers provider kullanmadan)
        return window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: walletManager.address,
            to: self.contractAddress,
            data: data,
            gas: '0x7A1200' // 8000000 (encrypted deck icin daha fazla gas)
          }]
        });
      })
      .then(function(txHash) {
        Logger.module('FHE_GAME').log('createGame TX sent:', txHash);

        // TX receipt bekle ve event'ten gameId al
        return self._waitForReceipt(txHash);
      })
      .then(function(receipt) {
        Logger.module('FHE_GAME').log('TX confirmed, parsing events...');

        // TX basarisiz olduysa hata firlat
        if (receipt.status === '0x0' || receipt.status === 0) {
          throw new Error('Transaction reverted');
        }

        // GameCreated event'ini parse et
        var iface = new ethers.utils.Interface(GAME_SESSION_ABI);
        var gameId = null;

        for (var i = 0; i < receipt.logs.length; i++) {
          try {
            var parsed = iface.parseLog(receipt.logs[i]);
            if (parsed && parsed.name === 'GameCreated') {
              gameId = parsed.args.gameId.toString();
              Logger.module('FHE_GAME').log('GameCreated event found, gameId:', gameId);
              break;
            }
          } catch (e) {
            // Bu log bu contract'a ait degil, devam et
          }
        }

        if (gameId === null) {
          Logger.module('FHE_GAME').warn('GameCreated event not found, using gameId 0');
          gameId = '0';
        }

        self.gameId = parseInt(gameId);
        self.playerIndex = 0;
        resolve(self.gameId);
      })
      .catch(function(error) {
        Logger.module('FHE_GAME').error('createGame error:', error.message || error);
        reject(error);
      });
  });
};

/**
 * Single Player oyun olustur (AI modu)
 * joinGame gerektirmez, oyun direkt baslar
 * v10: Deck shuffle edilir ve sifreli olarak gonderilir
 * @param {number} generalCardId - General kart ID'si
 * @param {number[]} deckCardIds - 40 kartlik deste
 * @returns {Promise<number>} gameId
 */
FHEGameSession.prototype.createSinglePlayerGame = function(generalCardId, deckCardIds) {
  var self = this;
  var walletManager = Wallet.getInstance();

  return new Promise(function(resolve, reject) {
    if (!self.contract) {
      reject(new Error('Contract not connected'));
      return;
    }

    Logger.module('FHE_GAME').log('Creating SINGLE PLAYER game with general:', generalCardId, 'deck size:', deckCardIds.length);

    var sessionKey = walletManager.address;

    // 1. Deck'i 40 karta tamamla
    var deck = self._padDeckTo40(deckCardIds);
    Logger.module('FHE_GAME').log('Deck padded to 40 cards');

    // 2. Deck'i shuffle et (Fisher-Yates)
    var shuffledDeck = self._shuffleDeck(deck);
    Logger.module('FHE_GAME').log('Deck shuffled');

    // 3. Deck'i sifrele
    Logger.module('FHE_GAME').log('Encrypting deck...');
    self._encryptDeck(shuffledDeck)
      .then(function(encryptedResult) {
        Logger.module('FHE_GAME').log('Deck encrypted, handles:', encryptedResult.handles.length);

        // 4. ABI encode with ethers Interface
        var iface = new ethers.utils.Interface(GAME_SESSION_ABI);
        var data = iface.encodeFunctionData('createSinglePlayerGame', [
          sessionKey,
          generalCardId,
          encryptedResult.handles,
          encryptedResult.inputProof
        ]);

        Logger.module('FHE_GAME').log('Sending createSinglePlayerGame TX via wallet API...');

        // Direkt wallet API ile TX gonder (ethers provider kullanmadan)
        return window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: walletManager.address,
            to: self.contractAddress,
            data: data,
            gas: '0x7A1200' // 8000000 (encrypted deck icin daha fazla gas)
          }]
        });
      })
      .then(function(txHash) {
        Logger.module('FHE_GAME').log('createSinglePlayerGame TX sent:', txHash);

        // TX receipt bekle ve event'ten gameId al
        return self._waitForReceipt(txHash);
      })
      .then(function(receipt) {
        Logger.module('FHE_GAME').log('TX confirmed, parsing events...');
        Logger.module('FHE_GAME').log('Receipt status:', receipt.status);
        Logger.module('FHE_GAME').log('Receipt logs count:', receipt.logs ? receipt.logs.length : 0);

        // TX basarisiz olduysa hata firlat
        // status: '0x1' = success, '0x0' = failed
        if (receipt.status === '0x0' || receipt.status === 0) {
          throw new Error('Transaction reverted - check contract requirements (CardRegistry, general validation, etc.)');
        }

        // GameCreated event'ini parse et
        var iface = new ethers.utils.Interface(GAME_SESSION_ABI);
        var gameId = null;
        var contractAddr = self.contractAddress.toLowerCase();

        if (receipt.logs && receipt.logs.length > 0) {
          for (var i = 0; i < receipt.logs.length; i++) {
            var log = receipt.logs[i];
            // Sadece bizim contract'imizin loglarini parse et (ACL, FHE executor vb. atla)
            if (log.address.toLowerCase() !== contractAddr) {
              continue;
            }
            try {
              var parsed = iface.parseLog(log);
              if (parsed && parsed.name === 'GameCreated') {
                gameId = parsed.args.gameId.toString();
                Logger.module('FHE_GAME').log('GameCreated event found, gameId:', gameId);
                break;
              }
            } catch (e) {
              // Bu log bizim ABI'mizde tanimli degil, sessizce atla
            }
          }
        }

        if (gameId === null) {
          Logger.module('FHE_GAME').error('GameCreated event not found! TX may have reverted or contract issue.');
          Logger.module('FHE_GAME').error('Full receipt:', JSON.stringify(receipt, null, 2));
          throw new Error('GameCreated event not found - contract may have reverted');
        }

        self.gameId = parseInt(gameId);
        self.playerIndex = 0;
        Logger.module('FHE_GAME').log('Single player game created successfully:', self.gameId);
        resolve(self.gameId);
      })
      .catch(function(error) {
        Logger.module('FHE_GAME').error('createSinglePlayerGame error:', error.message || error);
        reject(error);
      });
  });
};

/**
 * Mevcut oyuna katil
 * v10: Deck shuffle edilir ve sifreli olarak gonderilir
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

    Logger.module('FHE_GAME').log('Joining game:', gameId, 'deck size:', deckCardIds.length);

    var sessionKey = walletManager.address;

    // 1. Deck'i 40 karta tamamla
    var deck = self._padDeckTo40(deckCardIds);
    Logger.module('FHE_GAME').log('Deck padded to 40 cards');

    // 2. Deck'i shuffle et (Fisher-Yates)
    var shuffledDeck = self._shuffleDeck(deck);
    Logger.module('FHE_GAME').log('Deck shuffled');

    // 3. Deck'i sifrele
    Logger.module('FHE_GAME').log('Encrypting deck...');
    self._encryptDeck(shuffledDeck)
      .then(function(encryptedResult) {
        Logger.module('FHE_GAME').log('Deck encrypted, handles:', encryptedResult.handles.length);

        // 4. ABI encode with ethers Interface
        var iface = new ethers.utils.Interface(GAME_SESSION_ABI);
        var data = iface.encodeFunctionData('joinGame', [
          gameId,
          sessionKey,
          generalCardId,
          encryptedResult.handles,
          encryptedResult.inputProof
        ]);

        Logger.module('FHE_GAME').log('Sending joinGame TX via wallet API...');

        // Direkt wallet API ile TX gonder
        return window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [{
            from: walletManager.address,
            to: self.contractAddress,
            data: data,
            gas: '0x7A1200' // 8000000 (encrypted deck icin daha fazla gas)
          }]
        });
      })
      .then(function(txHash) {
        Logger.module('FHE_GAME').log('joinGame TX sent:', txHash);
        return self._waitForReceipt(txHash);
      })
      .then(function(receipt) {
        // TX basarisiz olduysa hata firlat
        if (receipt.status === '0x0' || receipt.status === 0) {
          throw new Error('Transaction reverted');
        }

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
 * TX receipt bekle (polling ile)
 * @private
 * @param {string} txHash - TX hash
 * @returns {Promise<object>} TX receipt
 */
FHEGameSession.prototype._waitForReceipt = function(txHash) {
  var maxAttempts = 60; // 60 x 2s = 120 saniye max
  var attempt = 0;

  return new Promise(function(resolve, reject) {
    function poll() {
      attempt++;
      Logger.module('FHE_GAME').log('Waiting for TX receipt, attempt:', attempt);

      window.ethereum.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      })
      .then(function(receipt) {
        if (receipt) {
          Logger.module('FHE_GAME').log('TX receipt received');
          resolve(receipt);
        } else if (attempt < maxAttempts) {
          setTimeout(poll, 2000); // 2 saniye bekle
        } else {
          reject(new Error('TX receipt timeout'));
        }
      })
      .catch(function(error) {
        if (attempt < maxAttempts) {
          setTimeout(poll, 2000);
        } else {
          reject(error);
        }
      });
    }

    poll();
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

    Logger.module('FHE_GAME').log('=== FHE DECRYPT HAND START ===');
    Logger.module('FHE_GAME').log('[FHE] Game ID:', self.gameId);
    Logger.module('FHE_GAME').log('[FHE] Player Index:', self.playerIndex);
    Logger.module('FHE_GAME').log('[FHE] Contract Address:', self.contractAddress);

    // 1. Handle'lari al (view call - popup yok)
    self.contract.getHand(self.gameId)
      .then(function(handles) {
        self.handHandles = handles;
        Logger.module('FHE_GAME').log('[FHE] Raw handles from contract:', handles.length);
        handles.forEach(function(h, idx) {
          Logger.module('FHE_GAME').log('[FHE]   Handle[' + idx + ']:', h.toString().slice(0, 20) + '...');
        });

        // 2. El boyutunu al
        return self.contract.getPlayerInfo(self.gameId, self.playerIndex);
      })
      .then(function(playerInfo) {
        var handSize = playerInfo.handSize;
        Logger.module('FHE_GAME').log('[FHE] Player hand size:', handSize);
        Logger.module('FHE_GAME').log('[FHE] Player info:', JSON.stringify({
          wallet: playerInfo.wallet,
          handSize: playerInfo.handSize,
          deckRemaining: playerInfo.deckRemaining,
          currentMana: playerInfo.currentMana,
          maxMana: playerInfo.maxMana,
          generalHp: playerInfo.generalHp
        }));

        if (handSize === 0) {
          self.decryptedHand = [];
          Logger.module('FHE_GAME').log('[FHE] Hand is empty, returning []');
          return [];
        }

        // 3. FHE Session ile decrypt
        // Handle'lari bytes32 hex formatina cevir (SDK bunu bekliyor)
        var handleStrings = [];
        for (var i = 0; i < handSize; i++) {
          var handle = self.handHandles[i];
          var hexHandle;
          if (handle._isBigNumber || handle._hex) {
            // ethers.js BigNumber - _hex property'si var
            hexHandle = handle._hex || handle.toHexString();
          } else if (typeof handle === 'bigint') {
            // Native BigInt
            hexHandle = '0x' + handle.toString(16);
          } else if (typeof handle === 'string' && handle.startsWith('0x')) {
            // Zaten hex string
            hexHandle = handle;
          } else {
            // Number veya decimal string - hex'e cevir
            hexHandle = '0x' + BigInt(handle.toString()).toString(16);
          }
          // 32 byte = 64 hex karakter olmali, padding ekle
          hexHandle = hexHandle.toLowerCase();
          if (hexHandle.startsWith('0x')) {
            var hexPart = hexHandle.slice(2);
            hexHandle = '0x' + hexPart.padStart(64, '0');
          }
          handleStrings.push(hexHandle);
          Logger.module('FHE_GAME').log('[FHE] Handle[' + i + '] converted:', hexHandle.substring(0, 20) + '...');
        }

        Logger.module('FHE_GAME').log('[FHE] Sending', handleStrings.length, 'handles for decrypt');
        Logger.module('FHE_GAME').log('[FHE] Session valid:', self.fheSession.isSessionValid());

        return self.fheSession.decrypt(handleStrings, self.contractAddress);
      })
      .then(function(decryptedValues) {
        self.decryptedHand = decryptedValues.map(function(v) {
          return Number(v);
        });

        Logger.module('FHE_GAME').log('[FHE] === DECRYPTED HAND ===');
        self.decryptedHand.forEach(function(cardId, idx) {
          Logger.module('FHE_GAME').log('[FHE]   Card[' + idx + ']: ID=' + cardId);
        });
        Logger.module('FHE_GAME').log('[FHE] =========================');

        resolve(self.decryptedHand);
      })
      .catch(function(error) {
        Logger.module('FHE_GAME').error('[FHE] Decrypt failed:', error);
        reject(error);
      });
  });
};

/**
 * Kart cek - Contract'tan deck[deckIndex] okuyup decrypt et (TX YOK!)
 *
 * AKIS:
 * 1. Contract'tan getCardFromDeck(gameId, localDeckIndex) view call (gas yok)
 * 2. Sifreli handle'i userDecrypt (gas yok)
 * 3. Kart ID'yi dondur ve localDeckIndex'i artir
 * 4. El'e ekle
 *
 * @returns {Promise<number>} Cekilen kart ID'si (yeni kart)
 */
FHEGameSession.prototype.drawCard = function() {
  var self = this;

  return new Promise(function(resolve, reject) {
    if (!self.contract || self.gameId === null) {
      reject(new Error('Not in a game'));
      return;
    }

    // El dolu mu kontrol et
    if (self.decryptedHand.length >= 6) {
      Logger.module('FHE_GAME').warn('[DRAW] Hand is full (6 cards)');
      resolve(null);
      return;
    }

    // Deck bitti mi kontrol et
    if (self.localDeckIndex >= 40) {
      Logger.module('FHE_GAME').warn('[DRAW] Deck is empty (fatigue)');
      resolve(null);
      return;
    }

    Logger.module('FHE_GAME').log('[DRAW] Drawing card from deck index:', self.localDeckIndex);

    // Contract'tan deck[localDeckIndex]'i al (view call - TX yok, gas yok)
    self.contract.getCardFromDeck(self.gameId, self.localDeckIndex)
      .then(function(encryptedHandle) {
        Logger.module('FHE_GAME').log('[DRAW] Got encrypted handle from deck[' + self.localDeckIndex + ']');

        // Handle'i hex string'e cevir
        var hexHandle;
        if (encryptedHandle._isBigNumber || encryptedHandle._hex) {
          hexHandle = encryptedHandle._hex || encryptedHandle.toHexString();
        } else if (typeof encryptedHandle === 'bigint') {
          hexHandle = '0x' + encryptedHandle.toString(16);
        } else if (typeof encryptedHandle === 'string' && encryptedHandle.startsWith('0x')) {
          hexHandle = encryptedHandle;
        } else {
          hexHandle = '0x' + BigInt(encryptedHandle.toString()).toString(16);
        }
        // 32 byte = 64 hex karakter olmali
        hexHandle = hexHandle.toLowerCase();
        if (hexHandle.startsWith('0x')) {
          var hexPart = hexHandle.slice(2);
          hexHandle = '0x' + hexPart.padStart(64, '0');
        }

        Logger.module('FHE_GAME').log('[DRAW] Handle converted:', hexHandle.substring(0, 20) + '...');

        // Handle'i decrypt et
        return self.fheSession.decrypt([hexHandle], self.contractAddress);
      })
      .then(function(decryptedValues) {
        if (!decryptedValues || decryptedValues.length === 0) {
          throw new Error('Decrypt returned empty result');
        }

        var newCardId = Number(decryptedValues[0]);
        Logger.module('FHE_GAME').log('[DRAW] Card decrypted:', newCardId);

        // Ele ekle
        self.decryptedHand.push(newCardId);

        // Local deck index'i artir
        self.localDeckIndex++;
        Logger.module('FHE_GAME').log('[DRAW] localDeckIndex updated to:', self.localDeckIndex);
        Logger.module('FHE_GAME').log('[DRAW] Hand size now:', self.decryptedHand.length);

        // Return single card ID (game.js will add to SDK)
        resolve(newCardId);
      })
      .catch(function(error) {
        Logger.module('FHE_GAME').error('[DRAW] Failed:', error);
        reject(error);
      });
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
 * Public decrypt - SDK kullanarak
 * @private
 */
FHEGameSession.prototype._getPublicDecryptProof = function(handle) {
  var self = this;

  return new Promise(function(resolve, reject) {
    // SDK instance'i al
    if (!self._fhevmInstance) {
      Logger.module('FHE_GAME').error('FHEVM instance not available for public decrypt');
      reject(new Error('FHEVM instance not available'));
      return;
    }

    // Handle'i string'e cevir
    var handleStr = typeof handle === 'bigint' ? handle.toString() : handle.toString();

    Logger.module('FHE_GAME').log('[PUBLIC_DECRYPT] Calling SDK publicDecrypt...');

    self._fhevmInstance.publicDecrypt([handleStr])
      .then(function(result) {
        Logger.module('FHE_GAME').log('[PUBLIC_DECRYPT] Success:', result);
        resolve({
          encodedValue: result.abiEncodedClearValues,
          proof: result.decryptionProof,
          clearValues: result.clearValues
        });
      })
      .catch(function(err) {
        Logger.module('FHE_GAME').error('[PUBLIC_DECRYPT] Failed:', err);
        reject(err);
      });
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
 * Fisher-Yates shuffle algoritması
 * Desteyi tamamen rastgele karistirir
 *
 * @private
 * @param {number[]} deck - Karistirilacak deste
 * @returns {number[]} Karistirilmis deste (yeni array)
 */
FHEGameSession.prototype._shuffleDeck = function(deck) {
  // Kopya olustur, orijinali bozma
  var shuffled = deck.slice();

  // Fisher-Yates shuffle
  for (var i = shuffled.length - 1; i > 0; i--) {
    // Crypto API ile guclu random
    var randomBytes = new Uint32Array(1);
    window.crypto.getRandomValues(randomBytes);
    var j = randomBytes[0] % (i + 1);

    // Swap
    var temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  Logger.module('FHE_GAME').log('[SHUFFLE] First 5 cards after shuffle:', shuffled.slice(0, 5));
  return shuffled;
};

/**
 * Desteyi sifrele (FHEVM createEncryptedInput ile)
 *
 * v10: Frontend deck'i sifreler, contract'a handles + proof gonderilir
 * TX verisinde plaintext deck gorunmez, rakip deck sirasini bilemez
 *
 * @private
 * @param {number[]} deckCardIds - 40 kartlik deste (shuffle edilmis)
 * @returns {Promise<{handles: string[], inputProof: string}>}
 */
FHEGameSession.prototype._encryptDeck = function(deckCardIds) {
  var self = this;
  var walletManager = Wallet.getInstance();
  var currentNetwork = Wallet.getCurrentNetwork();

  return new Promise(function(resolve, reject) {
    Logger.module('FHE_GAME').log('[ENCRYPT] Starting deck encryption...');
    Logger.module('FHE_GAME').log('[ENCRYPT] Network:', currentNetwork);
    Logger.module('FHE_GAME').log('[ENCRYPT] Contract:', self.contractAddress);
    Logger.module('FHE_GAME').log('[ENCRYPT] User:', walletManager.address);

    // Mock mode (Hardhat) - gercek sifreleme yok, mock handles olustur
    if (currentNetwork === 'hardhat' || currentNetwork === 'localhost') {
      Logger.module('FHE_GAME').log('[ENCRYPT] Mock mode - creating mock handles');

      var mockHandles = deckCardIds.map(function(cardId, index) {
        // Mock handle: 0x + cardId'yi 64 hex karaktere pad et
        // Contract mock FHE kullandiginda bu handle'lar direkt decode edilebilir
        var hexCardId = cardId.toString(16).padStart(4, '0');
        return '0x' + hexCardId.padStart(64, '0');
      });

      Logger.module('FHE_GAME').log('[ENCRYPT] Mock handles created:', mockHandles.length);

      resolve({
        handles: mockHandles,
        inputProof: '0x' // Mock'ta bos proof
      });
      return;
    }

    // Gercek mode (Sepolia) - FHEVM Relayer SDK ile sifrele
    Logger.module('FHE_GAME').log('[ENCRYPT] Real mode - checking FHEVM SDK availability');

    // FHEVM SDK'yi dinamik olarak yukle
    self._getFhevmInstance()
      .then(function(fhevmInstance) {
        // createEncryptedInput olustur
        var input = fhevmInstance.createEncryptedInput(
          self.contractAddress,
          walletManager.address
        );

        // Her kart ID'sini 16-bit olarak ekle
        for (var i = 0; i < deckCardIds.length; i++) {
          input.add16(deckCardIds[i]);
        }

        // Sifrele
        return input.encrypt();
      })
      .then(function(encrypted) {
        Logger.module('FHE_GAME').log('[ENCRYPT] Encryption complete, handles:', encrypted.handles.length);

        resolve({
          handles: encrypted.handles,
          inputProof: encrypted.inputProof
        });
      })
      .catch(function(error) {
        // SDK yoksa mock mode'a fallback yap
        Logger.module('FHE_GAME').warn('[ENCRYPT] FHEVM SDK not available, falling back to mock encryption');
        Logger.module('FHE_GAME').warn('[ENCRYPT] Error was:', error.message);

        // Mock handles olustur (Sepolia'da da calisir - test icin)
        var mockHandles = deckCardIds.map(function(cardId, index) {
          var hexCardId = cardId.toString(16).padStart(4, '0');
          return '0x' + hexCardId.padStart(64, '0');
        });

        Logger.module('FHE_GAME').log('[ENCRYPT] Mock handles created (fallback):', mockHandles.length);

        resolve({
          handles: mockHandles,
          inputProof: '0x'
        });
      });
  });
};

/**
 * FHEVM SDK instance'i al veya olustur
 * Relayer SDK ile Sepolia'ya baglanir
 *
 * SepoliaConfig:
 *   aclContractAddress: '0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D'
 *   kmsContractAddress: '0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A'
 *   inputVerifierContractAddress: '0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0'
 *   verifyingContractAddressDecryption: '0x5D8BD78e2ea6bbE41f26dFe9fdaEAa349e077478'
 *   verifyingContractAddressInputVerification: '0x483b9dE06E4E4C7D35CCf5837A1668487406D955'
 *   chainId: 11155111 (Sepolia)
 *   gatewayChainId: 10901
 *   relayerUrl: 'https://relayer.testnet.zama.org'
 *
 * @private
 * @returns {Promise<object>} FHEVM instance
 */
FHEGameSession.prototype._getFhevmInstance = function() {
  var self = this;
  var walletManager = Wallet.getInstance();

  return new Promise(function(resolve, reject) {
    // Eger cached instance varsa kullan
    if (self._fhevmInstance) {
      resolve(self._fhevmInstance);
      return;
    }

    // @zama-fhe/relayer-sdk lazy load
    // CDN: window.relayerSDK olarak yuklenir (window.fhevm DEGIL!)
    try {
      // SDK browser'da global olarak yuklu olmali (CDN ile veya bundle ile)
      var sdk = window.relayerSDK || window.fhevm;
      if (typeof sdk !== 'undefined' && typeof sdk.createInstance === 'function') {
        Logger.module('FHE_GAME').log('[FHEVM] Using global relayerSDK');

        // Oncelikle initSDK cagir (WASM yuklemesi gerekli)
        var initPromise = (typeof sdk.initSDK === 'function')
          ? sdk.initSDK()
          : Promise.resolve();

        initPromise
          .then(function() {
            // SepoliaConfig kullanarak instance olustur
            var config = {
              aclContractAddress: '0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D',
              kmsContractAddress: '0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A',
              inputVerifierContractAddress: '0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0',
              verifyingContractAddressDecryption: '0x5D8BD78e2ea6bbE41f26dFe9fdaEAa349e077478',
              verifyingContractAddressInputVerification: '0x483b9dE06E4E4C7D35CCf5837A1668487406D955',
              chainId: 11155111,
              gatewayChainId: 10901,
              network: window.ethereum, // MetaMask provider
              relayerUrl: 'https://relayer.testnet.zama.org'
            };

            Logger.module('FHE_GAME').log('[FHEVM] Creating instance with SepoliaConfig');
            return sdk.createInstance(config);
          })
          .then(function(instance) {
            Logger.module('FHE_GAME').log('[FHEVM] Instance created successfully');
            self._fhevmInstance = instance;
            resolve(instance);
          })
          .catch(function(err) {
            Logger.module('FHE_GAME').error('[FHEVM] Instance creation failed:', err.message);
            reject(err);
          });
      } else {
        // Fallback: Mock mode kullan
        Logger.module('FHE_GAME').warn('[FHEVM] SDK not loaded (checked relayerSDK and fhevm), falling back to mock mode');
        reject(new Error('FHEVM SDK not available'));
      }
    } catch (e) {
      reject(e);
    }
  });
};

/**
 * Deck'i 40 karta tamamla (padding)
 * Contract bytes32[40] bekliyor, eksik slotlar doldurulur
 *
 * Strateji: Eksik slotlari mevcut kartlarla tekrarla
 * Boylece contract tarafinda gecerli kartlar cekilir
 *
 * Ornek: 28 kartlik starter deck -> 40'a tamamlanir
 * [1,2,3,...,28] -> [1,2,3,...,28, 1,2,3,...,12]
 *
 * @private
 * @param {number[]} deckCardIds - Orijinal deste
 * @returns {number[]} 40 kartlik padded deste
 */
FHEGameSession.prototype._padDeckTo40 = function(deckCardIds) {
  var DECK_SIZE = 40;

  // Bos deste kontrolu
  if (!deckCardIds || deckCardIds.length === 0) {
    Logger.module('FHE_GAME').warn('Empty deck provided, filling with placeholder');
    var placeholder = [];
    // Use a neutral minion card ID (19027 = Primus Shieldmaster) instead of 1 (General)
    var PLACEHOLDER_CARD_ID = 19027;
    for (var i = 0; i < DECK_SIZE; i++) {
      placeholder.push(PLACEHOLDER_CARD_ID);
    }
    return placeholder;
  }

  // Eger zaten 40 veya fazlaysa, ilk 40'i al
  if (deckCardIds.length >= DECK_SIZE) {
    return deckCardIds.slice(0, DECK_SIZE);
  }

  // Eksik slotlari mevcut kartlarla tekrarla (round-robin)
  var padded = deckCardIds.slice(); // Kopya olustur
  var originalLength = deckCardIds.length;
  var index = 0;

  while (padded.length < DECK_SIZE) {
    padded.push(deckCardIds[index % originalLength]);
    index++;
  }

  return padded;
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
