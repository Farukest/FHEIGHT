// Generate card registry data for Solidity deployment
const fs = require('fs');
const path = require('path');

// Load extracted card data
const cardDataPath = path.join(__dirname, '../card-data-extracted.json');
const cardData = JSON.parse(fs.readFileSync(cardDataPath, 'utf8'));

// CardType enum: NONE=0, GENERAL=1, MINION=2, SPELL=3, ARTIFACT=4
// Faction enum: NEUTRAL=0, LYONAR=1, SONGHAI=2, VETRUVIAN=3, ABYSSIAN=4, MAGMAR=5, VANAR=6
// Rarity enum: COMMON=0, RARE=1, EPIC=2, LEGENDARY=3

function getCardType(card) {
  if (card.isGeneral) return 1; // GENERAL
  if (card.type === 'Unit') return 2; // MINION
  if (card.type === 'Spell') return 3; // SPELL
  if (card.type === 'Artifact') return 4; // ARTIFACT
  return 2; // Default to MINION
}

function getFaction(factionStr) {
  const map = {
    'Faction1': 1, // LYONAR
    'Faction2': 2, // SONGHAI
    'Faction3': 3, // VETRUVIAN
    'Faction4': 4, // ABYSSIAN
    'Faction5': 5, // MAGMAR
    'Faction6': 6, // VANAR
    'Neutral': 0,
    'Tutorial': 0, // Tutorial cards as neutral
    'TutorialSpell': 0,
    'Boss': 0, // Boss cards as neutral
    'Spell': 0,
    'Artifact': 0
  };
  return map[factionStr] || 0;
}

function getRarity(rarityStr) {
  const map = {
    'Common': 0,
    'Rare': 1,
    'Epic': 2,
    'Legendary': 3,
    'Fixed': 0 // Fixed rarity = common for registry purposes
  };
  return map[rarityStr] || 0;
}

// Process all cards
const allCards = [
  ...cardData.generals,
  ...cardData.minions,
  ...cardData.spells,
  ...cardData.artifacts
];

// Filter out tutorial and boss cards for main registry (keep playable cards)
// But include them for completeness
const playableCards = allCards.filter(card => {
  // Exclude tutorial cards (ID >= 100000) and boss cards (ID >= 200000)
  return card.id < 100000;
});

console.log(`Total cards: ${allCards.length}`);
console.log(`Playable cards: ${playableCards.length}`);

// Generate arrays for batch registration
const cardIds = [];
const cardTypes = [];
const factions = [];
const rarities = [];
const manaCosts = [];
const atks = [];
const hps = [];

for (const card of playableCards) {
  cardIds.push(card.id);
  cardTypes.push(getCardType(card));
  factions.push(getFaction(card.faction));
  rarities.push(getRarity(card.rarity));
  manaCosts.push(Math.min(card.manaCost || 0, 9)); // Cap at 9
  atks.push(Math.min(card.atk || 0, 255)); // Cap at 255
  hps.push(Math.min(card.maxHP || 0, 255)); // Cap at 255
}

// Output for TypeScript deployment
const output = {
  totalCards: playableCards.length,
  cardIds,
  cardTypes,
  factions,
  rarities,
  manaCosts,
  atks,
  hps
};

fs.writeFileSync(
  path.join(__dirname, '../card-registry-data.json'),
  JSON.stringify(output, null, 2)
);

console.log('\nCard registry data saved to card-registry-data.json');
console.log(`\nBreakdown:`);
console.log(`- Generals: ${cardTypes.filter(t => t === 1).length}`);
console.log(`- Minions: ${cardTypes.filter(t => t === 2).length}`);
console.log(`- Spells: ${cardTypes.filter(t => t === 3).length}`);
console.log(`- Artifacts: ${cardTypes.filter(t => t === 4).length}`);

// Generate TypeScript constants for easy import
const tsOutput = `// Auto-generated card registry data
// Total cards: ${playableCards.length}

export const CARD_IDS: number[] = ${JSON.stringify(cardIds)};

export const CARD_TYPES: number[] = ${JSON.stringify(cardTypes)};

export const FACTIONS: number[] = ${JSON.stringify(factions)};

export const RARITIES: number[] = ${JSON.stringify(rarities)};

export const MANA_COSTS: number[] = ${JSON.stringify(manaCosts)};

export const ATKS: number[] = ${JSON.stringify(atks)};

export const HPS: number[] = ${JSON.stringify(hps)};

// Valid General IDs for quick reference
export const GENERAL_IDS: number[] = ${JSON.stringify(
  playableCards.filter(c => c.isGeneral).map(c => c.id)
)};
`;

fs.writeFileSync(
  path.join(__dirname, '../card-registry-data.ts'),
  tsOutput
);

console.log('TypeScript constants saved to card-registry-data.ts');
