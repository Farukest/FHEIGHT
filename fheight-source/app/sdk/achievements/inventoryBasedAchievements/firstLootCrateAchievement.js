/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const CardFactory = require('app/sdk/cards/cardFactory');
const Factions = require('app/sdk/cards/factionsLookup');
const GameSession = require('app/sdk/gameSession');
const RarityLookup = require('app/sdk/cards/rarityLookup');
const CosmeticsChestTypeLookup = require('app/sdk/cosmetics/cosmeticsChestTypeLookup');
const i18next = require('i18next');

const _ = require('underscore');

class FirstCosmeticChestAchievement extends Achievement {
  static initClass() {
    this.id = "firstCosmeticChestAchievement";
    this.title = i18next.t("achievements.key_mythron_title");
    this.description = i18next.t("achievements.key_mythron_desc");
    this.progressRequired = 1;
    this.rewards =
      {bronzeCrateKey: 1};
  }


  // returns progress made by receiving a loot crate
  static progressForReceivingCosmeticChest(cosmeticChestType) {
    if (cosmeticChestType === CosmeticsChestTypeLookup.Common) {
      return 1;
    } else {
      return 0;
    }
  }
}
FirstCosmeticChestAchievement.initClass();


module.exports = FirstCosmeticChestAchievement;
