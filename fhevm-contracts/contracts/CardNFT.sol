// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721Enumerable} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title CardNFT - Card Collection NFTs for FHEIGHT Game
/// @notice NFT contract for game cards obtained from Spirit Orbs
/// @dev Cards have rarity, cardId (type), and prismatic status
contract CardNFT is ERC721Enumerable, Ownable {
    // ============ Constants ============

    uint8 public constant RARITY_COMMON = 0;
    uint8 public constant RARITY_RARE = 1;
    uint8 public constant RARITY_EPIC = 2;
    uint8 public constant RARITY_LEGENDARY = 3;

    // Total number of card types in the game
    uint256 public constant TOTAL_CARD_TYPES = 730;

    // Card type counts per rarity (from game data)
    uint256 public constant COMMON_CARD_COUNT = 400;
    uint256 public constant RARE_CARD_COUNT = 200;
    uint256 public constant EPIC_CARD_COUNT = 100;
    uint256 public constant LEGENDARY_CARD_COUNT = 30;

    // ============ Structs ============

    struct CardData {
        uint16 cardId;      // Card type ID (0-729)
        uint8 rarity;       // Rarity enum
        bool isPrismatic;   // Prismatic/foil version
        uint64 mintedAt;    // Timestamp when minted
    }

    // ============ State Variables ============

    // Token ID counter
    uint256 private _nextTokenId;

    // Card data for each token
    mapping(uint256 => CardData) public cards;

    // Authorized minters (SpiritOrb contract)
    mapping(address => bool) public minters;

    // Base URI for metadata
    string private _baseTokenURI;

    // Card pool per rarity (card IDs available to mint)
    // In production, this would be loaded from game data
    mapping(uint8 => uint16[]) private _cardPool;

    // Pseudo-random seed (for card selection - not cryptographically secure, ok for non-critical randomness)
    uint256 private _randomSeed;

    // ============ Events ============

    event CardMinted(
        address indexed to,
        uint256 indexed tokenId,
        uint16 cardId,
        uint8 rarity,
        bool isPrismatic
    );
    event MinterUpdated(address indexed minter, bool authorized);
    event BaseURIUpdated(string newBaseURI);

    // ============ Modifiers ============

    modifier onlyMinter() {
        require(minters[msg.sender], "Not authorized minter");
        _;
    }

    // ============ Constructor ============

    constructor() ERC721("FHEIGHT Cards", "FHCARD") Ownable(msg.sender) {
        _randomSeed = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao)));

        // Initialize card pools with placeholder IDs
        // In production, these would be the actual card IDs per rarity
        _initializeCardPools();
    }

    // ============ Admin Functions ============

    /// @notice Add or remove minter authorization
    /// @param minter Address to update
    /// @param authorized Whether to authorize or revoke
    function setMinter(address minter, bool authorized) external onlyOwner {
        require(minter != address(0), "Invalid minter address");
        minters[minter] = authorized;
        emit MinterUpdated(minter, authorized);
    }

    /// @notice Set base URI for token metadata
    /// @param baseURI New base URI
    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
        emit BaseURIUpdated(baseURI);
    }

    /// @notice Add cards to a rarity pool
    /// @param rarity Rarity to add to
    /// @param cardIds Array of card IDs to add
    function addToCardPool(uint8 rarity, uint16[] calldata cardIds) external onlyOwner {
        require(rarity <= RARITY_LEGENDARY, "Invalid rarity");
        for (uint256 i = 0; i < cardIds.length; i++) {
            _cardPool[rarity].push(cardIds[i]);
        }
    }

    /// @notice Clear and reset a rarity pool
    /// @param rarity Rarity to reset
    function resetCardPool(uint8 rarity) external onlyOwner {
        require(rarity <= RARITY_LEGENDARY, "Invalid rarity");
        delete _cardPool[rarity];
    }

    // ============ Minting Functions ============

    /// @notice Mint a card with specific rarity (called by SpiritOrb)
    /// @param to Recipient address
    /// @param rarity Card rarity
    /// @return tokenId The minted token ID
    function mintCard(address to, uint8 rarity) external onlyMinter returns (uint256) {
        require(rarity <= RARITY_LEGENDARY, "Invalid rarity");
        require(_cardPool[rarity].length > 0, "No cards in pool");

        uint256 tokenId = _nextTokenId++;

        // Select random card from pool
        uint16 cardId = _selectRandomCard(rarity);

        // Determine if prismatic (4-8% chance based on rarity)
        bool isPrismatic = _rollPrismatic(rarity);

        // Store card data
        cards[tokenId] = CardData({
            cardId: cardId,
            rarity: rarity,
            isPrismatic: isPrismatic,
            mintedAt: uint64(block.timestamp)
        });

        // Mint the NFT
        _safeMint(to, tokenId);

        emit CardMinted(to, tokenId, cardId, rarity, isPrismatic);

        return tokenId;
    }

    /// @notice Mint a specific card (for admin/testing)
    /// @param to Recipient address
    /// @param cardId Specific card ID
    /// @param rarity Card rarity
    /// @param isPrismatic Whether card is prismatic
    /// @return tokenId The minted token ID
    function mintSpecificCard(
        address to,
        uint16 cardId,
        uint8 rarity,
        bool isPrismatic
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        cards[tokenId] = CardData({
            cardId: cardId,
            rarity: rarity,
            isPrismatic: isPrismatic,
            mintedAt: uint64(block.timestamp)
        });

        _safeMint(to, tokenId);

        emit CardMinted(to, tokenId, cardId, rarity, isPrismatic);

        return tokenId;
    }

    // ============ Internal Functions ============

    /// @notice Initialize card pools with placeholder IDs
    function _initializeCardPools() internal {
        // Common cards: IDs 0-399
        for (uint16 i = 0; i < 100; i++) {
            _cardPool[RARITY_COMMON].push(i);
        }

        // Rare cards: IDs 400-599
        for (uint16 i = 0; i < 50; i++) {
            _cardPool[RARITY_RARE].push(i + 400);
        }

        // Epic cards: IDs 600-699
        for (uint16 i = 0; i < 25; i++) {
            _cardPool[RARITY_EPIC].push(i + 600);
        }

        // Legendary cards: IDs 700-729
        for (uint16 i = 0; i < 15; i++) {
            _cardPool[RARITY_LEGENDARY].push(i + 700);
        }
    }

    /// @notice Select a random card from a rarity pool
    /// @param rarity Rarity pool to select from
    /// @return cardId Selected card ID
    function _selectRandomCard(uint8 rarity) internal returns (uint16) {
        uint256 poolLength = _cardPool[rarity].length;

        // Update random seed
        _randomSeed = uint256(keccak256(abi.encodePacked(
            _randomSeed,
            block.timestamp,
            block.prevrandao,
            msg.sender
        )));

        uint256 index = _randomSeed % poolLength;
        return _cardPool[rarity][index];
    }

    /// @notice Roll for prismatic status
    /// @param rarity Card rarity (affects prismatic chance)
    /// @return isPrismatic Whether the card is prismatic
    function _rollPrismatic(uint8 rarity) internal returns (bool) {
        // Update random seed
        _randomSeed = uint256(keccak256(abi.encodePacked(
            _randomSeed,
            block.timestamp,
            "prismatic"
        )));

        // Prismatic chances: Common 4%, Rare 5%, Epic 6%, Legendary 8%
        uint256 threshold;
        if (rarity == RARITY_COMMON) threshold = 4;
        else if (rarity == RARITY_RARE) threshold = 5;
        else if (rarity == RARITY_EPIC) threshold = 6;
        else threshold = 8; // Legendary

        return (_randomSeed % 100) < threshold;
    }

    /// @notice Override base URI
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // ============ View Functions ============

    /// @notice Get card data for a token
    /// @param tokenId Token ID to query
    /// @return cardId Card type ID
    /// @return rarity Card rarity
    /// @return isPrismatic Whether card is prismatic
    /// @return mintedAt Mint timestamp
    function getCard(uint256 tokenId) external view returns (
        uint16 cardId,
        uint8 rarity,
        bool isPrismatic,
        uint64 mintedAt
    ) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        CardData memory card = cards[tokenId];
        return (card.cardId, card.rarity, card.isPrismatic, card.mintedAt);
    }

    /// @notice Get all token IDs owned by an address
    /// @param owner Address to query
    /// @return tokenIds Array of owned token IDs
    function getOwnedTokens(address owner) external view returns (uint256[] memory) {
        uint256 balance = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](balance);

        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }

        return tokenIds;
    }

    /// @notice Get rarity name
    /// @param rarity Rarity enum value
    /// @return name Rarity name
    function getRarityName(uint8 rarity) external pure returns (string memory) {
        if (rarity == RARITY_COMMON) return "Common";
        if (rarity == RARITY_RARE) return "Rare";
        if (rarity == RARITY_EPIC) return "Epic";
        if (rarity == RARITY_LEGENDARY) return "Legendary";
        return "Unknown";
    }

    /// @notice Get card pool size for a rarity
    /// @param rarity Rarity to query
    /// @return size Number of cards in pool
    function getCardPoolSize(uint8 rarity) external view returns (uint256) {
        return _cardPool[rarity].length;
    }

    /// @notice Get total minted cards
    /// @return count Total number of cards minted
    function totalMinted() external view returns (uint256) {
        return _nextTokenId;
    }
}
