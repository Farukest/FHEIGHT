/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const i18next = require('i18next');

class ShopAchievement extends Achievement {
  static initClass() {
    this.id = "gold_special_purchased";
    this.title = i18next.t("achievements.gold_starter_bundle_title");
    this.description = i18next.t("achievements.gold_starter_bundle_desc");
    this.progressRequired = 1;
    this.rewards = {
      cards: [
        {
          "rarity":4,
          "count":3,
          "cardSet":1,
          "factionId":[1,2,3,4,5,6]
        }
      ]
    };
    this.enabled = true;
  }

  static progressForArmoryTransaction(armoryTransactionSku) {
    if (armoryTransactionSku.indexOf("GOLD_DIVISION_STARTER_SPECIAL") !== -1) {
      return 1;
    } else {
      return 0;
    }
  }
}
ShopAchievement.initClass();

module.exports = ShopAchievement;
