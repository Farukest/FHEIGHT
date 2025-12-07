/**
 * Fheight CoffeeScript'ten TÜM kartları çıkarır
 * Regex-based parser
 */

const fs = require('fs');
const path = require('path');

const REFERENCE_PATH = path.join(__dirname, '..', 'game', 'reference', 'sdk', 'cards', 'factory');
const OUTPUT_PATH = path.join(__dirname, '..', 'game', 'data');

// Faction mapping
const FACTION_MAP = {
  'faction1': { id: 1, name: 'Lyonar' },
  'faction2': { id: 2, name: 'Songhai' },
  'faction3': { id: 3, name: 'Vetruvian' },
  'faction4': { id: 4, name: 'Abyssian' },
  'faction5': { id: 5, name: 'Magmar' },
  'faction6': { id: 6, name: 'Vanar' },
  'neutral': { id: 100, name: 'Neutral' }
};

// Rarity mapping
const RARITY_MAP = {
  'Rarity.Common': 'Common',
  'Rarity.Rare': 'Rare',
  'Rarity.Epic': 'Epic',
  'Rarity.Legendary': 'Legendary',
  'Rarity.Fixed': 'Token',
  'Rarity.TokenUnit': 'Token'
};

// Set/Expansion mapping
const SET_MAP = {
  'core': 'Core',
  'shimzar': 'Shimzar',
  'bloodstorm': 'Bloodstorm',
  'coreshatter': 'Coreshatter',
  'firstwatch': 'First Watch',
  'unity': 'Immortal Vanguard',
  'wartech': 'Trials of Mythron',
  'monthly': 'Monthly'
};

function extractCardsFromFile(filePath, setName, factionKey) {
  const content = fs.readFileSync(filePath, 'utf8');
  const cards = [];

  const faction = FACTION_MAP[factionKey] || { id: 100, name: 'Unknown' };

  // Split by card definitions (if identifier == Cards.XXX)
  const cardBlocks = content.split(/if\s*\(?\s*identifier\s*==\s*Cards\./);

  for (let i = 1; i < cardBlocks.length; i++) {
    const block = cardBlocks[i];

    try {
      // Extract card identifier
      const idMatch = block.match(/^(\w+)\.(\w+)/);
      if (!idMatch) continue;

      const cardCategory = idMatch[1]; // Faction1, Spell, Artifact, etc.
      const cardName = idMatch[2];

      // Determine card type
      let type = 'Unit';
      if (block.includes('new Spell(') || cardCategory.includes('Spell')) {
        type = 'Spell';
      } else if (block.includes('new Artifact(') || cardCategory.includes('Artifact')) {
        type = 'Artifact';
      }

      // Extract name
      const nameMatch = block.match(/card\.name\s*=\s*(?:i18next\.t\()?["']([^"']+)["']/);
      const displayName = nameMatch ? nameMatch[1].replace('cards.', '').replace(/_/g, ' ') : cardName;

      // Extract stats
      const atkMatch = block.match(/card\.atk\s*=\s*(\d+)/);
      const hpMatch = block.match(/card\.maxHP\s*=\s*(\d+)/);
      const manaMatch = block.match(/card\.manaCost\s*=\s*(\d+)/);
      const rarityMatch = block.match(/card\.rarityId\s*=\s*(Rarity\.\w+)/);

      // Extract description/ability
      const descMatch = block.match(/card\.setDescription\((?:i18next\.t\()?["']([^"']+)["']/);

      // Check for keywords/modifiers
      const keywords = [];
      if (block.includes('ModifierProvoke')) keywords.push('Provoke');
      if (block.includes('ModifierFlying') || block.includes('modifierFlying')) keywords.push('Flying');
      if (block.includes('ModifierRanged') || block.includes('modifierRanged')) keywords.push('Ranged');
      if (block.includes('ModifierRush')) keywords.push('Rush');
      if (block.includes('ModifierFrenzy')) keywords.push('Frenzy');
      if (block.includes('ModifierAirdrop')) keywords.push('Airdrop');
      if (block.includes('ModifierRebirth')) keywords.push('Rebirth');
      if (block.includes('ModifierBackstab')) keywords.push('Backstab');
      if (block.includes('ModifierGrow')) keywords.push('Grow');
      if (block.includes('ModifierForcefield')) keywords.push('Forcefield');
      if (block.includes('ModifierBlast')) keywords.push('Blast');
      if (block.includes('ModifierCelerity')) keywords.push('Celerity');
      if (block.includes('ModifierOpeningGambit')) keywords.push('Opening Gambit');
      if (block.includes('ModifierDyingWish')) keywords.push('Dying Wish');
      if (block.includes('ModifierDeathWatch')) keywords.push('Deathwatch');
      if (block.includes('ModifierInfiltrate')) keywords.push('Infiltrate');
      if (block.includes('ModifierZeal')) keywords.push('Zeal');

      // Skip generals for now (they have special handling)
      if (block.includes('setIsGeneral(true)')) continue;

      // Skip token cards
      if (block.includes('ModifierToken')) continue;

      const card = {
        id: `${cardCategory}_${cardName}`,
        name: cleanName(displayName),
        faction: faction.id,
        factionName: faction.name,
        type: type,
        set: SET_MAP[setName] || setName,
        mana: manaMatch ? parseInt(manaMatch[1]) : 0,
        rarity: rarityMatch ? (RARITY_MAP[rarityMatch[1]] || 'Common') : 'Common'
      };

      if (type === 'Unit') {
        card.atk = atkMatch ? parseInt(atkMatch[1]) : 0;
        card.hp = hpMatch ? parseInt(hpMatch[1]) : 0;
      }

      if (keywords.length > 0) {
        card.keywords = keywords;
      }

      if (descMatch) {
        card.description = descMatch[1];
      }

      cards.push(card);
    } catch (e) {
      // Skip problematic cards
    }
  }

  return cards;
}

function cleanName(name) {
  // i18next key formatından temiz isim çıkar
  // Format: "cards.faction_X_type_card_name_name" veya "cards.neutral_type_card_name_name"
  let clean = name
    .replace(/^cards\./, '')
    .replace(/^faction_\d+_/, '')
    .replace(/^neutral_/, '')
    .replace(/^spell_/, '')
    .replace(/^unit_/, '')
    .replace(/^artifact_/, '')
    .replace(/_name$/, '')
    .replace(/_desc$/, '')
    .replace(/_description$/, '');

  // snake_case to Title Case
  clean = clean
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
    .trim();

  return clean || name;
}

function processAllSets() {
  const allCards = [];
  const sets = fs.readdirSync(REFERENCE_PATH);

  for (const setName of sets) {
    const setPath = path.join(REFERENCE_PATH, setName);
    if (!fs.statSync(setPath).isDirectory()) continue;

    const files = fs.readdirSync(setPath).filter(f => f.endsWith('.coffee'));

    for (const file of files) {
      const factionKey = file.replace('.coffee', '');
      const filePath = path.join(setPath, file);

      try {
        const cards = extractCardsFromFile(filePath, setName, factionKey);
        allCards.push(...cards);
        console.log(`  ✓ ${setName}/${file}: ${cards.length} kart`);
      } catch (e) {
        console.log(`  ✗ ${setName}/${file}: Hata - ${e.message}`);
      }
    }
  }

  return allCards;
}

// Ana işlem
console.log('🎴 Fheight kart çıkarma başlıyor...\n');

const allCards = processAllSets();

// Unique kartları filtrele (aynı isimli kartları birleştir)
const uniqueCards = [];
const seenNames = new Set();

for (const card of allCards) {
  if (!seenNames.has(card.name) && card.mana > 0) {
    seenNames.add(card.name);
    uniqueCards.push(card);
  }
}

// ID'leri yeniden ata
uniqueCards.forEach((card, index) => {
  card.id = index + 1;
});

// Faction'a göre sırala
uniqueCards.sort((a, b) => {
  if (a.faction !== b.faction) return a.faction - b.faction;
  if (a.mana !== b.mana) return a.mana - b.mana;
  return a.name.localeCompare(b.name);
});

// İstatistikler
const stats = {
  total: uniqueCards.length,
  byFaction: {},
  byType: {},
  byRarity: {},
  bySet: {}
};

uniqueCards.forEach(card => {
  stats.byFaction[card.factionName] = (stats.byFaction[card.factionName] || 0) + 1;
  stats.byType[card.type] = (stats.byType[card.type] || 0) + 1;
  stats.byRarity[card.rarity] = (stats.byRarity[card.rarity] || 0) + 1;
  stats.bySet[card.set] = (stats.bySet[card.set] || 0) + 1;
});

console.log('\n📊 İstatistikler:');
console.log(`   Toplam: ${stats.total} kart`);
console.log(`   Faction: ${JSON.stringify(stats.byFaction)}`);
console.log(`   Type: ${JSON.stringify(stats.byType)}`);
console.log(`   Rarity: ${JSON.stringify(stats.byRarity)}`);

// Kaydet
const outputData = {
  version: '2.0.0',
  generatedAt: new Date().toISOString(),
  stats: stats,
  factions: {
    1: 'Lyonar',
    2: 'Songhai',
    3: 'Vetruvian',
    4: 'Abyssian',
    5: 'Magmar',
    6: 'Vanar',
    100: 'Neutral'
  },
  cards: uniqueCards
};

if (!fs.existsSync(OUTPUT_PATH)) {
  fs.mkdirSync(OUTPUT_PATH, { recursive: true });
}

fs.writeFileSync(
  path.join(OUTPUT_PATH, 'cards-full.json'),
  JSON.stringify(outputData, null, 2)
);

console.log(`\n✅ ${uniqueCards.length} kart kaydedildi: game/data/cards-full.json`);

// Ayrıca küçük bir starter set oluştur (her faction'dan en iyi 10 kart)
const starterCards = [];
for (const factionId of [1, 2, 3, 4, 5, 6, 100]) {
  const factionCards = uniqueCards
    .filter(c => c.faction === factionId)
    .slice(0, 15);
  starterCards.push(...factionCards);
}

fs.writeFileSync(
  path.join(OUTPUT_PATH, 'cards-starter.json'),
  JSON.stringify({ version: '2.0.0', cards: starterCards }, null, 2)
);

console.log(`✅ ${starterCards.length} starter kart kaydedildi: game/data/cards-starter.json`);
