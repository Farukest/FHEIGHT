import { DeployFunction } from "hardhat-deploy/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import * as fs from "fs";
import * as path from "path";

// Card registry data
interface CardRegistryData {
  totalCards: number;
  cardIds: number[];
  cardTypes: number[];
  factions: number[];
  rarities: number[];
  manaCosts: number[];
  atks: number[];
  hps: number[];
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const { ethers } = hre;

  console.log("\n========================================");
  console.log("FHEIGHT Contracts Deployment v2");
  console.log("========================================");
  console.log(`Deployer: ${deployer}`);
  console.log(`Network: ${hre.network.name}`);
  console.log("========================================\n");

  // 1. Deploy GameGold (ERC20)
  console.log("1. Deploying GameGold (ERC20)...");
  const deployedGameGold = await deploy("GameGold", {
    from: deployer,
    log: true,
    args: [],
  });
  console.log(`   GameGold deployed at: ${deployedGameGold.address}\n`);

  // 2. Deploy CardNFT (ERC721)
  console.log("2. Deploying CardNFT (ERC721)...");
  const deployedCardNFT = await deploy("CardNFT", {
    from: deployer,
    log: true,
    args: [],
  });
  console.log(`   CardNFT deployed at: ${deployedCardNFT.address}\n`);

  // 3. Deploy SpiritOrb (FHE Loot Box)
  console.log("3. Deploying SpiritOrb (FHE Loot Box)...");
  const deployedSpiritOrb = await deploy("SpiritOrb", {
    from: deployer,
    log: true,
    args: [],
  });
  console.log(`   SpiritOrb deployed at: ${deployedSpiritOrb.address}\n`);

  // 4. Configure economy contracts
  console.log("4. Configuring economy contracts...");

  const spiritOrb = await ethers.getContractAt("SpiritOrb", deployedSpiritOrb.address);
  const cardNFT = await ethers.getContractAt("CardNFT", deployedCardNFT.address);

  console.log("   - Setting GameGold in SpiritOrb...");
  const tx1 = await spiritOrb.setGoldToken(deployedGameGold.address);
  await tx1.wait();
  console.log("     Done.");

  console.log("   - Setting CardNFT in SpiritOrb...");
  const tx2 = await spiritOrb.setCardNFT(deployedCardNFT.address);
  await tx2.wait();
  console.log("     Done.");

  console.log("   - Authorizing SpiritOrb as CardNFT minter...");
  const tx3 = await cardNFT.setMinter(deployedSpiritOrb.address, true);
  await tx3.wait();
  console.log("     Done.");

  // 5. Deploy CardRegistry
  console.log("\n5. Deploying CardRegistry...");
  const deployedCardRegistry = await deploy("CardRegistry", {
    from: deployer,
    log: true,
    args: [],
  });
  console.log(`   CardRegistry deployed at: ${deployedCardRegistry.address}\n`);

  // 6. Populate CardRegistry with card data
  console.log("6. Populating CardRegistry with card data...");

  const cardRegistryDataPath = path.join(__dirname, "../card-registry-data.json");
  if (!fs.existsSync(cardRegistryDataPath)) {
    console.log("   WARNING: card-registry-data.json not found. Run 'node scripts/generate-card-registry-data.js' first.");
  } else {
    const cardData: CardRegistryData = JSON.parse(fs.readFileSync(cardRegistryDataPath, "utf8"));
    console.log(`   Total cards to register: ${cardData.totalCards}`);

    const cardRegistry = await ethers.getContractAt("CardRegistry", deployedCardRegistry.address);

    // Register cards in batches (to avoid gas limits)
    const BATCH_SIZE = 100;
    const totalBatches = Math.ceil(cardData.totalCards / BATCH_SIZE);

    for (let i = 0; i < totalBatches; i++) {
      const start = i * BATCH_SIZE;
      const end = Math.min(start + BATCH_SIZE, cardData.totalCards);

      console.log(`   Registering batch ${i + 1}/${totalBatches} (cards ${start}-${end - 1})...`);

      const batchCardIds = cardData.cardIds.slice(start, end);
      const batchCardTypes = cardData.cardTypes.slice(start, end);
      const batchFactions = cardData.factions.slice(start, end);
      const batchRarities = cardData.rarities.slice(start, end);
      const batchManaCosts = cardData.manaCosts.slice(start, end);
      const batchAtks = cardData.atks.slice(start, end);
      const batchHps = cardData.hps.slice(start, end);

      const tx = await cardRegistry.registerCardsBatch(
        batchCardIds,
        batchCardTypes,
        batchFactions,
        batchRarities,
        batchManaCosts,
        batchAtks,
        batchHps,
        { gasLimit: 10000000 }
      );
      await tx.wait();
    }

    console.log(`   Successfully registered ${cardData.totalCards} cards!`);

    // Lock the registry to prevent modifications
    console.log("   Locking registry...");
    const lockTx = await cardRegistry.lockRegistry();
    await lockTx.wait();
    console.log("   Registry locked!\n");
  }

  // 7. Deploy FHECounter (example contract from template)
  console.log("7. Deploying FHECounter (example)...");
  const deployedFHECounter = await deploy("FHECounter", {
    from: deployer,
    log: true,
  });
  console.log(`   FHECounter deployed at: ${deployedFHECounter.address}\n`);

  // 8. Deploy GameSession (FHE Card Game) - now requires CardRegistry address
  console.log("8. Deploying GameSession (FHE Card Game)...");
  const deployedGameSession = await deploy("GameSession", {
    from: deployer,
    log: true,
    args: [deployedCardRegistry.address],
  });
  console.log(`   GameSession deployed at: ${deployedGameSession.address}\n`);

  // Summary
  console.log("\n========================================");
  console.log("Deployment Summary v2");
  console.log("========================================");
  console.log(`GameGold:     ${deployedGameGold.address}`);
  console.log(`CardNFT:      ${deployedCardNFT.address}`);
  console.log(`SpiritOrb:    ${deployedSpiritOrb.address}`);
  console.log(`CardRegistry: ${deployedCardRegistry.address}`);
  console.log(`FHECounter:   ${deployedFHECounter.address}`);
  console.log(`GameSession:  ${deployedGameSession.address}`);
  console.log("========================================\n");

  // Save deployment addresses to a JSON file for frontend use
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    deployer: deployer,
    timestamp: new Date().toISOString(),
    contracts: {
      GameGold: {
        address: deployedGameGold.address,
        description: "ERC20 in-game currency token"
      },
      CardNFT: {
        address: deployedCardNFT.address,
        description: "ERC721 NFT for game cards with rarity system"
      },
      SpiritOrb: {
        address: deployedSpiritOrb.address,
        description: "FHE-based loot box using encrypted random for provably fair card generation"
      },
      CardRegistry: {
        address: deployedCardRegistry.address,
        description: "On-chain card statistics registry for cheat-proof game logic"
      },
      FHECounter: {
        address: deployedFHECounter.address,
        description: "Example FHE counter contract from template"
      },
      GameSession: {
        address: deployedGameSession.address,
        description: "FHE-based card game with session keys, encrypted hands, and on-chain game logic"
      }
    },
    configuration: {
      "SpiritOrb.goldToken": deployedGameGold.address,
      "SpiritOrb.cardNFT": deployedCardNFT.address,
      "CardNFT.authorizedMinter": deployedSpiritOrb.address,
      "GameSession.cardRegistry": deployedCardRegistry.address
    },
    fhevm: {
      ACL_CONTRACT: "0xf0Ffdc93b7E186bC2f8CB3dAA75D86d1930A433D",
      KMS_VERIFIER: "0xbE0E383937d564D7FF0BC3b46c51f0bF8d5C311A",
      INPUT_VERIFIER: "0xBBC1fFCdc7C316aAAd72E807D9b0272BE8F84DA0",
      FHEVM_EXECUTOR: "0x92C920834Ec8941d2C77D188936E1f7A6f49c127"
    }
  };

  // Write to file
  const outputPath = path.join(__dirname, `../deployed-contracts-${hre.network.name}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
  console.log(`Deployment info saved to: ${outputPath}`);

  console.log("\nDeployment Info (for frontend):");
  console.log(JSON.stringify(deploymentInfo, null, 2));
};

export default func;
func.id = "deploy_fheight_v3"; // Changed ID to force redeployment - FHE debug events
func.tags = ["FHEIGHT", "GameGold", "CardNFT", "SpiritOrb", "CardRegistry", "FHECounter", "GameSession"];
