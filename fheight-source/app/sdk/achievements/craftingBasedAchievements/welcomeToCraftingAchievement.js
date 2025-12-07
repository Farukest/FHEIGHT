/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const i18next = require('i18next');

// Disenchant your first Card.

class WelcomeToCraftingAchievement extends Achievement {
  static initClass() {
    this.id = "welcomeToCrafting";
    this.title = i18next.t("achievements.welcome_to_crafting_title");
    this.description = i18next.t("achievements.welcome_to_crafting_desc");
    this.progressRequired = 1;
    this.rewards =
      {spirit: 90};
    this.enabled = false;
  }

  static progressForDisenchanting(cardId) {
    return 1;
  }
}
WelcomeToCraftingAchievement.initClass();


module.exports = WelcomeToCraftingAchievement;
