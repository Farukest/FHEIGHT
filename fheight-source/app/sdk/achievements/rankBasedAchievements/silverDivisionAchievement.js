/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const i18next = require('i18next');

class SilverDivisionAchievement extends Achievement {
  static initClass() {
    this.id = "silverDivisionAchievement";
    this.title = i18next.t("achievements.silver_division_title");
    this.description = i18next.t("achievements.silver_division_desc");
    this.progressRequired = 1;
    this.rewards =
      {spiritOrb: 1};
    this.enabled = false;
  }

  static progressForAchievingRank(rank) {
    if (rank <= 20) {
      return 1;
    } else {
      return 0;
    }
  }
}
SilverDivisionAchievement.initClass();

module.exports = SilverDivisionAchievement;
