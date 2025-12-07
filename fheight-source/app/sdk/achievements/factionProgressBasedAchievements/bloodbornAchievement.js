/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const i18next = require('i18next');

class BloodbornAchievement extends Achievement {
  static initClass() {
    this.id = "bloodborn";
    this.title = i18next.t("achievements.bloodborn_title");
    this.description = i18next.t("achievements.bloodborn_desc");
    this.progressRequired = 1;
    this.rewards =
      {spiritOrb: 1};
    this.enabled = false;
  }


  // returns progress made by reaching a state of faction progression
  static progressForFactionProgression(factionProgressionData) {
    // 9 is the faction level at which players have unlocked all cards for a faction
    for (var factionId in factionProgressionData) {
      var factionData = factionProgressionData[factionId];
      if (factionData && factionData.stats && (factionData.stats.level === 9)) {
        return 1;
      }
    }

    // No factions are level 9 so no progress is made
    return 0;
  }
}
BloodbornAchievement.initClass();


module.exports = BloodbornAchievement;
