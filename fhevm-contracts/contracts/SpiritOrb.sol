// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {FHE, euint8, euint32, ebool} from "@fhevm/solidity/lib/FHE.sol";
import {ZamaEthereumConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title SpiritOrb - Encrypted Loot Box for FHEIGHT Game
/// @notice Provably fair loot box system using FHE for hidden card contents
/// @dev Cards remain encrypted until opened, preventing manipulation
contract SpiritOrb is ZamaEthereumConfig, Ownable {
    // ============ Constants ============

    // Rarity enum
    uint8 public constant RARITY_COMMON = 0;
    uint8 public constant RARITY_RARE = 1;
    uint8 public constant RARITY_EPIC = 2;
    uint8 public constant RARITY_LEGENDARY = 3;

    // Rarity thresholds for slots 1-4 (out of 100)
    // Common: 0-72 (73%), Rare: 73-87 (15%), Epic: 88-97 (10%), Legendary: 98-99 (2%)
    uint8 public constant THRESHOLD_COMMON = 73;
    uint8 public constant THRESHOLD_RARE = 88;
    uint8 public constant THRESHOLD_EPIC = 98;

    // Rarity thresholds for slot 5 (guaranteed rare or better)
    // Rare: 0-69 (70%), Epic: 70-81 (12%), Legendary: 82-99 (18%)
    uint8 public constant SLOT5_THRESHOLD_RARE = 70;
    uint8 public constant SLOT5_THRESHOLD_EPIC = 82;

    // Orb price in Gold (100 Gold per orb)
    uint256 public orbPrice = 100 * 10**18;

    // ============ State Variables ============

    // Total orbs opened (for stats)
    uint256 public totalOrbsOpened;

    // Unopened orb count per user
    mapping(address => uint256) public unopenedOrbs;

    // Encrypted orb contents: user => orbIndex => slot => encrypted card data
    // Card data format: rarity (euint8)
    mapping(address => mapping(uint256 => euint8[5])) private _encryptedOrbCards;

    // Orb states: 0 = not exists, 1 = purchased, 2 = opened (cards generated), 3 = revealed
    mapping(address => mapping(uint256 => uint8)) public orbStates;

    // User's next orb index
    mapping(address => uint256) public nextOrbIndex;

    // Gold token reference (for payment)
    address public goldToken;

    // Card NFT contract reference (for minting revealed cards)
    address public cardNFT;

    // ============ Events ============

    event OrbPurchased(address indexed user, uint256 orbIndex, uint256 price);
    event OrbOpened(address indexed user, uint256 orbIndex);
    event CardsRevealed(address indexed user, uint256 orbIndex, uint8[5] rarities);
    event OrbPriceUpdated(uint256 newPrice);

    // ============ Constructor ============

    constructor() Ownable(msg.sender) {}

    // ============ Admin Functions ============

    /// @notice Set the Gold token contract address
    /// @param _goldToken Address of the GameGold ERC20 contract
    function setGoldToken(address _goldToken) external onlyOwner {
        require(_goldToken != address(0), "Invalid gold token address");
        goldToken = _goldToken;
    }

    /// @notice Set the Card NFT contract address
    /// @param _cardNFT Address of the CardNFT contract
    function setCardNFT(address _cardNFT) external onlyOwner {
        require(_cardNFT != address(0), "Invalid card NFT address");
        cardNFT = _cardNFT;
    }

    /// @notice Update orb price
    /// @param _newPrice New price in Gold tokens (with decimals)
    function setOrbPrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Price must be positive");
        orbPrice = _newPrice;
        emit OrbPriceUpdated(_newPrice);
    }

    /// @notice Grant free orbs to a user (for rewards, promotions)
    /// @param user Address to receive orbs
    /// @param amount Number of orbs to grant
    function grantOrbs(address user, uint256 amount) external onlyOwner {
        unopenedOrbs[user] += amount;
    }

    // ============ User Functions ============

    /// @notice Purchase Spirit Orbs with Gold
    /// @param amount Number of orbs to purchase
    /// @dev Requires prior approval of Gold tokens
    function purchaseOrbs(uint256 amount) external {
        require(goldToken != address(0), "Gold token not set");
        require(amount > 0, "Must purchase at least 1 orb");

        uint256 totalCost = orbPrice * amount;

        // Transfer Gold from user to this contract
        // Note: User must have approved this contract to spend their Gold
        (bool success, ) = goldToken.call(
            abi.encodeWithSignature(
                "transferFrom(address,address,uint256)",
                msg.sender,
                address(this),
                totalCost
            )
        );
        require(success, "Gold transfer failed");

        // Add unopened orbs
        unopenedOrbs[msg.sender] += amount;

        // Emit events for each orb
        for (uint256 i = 0; i < amount; i++) {
            uint256 orbIndex = nextOrbIndex[msg.sender]++;
            orbStates[msg.sender][orbIndex] = 1; // purchased
            emit OrbPurchased(msg.sender, orbIndex, orbPrice);
        }
    }

    /// @notice Open an orb - generates encrypted card rarities using FHE random
    /// @param orbIndex Index of the orb to open
    /// @dev Cards are encrypted until reveal is called
    function openOrb(uint256 orbIndex) external {
        require(unopenedOrbs[msg.sender] > 0, "No unopened orbs");
        require(orbStates[msg.sender][orbIndex] == 1, "Orb not available");

        // Decrement unopened count
        unopenedOrbs[msg.sender]--;

        // Generate 5 encrypted random numbers (0-99 range = 128 upper bound)
        // Using bounded random for gas efficiency
        euint8 rand1 = FHE.randEuint8(128);
        euint8 rand2 = FHE.randEuint8(128);
        euint8 rand3 = FHE.randEuint8(128);
        euint8 rand4 = FHE.randEuint8(128);
        euint8 rand5 = FHE.randEuint8(128);

        // Store encrypted random values (will be used to determine rarity)
        _encryptedOrbCards[msg.sender][orbIndex][0] = rand1;
        _encryptedOrbCards[msg.sender][orbIndex][1] = rand2;
        _encryptedOrbCards[msg.sender][orbIndex][2] = rand3;
        _encryptedOrbCards[msg.sender][orbIndex][3] = rand4;
        _encryptedOrbCards[msg.sender][orbIndex][4] = rand5;

        // Set ACL permissions for public decryption
        FHE.makePubliclyDecryptable(rand1);
        FHE.makePubliclyDecryptable(rand2);
        FHE.makePubliclyDecryptable(rand3);
        FHE.makePubliclyDecryptable(rand4);
        FHE.makePubliclyDecryptable(rand5);

        // Update state
        orbStates[msg.sender][orbIndex] = 2; // opened
        totalOrbsOpened++;

        emit OrbOpened(msg.sender, orbIndex);
    }

    /// @notice Get encrypted card handles for an opened orb (for off-chain decryption)
    /// @param orbIndex Index of the orb
    /// @return handles Array of 5 encrypted card handles
    function getEncryptedCards(uint256 orbIndex) external view returns (euint8[5] memory) {
        require(orbStates[msg.sender][orbIndex] >= 2, "Orb not opened");
        return _encryptedOrbCards[msg.sender][orbIndex];
    }

    /// @notice Reveal cards after off-chain public decryption
    /// @param orbIndex Index of the orb
    /// @param clearValues ABI encoded array of 5 uint8 random values
    /// @param decryptionProof KMS decryption proof
    /// @dev Verifies the decryption, calculates rarities, mints NFTs
    function revealCards(
        uint256 orbIndex,
        bytes calldata clearValues,
        bytes calldata decryptionProof
    ) external {
        require(orbStates[msg.sender][orbIndex] == 2, "Orb not ready for reveal");

        // Prepare handles array for signature verification
        bytes32[] memory handles = new bytes32[](5);
        handles[0] = FHE.toBytes32(_encryptedOrbCards[msg.sender][orbIndex][0]);
        handles[1] = FHE.toBytes32(_encryptedOrbCards[msg.sender][orbIndex][1]);
        handles[2] = FHE.toBytes32(_encryptedOrbCards[msg.sender][orbIndex][2]);
        handles[3] = FHE.toBytes32(_encryptedOrbCards[msg.sender][orbIndex][3]);
        handles[4] = FHE.toBytes32(_encryptedOrbCards[msg.sender][orbIndex][4]);

        // Verify KMS signatures - reverts if invalid
        FHE.checkSignatures(handles, clearValues, decryptionProof);

        // Decode clear values
        (uint8 r1, uint8 r2, uint8 r3, uint8 r4, uint8 r5) = abi.decode(
            clearValues,
            (uint8, uint8, uint8, uint8, uint8)
        );

        // Calculate rarities
        uint8[5] memory rarities;
        rarities[0] = _calculateRarity(r1 % 100, false);
        rarities[1] = _calculateRarity(r2 % 100, false);
        rarities[2] = _calculateRarity(r3 % 100, false);
        rarities[3] = _calculateRarity(r4 % 100, false);
        rarities[4] = _calculateRarity(r5 % 100, true); // Slot 5 is guaranteed rare+

        // Update state
        orbStates[msg.sender][orbIndex] = 3; // revealed

        // Mint cards if CardNFT is set
        if (cardNFT != address(0)) {
            for (uint8 i = 0; i < 5; i++) {
                // Mint card NFT to user
                cardNFT.call(
                    abi.encodeWithSignature(
                        "mintCard(address,uint8)",
                        msg.sender,
                        rarities[i]
                    )
                );
                // Don't revert if mint fails, just continue (return value intentionally ignored)
            }
        }

        emit CardsRevealed(msg.sender, orbIndex, rarities);
    }

    // ============ Internal Functions ============

    /// @notice Calculate rarity from random value
    /// @param randomValue Random value 0-99
    /// @param isSlot5 Whether this is slot 5 (guaranteed rare+)
    /// @return rarity Rarity enum value
    function _calculateRarity(uint8 randomValue, bool isSlot5) internal pure returns (uint8) {
        if (isSlot5) {
            // Slot 5: Rare 70%, Epic 12%, Legendary 18%
            if (randomValue < SLOT5_THRESHOLD_RARE) {
                return RARITY_RARE;
            } else if (randomValue < SLOT5_THRESHOLD_EPIC) {
                return RARITY_EPIC;
            } else {
                return RARITY_LEGENDARY;
            }
        } else {
            // Slots 1-4: Common 73%, Rare 15%, Epic 10%, Legendary 2%
            if (randomValue < THRESHOLD_COMMON) {
                return RARITY_COMMON;
            } else if (randomValue < THRESHOLD_RARE) {
                return RARITY_RARE;
            } else if (randomValue < THRESHOLD_EPIC) {
                return RARITY_EPIC;
            } else {
                return RARITY_LEGENDARY;
            }
        }
    }

    // ============ View Functions ============

    /// @notice Get rarity name from enum
    /// @param rarity Rarity enum value
    /// @return name Rarity name string
    function getRarityName(uint8 rarity) external pure returns (string memory) {
        if (rarity == RARITY_COMMON) return "Common";
        if (rarity == RARITY_RARE) return "Rare";
        if (rarity == RARITY_EPIC) return "Epic";
        if (rarity == RARITY_LEGENDARY) return "Legendary";
        return "Unknown";
    }

    /// @notice Get user's orb statistics
    /// @param user User address
    /// @return unopened Number of unopened orbs
    /// @return nextIndex Next orb index for user
    function getUserOrbStats(address user) external view returns (uint256 unopened, uint256 nextIndex) {
        return (unopenedOrbs[user], nextOrbIndex[user]);
    }
}
