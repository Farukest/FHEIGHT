// Script to extract card data from factory files
const fs = require('fs');
const path = require('path');

const factoryBasePath = path.join(__dirname, '../../fheight-source/app/sdk/cards/factory');
const cardsLookupPath = path.join(__dirname, '../../fheight-source/app/sdk/cards/cardsLookup.js');

// Read cardsLookup.js to get card IDs
const cardsLookupContent = fs.readFileSync(cardsLookupPath, 'utf8');

// Extract card IDs from cardsLookup
const cardIds = {};
const factionPattern = /this\.(Faction\d|Neutral)\s*=\s*\{([^}]+)\}/gs;
let match;

while ((match = factionPattern.exec(cardsLookupContent)) !== null) {
  const factionName = match[1];
  const content = match[2];
  const idPattern = /(\w+)\s*:\s*(\d+)/g;
  let idMatch;
  while ((idMatch = idPattern.exec(content)) !== null) {
    const cardName = idMatch[1];
    const cardId = parseInt(idMatch[2]);
    cardIds[cardId] = { faction: factionName, name: cardName };
  }
}

// Also extract Spell, Artifact, Tile, Tutorial, Boss, etc.
const otherPatterns = [
  /this\.(Spell)\s*=\s*\{([^}]+)\}/gs,
  /this\.(Artifact)\s*=\s*\{([^}]+)\}/gs,
  /this\.(Tile)\s*=\s*\{([^}]+)\}/gs,
  /this\.(Tutorial)\s*=\s*\{([^}]+)\}/gs,
  /this\.(TutorialSpell)\s*=\s*\{([^}]+)\}/gs,
  /this\.(Boss)\s*=\s*\{([^}]+)\}/gs,
];

for (const pattern of otherPatterns) {
  while ((match = pattern.exec(cardsLookupContent)) !== null) {
    const typeName = match[1];
    const content = match[2];
    const idPattern = /(\w+)\s*:\s*(\d+)/g;
    let idMatch;
    while ((idMatch = idPattern.exec(content)) !== null) {
      const cardName = idMatch[1];
      const cardId = parseInt(idMatch[2]);
      cardIds[cardId] = { faction: typeName, name: cardName };
    }
  }
}

console.log(`Found ${Object.keys(cardIds).length} card IDs in cardsLookup.js`);

// Now parse factory files to extract card stats
const cardData = [];

function parseFactoryFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  // Find all card definitions
  // Pattern: card = new Unit/Spell/Artifact(gameSession);
  // Then look for: card.atk = X; card.maxHP = X; card.manaCost = X;

  const cardDefPattern = /if\s*\(identifier\s*===\s*Cards\.(\w+)\.(\w+)\)\s*\{([\s\S]*?)(?=\n\s*if\s*\(identifier|$)/g;
  let cardMatch;

  while ((cardMatch = cardDefPattern.exec(content)) !== null) {
    const factionOrType = cardMatch[1];
    const cardName = cardMatch[2];
    const cardBlock = cardMatch[3];

    // Extract card type (Unit, Spell, Artifact)
    const typeMatch = cardBlock.match(/card\s*=\s*new\s+(\w+)\s*\(/);
    const cardType = typeMatch ? typeMatch[1] : 'Unknown';

    // Extract stats
    const atkMatch = cardBlock.match(/card\.atk\s*=\s*(\d+)/);
    const hpMatch = cardBlock.match(/card\.maxHP\s*=\s*(\d+)/);
    const manaMatch = cardBlock.match(/card\.manaCost\s*=\s*(\d+)/);
    const rarityMatch = cardBlock.match(/card\.rarityId\s*=\s*Rarity\.(\w+)/);
    const isGeneralMatch = cardBlock.match(/card\.setIsGeneral\s*\(\s*true\s*\)/);

    // Find the card ID from cardsLookup
    let cardId = null;
    for (const [id, info] of Object.entries(cardIds)) {
      if (info.name === cardName && (info.faction === factionOrType || info.faction.includes(factionOrType))) {
        cardId = parseInt(id);
        break;
      }
    }

    // Only include cards with valid stats (Units mainly)
    if (cardId) {
      const data = {
        id: cardId,
        name: cardName,
        faction: factionOrType,
        type: cardType,
        manaCost: manaMatch ? parseInt(manaMatch[1]) : 0,
        atk: atkMatch ? parseInt(atkMatch[1]) : 0,
        maxHP: hpMatch ? parseInt(hpMatch[1]) : 0,
        rarity: rarityMatch ? rarityMatch[1] : 'Common',
        isGeneral: isGeneralMatch ? true : false
      };
      cardData.push(data);
    }
  }
}

// Parse all factory files
const factoryDirs = ['core', 'bloodstorm', 'shimzar', 'unity', 'wartech', 'coreshatter', 'firstwatch', 'monthly', 'misc'];

for (const dir of factoryDirs) {
  const dirPath = path.join(factoryBasePath, dir);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
      if (file.endsWith('.js')) {
        const filePath = path.join(dirPath, file);
        parseFactoryFile(filePath);
      }
    }
  }
}

// Sort by ID
cardData.sort((a, b) => a.id - b.id);

// Remove duplicates (keep first occurrence)
const uniqueCards = [];
const seenIds = new Set();
for (const card of cardData) {
  if (!seenIds.has(card.id)) {
    seenIds.add(card.id);
    uniqueCards.push(card);
  }
}

console.log(`Extracted ${uniqueCards.length} unique cards`);

// Separate cards by type
const units = uniqueCards.filter(c => c.type === 'Unit');
const spells = uniqueCards.filter(c => c.type === 'Spell');
const artifacts = uniqueCards.filter(c => c.type === 'Artifact');
const generals = units.filter(c => c.isGeneral);
const minions = units.filter(c => !c.isGeneral);

console.log(`- Units: ${units.length} (Generals: ${generals.length}, Minions: ${minions.length})`);
console.log(`- Spells: ${spells.length}`);
console.log(`- Artifacts: ${artifacts.length}`);

// Output summary
console.log('\n=== GENERALS ===');
for (const card of generals) {
  console.log(`ID: ${card.id}, Name: ${card.name}, HP: ${card.maxHP}, ATK: ${card.atk}`);
}

console.log('\n=== SAMPLE MINIONS (first 20) ===');
for (const card of minions.slice(0, 20)) {
  console.log(`ID: ${card.id}, Name: ${card.name}, Mana: ${card.manaCost}, HP: ${card.maxHP}, ATK: ${card.atk}`);
}

// Save to JSON
const output = {
  totalCards: uniqueCards.length,
  generals: generals,
  minions: minions,
  spells: spells,
  artifacts: artifacts
};

fs.writeFileSync(
  path.join(__dirname, '../card-data-extracted.json'),
  JSON.stringify(output, null, 2)
);

console.log('\nCard data saved to card-data-extracted.json');

// Also output in Solidity-friendly format
console.log('\n=== SOLIDITY CARD STATS (sample) ===');
console.log('// CardType: 1=General, 2=Minion, 3=Spell, 4=Artifact');
console.log('// Format: cardId => (cardType, manaCost, atk, hp)');
for (const card of [...generals.slice(0, 3), ...minions.slice(0, 5)]) {
  const cardType = card.isGeneral ? 1 : 2;
  console.log(`// ${card.name}: cardStats[${card.id}] = CardStats(${cardType}, ${card.manaCost}, ${card.atk}, ${card.maxHP});`);
}
