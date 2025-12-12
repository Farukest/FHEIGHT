import { ethers } from "hardhat";

// Card types enum (must match contract)
enum CardType {
  NONE = 0,
  GENERAL = 1,
  MINION = 2,
  SPELL = 3,
  ARTIFACT = 4
}

// Faction enum
enum Faction {
  NEUTRAL = 0,
  LYONAR = 1,
  SONGHAI = 2,
  VETRUVIAN = 3,
  ABYSSIAN = 4,
  MAGMAR = 5,
  VANAR = 6
}

// Rarity enum
enum Rarity {
  COMMON = 0,
  RARE = 1,
  EPIC = 2,
  LEGENDARY = 3
}

// General card data
interface GeneralCard {
  id: number;
  faction: Faction;
  name: string;
  atk: number;
  hp: number;
}

// All general cards from cardsLookup.js
const GENERAL_CARDS: GeneralCard[] = [
  // Faction 1 - Lyonar
  { id: 1, faction: Faction.LYONAR, name: "Argeon Highmayne", atk: 2, hp: 25 },
  { id: 23, faction: Faction.LYONAR, name: "Ziran Sunforge", atk: 2, hp: 25 },
  { id: 51, faction: Faction.LYONAR, name: "Brome Warcrest", atk: 2, hp: 25 },

  // Faction 2 - Songhai
  { id: 101, faction: Faction.SONGHAI, name: "Reva Eventide", atk: 2, hp: 25 },
  { id: 123, faction: Faction.SONGHAI, name: "Kaleos Xaan", atk: 2, hp: 25 },
  { id: 152, faction: Faction.SONGHAI, name: "Shidai Stormblossom", atk: 2, hp: 25 },

  // Faction 3 - Vetruvian
  { id: 201, faction: Faction.VETRUVIAN, name: "Zirix Starstrider", atk: 2, hp: 25 },
  { id: 223, faction: Faction.VETRUVIAN, name: "Sajj Bloodtide", atk: 2, hp: 25 },
  { id: 254, faction: Faction.VETRUVIAN, name: "Ciphyron Ascendant", atk: 2, hp: 25 },

  // Faction 4 - Abyssian
  { id: 301, faction: Faction.ABYSSIAN, name: "Lilithe Blightchaser", atk: 2, hp: 25 },
  { id: 323, faction: Faction.ABYSSIAN, name: "Cassyva Soulreaper", atk: 2, hp: 25 },
  { id: 355, faction: Faction.ABYSSIAN, name: "Maehv Skinsolder", atk: 2, hp: 25 },

  // Faction 5 - Magmar
  { id: 401, faction: Faction.MAGMAR, name: "Vaath the Immortal", atk: 2, hp: 25 },
  { id: 418, faction: Faction.MAGMAR, name: "Starhorn the Seeker", atk: 2, hp: 25 },
  { id: 449, faction: Faction.MAGMAR, name: "Ragnora the Relentless", atk: 2, hp: 25 },

  // Faction 6 - Vanar
  { id: 501, faction: Faction.VANAR, name: "Faie Bloodwing", atk: 2, hp: 25 },
  { id: 527, faction: Faction.VANAR, name: "Kara Winterblade", atk: 2, hp: 25 },
  { id: 558, faction: Faction.VANAR, name: "Ilena Cryobyte", atk: 2, hp: 25 },
];

// Minion cards for deck building
const MINION_CARDS = [
  // Neutral minions
  { id: 10001, faction: Faction.NEUTRAL, name: "Healing Mystic", manaCost: 2, atk: 2, hp: 3 },
  { id: 10002, faction: Faction.NEUTRAL, name: "Primus Fist", manaCost: 2, atk: 2, hp: 3 },
  { id: 10003, faction: Faction.NEUTRAL, name: "Dancing Blades", manaCost: 5, atk: 4, hp: 6 },
  { id: 10004, faction: Faction.NEUTRAL, name: "Bloodtear Alchemist", manaCost: 1, atk: 2, hp: 1 },
  { id: 10005, faction: Faction.NEUTRAL, name: "Ephemeral Shroud", manaCost: 2, atk: 2, hp: 2 },
  { id: 10006, faction: Faction.NEUTRAL, name: "Jaxi", manaCost: 2, atk: 1, hp: 1 },
  { id: 10007, faction: Faction.NEUTRAL, name: "Saberspine Tiger", manaCost: 3, atk: 3, hp: 2 },
  { id: 10008, faction: Faction.NEUTRAL, name: "Primus Shieldmaster", manaCost: 4, atk: 3, hp: 6 },
  { id: 10009, faction: Faction.NEUTRAL, name: "Hailstone Golem", manaCost: 4, atk: 4, hp: 6 },
  { id: 10010, faction: Faction.NEUTRAL, name: "Brightmoss Golem", manaCost: 5, atk: 4, hp: 9 },

  // Lyonar minions
  { id: 9, faction: Faction.LYONAR, name: "Windblade Adept", manaCost: 2, atk: 2, hp: 3 },
  { id: 10, faction: Faction.LYONAR, name: "Sunstone Templar", manaCost: 2, atk: 1, hp: 4 },
  { id: 11, faction: Faction.LYONAR, name: "Silverguard Knight", manaCost: 3, atk: 1, hp: 5 },
  { id: 12, faction: Faction.LYONAR, name: "Arclyte Sentinel", manaCost: 3, atk: 2, hp: 4 },
  { id: 14, faction: Faction.LYONAR, name: "Silverguard Squire", manaCost: 1, atk: 1, hp: 4 },
  { id: 17, faction: Faction.LYONAR, name: "Ironcliffe Guardian", manaCost: 5, atk: 3, hp: 10 },
  { id: 21, faction: Faction.LYONAR, name: "Azurite Lion", manaCost: 2, atk: 2, hp: 3 },
];

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", signer.address);
  console.log("Account balance:", ethers.formatEther(await signer.provider!.getBalance(signer.address)), "ETH");

  // Step 1: Deploy new CardRegistry
  console.log("\n=== Step 1: Deploying CardRegistry ===\n");
  const CardRegistry = await ethers.getContractFactory("CardRegistry");
  const cardRegistry = await CardRegistry.deploy();
  await cardRegistry.waitForDeployment();
  const cardRegistryAddress = await cardRegistry.getAddress();
  console.log("CardRegistry deployed at:", cardRegistryAddress);

  // Step 2: Register General cards
  console.log("\n=== Step 2: Registering General Cards ===\n");
  for (const general of GENERAL_CARDS) {
    console.log(`Registering: ${general.name} (ID: ${general.id})`);
    const tx = await cardRegistry.registerCard(
      general.id,
      CardType.GENERAL,
      general.faction,
      Rarity.LEGENDARY,
      0, // manaCost
      general.atk,
      general.hp
    );
    await tx.wait();
    console.log(`  Done!`);
  }

  // Step 3: Register Minion cards
  console.log("\n=== Step 3: Registering Minion Cards ===\n");
  for (const minion of MINION_CARDS) {
    console.log(`Registering: ${minion.name} (ID: ${minion.id})`);
    const tx = await cardRegistry.registerCard(
      minion.id,
      CardType.MINION,
      minion.faction,
      Rarity.COMMON,
      minion.manaCost,
      minion.atk,
      minion.hp
    );
    await tx.wait();
    console.log(`  Done!`);
  }

  // Step 4: Deploy GameSession with new CardRegistry
  console.log("\n=== Step 4: Deploying GameSession ===\n");
  const GameSession = await ethers.getContractFactory("GameSession");
  const gameSession = await GameSession.deploy(cardRegistryAddress);
  await gameSession.waitForDeployment();
  const gameSessionAddress = await gameSession.getAddress();
  console.log("GameSession deployed at:", gameSessionAddress);

  // Step 5: Verify generals are valid
  console.log("\n=== Step 5: Verifying Generals ===\n");
  for (const general of GENERAL_CARDS) {
    const isValid = await cardRegistry.isValidGeneral(general.id);
    console.log(`General ${general.id} (${general.name}): ${isValid ? "VALID" : "NOT VALID"}`);
  }

  // Summary
  console.log("\n============================================");
  console.log("=== DEPLOYMENT SUMMARY ===");
  console.log("============================================");
  console.log("CardRegistry:", cardRegistryAddress);
  console.log("GameSession:", gameSessionAddress);
  console.log("\nUpdate fhe_session.js with:");
  console.log(`  CardRegistry: '${cardRegistryAddress}',`);
  console.log(`  GameSession: '${gameSessionAddress}',`);
  console.log("============================================");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
