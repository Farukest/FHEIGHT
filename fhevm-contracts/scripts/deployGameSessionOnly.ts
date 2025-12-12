import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying GameSession with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  // Mevcut CardRegistry adresi (Sepolia'da zaten deploy edilmis)
  // v11 - getCardFromDeck ve getDeckIndex view fonksiyonlari eklendi
  const CARD_REGISTRY_ADDRESS = "0x1BD8190C546D58518E438eCC65E7aE01fEd4c169";

  console.log("\nDeploying GameSession...");
  const GameSession = await ethers.getContractFactory("GameSession");
  const gameSession = await GameSession.deploy(CARD_REGISTRY_ADDRESS);
  await gameSession.waitForDeployment();

  const gameSessionAddress = await gameSession.getAddress();
  console.log("GameSession deployed to:", gameSessionAddress);

  console.log("\n========================================");
  console.log("UPDATE fhe_session.js with:");
  console.log(`GameSession: '${gameSessionAddress}'`);
  console.log("========================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
