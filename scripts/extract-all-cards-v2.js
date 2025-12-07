/**
 * Fheight CoffeeScript'ten TÜM kartları çıkarır (v2 - Localization ile)
 */

const fs = require('fs');
const path = require('path');

const REFERENCE_PATH = path.join(__dirname, '..', 'game', 'reference', 'sdk', 'cards', 'factory');
const LOCALIZATION_PATH = path.join(__dirname, '..', 'fheight-source', 'app', 'localization', 'locales', 'en');
const OUTPUT_PATH = path.join(__dirname, '..', 'game', 'data');

// Localization yükle
let LOCALIZATION = {};
function loadLocalization() {
  const files = fs.readdirSync(LOCALIZATION_PATH).filter(f => f.endsWith('.json'));
  for (const file of files) {
    try {
      const content = JSON.parse(fs.readFileSync(path.join(LOCALIZATION_PATH, file), 'utf8'));
      Object.assign(LOCALIZATION, content);
    } catch (e) {
      console.log(`Localization yüklenemedi: ${file}`);
    }
  }
  console.log(`📚 ${Object.keys(LOCALIZATION).length} çeviri yüklendi\n`);
}

// İsim çevirisi
function translateName(key) {
  // "cards.faction_1_spell_roar_name" -> "faction_1_spell_roar_name"
  const cleanKey = key.replace(/^cards\./, '').replace(/_name$/, '_name');

  if (LOCALIZATION[cleanKey]) {
    return LOCALIZATION[cleanKey];
  }

  // Alternatif formatları dene
  const variants = [
    cleanKey,
    cleanKey + '_name',
    cleanKey.replace('_name', ''),
  ];

  for (const variant of variants) {
    if (LOCALIZATION[variant]) {
      return LOCALIZATION[variant];
    }
  }

  // Fallback: key'den isim üret
  return key
    .replace(/^cards\./, '')
    .replace(/faction_\d+_/, '')
    .replace(/neutral_/, '')
    .replace(/spell_|unit_|artifact_/, '')
    .replace(/_name$/, '')
    .split('_')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

// Description çevirisi
function translateDescription(key) {
  const cleanKey = key
    .replace(/^cards\./, '')
    .replace(/_description$/, '_desc')
    .replace(/_desc$/, '_desc');

  const variants = [
    cleanKey,
    cleanKey.replace('_desc', '_description'),
    cleanKey + '_desc',
    cleanKey + '_description',
  ];

  for (const variant of variants) {
    if (LOCALIZATION[variant]) {
      return LOCALIZATION[variant];
    }
  }

  return null;
}

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

// Set/Expansion mapping
const SET_MAP = {
  'core': 'Core',
  'shimzar': 'Shimzar',
  'bloodstorm': 'Bloodstorm',
  'coreshatter': 'Ancient Bonds',
  'firstwatch': 'Rise of the Bloodborn',
  'unity': 'Immortal Vanguard',
  'wartech': 'Trials of Mythron',
  'monthly': 'Monthly'
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

function extractCardsFromFile(filePath, setName, factionKey) {
  const content = fs.readFileSync(filePath, 'utf8');
  const cards = [];

  const faction = FACTION_MAP[factionKey] || { id: 100, name: 'Neutral' };

  // Split by card definitions
  const cardBlocks = content.split(/if\s*\(?\s*identifier\s*==\s*Cards\./);

  for (let i = 1; i < cardBlocks.length; i++) {
    const block = cardBlocks[i];

    try {
      // Extract card identifier
      const idMatch = block.match(/^(\w+)\.(\w+)/);
      if (!idMatch) continue;

      const cardCategory = idMatch[1];
      const cardId = idMatch[2];

      // Determine card type
      let type = 'Unit';
      if (block.includes('new Spell(') || cardCategory.includes('Spell')) {
        type = 'Spell';
      } else if (block.includes('new Artifact(') || cardCategory.includes('Artifact')) {
        type = 'Artifact';
      }

      // Extract name key
      const nameMatch = block.match(/card\.name\s*=\s*(?:i18next\.t\()?["']([^"']+)["']/);
      const nameKey = nameMatch ? nameMatch[1] : cardId;
      const displayName = translateName(nameKey);

      // Extract stats
      const atkMatch = block.match(/card\.atk\s*=\s*(\d+)/);
      const hpMatch = block.match(/card\.maxHP\s*=\s*(\d+)/);
      const manaMatch = block.match(/card\.manaCost\s*=\s*(\d+)/);
      const rarityMatch = block.match(/card\.rarityId\s*=\s*(Rarity\.\w+)/);

      // Extract description
      const descMatch = block.match(/card\.setDescription\((?:i18next\.t\()?["']([^"']+)["']/);
      const description = descMatch ? translateDescription(descMatch[1]) : null;

      // Check for keywords
      const keywords = [];
      if (block.includes('ModifierProvoke')) keywords.push('Provoke');
      if (block.includes('ModifierFlying')) keywords.push('Flying');
      if (block.includes('ModifierRanged')) keywords.push('Ranged');
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
      if (block.includes('ModifierStrikeback')) keywords.push('Strikeback');
      if (block.includes('ModifierSentinel')) keywords.push('Sentinel');

      // Skip generals
      if (block.includes('setIsGeneral(true)')) continue;
      // Skip tokens
      if (block.includes('ModifierToken')) continue;

      const mana = manaMatch ? parseInt(manaMatch[1]) : 0;
      if (mana === 0 && type === 'Unit') continue; // Skip 0 mana units (likely tokens)

      const card = {
        id: `${cardCategory}_${cardId}`,
        name: displayName,
        faction: faction.id,
        factionName: faction.name,
        type: type,
        set: SET_MAP[setName] || setName,
        mana: mana,
        rarity: rarityMatch ? (RARITY_MAP[rarityMatch[1]] || 'Common') : 'Common'
      };

      if (type === 'Unit') {
        card.atk = atkMatch ? parseInt(atkMatch[1]) : 0;
        card.hp = hpMatch ? parseInt(hpMatch[1]) : 0;
      }

      if (keywords.length > 0) {
        card.keywords = keywords;
      }

      if (description) {
        card.description = description;
      }

      // Sprite reference
      const spriteMatch = block.match(/RSX\.(\w+)\.name/);
      if (spriteMatch) {
        card.sprite = spriteMatch[1];
      }

      cards.push(card);
    } catch (e) {
      // Skip problematic cards
    }
  }

  return cards;
}

function processAllSets() {
  const allCards = [];
  const sets = fs.readdirSync(REFERENCE_PATH);

  for (const setName of sets) {
    const setPath = path.join(REFERENCE_PATH, setName);
    if (!fs.statSync(setPath).isDirectory()) continue;
    if (setName === 'misc') continue; // Skip misc folder

    const files = fs.readdirSync(setPath).filter(f => f.endsWith('.coffee'));

    for (const file of files) {
      const factionKey = file.replace('.coffee', '');
      const filePath = path.join(setPath, file);

      try {
        const cards = extractCardsFromFile(filePath, setName, factionKey);
        allCards.push(...cards);
        console.log(`  ✓ ${setName}/${file}: ${cards.length} kart`);
      } catch (e) {
        console.log(`  ✗ ${setName}/${file}: Hata`);
      }
    }
  }

  return allCards;
}

// Ana işlem
console.log('🎴 Fheight kart çıkarma v2 başlıyor...\n');

loadLocalization();

const allCards = processAllSets();

// Unique kartları filtrele
const uniqueCards = [];
const seenNames = new Set();

for (const card of allCards) {
  const key = `${card.name}_${card.faction}`;
  if (!seenNames.has(key)) {
    seenNames.add(key);
    uniqueCards.push(card);
  }
}

// ID'leri yeniden ata
uniqueCards.forEach((card, index) => {
  card.id = index + 1;
});

// Sırala
uniqueCards.sort((a, b) => {
  if (a.faction !== b.faction) return a.faction - b.faction;
  if (a.type !== b.type) return a.type.localeCompare(b.type);
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
console.log(`   Faction:`, stats.byFaction);
console.log(`   Type:`, stats.byType);
console.log(`   Rarity:`, stats.byRarity);

// Kaydet
const outputData = {
  version: '2.0.0',
  generatedAt: new Date().toISOString(),
  stats: stats,
  factions: {
    1: { name: 'Lyonar', color: '#FFD700' },
    2: { name: 'Songhai', color: '#FF4500' },
    3: { name: 'Vetruvian', color: '#DEB887' },
    4: { name: 'Abyssian', color: '#8B008B' },
    5: { name: 'Magmar', color: '#228B22' },
    6: { name: 'Vanar', color: '#00CED1' },
    100: { name: 'Neutral', color: '#808080' }
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

// Starter set
const starterCards = [];
for (const factionId of [1, 2, 3, 4, 5, 6, 100]) {
  const factionCards = uniqueCards
    .filter(c => c.faction === factionId && c.rarity !== 'Token')
    .slice(0, 15);
  starterCards.push(...factionCards);
}

fs.writeFileSync(
  path.join(OUTPUT_PATH, 'cards-starter.json'),
  JSON.stringify({ version: '2.0.0', cards: starterCards }, null, 2)
);

console.log(`✅ ${starterCards.length} starter kart: game/data/cards-starter.json`);

// Örnek kartları göster
console.log('\n📋 Örnek kartlar:');
uniqueCards.slice(0, 5).forEach(c => {
  console.log(`   ${c.name} (${c.factionName}) - ${c.mana} mana ${c.type}`);
});
