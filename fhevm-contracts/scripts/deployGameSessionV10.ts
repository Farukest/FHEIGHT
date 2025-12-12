import { ethers } from "hardhat";

// Existing CardRegistry address (already has cards registered)
const CARD_REGISTRY_ADDRESS = "0x1BD8190C546D58518E438eCC65E7aE01fEd4c169";

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Deploying GameSession v10 (encrypted deck input) with account:", signer.address);
  console.log("Account balance:", ethers.formatEther(await signer.provider!.getBalance(signer.address)), "ETH");

  // Verify CardRegistry exists
  console.log("\n=== Verifying CardRegistry ===\n");
  console.log("Using existing CardRegistry at:", CARD_REGISTRY_ADDRESS);

  const CardRegistry = await ethers.getContractFactory("CardRegistry");
  const cardRegistry = CardRegistry.attach(CARD_REGISTRY_ADDRESS);

  // Check if a general exists
  const isArgeon = await cardRegistry.isValidGeneral(1);
  console.log("Argeon (ID: 1) is valid general:", isArgeon);

  if (!isArgeon) {
    console.log("ERROR: CardRegistry doesn't have generals registered!");
    return;
  }

  // Deploy new GameSession v10
  console.log("\n=== Deploying GameSession v10 ===\n");
  const GameSession = await ethers.getContractFactory("GameSession");
  const gameSession = await GameSession.deploy(CARD_REGISTRY_ADDRESS);
  await gameSession.waitForDeployment();
  const gameSessionAddress = await gameSession.getAddress();
  console.log("GameSession v10 deployed at:", gameSessionAddress);

  // Summary
  console.log("\n============================================");
  console.log("=== DEPLOYMENT SUMMARY ===");
  console.log("============================================");
  console.log("CardRegistry (existing):", CARD_REGISTRY_ADDRESS);
  console.log("GameSession v10 (NEW):", gameSessionAddress);
  console.log("\nUpdate fhe_session.js with:");
  console.log(`  GameSession: '${gameSessionAddress}',`);
  console.log("\nChanges in v10:");
  console.log("  - createGame/createSinglePlayerGame/joinGame now accept encrypted deck");
  console.log("  - Frontend must shuffle and encrypt deck before sending");
  console.log("  - TX data is encrypted, opponent cannot see deck order");
  console.log("============================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
