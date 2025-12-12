// SPDX-License-Identifier: BSD-3-Clause-Clear
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title GameGold - In-game Currency for FHEIGHT
/// @notice ERC20 token used for purchasing Spirit Orbs and other in-game items
/// @dev Standard ERC20 with mint/burn capabilities for game economy management
contract GameGold is ERC20, ERC20Burnable, Ownable {
    // ============ Constants ============

    // Maximum supply (1 billion tokens)
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18;

    // Daily claim amount (50 Gold per day)
    uint256 public constant DAILY_CLAIM_AMOUNT = 50 * 10**18;

    // First win of day bonus (25 Gold)
    uint256 public constant FIRST_WIN_BONUS = 25 * 10**18;

    // ============ State Variables ============

    // Authorized minters (game server, rewards contract)
    mapping(address => bool) public minters;

    // Last daily claim timestamp per user
    mapping(address => uint256) public lastDailyClaim;

    // Last first win claim date (stored as day number)
    mapping(address => uint256) public lastFirstWinDay;

    // Game server address (can grant rewards)
    address public gameServer;

    // ============ Events ============

    event MinterUpdated(address indexed minter, bool authorized);
    event DailyClaimed(address indexed user, uint256 amount);
    event FirstWinClaimed(address indexed user, uint256 amount);
    event GameServerUpdated(address indexed newServer);
    event RewardGranted(address indexed user, uint256 amount, string reason);

    // ============ Modifiers ============

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "Not authorized minter");
        _;
    }

    modifier onlyGameServer() {
        require(msg.sender == gameServer || msg.sender == owner(), "Not game server");
        _;
    }

    // ============ Constructor ============

    constructor() ERC20("FHEIGHT Gold", "GOLD") Ownable(msg.sender) {
        // Mint initial supply to owner (for liquidity, rewards pool, etc.)
        // 100 million initial supply
        _mint(msg.sender, 100_000_000 * 10**18);
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

    /// @notice Set game server address
    /// @param _gameServer New game server address
    function setGameServer(address _gameServer) external onlyOwner {
        require(_gameServer != address(0), "Invalid game server address");
        gameServer = _gameServer;
        emit GameServerUpdated(_gameServer);
    }

    /// @notice Mint tokens (only minters)
    /// @param to Recipient address
    /// @param amount Amount to mint
    function mint(address to, uint256 amount) external onlyMinter {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }

    /// @notice Withdraw tokens from contract (rescue function)
    /// @param to Recipient address
    /// @param amount Amount to withdraw
    function withdraw(address to, uint256 amount) external onlyOwner {
        require(balanceOf(address(this)) >= amount, "Insufficient contract balance");
        _transfer(address(this), to, amount);
    }

    // ============ User Functions ============

    /// @notice Claim daily Gold reward
    /// @dev Can be called once every 24 hours
    function claimDaily() external {
        require(
            block.timestamp >= lastDailyClaim[msg.sender] + 24 hours,
            "Daily claim not ready"
        );

        lastDailyClaim[msg.sender] = block.timestamp;

        // Mint daily reward
        require(totalSupply() + DAILY_CLAIM_AMOUNT <= MAX_SUPPLY, "Exceeds max supply");
        _mint(msg.sender, DAILY_CLAIM_AMOUNT);

        emit DailyClaimed(msg.sender, DAILY_CLAIM_AMOUNT);
    }

    /// @notice Check if daily claim is available
    /// @param user User address
    /// @return available Whether claim is available
    /// @return nextClaimTime Timestamp when next claim is available
    function canClaimDaily(address user) external view returns (bool available, uint256 nextClaimTime) {
        uint256 lastClaim = lastDailyClaim[user];
        uint256 nextClaim = lastClaim + 24 hours;

        if (block.timestamp >= nextClaim) {
            return (true, block.timestamp);
        } else {
            return (false, nextClaim);
        }
    }

    // ============ Game Server Functions ============

    /// @notice Grant first win of day bonus
    /// @param user User who won their first game today
    function grantFirstWinBonus(address user) external onlyGameServer {
        uint256 today = block.timestamp / 1 days;
        require(lastFirstWinDay[user] < today, "First win already claimed today");

        lastFirstWinDay[user] = today;

        require(totalSupply() + FIRST_WIN_BONUS <= MAX_SUPPLY, "Exceeds max supply");
        _mint(user, FIRST_WIN_BONUS);

        emit FirstWinClaimed(user, FIRST_WIN_BONUS);
    }

    /// @notice Grant custom reward (for quests, achievements, etc.)
    /// @param user User to reward
    /// @param amount Reward amount
    /// @param reason Reason for reward (for logging)
    function grantReward(address user, uint256 amount, string calldata reason) external onlyGameServer {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(user, amount);

        emit RewardGranted(user, amount, reason);
    }

    /// @notice Batch grant rewards
    /// @param users Array of user addresses
    /// @param amounts Array of reward amounts
    /// @param reason Reason for rewards
    function batchGrantReward(
        address[] calldata users,
        uint256[] calldata amounts,
        string calldata reason
    ) external onlyGameServer {
        require(users.length == amounts.length, "Array length mismatch");

        uint256 totalAmount;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        require(totalSupply() + totalAmount <= MAX_SUPPLY, "Exceeds max supply");

        for (uint256 i = 0; i < users.length; i++) {
            _mint(users[i], amounts[i]);
            emit RewardGranted(users[i], amounts[i], reason);
        }
    }

    // ============ View Functions ============

    /// @notice Check if first win bonus is available today
    /// @param user User address
    /// @return available Whether first win bonus can be claimed
    function canClaimFirstWin(address user) external view returns (bool) {
        uint256 today = block.timestamp / 1 days;
        return lastFirstWinDay[user] < today;
    }

    /// @notice Get user's Gold balance in human readable format
    /// @param user User address
    /// @return balance Balance with 18 decimals removed
    function getBalanceFormatted(address user) external view returns (uint256) {
        return balanceOf(user) / 10**18;
    }

    /// @notice Get remaining mintable supply
    /// @return remaining Tokens that can still be minted
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - totalSupply();
    }
}
