const fs = require('fs');
const path = require('path');

const questFiles = [
  'app/sdk/quests/questBeginnerCompleteSoloChallenges.js',
  'app/sdk/quests/questBeginnerFactionLevel.js',
  'app/sdk/quests/questBeginnerPlayOneQuickMatch.js',
  'app/sdk/quests/questBeginnerPlayPracticeGames.js',
  'app/sdk/quests/questBeginnerWinFourPracticeGames.js',
  'app/sdk/quests/questBeginnerWinOneSeasonGame.js',
  'app/sdk/quests/questBeginnerWinPracticeGames.js',
  'app/sdk/quests/questBeginnerWinThreeQuickMatches.js',
  'app/sdk/quests/questBeginnerWinThreeRankedMatches.js',
  'app/sdk/quests/questBeginnerWinTwoPracticeGames.js'
];

questFiles.forEach(file => {
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Pattern: super(..., this.goldReward) -> need to replace this.goldReward with the actual static value
  // Look for: this.goldReward = NUMBER followed by super(...this.goldReward)
  
  // Find the goldReward value
  const goldMatch = content.match(/this\.goldReward\s*=\s*(\d+)/);
  if (goldMatch) {
    const goldValue = goldMatch[1];
    // Replace this.goldReward in super() with the literal value
    const newContent = content.replace(
      /super\(([^)]*),\s*this\.goldReward\)/g,
      `super($1, ${goldValue})`
    );
    
    if (newContent !== content) {
      fs.writeFileSync(file, newContent);
      console.log(`Fixed: ${file} (goldReward=${goldValue})`);
    }
  }
});

console.log('Done!');
