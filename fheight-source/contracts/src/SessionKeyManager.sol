// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title SessionKeyManager
 * @notice Ephemeral session key management for FHEIGHT
 * @dev Allows players to authorize temporary keys for gameplay without MetaMask popups
 *
 * WORKFLOW:
 * 1. Oyun baslarken: Player ana cuzdanla session key authorize eder (1 popup)
 * 2. Oyun sirasinda: Tum hamleler session key ile imzalanir (0 popup)
 * 3. Oyun bitince: Session key otomatik expire veya manuel revoke
 *
 * GUVENLIK:
 * - Session key sadece belirli contract'lara islem yapabilir
 * - Zaman siniri var (default 4 saat)
 * - Ana cuzdan her zaman revoke edebilir
 * - Session key ETH transfer edemez
 */

import "./GameSession.sol";

contract SessionKeyManager {

    // ============ STRUCTS ============

    struct SessionKey {
        address sessionAddress;     // Ephemeral key address
        address owner;              // Main wallet owner
        uint256 createdAt;          // Creation timestamp
        uint256 expiresAt;          // Expiration timestamp
        bool active;                // Is still valid
        uint256[] authorizedGames;  // Game IDs this key can act on
    }

    // ============ STORAGE ============

    // Main wallet -> Session keys
    mapping(address => SessionKey[]) public sessionKeys;

    // Session address -> Owner wallet
    mapping(address => address) public sessionToOwner;

    // Session address -> Active status
    mapping(address => bool) public isActiveSession;

    // Session address -> Game ID -> Can play
    mapping(address => mapping(uint256 => bool)) public canPlayGame;

    // Authorized game contract
    GameSession public gameSession;

    // Default session duration (4 hours)
    uint256 public constant DEFAULT_SESSION_DURATION = 4 hours;

    // Maximum session duration (24 hours)
    uint256 public constant MAX_SESSION_DURATION = 24 hours;

    // ============ EVENTS ============

    event SessionKeyCreated(
        address indexed owner,
        address indexed sessionKey,
        uint256 expiresAt,
        uint256[] gameIds
    );
    event SessionKeyRevoked(address indexed owner, address indexed sessionKey);
    event SessionKeyExpired(address indexed sessionKey);
    event GameAuthorized(address indexed sessionKey, uint256 indexed gameId);
    event GameDeauthorized(address indexed sessionKey, uint256 indexed gameId);

    // ============ ERRORS ============

    error InvalidSessionKey();
    error SessionKeyHasExpired();
    error SessionKeyNotActive();
    error NotOwner();
    error GameNotAuthorized();
    error InvalidDuration();
    error SessionKeyAlreadyExists();

    // ============ CONSTRUCTOR ============

    constructor(address _gameSession) {
        gameSession = GameSession(_gameSession);
    }

    // ============ SESSION KEY MANAGEMENT ============

    /**
     * @notice Create a new session key for gameplay
     * @param sessionAddress The ephemeral key address (generated client-side)
     * @param duration Session validity duration in seconds
     * @param gameIds Array of game IDs this key can play
     */
    function createSessionKey(
        address sessionAddress,
        uint256 duration,
        uint256[] calldata gameIds
    ) external {
        if (duration == 0) {
            duration = DEFAULT_SESSION_DURATION;
        }
        if (duration > MAX_SESSION_DURATION) {
            revert InvalidDuration();
        }
        if (isActiveSession[sessionAddress]) {
            revert SessionKeyAlreadyExists();
        }

        uint256 expiresAt = block.timestamp + duration;

        // Create session key
        SessionKey memory newKey = SessionKey({
            sessionAddress: sessionAddress,
            owner: msg.sender,
            createdAt: block.timestamp,
            expiresAt: expiresAt,
            active: true,
            authorizedGames: gameIds
        });

        sessionKeys[msg.sender].push(newKey);
        sessionToOwner[sessionAddress] = msg.sender;
        isActiveSession[sessionAddress] = true;

        // Authorize games
        for (uint256 i = 0; i < gameIds.length; i++) {
            canPlayGame[sessionAddress][gameIds[i]] = true;
        }

        emit SessionKeyCreated(msg.sender, sessionAddress, expiresAt, gameIds);
    }

    /**
     * @notice Revoke a session key
     * @param sessionAddress The session key to revoke
     */
    function revokeSessionKey(address sessionAddress) external {
        if (sessionToOwner[sessionAddress] != msg.sender) {
            revert NotOwner();
        }

        isActiveSession[sessionAddress] = false;

        // Find and deactivate in array
        SessionKey[] storage keys = sessionKeys[msg.sender];
        for (uint256 i = 0; i < keys.length; i++) {
            if (keys[i].sessionAddress == sessionAddress) {
                keys[i].active = false;
                break;
            }
        }

        emit SessionKeyRevoked(msg.sender, sessionAddress);
    }

    /**
     * @notice Authorize a session key for an additional game
     * @param sessionAddress The session key
     * @param gameId The game ID to authorize
     */
    function authorizeGame(address sessionAddress, uint256 gameId) external {
        if (sessionToOwner[sessionAddress] != msg.sender) {
            revert NotOwner();
        }
        if (!isActiveSession[sessionAddress]) {
            revert SessionKeyNotActive();
        }

        canPlayGame[sessionAddress][gameId] = true;
        emit GameAuthorized(sessionAddress, gameId);
    }

    /**
     * @notice Deauthorize a session key from a game
     * @param sessionAddress The session key
     * @param gameId The game ID to deauthorize
     */
    function deauthorizeGame(address sessionAddress, uint256 gameId) external {
        if (sessionToOwner[sessionAddress] != msg.sender) {
            revert NotOwner();
        }

        canPlayGame[sessionAddress][gameId] = false;
        emit GameDeauthorized(sessionAddress, gameId);
    }

    // ============ SESSION KEY VALIDATION ============

    /**
     * @notice Check if a session key is valid
     * @param sessionAddress The session key to check
     */
    function isValidSession(address sessionAddress) public view returns (bool) {
        if (!isActiveSession[sessionAddress]) {
            return false;
        }

        address owner = sessionToOwner[sessionAddress];
        SessionKey[] storage keys = sessionKeys[owner];

        for (uint256 i = 0; i < keys.length; i++) {
            if (keys[i].sessionAddress == sessionAddress) {
                if (!keys[i].active) {
                    return false;
                }
                if (block.timestamp > keys[i].expiresAt) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    /**
     * @notice Check if a session key can play a specific game
     * @param sessionAddress The session key
     * @param gameId The game ID
     */
    function canSessionPlayGame(address sessionAddress, uint256 gameId) public view returns (bool) {
        if (!isValidSession(sessionAddress)) {
            return false;
        }
        return canPlayGame[sessionAddress][gameId];
    }

    /**
     * @notice Get the owner of a session key
     * @param sessionAddress The session key
     */
    function getOwner(address sessionAddress) external view returns (address) {
        return sessionToOwner[sessionAddress];
    }

    /**
     * @notice Get session key info
     * @param sessionAddress The session key
     */
    function getSessionInfo(address sessionAddress) external view returns (
        address owner,
        uint256 createdAt,
        uint256 expiresAt,
        bool active,
        bool valid
    ) {
        owner = sessionToOwner[sessionAddress];
        SessionKey[] storage keys = sessionKeys[owner];

        for (uint256 i = 0; i < keys.length; i++) {
            if (keys[i].sessionAddress == sessionAddress) {
                return (
                    keys[i].owner,
                    keys[i].createdAt,
                    keys[i].expiresAt,
                    keys[i].active,
                    isValidSession(sessionAddress)
                );
            }
        }

        return (address(0), 0, 0, false, false);
    }

    /**
     * @notice Get all session keys for an owner
     * @param owner The owner address
     */
    function getSessionKeys(address owner) external view returns (SessionKey[] memory) {
        return sessionKeys[owner];
    }

    /**
     * @notice Get active session count for an owner
     * @param owner The owner address
     */
    function getActiveSessionCount(address owner) external view returns (uint256) {
        uint256 count = 0;
        SessionKey[] storage keys = sessionKeys[owner];

        for (uint256 i = 0; i < keys.length; i++) {
            if (keys[i].active && block.timestamp <= keys[i].expiresAt) {
                count++;
            }
        }

        return count;
    }

    // ============ MODIFIERS FOR GAME SESSION ============

    /**
     * @notice Modifier to validate session key for game actions
     * @dev Use this in GameSession functions
     */
    function validateSessionForGame(address sessionAddress, uint256 gameId) external view returns (bool) {
        return canSessionPlayGame(sessionAddress, gameId);
    }

    /**
     * @notice Get the actual player address (owner) for a session key
     * @dev GameSession should use this to attribute actions to the real player
     */
    function resolvePlayer(address caller, uint256 gameId) external view returns (address) {
        // If caller is a valid session key for this game, return owner
        if (canSessionPlayGame(caller, gameId)) {
            return sessionToOwner[caller];
        }
        // Otherwise return caller (direct player action)
        return caller;
    }
}
