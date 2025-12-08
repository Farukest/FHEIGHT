import { ethers } from "hardhat";

async function main() {
  console.log("Deploying FHEIGHT contracts...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy GameSession
  console.log("1. Deploying GameSession...");
  const GameSessionFactory = await ethers.getContractFactory("GameSession");
  const gameSession = await GameSessionFactory.deploy();
  await gameSession.waitForDeployment();
  const gameSessionAddress = await gameSession.getAddress();
  console.log("   GameSession deployed to:", gameSessionAddress);

  // Deploy SessionKeyManager
  console.log("\n2. Deploying SessionKeyManager...");
  const SessionKeyManagerFactory = await ethers.getContractFactory("SessionKeyManager");
  const sessionKeyManager = await SessionKeyManagerFactory.deploy(gameSessionAddress);
  await sessionKeyManager.waitForDeployment();
  const sessionKeyManagerAddress = await sessionKeyManager.getAddress();
  console.log("   SessionKeyManager deployed to:", sessionKeyManagerAddress);

  // Summary
  console.log("\n=== Deployment Summary ===");
  console.log("GameSession:       ", gameSessionAddress);
  console.log("SessionKeyManager: ", sessionKeyManagerAddress);
  console.log("\n=== Contract Addresses for Frontend ===");
  console.log(`export const GAME_SESSION_ADDRESS = "${gameSessionAddress}";`);
  console.log(`export const SESSION_KEY_MANAGER_ADDRESS = "${sessionKeyManagerAddress}";`);

  // Verify on Etherscan if not on localhost
  const network = await ethers.provider.getNetwork();
  if (network.chainId !== BigInt(31337)) {
    console.log("\n=== Verification Commands ===");
    console.log(`npx hardhat verify --network sepolia ${gameSessionAddress}`);
    console.log(`npx hardhat verify --network sepolia ${sessionKeyManagerAddress} ${gameSessionAddress}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
