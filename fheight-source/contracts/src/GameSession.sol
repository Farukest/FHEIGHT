// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title GameSession
 * @notice FHE-based card game session contract for FHEIGHT
 * @dev Encrypted hand cards, deck order. Public board state.
 *
 * SIFRELI VERILER:
 * - playerHand[player][0-5]: Oyuncunun elindeki kartlar (euint8)
 * - deckOrder[player][0-39]: Deste sirasi (euint8)
 *
 * ACIK VERILER:
 * - board[]: Tahtadaki birimler
 * - generalHP[]: General can puanlari
 * - mana[]: Oyuncu manalari
 * - graveyard[]: Mezarlik
 */

// Note: For actual FHEVM deployment, uncomment these imports:
// import { FHE, euint8, ebool, externalEuint8 } from "@fhevm/solidity/lib/FHE.sol";
// import { ZamaEthereumConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

// For local testing without FHEVM, we use mock types
contract GameSession {

    // ============ CONSTANTS ============
    uint8 public constant BOARD_WIDTH = 9;
    uint8 public constant BOARD_HEIGHT = 5;
    uint8 public constant MAX_HAND_SIZE = 6;
    uint8 public constant DECK_SIZE = 40;
    uint8 public constant STARTING_HAND_SIZE = 5;
    uint8 public constant MAX_MANA = 9;
    uint8 public constant STARTING_GENERAL_HP = 25;

    // ============ ENUMS ============
    enum GameState { WaitingForPlayers, MulliganPhase, InProgress, Finished }
    enum TurnPhase { Draw, Main, End }

    // ============ STRUCTS ============
    struct BoardUnit {
        uint32 cardId;      // Kart ID (0 = bos)
        address owner;      // Sahip
        uint8 x;            // X pozisyonu (0-8)
        uint8 y;            // Y pozisyonu (0-4)
        uint8 hp;           // Can
        uint8 atk;          // Saldiri
        bool exhausted;     // Bu tur hareket/saldiri yapti mi
        bool isGeneral;     // General mi
    }

    struct Game {
        address player1;
        address player2;
        address currentTurn;
        GameState state;
        TurnPhase phase;
        uint8 turnNumber;
        uint256 createdAt;
        uint256 lastActionAt;
    }

    // ============ STORAGE ============

    // Game counter
    uint256 public gameCounter;

    // Game data
    mapping(uint256 => Game) public games;

    // Player hand (ENCRYPTED in real FHEVM)
    // gameId => player => cardIndex => cardId
    // In real FHEVM: mapping(uint256 => mapping(address => euint8[6])) private playerHand;
    mapping(uint256 => mapping(address => uint8[6])) private playerHand;
    mapping(uint256 => mapping(address => uint8)) public handSize;

    // Deck order (ENCRYPTED in real FHEVM)
    // In real FHEVM: mapping(uint256 => mapping(address => euint8[40])) private deckOrder;
    mapping(uint256 => mapping(address => uint8[40])) private deckOrder;
    mapping(uint256 => mapping(address => uint8)) public deckIndex; // Next card to draw

    // Board state (PUBLIC)
    mapping(uint256 => BoardUnit[]) public board;

    // General HP (PUBLIC)
    mapping(uint256 => mapping(address => uint8)) public generalHP;

    // Mana (PUBLIC)
    mapping(uint256 => mapping(address => uint8)) public mana;
    mapping(uint256 => mapping(address => uint8)) public maxMana;

    // Graveyard (PUBLIC)
    mapping(uint256 => uint32[]) public graveyard;

    // Replace tracking (1 per turn)
    mapping(uint256 => mapping(address => bool)) public hasReplacedThisTurn;

    // ============ EVENTS ============
    event GameCreated(uint256 indexed gameId, address indexed player1);
    event PlayerJoined(uint256 indexed gameId, address indexed player2);
    event GameStarted(uint256 indexed gameId);
    event TurnStarted(uint256 indexed gameId, address indexed player, uint8 turnNumber);
    event TurnEnded(uint256 indexed gameId, address indexed player);
    event CardDrawn(uint256 indexed gameId, address indexed player);
    event CardPlayed(uint256 indexed gameId, address indexed player, uint8 handIndex, uint8 x, uint8 y);
    event CardReplaced(uint256 indexed gameId, address indexed player, uint8 handIndex);
    event UnitMoved(uint256 indexed gameId, uint8 fromX, uint8 fromY, uint8 toX, uint8 toY);
    event UnitAttacked(uint256 indexed gameId, uint8 attackerX, uint8 attackerY, uint8 targetX, uint8 targetY, uint8 damage);
    event UnitDied(uint256 indexed gameId, uint8 x, uint8 y, uint32 cardId);
    event GameEnded(uint256 indexed gameId, address indexed winner);

    // ============ MODIFIERS ============
    modifier onlyPlayer(uint256 gameId) {
        require(
            msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2,
            "Not a player"
        );
        _;
    }

    modifier onlyCurrentTurn(uint256 gameId) {
        require(msg.sender == games[gameId].currentTurn, "Not your turn");
        _;
    }

    modifier gameInProgress(uint256 gameId) {
        require(games[gameId].state == GameState.InProgress, "Game not in progress");
        _;
    }

    // ============ GAME LIFECYCLE ============

    /**
     * @notice Yeni oyun olustur
     * @param deckCardIds Oyuncunun 40 kartlik destesi (kart ID'leri)
     */
    function createGame(uint32[40] calldata deckCardIds) external returns (uint256 gameId) {
        gameId = gameCounter++;

        games[gameId] = Game({
            player1: msg.sender,
            player2: address(0),
            currentTurn: address(0),
            state: GameState.WaitingForPlayers,
            phase: TurnPhase.Draw,
            turnNumber: 0,
            createdAt: block.timestamp,
            lastActionAt: block.timestamp
        });

        // Initialize deck (in real FHEVM, this would be encrypted)
        _initializeDeck(gameId, msg.sender, deckCardIds);

        // Initialize general HP
        generalHP[gameId][msg.sender] = STARTING_GENERAL_HP;

        emit GameCreated(gameId, msg.sender);
    }

    /**
     * @notice Oyuna katil
     * @param gameId Oyun ID
     * @param deckCardIds Oyuncunun 40 kartlik destesi
     */
    function joinGame(uint256 gameId, uint32[40] calldata deckCardIds) external {
        Game storage game = games[gameId];
        require(game.state == GameState.WaitingForPlayers, "Game not waiting");
        require(game.player2 == address(0), "Game full");
        require(msg.sender != game.player1, "Cannot join own game");

        game.player2 = msg.sender;
        game.state = GameState.MulliganPhase;
        game.lastActionAt = block.timestamp;

        // Initialize deck
        _initializeDeck(gameId, msg.sender, deckCardIds);

        // Initialize general HP
        generalHP[gameId][msg.sender] = STARTING_GENERAL_HP;

        emit PlayerJoined(gameId, msg.sender);

        // Draw starting hands for both players
        _drawStartingHand(gameId, game.player1);
        _drawStartingHand(gameId, game.player2);
    }

    /**
     * @notice Mulligan tamamla ve oyunu baslat
     * @param gameId Oyun ID
     * @param replaceIndices Replace edilecek kart indeksleri (0-4)
     */
    function completeMulligan(uint256 gameId, uint8[] calldata replaceIndices) external onlyPlayer(gameId) {
        Game storage game = games[gameId];
        require(game.state == GameState.MulliganPhase, "Not in mulligan");

        // Replace selected cards
        for (uint8 i = 0; i < replaceIndices.length; i++) {
            require(replaceIndices[i] < STARTING_HAND_SIZE, "Invalid index");
            _replaceCard(gameId, msg.sender, replaceIndices[i]);
        }

        // Check if both players completed mulligan (simplified - in real impl track separately)
        game.state = GameState.InProgress;
        game.currentTurn = game.player1; // Player 1 goes first
        game.turnNumber = 1;
        maxMana[gameId][game.player1] = 2; // First player starts with 2 mana
        mana[gameId][game.player1] = 2;
        maxMana[gameId][game.player2] = 2;
        mana[gameId][game.player2] = 2;

        // Spawn generals at starting positions
        _spawnGeneral(gameId, game.player1, 0, 2); // Left side
        _spawnGeneral(gameId, game.player2, 8, 2); // Right side

        emit GameStarted(gameId);
        emit TurnStarted(gameId, game.currentTurn, game.turnNumber);
    }

    // ============ TURN ACTIONS ============

    /**
     * @notice Kart cek (SIFRELI -> SIFRELI)
     * Sadece kart sahibi decrypt edebilir
     */
    function drawCard(uint256 gameId) external onlyCurrentTurn(gameId) gameInProgress(gameId) {
        require(handSize[gameId][msg.sender] < MAX_HAND_SIZE, "Hand full");
        require(deckIndex[gameId][msg.sender] < DECK_SIZE, "Deck empty");

        // In real FHEVM:
        // euint8 drawnCard = deckOrder[gameId][msg.sender][deckIndex[gameId][msg.sender]];
        // playerHand[gameId][msg.sender][handSize[gameId][msg.sender]] = drawnCard;
        // FHE.allowThis(drawnCard);
        // FHE.allow(drawnCard, msg.sender);

        uint8 drawnCard = deckOrder[gameId][msg.sender][deckIndex[gameId][msg.sender]];
        playerHand[gameId][msg.sender][handSize[gameId][msg.sender]] = drawnCard;

        handSize[gameId][msg.sender]++;
        deckIndex[gameId][msg.sender]++;

        emit CardDrawn(gameId, msg.sender);
    }

    /**
     * @notice Kart oyna (SIFRELI -> ACIK)
     * Eldeki sifreli kart, board'a acik olarak yerlesir
     * @param handIndex Eldeki kart indeksi
     * @param x Board X pozisyonu
     * @param y Board Y pozisyonu
     */
    function playCard(
        uint256 gameId,
        uint8 handIndex,
        uint8 x,
        uint8 y
    ) external onlyCurrentTurn(gameId) gameInProgress(gameId) {
        require(handIndex < handSize[gameId][msg.sender], "Invalid hand index");
        require(x < BOARD_WIDTH && y < BOARD_HEIGHT, "Invalid position");
        require(_getUnitAt(gameId, x, y).cardId == 0, "Position occupied");

        // Get card from hand (in real FHEVM, need user decrypt or public decrypt)
        uint8 cardId = playerHand[gameId][msg.sender][handIndex];
        require(cardId > 0, "Empty slot");

        // TODO: Check mana cost from CardRegistry
        // uint8 cost = cardRegistry.getManaCost(cardId);
        // require(mana[gameId][msg.sender] >= cost, "Not enough mana");
        // mana[gameId][msg.sender] -= cost;

        // Spawn unit on board
        board[gameId].push(BoardUnit({
            cardId: uint32(cardId),
            owner: msg.sender,
            x: x,
            y: y,
            hp: 2,  // TODO: Get from CardRegistry
            atk: 2, // TODO: Get from CardRegistry
            exhausted: true, // Cannot act on play turn
            isGeneral: false
        }));

        // Remove from hand (shift cards left)
        _removeFromHand(gameId, msg.sender, handIndex);

        emit CardPlayed(gameId, msg.sender, handIndex, x, y);
    }

    /**
     * @notice Kart replace et (SIFRELI -> SIFRELI)
     * Eldeki bir karti desteye geri koy, yeni kart cek
     * Her turda 1 kez yapilabilir
     */
    function replaceCard(uint256 gameId, uint8 handIndex) external onlyCurrentTurn(gameId) gameInProgress(gameId) {
        require(!hasReplacedThisTurn[gameId][msg.sender], "Already replaced this turn");
        require(handIndex < handSize[gameId][msg.sender], "Invalid hand index");
        require(deckIndex[gameId][msg.sender] < DECK_SIZE, "Deck empty");

        _replaceCard(gameId, msg.sender, handIndex);
        hasReplacedThisTurn[gameId][msg.sender] = true;

        emit CardReplaced(gameId, msg.sender, handIndex);
    }

    /**
     * @notice Birim hareket ettir (ACIK)
     */
    function moveUnit(
        uint256 gameId,
        uint8 fromX,
        uint8 fromY,
        uint8 toX,
        uint8 toY
    ) external onlyCurrentTurn(gameId) gameInProgress(gameId) {
        require(toX < BOARD_WIDTH && toY < BOARD_HEIGHT, "Invalid destination");

        (uint256 unitIndex, BoardUnit storage unit) = _getUnitAtWithIndex(gameId, fromX, fromY);
        require(unit.cardId != 0, "No unit at position");
        require(unit.owner == msg.sender, "Not your unit");
        require(!unit.exhausted, "Unit exhausted");
        require(_getUnitAt(gameId, toX, toY).cardId == 0, "Destination occupied");

        // Check movement range (simplified: 1-2 tiles)
        uint8 distance = _distance(fromX, fromY, toX, toY);
        require(distance <= 2, "Too far");

        unit.x = toX;
        unit.y = toY;
        unit.exhausted = true;

        emit UnitMoved(gameId, fromX, fromY, toX, toY);
    }

    /**
     * @notice Saldiri yap (ACIK)
     */
    function attack(
        uint256 gameId,
        uint8 attackerX,
        uint8 attackerY,
        uint8 targetX,
        uint8 targetY
    ) external onlyCurrentTurn(gameId) gameInProgress(gameId) {
        (uint256 attackerIndex, BoardUnit storage attacker) = _getUnitAtWithIndex(gameId, attackerX, attackerY);
        require(attacker.cardId != 0, "No attacker");
        require(attacker.owner == msg.sender, "Not your unit");
        require(!attacker.exhausted, "Attacker exhausted");

        (uint256 targetIndex, BoardUnit storage target) = _getUnitAtWithIndex(gameId, targetX, targetY);
        require(target.cardId != 0, "No target");
        require(target.owner != msg.sender, "Cannot attack own unit");

        // Check attack range (simplified: adjacent)
        uint8 distance = _distance(attackerX, attackerY, targetX, targetY);
        require(distance == 1, "Target not in range");

        // Deal damage
        uint8 damage = attacker.atk;

        if (target.isGeneral) {
            // Damage to general
            if (generalHP[gameId][target.owner] <= damage) {
                generalHP[gameId][target.owner] = 0;
                _endGame(gameId, msg.sender);
            } else {
                generalHP[gameId][target.owner] -= damage;
            }
        } else {
            // Damage to unit
            if (target.hp <= damage) {
                // Unit dies
                graveyard[gameId].push(target.cardId);
                emit UnitDied(gameId, targetX, targetY, target.cardId);
                _removeUnit(gameId, targetIndex);
            } else {
                target.hp -= damage;
            }
        }

        // Counter-attack (if target survives and is not general)
        if (!target.isGeneral && target.hp > 0) {
            if (attacker.hp <= target.atk) {
                graveyard[gameId].push(attacker.cardId);
                emit UnitDied(gameId, attackerX, attackerY, attacker.cardId);
                _removeUnit(gameId, attackerIndex);
            } else {
                attacker.hp -= target.atk;
            }
        }

        attacker.exhausted = true;

        emit UnitAttacked(gameId, attackerX, attackerY, targetX, targetY, damage);
    }

    /**
     * @notice Turu bitir
     */
    function endTurn(uint256 gameId) external onlyCurrentTurn(gameId) gameInProgress(gameId) {
        Game storage game = games[gameId];

        emit TurnEnded(gameId, msg.sender);

        // Switch turns
        address nextPlayer = (msg.sender == game.player1) ? game.player2 : game.player1;
        game.currentTurn = nextPlayer;

        // Increment turn number if player2 finished
        if (msg.sender == game.player2) {
            game.turnNumber++;
        }

        // Refresh mana
        if (maxMana[gameId][nextPlayer] < MAX_MANA) {
            maxMana[gameId][nextPlayer]++;
        }
        mana[gameId][nextPlayer] = maxMana[gameId][nextPlayer];

        // Reset replace flag
        hasReplacedThisTurn[gameId][nextPlayer] = false;

        // Refresh units
        _refreshUnits(gameId, nextPlayer);

        // Auto-draw card for next player
        if (handSize[gameId][nextPlayer] < MAX_HAND_SIZE && deckIndex[gameId][nextPlayer] < DECK_SIZE) {
            uint8 drawnCard = deckOrder[gameId][nextPlayer][deckIndex[gameId][nextPlayer]];
            playerHand[gameId][nextPlayer][handSize[gameId][nextPlayer]] = drawnCard;
            handSize[gameId][nextPlayer]++;
            deckIndex[gameId][nextPlayer]++;
            emit CardDrawn(gameId, nextPlayer);
        }

        game.lastActionAt = block.timestamp;

        emit TurnStarted(gameId, nextPlayer, game.turnNumber);
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Get board units for a game
     */
    function getBoardUnits(uint256 gameId) external view returns (BoardUnit[] memory) {
        return board[gameId];
    }

    /**
     * @notice Get player's hand size (actual cards encrypted)
     */
    function getHandSize(uint256 gameId, address player) external view returns (uint8) {
        return handSize[gameId][player];
    }

    /**
     * @notice Get deck remaining count
     */
    function getDeckRemaining(uint256 gameId, address player) external view returns (uint8) {
        return DECK_SIZE - deckIndex[gameId][player];
    }

    /**
     * @notice Get graveyard
     */
    function getGraveyard(uint256 gameId) external view returns (uint32[] memory) {
        return graveyard[gameId];
    }

    // In real FHEVM, add this for user decrypt:
    // function getHandCard(uint256 gameId, uint8 index) external view returns (euint8) {
    //     require(msg.sender == games[gameId].player1 || msg.sender == games[gameId].player2, "Not player");
    //     return playerHand[gameId][msg.sender][index];
    // }

    // ============ INTERNAL FUNCTIONS ============

    function _initializeDeck(uint256 gameId, address player, uint32[40] calldata deckCardIds) internal {
        // In real FHEVM, shuffle using FHE.randEuint8Bounded() for Fisher-Yates
        // For now, just copy the deck order
        for (uint8 i = 0; i < DECK_SIZE; i++) {
            deckOrder[gameId][player][i] = uint8(deckCardIds[i] & 0xFF);
        }
        deckIndex[gameId][player] = 0;

        // In real FHEVM:
        // for (uint8 i = DECK_SIZE - 1; i > 0; i--) {
        //     euint8 j = FHE.randEuint8Bounded(i + 1);
        //     // Swap deckOrder[i] and deckOrder[j] using FHE.select
        // }
    }

    function _drawStartingHand(uint256 gameId, address player) internal {
        for (uint8 i = 0; i < STARTING_HAND_SIZE; i++) {
            playerHand[gameId][player][i] = deckOrder[gameId][player][i];
        }
        handSize[gameId][player] = STARTING_HAND_SIZE;
        deckIndex[gameId][player] = STARTING_HAND_SIZE;
    }

    function _replaceCard(uint256 gameId, address player, uint8 handIndex) internal {
        // Put card back in deck (simplified - in real impl would shuffle back)
        // Draw new card
        if (deckIndex[gameId][player] < DECK_SIZE) {
            playerHand[gameId][player][handIndex] = deckOrder[gameId][player][deckIndex[gameId][player]];
            deckIndex[gameId][player]++;
        }
    }

    function _removeFromHand(uint256 gameId, address player, uint8 index) internal {
        // Shift cards left
        for (uint8 i = index; i < handSize[gameId][player] - 1; i++) {
            playerHand[gameId][player][i] = playerHand[gameId][player][i + 1];
        }
        handSize[gameId][player]--;
    }

    function _spawnGeneral(uint256 gameId, address player, uint8 x, uint8 y) internal {
        board[gameId].push(BoardUnit({
            cardId: 1, // General card ID
            owner: player,
            x: x,
            y: y,
            hp: STARTING_GENERAL_HP,
            atk: 2,
            exhausted: false,
            isGeneral: true
        }));
    }

    function _getUnitAt(uint256 gameId, uint8 x, uint8 y) internal view returns (BoardUnit memory) {
        BoardUnit[] storage units = board[gameId];
        for (uint256 i = 0; i < units.length; i++) {
            if (units[i].x == x && units[i].y == y) {
                return units[i];
            }
        }
        return BoardUnit(0, address(0), 0, 0, 0, 0, false, false);
    }

    function _getUnitAtWithIndex(uint256 gameId, uint8 x, uint8 y) internal view returns (uint256, BoardUnit storage) {
        BoardUnit[] storage units = board[gameId];
        for (uint256 i = 0; i < units.length; i++) {
            if (units[i].x == x && units[i].y == y) {
                return (i, units[i]);
            }
        }
        revert("Unit not found");
    }

    function _removeUnit(uint256 gameId, uint256 index) internal {
        BoardUnit[] storage units = board[gameId];
        units[index] = units[units.length - 1];
        units.pop();
    }

    function _refreshUnits(uint256 gameId, address player) internal {
        BoardUnit[] storage units = board[gameId];
        for (uint256 i = 0; i < units.length; i++) {
            if (units[i].owner == player) {
                units[i].exhausted = false;
            }
        }
    }

    function _distance(uint8 x1, uint8 y1, uint8 x2, uint8 y2) internal pure returns (uint8) {
        uint8 dx = x1 > x2 ? x1 - x2 : x2 - x1;
        uint8 dy = y1 > y2 ? y1 - y2 : y2 - y1;
        return dx > dy ? dx : dy; // Chebyshev distance
    }

    function _endGame(uint256 gameId, address winner) internal {
        games[gameId].state = GameState.Finished;
        emit GameEnded(gameId, winner);
    }
}
