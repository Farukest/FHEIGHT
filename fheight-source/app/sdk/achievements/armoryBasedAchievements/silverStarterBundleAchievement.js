/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const CardsLookup = require('app/sdk/cards/cardsLookup');
const i18next = require('i18next');

class ShopAchievement extends Achievement {
  static initClass() {
    this.id = "silver_special_purchased";
    this.title = i18next.t("achievements.silver_starter_bundle_title");
    this.description = i18next.t("achievements.silver_starter_bundle_desc");
    this.progressRequired = 1;
    this.rewards = {
      cards: [
        {
          "rarity":3,
          "count":3,
          "cardSet":1,
          "sample": [
            CardsLookup.Neutral.TwilightMage,
            CardsLookup.Neutral.VenomToth,
            CardsLookup.Neutral.Purgatos,
            CardsLookup.Neutral.SwornAvenger,
            CardsLookup.Neutral.Dilotas,
            CardsLookup.Neutral.AlcuinLoremaster
          ],
          "factionId":[100]
        }
      ]
    };
    this.enabled = true;
  }

  static progressForArmoryTransaction(armoryTransactionSku) {
    if (armoryTransactionSku.indexOf("SILVER_DIVISION_STARTER_SPECIAL") !== -1) {
      return 1;
    } else {
      return 0;
    }
  }
}
ShopAchievement.initClass();

module.exports = ShopAchievement;
