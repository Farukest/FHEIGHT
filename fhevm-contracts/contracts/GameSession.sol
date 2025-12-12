// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint8, euint16, ebool, externalEuint16} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {CardRegistry} from "./CardRegistry.sol";

/// @title GameSession - FHE-based Card Game with Session Keys
/// @notice Provably fair card game with encrypted hands and session-based authentication
/// @dev Session keys allow popup-free gameplay after initial authorization
contract GameSession is ZamaEthereumConfig, Ownable {
    // ============ Constants ============

    uint8 public constant MAX_HAND_SIZE = 6;
    uint8 public constant STARTING_HAND_SIZE = 5;
    uint8 public constant DECK_SIZE = 40;
    uint8 public constant MAX_MANA = 9;
    uint8 public constant BOARD_WIDTH = 9;
    uint8 public constant BOARD_HEIGHT = 5;
    uint8 public constant MAX_MULLIGAN_COUNT = 2;  // Oyun başında max 2 kart değiştirilebilir

    // ============ Card Registry Reference ============
    CardRegistry public immutable cardRegistry;

    // ============ Enums ============

    enum GameState {
        NotStarted,
        WaitingForPlayer2,
        Mulligan,
        InProgress,
        Ended
    }

    enum TurnPhase {
        StartTurn,
        Main,
        EndTurn
    }

    // ============ Structs ============

    struct Player {
        address wallet;           // Ana cüzdan adresi
        address sessionKey;       // Oyun için geçici session key
        euint16[MAX_HAND_SIZE] hand;  // Şifreli el kartları (kart ID 0-730 arası)
        euint16[MAX_HAND_SIZE] spellHand; // Şifreli el kartları (havuzdan - spellMulligan için)
        uint8 handSize;           // Eldeki kart sayısı (açık)
        bool isSpellHand;         // true = spellHand kullanılıyor, false = normal hand
        euint16[DECK_SIZE] deck;  // Şifreli deste (kart ID 0-730 arası, frontend'de shuffle edilmiş)
        uint8 deckIndex;          // Sonraki çekilecek kart indexi
        uint8 currentMana;        // Mevcut mana
        uint8 maxMana;            // Maximum mana (her tur +1)
        uint32 generalCardId;     // General kart ID'si (registry'den doğrulanmış)
        uint8 generalHp;          // General HP (registry'den)
        uint8 generalAtk;         // General ATK (registry'den)
        uint8 generalX;           // General pozisyonu X
        uint8 generalY;           // General pozisyonu Y
        bool hasReplacedThisTurn; // Bu tur replace yapıldı mı
    }

    struct BoardUnit {
        uint16 cardId;            // Kart ID (0 = boş)
        uint8 ownerIndex;         // 0 veya 1 (hangi oyuncu)
        uint8 currentHp;          // Mevcut HP
        uint8 currentAtk;         // Mevcut ATK
        bool exhausted;           // Bu tur hareket etti mi
        bool isGeneral;           // General mı
    }

    struct Game {
        Player[2] players;
        BoardUnit[BOARD_HEIGHT][BOARD_WIDTH] board;  // [x][y] erişim için
        GameState state;
        TurnPhase phase;
        uint8 currentTurn;        // 0 veya 1 (hangi oyuncunun turu)
        uint8 turnNumber;         // Kaçıncı tur
        address winner;
        uint256 startTime;
        uint256 lastActionTime;
        bool isSinglePlayer;      // Single player (AI) modu mu?
    }

    // ============ State Variables ============

    mapping(uint256 => Game) public games;
    uint256 public nextGameId;

    // Random results storage - her oyun için şifreli random sonuçlar
    // Key: gameId => requestId => encrypted result
    uint8 public constant MAX_RANDOM_REQUESTS = 10; // Bir turda max 10 random istek
    mapping(uint256 => mapping(uint8 => euint8)) private randomResults8;   // 0-255 arası (pozisyon, hedef index)
    mapping(uint256 => mapping(uint8 => euint16)) private randomResults16; // 0-65535 arası (kart havuzu index)
    mapping(uint256 => uint8) public randomRequestCount; // Her oyun için request sayacı

    // Timeout for inactive games (5 minutes)
    uint256 public constant TURN_TIMEOUT = 5 minutes;

    // ============ Events ============

    event GameCreated(uint256 indexed gameId, address indexed player1, address sessionKey1);
    event PlayerJoined(uint256 indexed gameId, address indexed player2, address sessionKey2);
    event GameStarted(uint256 indexed gameId);
    event TurnStarted(uint256 indexed gameId, uint8 playerIndex, uint8 turnNumber);
    event CardDrawn(uint256 indexed gameId, uint8 playerIndex);
    event CardPlayed(uint256 indexed gameId, uint8 playerIndex, uint16 cardId, uint8 x, uint8 y);
    event UnitMoved(uint256 indexed gameId, uint8 fromX, uint8 fromY, uint8 toX, uint8 toY);
    event UnitAttacked(uint256 indexed gameId, uint8 attackerX, uint8 attackerY, uint8 targetX, uint8 targetY);
    event UnitDied(uint256 indexed gameId, uint8 x, uint8 y, uint16 cardId);
    event CardReplaced(uint256 indexed gameId, uint8 playerIndex, uint8 handSlot);
    event TurnEnded(uint256 indexed gameId, uint8 playerIndex);
    event GameEnded(uint256 indexed gameId, address winner);

    // FHE Debug Events
    event FHE_DeckInitialized(uint256 indexed gameId, uint8 playerIndex, uint8 deckSize);
    event FHE_DeckShuffled(uint256 indexed gameId, uint8 playerIndex);
    event FHE_StartingHandDrawn(uint256 indexed gameId, uint8 playerIndex, uint8 handSize);
    event FHE_CardEncrypted(uint256 indexed gameId, uint8 playerIndex, uint8 cardIndex, uint16 originalCardId);
    event SpellMulliganExecuted(uint256 indexed gameId, uint8 playerIndex, uint8 numCards, uint16 poolSize);

    // Random Action Events
    event RandomPositionGenerated(uint256 indexed gameId, uint8 indexed requestId);
    event RandomTargetGenerated(uint256 indexed gameId, uint8 indexed requestId);
    event RandomCardGenerated(uint256 indexed gameId, uint8 indexed requestId);

    // ============ Modifiers ============

    /// @notice Sadece oyunun session key'i veya ana cüzdanı çağırabilir
    /// @dev Single player modda sadece player 0 kontrol edilir
    modifier onlyPlayer(uint256 gameId) {
        Game storage game = games[gameId];
        if (game.isSinglePlayer) {
            // Single player mod: sadece player 0'ı kontrol et
            require(
                msg.sender == game.players[0].wallet ||
                msg.sender == game.players[0].sessionKey,
                "Not a player"
            );
        } else {
            // Multiplayer mod: her iki oyuncuyu da kontrol et
            require(
                msg.sender == game.players[0].wallet ||
                msg.sender == game.players[0].sessionKey ||
                msg.sender == game.players[1].wallet ||
                msg.sender == game.players[1].sessionKey,
                "Not a player"
            );
        }
        _;
    }

    /// @notice Sadece sırası gelen oyuncu çağırabilir
    /// @dev Single player modda her zaman player 0 oynayabilir
    modifier onlyCurrentPlayer(uint256 gameId) {
        Game storage game = games[gameId];
        if (game.isSinglePlayer) {
            // Single player mod: her zaman player 0 oynayabilir
            require(
                msg.sender == game.players[0].wallet ||
                msg.sender == game.players[0].sessionKey,
                "Not your turn"
            );
        } else {
            // Multiplayer mod: sırası olan oyuncu oynayabilir
            uint8 current = game.currentTurn;
            require(
                msg.sender == game.players[current].wallet ||
                msg.sender == game.players[current].sessionKey,
                "Not your turn"
            );
        }
        _;
    }

    /// @notice Oyun aktif olmalı
    modifier gameInProgress(uint256 gameId) {
        require(games[gameId].state == GameState.InProgress, "Game not in progress");
        _;
    }

    // ============ Errors ============

    error InvalidCardRegistry();
    error InvalidGeneralCard(uint32 cardId);
    error CardNotInRegistry(uint32 cardId);

    // ============ Constructor ============

    constructor(address _cardRegistry) Ownable(msg.sender) {
        if (_cardRegistry == address(0)) revert InvalidCardRegistry();
        cardRegistry = CardRegistry(_cardRegistry);
    }

    // ============ Game Creation ============

    /// @notice Yeni oyun oluştur (şifreli deck ile)
    /// @param sessionKey Player 1'in session key'i
    /// @param generalCardId Oyuncunun seçtiği General kart ID'si
    /// @param encryptedDeck Frontend'de şifrelenmiş ve shuffle edilmiş 40 kart (externalEuint16[40])
    /// @param inputProof Şifreli input'ların doğrulama proof'u
    function createGame(
        address sessionKey,
        uint32 generalCardId,
        externalEuint16[DECK_SIZE] calldata encryptedDeck,
        bytes calldata inputProof
    ) external returns (uint256 gameId) {
        // General kartını doğrula
        if (!cardRegistry.isValidGeneral(generalCardId)) revert InvalidGeneralCard(generalCardId);

        // General statlarını al
        (
            CardRegistry.CardType cardType,
            uint8 manaCost,
            uint8 generalAtk,
            uint8 generalHp
        ) = cardRegistry.getBasicStats(generalCardId);

        gameId = nextGameId++;
        Game storage game = games[gameId];

        game.players[0].wallet = msg.sender;
        game.players[0].sessionKey = sessionKey;
        game.players[0].generalCardId = generalCardId;
        game.state = GameState.WaitingForPlayer2;
        game.startTime = block.timestamp;
        game.lastActionTime = block.timestamp;

        // Şifreli desteyi doğrula ve sakla
        _initializeEncryptedDeck(game.players[0], encryptedDeck, inputProof, gameId, 0);

        // General pozisyonu (sol taraf ortası) ve HP (registry'den)
        game.players[0].generalX = 0;
        game.players[0].generalY = 2;
        game.players[0].generalHp = generalHp;
        game.players[0].generalAtk = generalAtk;

        emit GameCreated(gameId, msg.sender, sessionKey);
    }

    /// @notice Single player oyun oluştur (AI modu, şifreli deck ile)
    /// @dev joinGame gerektirmez, oyun direkt başlar
    /// @param sessionKey Player'ın session key'i
    /// @param generalCardId Oyuncunun seçtiği General kart ID'si
    /// @param encryptedDeck Frontend'de şifrelenmiş ve shuffle edilmiş 40 kart
    /// @param inputProof Şifreli input'ların doğrulama proof'u
    function createSinglePlayerGame(
        address sessionKey,
        uint32 generalCardId,
        externalEuint16[DECK_SIZE] calldata encryptedDeck,
        bytes calldata inputProof
    ) external returns (uint256 gameId) {
        // General kartını doğrula
        if (!cardRegistry.isValidGeneral(generalCardId)) revert InvalidGeneralCard(generalCardId);

        // General statlarını al
        (
            CardRegistry.CardType cardType,
            uint8 manaCost,
            uint8 generalAtk,
            uint8 generalHp
        ) = cardRegistry.getBasicStats(generalCardId);

        gameId = nextGameId++;
        Game storage game = games[gameId];

        // Single player flag'i ayarla
        game.isSinglePlayer = true;

        game.players[0].wallet = msg.sender;
        game.players[0].sessionKey = sessionKey;
        game.players[0].generalCardId = generalCardId;

        // Şifreli desteyi doğrula ve sakla
        _initializeEncryptedDeck(game.players[0], encryptedDeck, inputProof, gameId, 0);

        // General pozisyonu (sol taraf ortası) ve HP (registry'den)
        game.players[0].generalX = 0;
        game.players[0].generalY = 2;
        game.players[0].generalHp = generalHp;
        game.players[0].generalAtk = generalAtk;

        // Board'a general yerleştir
        game.board[0][2] = BoardUnit({
            cardId: uint16(generalCardId),
            ownerIndex: 0,
            currentHp: generalHp,
            currentAtk: generalAtk,
            exhausted: false,
            isGeneral: true
        });

        // Başlangıç eli çek
        _drawStartingHand(game, 0, gameId);

        // Oyunu direkt başlat (mulligan atla)
        game.state = GameState.InProgress;
        game.currentTurn = 0;  // Player 0 başlar
        game.turnNumber = 1;
        game.players[0].maxMana = 2;
        game.players[0].currentMana = 2;
        game.startTime = block.timestamp;
        game.lastActionTime = block.timestamp;

        emit GameCreated(gameId, msg.sender, sessionKey);
        emit GameStarted(gameId);
        emit TurnStarted(gameId, 0, 1);
    }

    /// @notice Oyuna katıl (şifreli deck ile)
    /// @param gameId Katılınacak oyun
    /// @param sessionKey Player 2'nin session key'i
    /// @param generalCardId Player 2'nin General kart ID'si
    /// @param encryptedDeck Frontend'de şifrelenmiş ve shuffle edilmiş 40 kart
    /// @param inputProof Şifreli input'ların doğrulama proof'u
    function joinGame(
        uint256 gameId,
        address sessionKey,
        uint32 generalCardId,
        externalEuint16[DECK_SIZE] calldata encryptedDeck,
        bytes calldata inputProof
    ) external {
        Game storage game = games[gameId];
        require(game.state == GameState.WaitingForPlayer2, "Game not waiting");
        require(msg.sender != game.players[0].wallet, "Cannot join own game");

        // General kartını doğrula
        if (!cardRegistry.isValidGeneral(generalCardId)) revert InvalidGeneralCard(generalCardId);

        // General statlarını al
        (
            CardRegistry.CardType cardType,
            uint8 manaCost,
            uint8 generalAtk,
            uint8 generalHp
        ) = cardRegistry.getBasicStats(generalCardId);

        game.players[1].wallet = msg.sender;
        game.players[1].sessionKey = sessionKey;
        game.players[1].generalCardId = generalCardId;

        // Şifreli desteyi doğrula ve sakla
        _initializeEncryptedDeck(game.players[1], encryptedDeck, inputProof, gameId, 1);

        // General pozisyonu (sağ taraf ortası) ve HP/ATK (registry'den)
        game.players[1].generalX = 8;
        game.players[1].generalY = 2;
        game.players[1].generalHp = generalHp;
        game.players[1].generalAtk = generalAtk;

        // Board'a generalleri yerleştir (registry'den alınan statlarla)
        game.board[0][2] = BoardUnit({
            cardId: uint16(game.players[0].generalCardId),
            ownerIndex: 0,
            currentHp: game.players[0].generalHp,
            currentAtk: game.players[0].generalAtk,
            exhausted: false,
            isGeneral: true
        });

        game.board[8][2] = BoardUnit({
            cardId: uint16(generalCardId),
            ownerIndex: 1,
            currentHp: generalHp,
            currentAtk: generalAtk,
            exhausted: false,
            isGeneral: true
        });

        game.state = GameState.Mulligan;
        game.lastActionTime = block.timestamp;

        emit PlayerJoined(gameId, msg.sender, sessionKey);

        // Başlangıç eli çek (her iki oyuncu)
        _drawStartingHand(game, 0, gameId);
        _drawStartingHand(game, 1, gameId);
    }

    /// @notice Mulligan tamamla ve oyunu başlat
    /// @param gameId Oyun ID
    /// @param mulliganSlots Değiştirilecek kart slotları (true = değiştir)
    function completeMulligan(
        uint256 gameId,
        bool[STARTING_HAND_SIZE] calldata mulliganSlots
    ) external onlyPlayer(gameId) {
        Game storage game = games[gameId];
        require(game.state == GameState.Mulligan, "Not in mulligan");

        uint8 playerIndex = _getPlayerIndex(game, msg.sender);
        Player storage player = game.players[playerIndex];

        // GÜVENLİK: Mulligan limit kontrolü
        uint8 mulliganCount = 0;
        for (uint8 i = 0; i < STARTING_HAND_SIZE; i++) {
            if (mulliganSlots[i]) mulliganCount++;
        }
        require(mulliganCount <= MAX_MULLIGAN_COUNT, "Mulligan limit exceeded (max 2)");

        // Seçilen kartları değiştir
        for (uint8 i = 0; i < STARTING_HAND_SIZE; i++) {
            if (mulliganSlots[i] && player.deckIndex < DECK_SIZE) {
                // Eski kartı desteye geri koy (basitleştirilmiş - sadece yeni kart çek)
                player.hand[i] = player.deck[player.deckIndex];

                // ACL ayarla
                FHE.allowThis(player.hand[i]);
                FHE.allow(player.hand[i], player.wallet);

                player.deckIndex++;
            }
        }

        // İki oyuncu da mulligan yaptıysa oyunu başlat
        // Basitleştirme: İlk mulligan yapan oyunu başlatır
        if (game.state == GameState.Mulligan) {
            game.state = GameState.InProgress;
            game.currentTurn = 1; // Player 2 başlar
            game.turnNumber = 1;
            game.players[1].maxMana = 2; // Player 2 extra mana
            game.players[1].currentMana = 2;
            game.players[0].maxMana = 1;
            game.players[0].currentMana = 1;

            emit GameStarted(gameId);
            emit TurnStarted(gameId, 1, 1);
        }
    }

    // ============ Turn Actions ============

    /// @notice Kart çek (tur başı otomatik veya spell efekti)
    /// @param gameId Oyun ID
    function drawCard(uint256 gameId) external onlyCurrentPlayer(gameId) gameInProgress(gameId) {
        Game storage game = games[gameId];
        uint8 playerIndex = game.currentTurn;
        Player storage player = game.players[playerIndex];

        require(player.handSize < MAX_HAND_SIZE, "Hand full");
        require(player.deckIndex < DECK_SIZE, "Deck empty");

        // Desteden şifreli kart çek (euint16 - kart ID 0-730)
        euint16 drawnCard = player.deck[player.deckIndex];
        player.hand[player.handSize] = drawnCard;

        // ACL: Sadece kart sahibi görebilir
        FHE.allowThis(drawnCard);
        FHE.allow(drawnCard, player.wallet);

        player.handSize++;
        player.deckIndex++;
        game.lastActionTime = block.timestamp;

        emit CardDrawn(gameId, playerIndex);
    }

    /// @notice Kart oyna (elden board'a)
    /// @param gameId Oyun ID
    /// @param handSlot Eldeki kart indexi
    /// @param x Board X pozisyonu
    /// @param y Board Y pozisyonu
    /// @param clearCardId Decrypt edilmiş kart ID
    /// @param decryptionProof KMS decrypt proof
    function playCard(
        uint256 gameId,
        uint8 handSlot,
        uint8 x,
        uint8 y,
        bytes calldata clearCardId,
        bytes calldata decryptionProof
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) {
        Game storage game = games[gameId];
        uint8 playerIndex = game.currentTurn;
        Player storage player = game.players[playerIndex];

        require(handSlot < player.handSize, "Invalid hand slot");
        require(x < BOARD_WIDTH && y < BOARD_HEIGHT, "Invalid position");
        require(game.board[x][y].cardId == 0, "Position occupied");

        // KMS proof doğrula
        bytes32[] memory handles = new bytes32[](1);
        handles[0] = FHE.toBytes32(player.hand[handSlot]);
        FHE.checkSignatures(handles, clearCardId, decryptionProof);

        // Kart ID'yi decode et
        uint16 cardId = abi.decode(clearCardId, (uint16));

        // Mana kontrolü (basitleştirilmiş - her kart 1 mana)
        uint8 manaCost = _getCardManaCost(cardId);
        require(player.currentMana >= manaCost, "Not enough mana");
        player.currentMana -= manaCost;

        // Board'a yerleştir
        game.board[x][y] = BoardUnit({
            cardId: cardId,
            ownerIndex: playerIndex,
            currentHp: _getCardHp(cardId),
            currentAtk: _getCardAtk(cardId),
            exhausted: true, // Yeni birim hareket edemez
            isGeneral: false
        });

        // Elden çıkar
        _removeFromHand(player, handSlot);

        game.lastActionTime = block.timestamp;
        emit CardPlayed(gameId, playerIndex, cardId, x, y);
    }

    /// @notice Birim hareket ettir
    /// @param gameId Oyun ID
    /// @param fromX Mevcut X
    /// @param fromY Mevcut Y
    /// @param toX Hedef X
    /// @param toY Hedef Y
    function moveUnit(
        uint256 gameId,
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) {
        Game storage game = games[gameId];
        uint8 playerIndex = game.currentTurn;

        BoardUnit storage unit = game.board[fromX][fromY];
        require(unit.cardId != 0, "No unit");
        require(unit.ownerIndex == playerIndex, "Not your unit");
        require(!unit.exhausted, "Unit exhausted");
        require(game.board[toX][toY].cardId == 0, "Target occupied");

        // Hareket mesafesi kontrolü (max 2 kare)
        uint8 distance = _calculateDistance(fromX, fromY, toX, toY);
        require(distance <= 2, "Too far");

        // Hareket et
        game.board[toX][toY] = unit;
        game.board[toX][toY].exhausted = true;
        delete game.board[fromX][fromY];

        // General pozisyonunu güncelle
        if (unit.isGeneral) {
            game.players[playerIndex].generalX = toX;
            game.players[playerIndex].generalY = toY;
        }

        game.lastActionTime = block.timestamp;
        emit UnitMoved(gameId, fromX, fromY, toX, toY);
    }

    /// @notice Saldır
    /// @param gameId Oyun ID
    /// @param attackerX Saldıran X
    /// @param attackerY Saldıran Y
    /// @param targetX Hedef X
    /// @param targetY Hedef Y
    function attack(
        uint256 gameId,
        uint8 attackerX,
        uint8 attackerY,
        uint8 targetX,
        uint8 targetY
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) {
        Game storage game = games[gameId];
        uint8 playerIndex = game.currentTurn;

        BoardUnit storage attacker = game.board[attackerX][attackerY];
        BoardUnit storage target = game.board[targetX][targetY];

        require(attacker.cardId != 0, "No attacker");
        require(attacker.ownerIndex == playerIndex, "Not your unit");
        require(!attacker.exhausted, "Attacker exhausted");
        require(target.cardId != 0, "No target");
        require(target.ownerIndex != playerIndex, "Cannot attack own unit");

        // Saldırı mesafesi kontrolü (bitişik olmalı)
        uint8 distance = _calculateDistance(attackerX, attackerY, targetX, targetY);
        require(distance == 1, "Target not adjacent");

        // Hasar hesapla
        _dealDamage(game, targetX, targetY, attacker.currentAtk, gameId);

        // Karşı saldırı (target ölmediyse)
        if (game.board[targetX][targetY].cardId != 0) {
            _dealDamage(game, attackerX, attackerY, target.currentAtk, gameId);
        }

        attacker.exhausted = true;
        game.lastActionTime = block.timestamp;

        emit UnitAttacked(gameId, attackerX, attackerY, targetX, targetY);
    }

    /// @notice Kart değiştir (replace)
    /// @param gameId Oyun ID
    /// @param handSlot Değiştirilecek kart indexi
    function replaceCard(
        uint256 gameId,
        uint8 handSlot
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) {
        Game storage game = games[gameId];
        uint8 playerIndex = game.currentTurn;
        Player storage player = game.players[playerIndex];

        require(!player.hasReplacedThisTurn, "Already replaced");
        require(handSlot < player.handSize, "Invalid slot");
        require(player.deckIndex < DECK_SIZE, "Deck empty");

        // Yeni kart çek (euint16 - kart ID 0-730)
        euint16 newCard = player.deck[player.deckIndex];
        player.hand[handSlot] = newCard;

        // ACL
        FHE.allowThis(newCard);
        FHE.allow(newCard, player.wallet);

        player.deckIndex++;
        player.hasReplacedThisTurn = true;
        game.lastActionTime = block.timestamp;

        emit CardReplaced(gameId, playerIndex, handSlot);
    }

    /// @notice Spell Mulligan - Tüm eli değiştir (SpellGodMulligan için)
    /// @param gameId Oyun ID
    /// @param poolSize Kart havuzu boyutu (örn: 730)
    /// @param numCards Çekilecek kart sayısı (genelde 5)
    function spellMulligan(
        uint256 gameId,
        uint16 poolSize,
        uint8 numCards
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) {
        require(poolSize > 0, "Pool size must be > 0");
        require(numCards > 0 && numCards <= MAX_HAND_SIZE, "Invalid card count");

        Game storage game = games[gameId];
        uint8 playerIndex = game.currentTurn;
        Player storage player = game.players[playerIndex];

        // Havuzdan random kartlar çek (şifreli index olarak)
        for (uint8 i = 0; i < numCards; i++) {
            // 0 ile poolSize-1 arası random index üret
            euint16 randomIndex = FHE.randEuint16(poolSize);

            // spellHand'e kaydet (euint16 - 730 kart destekler)
            player.spellHand[i] = randomIndex;

            // ACL ayarla
            FHE.allowThis(player.spellHand[i]);
            FHE.allow(player.spellHand[i], player.wallet);
        }

        player.handSize = numCards;
        player.isSpellHand = true;  // Artık spellHand kullanılıyor
        game.lastActionTime = block.timestamp;

        emit SpellMulliganExecuted(gameId, playerIndex, numCards, poolSize);
    }

    /// @notice SpellHand kartlarını döndür (spellMulligan sonrası decrypt için)
    /// @param gameId Oyun ID
    function getSpellHand(uint256 gameId) external view returns (euint16[MAX_HAND_SIZE] memory) {
        Game storage game = games[gameId];
        uint8 playerIndex = _getPlayerIndex(game, msg.sender);
        return game.players[playerIndex].spellHand;
    }

    // ============ FHE Random Action Functions ============

    /// @notice Random teleport pozisyonu üret (RandomTeleportAction için)
    /// @param gameId Oyun ID
    /// @param validPositionCount Geçerli pozisyon sayısı (frontend'den)
    /// @return requestId Bu random isteğin ID'si (decrypt için kullanılacak)
    /// @dev validPositionCount: Board'daki boş pozisyon sayısı (max 45 = 9x5)
    function requestRandomTeleportPosition(
        uint256 gameId,
        uint8 validPositionCount
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) returns (uint8 requestId) {
        require(validPositionCount > 0 && validPositionCount <= 45, "Invalid position count");
        require(randomRequestCount[gameId] < MAX_RANDOM_REQUESTS, "Too many random requests");

        requestId = randomRequestCount[gameId];

        // 0 ile validPositionCount-1 arası şifreli random index üret
        euint8 randomIndex = FHE.randEuint8(validPositionCount);
        randomResults8[gameId][requestId] = randomIndex;

        // ACL - her iki oyuncu da görebilir (public decrypt için)
        Game storage game = games[gameId];
        FHE.allowThis(randomIndex);
        FHE.allow(randomIndex, game.players[0].wallet);
        FHE.allow(randomIndex, game.players[1].wallet);
        FHE.makePubliclyDecryptable(randomIndex);

        randomRequestCount[gameId]++;
        game.lastActionTime = block.timestamp;

        emit RandomPositionGenerated(gameId, requestId);
    }

    /// @notice Random spawn pozisyonu üret (RandomPlayCardSilentlyAction için)
    /// @param gameId Oyun ID
    /// @param validPositionCount Geçerli spawn pozisyon sayısı (frontend'den)
    /// @return requestId Bu random isteğin ID'si
    function requestRandomSpawnPosition(
        uint256 gameId,
        uint8 validPositionCount
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) returns (uint8 requestId) {
        require(validPositionCount > 0 && validPositionCount <= 45, "Invalid position count");
        require(randomRequestCount[gameId] < MAX_RANDOM_REQUESTS, "Too many random requests");

        requestId = randomRequestCount[gameId];

        euint8 randomIndex = FHE.randEuint8(validPositionCount);
        randomResults8[gameId][requestId] = randomIndex;

        Game storage game = games[gameId];
        FHE.allowThis(randomIndex);
        FHE.allow(randomIndex, game.players[0].wallet);
        FHE.allow(randomIndex, game.players[1].wallet);
        FHE.makePubliclyDecryptable(randomIndex);

        randomRequestCount[gameId]++;
        game.lastActionTime = block.timestamp;

        emit RandomPositionGenerated(gameId, requestId);
    }

    /// @notice Random düşman hedefi seç (RandomDamageAction için)
    /// @param gameId Oyun ID
    /// @param validTargetCount Geçerli hedef sayısı (düşman birim sayısı, frontend'den)
    /// @return requestId Bu random isteğin ID'si
    /// @dev validTargetCount: Board'daki düşman birim sayısı (max ~20)
    function requestRandomDamageTarget(
        uint256 gameId,
        uint8 validTargetCount
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) returns (uint8 requestId) {
        require(validTargetCount > 0, "No valid targets");
        require(randomRequestCount[gameId] < MAX_RANDOM_REQUESTS, "Too many random requests");

        requestId = randomRequestCount[gameId];

        euint8 randomIndex = FHE.randEuint8(validTargetCount);
        randomResults8[gameId][requestId] = randomIndex;

        Game storage game = games[gameId];
        FHE.allowThis(randomIndex);
        FHE.allow(randomIndex, game.players[0].wallet);
        FHE.allow(randomIndex, game.players[1].wallet);
        FHE.makePubliclyDecryptable(randomIndex);

        randomRequestCount[gameId]++;
        game.lastActionTime = block.timestamp;

        emit RandomTargetGenerated(gameId, requestId);
    }

    /// @notice Random artifact seç (RemoveRandomArtifactAction için)
    /// @param gameId Oyun ID
    /// @param artifactCount General üzerindeki artifact sayısı (frontend'den)
    /// @return requestId Bu random isteğin ID'si
    function requestRandomArtifact(
        uint256 gameId,
        uint8 artifactCount
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) returns (uint8 requestId) {
        require(artifactCount > 0, "No artifacts");
        require(randomRequestCount[gameId] < MAX_RANDOM_REQUESTS, "Too many random requests");

        requestId = randomRequestCount[gameId];

        euint8 randomIndex = FHE.randEuint8(artifactCount);
        randomResults8[gameId][requestId] = randomIndex;

        Game storage game = games[gameId];
        FHE.allowThis(randomIndex);
        FHE.allow(randomIndex, game.players[0].wallet);
        FHE.allow(randomIndex, game.players[1].wallet);
        FHE.makePubliclyDecryptable(randomIndex);

        randomRequestCount[gameId]++;
        game.lastActionTime = block.timestamp;

        emit RandomTargetGenerated(gameId, requestId);
    }

    /// @notice Random kart transform (SpellTransformSameManaCost için)
    /// @param gameId Oyun ID
    /// @param cardPoolSize Aynı mana maliyetli kart sayısı (frontend'den)
    /// @return requestId Bu random isteğin ID'si
    /// @dev cardPoolSize: Aynı mana cost'a sahip minion sayısı (max ~100)
    function requestRandomTransformCard(
        uint256 gameId,
        uint16 cardPoolSize
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) returns (uint8 requestId) {
        require(cardPoolSize > 0, "No valid cards");
        require(randomRequestCount[gameId] < MAX_RANDOM_REQUESTS, "Too many random requests");

        requestId = randomRequestCount[gameId];

        euint16 randomIndex = FHE.randEuint16(cardPoolSize);
        randomResults16[gameId][requestId] = randomIndex;

        Game storage game = games[gameId];
        FHE.allowThis(randomIndex);
        FHE.allow(randomIndex, game.players[0].wallet);
        FHE.allow(randomIndex, game.players[1].wallet);
        FHE.makePubliclyDecryptable(randomIndex);

        randomRequestCount[gameId]++;
        game.lastActionTime = block.timestamp;

        emit RandomCardGenerated(gameId, requestId);
    }

    /// @notice Genel amaçlı random kart seçimi (havuzdan kart çekme spell'leri için)
    /// @param gameId Oyun ID
    /// @param poolSize Kart havuzu boyutu (faction kartları, artifact'lar, vs.)
    /// @return requestId Bu random isteğin ID'si
    /// @dev Kullanım: spellDrawArtifact, spellCryogenesis, modifierDrawRandomBattlePet, vs.
    function requestRandomCardFromPool(
        uint256 gameId,
        uint16 poolSize
    ) external onlyCurrentPlayer(gameId) gameInProgress(gameId) returns (uint8 requestId) {
        require(poolSize > 0, "Empty pool");
        require(randomRequestCount[gameId] < MAX_RANDOM_REQUESTS, "Too many random requests");

        requestId = randomRequestCount[gameId];

        euint16 randomIndex = FHE.randEuint16(poolSize);
        randomResults16[gameId][requestId] = randomIndex;

        Game storage game = games[gameId];
        FHE.allowThis(randomIndex);
        FHE.allow(randomIndex, game.players[0].wallet);
        FHE.allow(randomIndex, game.players[1].wallet);
        FHE.makePubliclyDecryptable(randomIndex);

        randomRequestCount[gameId]++;
        game.lastActionTime = block.timestamp;

        emit RandomCardGenerated(gameId, requestId);
    }

    /// @notice Random sonucu al (euint8 - pozisyon, hedef index için)
    /// @param gameId Oyun ID
    /// @param requestId Random istek ID'si
    function getRandomResult8(uint256 gameId, uint8 requestId) external view returns (euint8) {
        return randomResults8[gameId][requestId];
    }

    /// @notice Random sonucu al (euint16 - kart pool index için)
    /// @param gameId Oyun ID
    /// @param requestId Random istek ID'si
    function getRandomResult16(uint256 gameId, uint8 requestId) external view returns (euint16) {
        return randomResults16[gameId][requestId];
    }

    /// @notice Tur sonunda random request sayacını sıfırla
    /// @param gameId Oyun ID
    function _resetRandomRequestCount(uint256 gameId) internal {
        randomRequestCount[gameId] = 0;
    }

    /// @notice Turu bitir
    /// @param gameId Oyun ID
    function endTurn(uint256 gameId) external onlyCurrentPlayer(gameId) gameInProgress(gameId) {
        Game storage game = games[gameId];
        uint8 currentPlayer = game.currentTurn;

        emit TurnEnded(gameId, currentPlayer);

        // Sonraki oyuncuya geç
        game.currentTurn = currentPlayer == 0 ? 1 : 0;
        uint8 nextPlayer = game.currentTurn;

        // Tur sayacını artır (her iki oyuncu oynadığında)
        if (nextPlayer == 1) {
            game.turnNumber++;
        }

        // Yeni tur başlangıcı
        Player storage next = game.players[nextPlayer];

        // Mana yenile ve artır
        if (next.maxMana < MAX_MANA) {
            next.maxMana++;
        }
        next.currentMana = next.maxMana;

        // Replace hakkı sıfırla
        next.hasReplacedThisTurn = false;

        // Birimlerin exhausted durumunu sıfırla
        for (uint8 x = 0; x < BOARD_WIDTH; x++) {
            for (uint8 y = 0; y < BOARD_HEIGHT; y++) {
                if (game.board[x][y].ownerIndex == nextPlayer) {
                    game.board[x][y].exhausted = false;
                }
            }
        }

        game.lastActionTime = block.timestamp;
        emit TurnStarted(gameId, nextPlayer, game.turnNumber);

        // Otomatik kart çek (tur başı, euint16 - kart ID 0-730)
        if (next.handSize < MAX_HAND_SIZE && next.deckIndex < DECK_SIZE) {
            euint16 drawnCard = next.deck[next.deckIndex];
            next.hand[next.handSize] = drawnCard;
            FHE.allowThis(drawnCard);
            FHE.allow(drawnCard, next.wallet);
            next.handSize++;
            next.deckIndex++;
            emit CardDrawn(gameId, nextPlayer);
        }
    }

    /// @notice Teslim ol
    /// @param gameId Oyun ID
    function resign(uint256 gameId) external onlyPlayer(gameId) gameInProgress(gameId) {
        Game storage game = games[gameId];
        uint8 playerIndex = _getPlayerIndex(game, msg.sender);

        // Diğer oyuncu kazanır
        uint8 winnerIndex = playerIndex == 0 ? 1 : 0;
        _endGame(game, game.players[winnerIndex].wallet, gameId);
    }

    // ============ View Functions ============

    /// @notice Oyuncunun el kartı handle'larını döndür (user decrypt için)
    /// @param gameId Oyun ID
    function getHand(uint256 gameId) external view returns (euint16[MAX_HAND_SIZE] memory) {
        Game storage game = games[gameId];
        uint8 playerIndex = _getPlayerIndex(game, msg.sender);
        return game.players[playerIndex].hand;
    }

    /// @notice Desteden belirli bir index'teki şifreli kartı döndür (TX YOK - view call)
    /// @dev Frontend local deckIndex takip eder, bu fonksiyon ile deck[index]'i okur ve decrypt eder
    /// @param gameId Oyun ID
    /// @param deckIndex Desteden okunacak kart indexi (0-39)
    /// @return Şifreli kart handle'ı (euint16)
    function getCardFromDeck(uint256 gameId, uint8 deckIndex) external view returns (euint16) {
        require(deckIndex < DECK_SIZE, "Invalid deck index");
        Game storage game = games[gameId];
        uint8 playerIndex = _getPlayerIndex(game, msg.sender);
        return game.players[playerIndex].deck[deckIndex];
    }

    /// @notice Oyuncunun deckIndex'ini döndür (kaç kart çekildiğini gösterir)
    /// @param gameId Oyun ID
    /// @return deckIndex (başlangıçta 5, her kart çekiminde +1)
    function getDeckIndex(uint256 gameId) external view returns (uint8) {
        Game storage game = games[gameId];
        uint8 playerIndex = _getPlayerIndex(game, msg.sender);
        return game.players[playerIndex].deckIndex;
    }

    /// @notice Oyun durumunu döndür
    /// @param gameId Oyun ID
    function getGameState(uint256 gameId) external view returns (
        GameState state,
        uint8 currentTurn,
        uint8 turnNumber,
        address winner
    ) {
        Game storage game = games[gameId];
        return (game.state, game.currentTurn, game.turnNumber, game.winner);
    }

    /// @notice Oyuncu bilgilerini döndür
    /// @param gameId Oyun ID
    /// @param playerIndex 0 veya 1
    function getPlayerInfo(uint256 gameId, uint8 playerIndex) external view returns (
        address wallet,
        uint8 handSize,
        uint8 deckRemaining,
        uint8 currentMana,
        uint8 maxMana,
        uint8 generalHp
    ) {
        Player storage player = games[gameId].players[playerIndex];
        return (
            player.wallet,
            player.handSize,
            DECK_SIZE - player.deckIndex,
            player.currentMana,
            player.maxMana,
            player.generalHp
        );
    }

    /// @notice Board pozisyonundaki birimi döndür
    /// @param gameId Oyun ID
    /// @param x X pozisyonu
    /// @param y Y pozisyonu
    function getBoardUnit(uint256 gameId, uint8 x, uint8 y) external view returns (
        uint16 cardId,
        uint8 ownerIndex,
        uint8 currentHp,
        uint8 currentAtk,
        bool exhausted,
        bool isGeneral
    ) {
        BoardUnit storage unit = games[gameId].board[x][y];
        return (unit.cardId, unit.ownerIndex, unit.currentHp, unit.currentAtk, unit.exhausted, unit.isGeneral);
    }

    // ============ Internal Functions ============

    /// @notice Şifreli desteyi doğrula ve sakla (shuffle ve şifreleme frontend'de yapılır)
    /// @dev Frontend shuffle yapar → createEncryptedInput ile şifreler → contract'a gönderir
    ///      Contract sadece FHE.fromExternal ile doğrular ve saklar.
    ///      TX verisi şifreli olduğu için rakip deck sırasını göremez.
    /// @param player Oyuncu storage referansı
    /// @param encryptedDeck Frontend'den gelen şifreli 40 kart (externalEuint16[40])
    /// @param inputProof Şifreleme proof'u (tek proof tüm kartlar için)
    /// @param gameId Oyun ID (event için)
    /// @param playerIndex Oyuncu indexi (event için)
    function _initializeEncryptedDeck(
        Player storage player,
        externalEuint16[DECK_SIZE] calldata encryptedDeck,
        bytes calldata inputProof,
        uint256 gameId,
        uint8 playerIndex
    ) internal {
        // Her şifreli kartı doğrula ve sakla
        for (uint8 i = 0; i < DECK_SIZE; i++) {
            // FHE.fromExternal: şifreli input'u doğrular ve euint16'ya çevirir
            player.deck[i] = FHE.fromExternal(encryptedDeck[i], inputProof);

            // ACL: Contract erişimi (internal işlemler için)
            FHE.allowThis(player.deck[i]);

            // ACL: Oyuncu erişimi (user decrypt için - TÜM deck kartları)
            // Bu sayede getCardFromDeck() ile TX'siz kart çekimi yapılabilir
            FHE.allow(player.deck[i], player.wallet);

            emit FHE_CardEncrypted(gameId, playerIndex, i, 0); // Şifreli olduğu için ID 0 gösteriyoruz
        }

        emit FHE_DeckInitialized(gameId, playerIndex, DECK_SIZE);
    }

    /// @notice Başlangıç eli çek
    function _drawStartingHand(Game storage game, uint8 playerIndex, uint256 gameId) internal {
        Player storage player = game.players[playerIndex];

        for (uint8 i = 0; i < STARTING_HAND_SIZE; i++) {
            player.hand[i] = player.deck[i];
            FHE.allowThis(player.hand[i]);
            FHE.allow(player.hand[i], player.wallet);
        }

        player.handSize = STARTING_HAND_SIZE;
        player.deckIndex = STARTING_HAND_SIZE;

        // FHE Debug: Log starting hand drawn
        emit FHE_StartingHandDrawn(gameId, playerIndex, STARTING_HAND_SIZE);
    }

    /// @notice Elden kart çıkar
    function _removeFromHand(Player storage player, uint8 slot) internal {
        require(slot < player.handSize, "Invalid slot");

        // Son kartı silinen yere taşı
        if (slot < player.handSize - 1) {
            player.hand[slot] = player.hand[player.handSize - 1];
        }

        player.handSize--;
    }

    /// @notice Mesafe hesapla (Manhattan)
    function _calculateDistance(uint8 x1, uint8 y1, uint8 x2, uint8 y2) internal pure returns (uint8) {
        uint8 dx = x1 > x2 ? x1 - x2 : x2 - x1;
        uint8 dy = y1 > y2 ? y1 - y2 : y2 - y1;
        return dx + dy;
    }

    /// @notice Hasar ver
    function _dealDamage(Game storage game, uint8 x, uint8 y, uint8 damage, uint256 gameId) internal {
        BoardUnit storage unit = game.board[x][y];

        if (unit.currentHp <= damage) {
            // Birim öldü
            uint16 cardId = unit.cardId;
            uint8 ownerIndex = unit.ownerIndex;
            bool wasGeneral = unit.isGeneral;

            delete game.board[x][y];
            emit UnitDied(gameId, x, y, cardId);

            // General öldüyse oyun biter
            if (wasGeneral) {
                uint8 winnerIndex = ownerIndex == 0 ? 1 : 0;
                _endGame(game, game.players[winnerIndex].wallet, gameId);
            }
        } else {
            unit.currentHp -= damage;

            // General HP'sini de güncelle
            if (unit.isGeneral) {
                game.players[unit.ownerIndex].generalHp = unit.currentHp;
            }
        }
    }

    /// @notice Oyunu bitir
    function _endGame(Game storage game, address winner, uint256 gameId) internal {
        game.state = GameState.Ended;
        game.winner = winner;
        emit GameEnded(gameId, winner);
    }

    /// @notice Msg.sender'ın player index'ini bul
    /// @dev Single player modda her zaman 0 döner
    function _getPlayerIndex(Game storage game, address sender) internal view returns (uint8) {
        if (sender == game.players[0].wallet || sender == game.players[0].sessionKey) {
            return 0;
        }
        // Single player modda player 1 kontrolü atla
        if (!game.isSinglePlayer) {
            if (sender == game.players[1].wallet || sender == game.players[1].sessionKey) {
                return 1;
            }
        }
        revert("Not a player");
    }

    // ============ Card Data (CardRegistry'den) ============

    /// @notice Kartın mana maliyetini CardRegistry'den al
    function _getCardManaCost(uint16 cardId) internal view returns (uint8) {
        return cardRegistry.getManaCost(uint32(cardId));
    }

    /// @notice Kartın HP'sini CardRegistry'den al
    function _getCardHp(uint16 cardId) internal view returns (uint8) {
        return cardRegistry.getHp(uint32(cardId));
    }

    /// @notice Kartın ATK'sını CardRegistry'den al
    function _getCardAtk(uint16 cardId) internal view returns (uint8) {
        return cardRegistry.getAtk(uint32(cardId));
    }

    /// @notice Kartın tipini kontrol et (unit mi değil mi)
    function _isUnitCard(uint16 cardId) internal view returns (bool) {
        return cardRegistry.isUnit(uint32(cardId));
    }
}
