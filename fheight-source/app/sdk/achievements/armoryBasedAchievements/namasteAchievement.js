/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const i18next = require('i18next');

// Make your first real-money purchase at the THE ARMORY.

class NamasteAchievement extends Achievement {
  static initClass() {
    this.id = "namaste";
    this.title = i18next.t("achievements.namaste_title");
    this.description = i18next.t("achievements.namaste_desc");
    this.progressRequired = 1;
    this.rewards =
      {gold: 100}; // TODO: will be snowchaser
    this.enabled = false;
  }


  static progressForArmoryTransaction(armoryTransactionSku) {
    if (armoryTransactionSku.indexOf("BOOSTER") !== -1) {
      return 1;
    } else {
      return 0;
    }
  }
}
NamasteAchievement.initClass();


module.exports = NamasteAchievement;
