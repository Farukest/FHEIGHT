// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import { Ownable2Step, Ownable } from "@openzeppelin/contracts/access/Ownable2Step.sol";

/**
 * @title CardRegistry
 * @notice On-chain registry for all game card statistics
 * @dev Immutable after initial setup to prevent cheating
 *      All card stats are stored on-chain and can be queried by GameSession
 */
contract CardRegistry is Ownable2Step {
    // Card types enum
    enum CardType {
        NONE,       // 0 - Invalid/unregistered
        GENERAL,    // 1 - General cards (hero)
        MINION,     // 2 - Regular minion units
        SPELL,      // 3 - Spell cards
        ARTIFACT    // 4 - Artifact cards
    }

    // Rarity enum
    enum Rarity {
        COMMON,     // 0
        RARE,       // 1
        EPIC,       // 2
        LEGENDARY   // 3
    }

    // Faction enum (matches game factions)
    enum Faction {
        NEUTRAL,    // 0
        LYONAR,     // 1 - Faction1
        SONGHAI,    // 2 - Faction2
        VETRUVIAN,  // 3 - Faction3
        ABYSSIAN,   // 4 - Faction4
        MAGMAR,     // 5 - Faction5
        VANAR       // 6 - Faction6
    }

    // Packed card stats struct (fits in single storage slot)
    struct CardStats {
        CardType cardType;  // 1 byte
        Faction faction;    // 1 byte
        Rarity rarity;      // 1 byte
        uint8 manaCost;     // 1 byte (0-9)
        uint8 atk;          // 1 byte (0-255)
        uint8 hp;           // 1 byte (0-255)
        bool exists;        // 1 byte
        // 25 bytes remaining for future use
    }

    // Card ID => Card Stats mapping
    mapping(uint32 => CardStats) private _cardStats;

    // Valid general IDs for deck validation
    mapping(uint32 => bool) private _validGeneralIds;

    // Total registered cards count
    uint32 public totalCards;

    // Registry locked flag (immutable after lock)
    bool public locked;

    // Events
    event CardRegistered(uint32 indexed cardId, CardType cardType, uint8 manaCost, uint8 atk, uint8 hp);
    event CardsRegisteredBatch(uint32 count);
    event RegistryLocked();

    // Errors
    error RegistryIsLocked();
    error CardNotFound(uint32 cardId);
    error CardAlreadyExists(uint32 cardId);
    error InvalidCardId();
    error InvalidStats();

    constructor() Ownable(msg.sender) {}

    // ============ ADMIN FUNCTIONS ============

    /**
     * @notice Register a single card
     * @param cardId Unique card identifier
     * @param cardType Type of card (General, Minion, Spell, Artifact)
     * @param faction Card's faction
     * @param rarity Card's rarity
     * @param manaCost Mana cost to play (0-9)
     * @param atk Attack value
     * @param hp Health points
     */
    function registerCard(
        uint32 cardId,
        CardType cardType,
        Faction faction,
        Rarity rarity,
        uint8 manaCost,
        uint8 atk,
        uint8 hp
    ) external onlyOwner {
        if (locked) revert RegistryIsLocked();
        if (cardId == 0) revert InvalidCardId();
        if (_cardStats[cardId].exists) revert CardAlreadyExists(cardId);

        _cardStats[cardId] = CardStats({
            cardType: cardType,
            faction: faction,
            rarity: rarity,
            manaCost: manaCost,
            atk: atk,
            hp: hp,
            exists: true
        });

        // Track valid generals
        if (cardType == CardType.GENERAL) {
            _validGeneralIds[cardId] = true;
        }

        totalCards++;
        emit CardRegistered(cardId, cardType, manaCost, atk, hp);
    }

    /**
     * @notice Batch register multiple cards (gas efficient)
     * @param cardIds Array of card IDs
     * @param cardTypes Array of card types
     * @param factions Array of factions
     * @param rarities Array of rarities
     * @param manaCosts Array of mana costs
     * @param atks Array of attack values
     * @param hps Array of HP values
     */
    function registerCardsBatch(
        uint32[] calldata cardIds,
        CardType[] calldata cardTypes,
        Faction[] calldata factions,
        Rarity[] calldata rarities,
        uint8[] calldata manaCosts,
        uint8[] calldata atks,
        uint8[] calldata hps
    ) external onlyOwner {
        if (locked) revert RegistryIsLocked();

        uint256 len = cardIds.length;
        require(
            len == cardTypes.length &&
            len == factions.length &&
            len == rarities.length &&
            len == manaCosts.length &&
            len == atks.length &&
            len == hps.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < len; i++) {
            uint32 cardId = cardIds[i];
            if (cardId == 0) continue;
            if (_cardStats[cardId].exists) continue;

            _cardStats[cardId] = CardStats({
                cardType: cardTypes[i],
                faction: factions[i],
                rarity: rarities[i],
                manaCost: manaCosts[i],
                atk: atks[i],
                hp: hps[i],
                exists: true
            });

            if (cardTypes[i] == CardType.GENERAL) {
                _validGeneralIds[cardId] = true;
            }

            totalCards++;
        }

        emit CardsRegisteredBatch(uint32(len));
    }

    /**
     * @notice Lock the registry permanently (no more changes allowed)
     * @dev Call this after all cards are registered to prevent manipulation
     */
    function lockRegistry() external onlyOwner {
        if (locked) revert RegistryIsLocked();
        locked = true;
        emit RegistryLocked();
    }

    // ============ VIEW FUNCTIONS ============

    /**
     * @notice Get full card stats
     * @param cardId Card identifier
     * @return stats Card statistics struct
     */
    function getCardStats(uint32 cardId) external view returns (CardStats memory stats) {
        stats = _cardStats[cardId];
        if (!stats.exists) revert CardNotFound(cardId);
        return stats;
    }

    /**
     * @notice Get card type
     * @param cardId Card identifier
     * @return Card type enum
     */
    function getCardType(uint32 cardId) external view returns (CardType) {
        if (!_cardStats[cardId].exists) revert CardNotFound(cardId);
        return _cardStats[cardId].cardType;
    }

    /**
     * @notice Get card mana cost
     * @param cardId Card identifier
     * @return Mana cost (0-9)
     */
    function getManaCost(uint32 cardId) external view returns (uint8) {
        if (!_cardStats[cardId].exists) revert CardNotFound(cardId);
        return _cardStats[cardId].manaCost;
    }

    /**
     * @notice Get card attack value
     * @param cardId Card identifier
     * @return Attack value
     */
    function getAtk(uint32 cardId) external view returns (uint8) {
        if (!_cardStats[cardId].exists) revert CardNotFound(cardId);
        return _cardStats[cardId].atk;
    }

    /**
     * @notice Get card HP
     * @param cardId Card identifier
     * @return HP value
     */
    function getHp(uint32 cardId) external view returns (uint8) {
        if (!_cardStats[cardId].exists) revert CardNotFound(cardId);
        return _cardStats[cardId].hp;
    }

    /**
     * @notice Get card faction
     * @param cardId Card identifier
     * @return Faction enum
     */
    function getFaction(uint32 cardId) external view returns (Faction) {
        if (!_cardStats[cardId].exists) revert CardNotFound(cardId);
        return _cardStats[cardId].faction;
    }

    /**
     * @notice Check if card exists in registry
     * @param cardId Card identifier
     * @return true if card is registered
     */
    function cardExists(uint32 cardId) external view returns (bool) {
        return _cardStats[cardId].exists;
    }

    /**
     * @notice Check if card ID is a valid general
     * @param cardId Card identifier
     * @return true if card is a playable general
     */
    function isValidGeneral(uint32 cardId) external view returns (bool) {
        return _validGeneralIds[cardId];
    }

    /**
     * @notice Check if card is a unit (General or Minion)
     * @param cardId Card identifier
     * @return true if card is a unit type
     */
    function isUnit(uint32 cardId) external view returns (bool) {
        if (!_cardStats[cardId].exists) return false;
        CardType ct = _cardStats[cardId].cardType;
        return ct == CardType.GENERAL || ct == CardType.MINION;
    }

    /**
     * @notice Get combat stats (atk and hp) in single call
     * @param cardId Card identifier
     * @return atk Attack value
     * @return hp HP value
     */
    function getCombatStats(uint32 cardId) external view returns (uint8 atk, uint8 hp) {
        if (!_cardStats[cardId].exists) revert CardNotFound(cardId);
        return (_cardStats[cardId].atk, _cardStats[cardId].hp);
    }

    /**
     * @notice Get all basic stats in single call (gas efficient)
     * @param cardId Card identifier
     * @return cardType Card type
     * @return manaCost Mana cost
     * @return atk Attack value
     * @return hp HP value
     */
    function getBasicStats(uint32 cardId) external view returns (
        CardType cardType,
        uint8 manaCost,
        uint8 atk,
        uint8 hp
    ) {
        CardStats memory stats = _cardStats[cardId];
        if (!stats.exists) revert CardNotFound(cardId);
        return (stats.cardType, stats.manaCost, stats.atk, stats.hp);
    }
}
