/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Rarity = require('./rarityLookup');
const i18next = require('i18next');

class RarityFactory {

  static rarityForIdentifier(identifier) {
    let rarity = null;

    if (identifier === Rarity.Fixed) {
      rarity = {
        id: Rarity.Fixed,
        name: i18next.t("rarity.rarity_basic"),
        devName: "basic",
        spiritCost: 0,
        spiritReward: 0,
        spiritCostPrismatic: 0,
        spiritRewardPrismatic: 0,
        bonusRewardCount: 0,
        color: {r: 255, g: 255, b: 255},
        hex: "#CCCCCC",
        isHiddenToUI: false
      };
    }

    if (identifier === Rarity.Common) {
      rarity = {
        id: Rarity.Common,
        name: i18next.t("rarity.rarity_common"),
        devName: "common",
        spiritCost: 20,
        spiritReward: 10,
        spiritCostPrismatic: 100,
        spiritRewardPrismatic: 50,
        cosmeticHardPrice: 100,
        spiritCostCosmetic: 250,
        spiritRewardCosmetic: 125,
        bonusRewardCount: 1,
        color: {r: 255, g: 255, b: 255},
        hex: "#CCCCCC",
        isHiddenToUI: false
      };
    }

    if (identifier === Rarity.Rare) {
      rarity = {
        id: Rarity.Rare,
        name: i18next.t("rarity.rarity_rare"),
        devName: "rare",
        spiritCost: 50,
        spiritReward: 25,
        spiritCostPrismatic: 175,
        spiritRewardPrismatic: 90,
        cosmeticHardPrice: 150,
        spiritCostCosmetic: 500,
        spiritRewardCosmetic: 250,
        bonusRewardCount: 1,
        color: {r: 56, g: 93, b: 255},
        hex: "#6dcff6",
        isHiddenToUI: false
      };
    }

    if (identifier === Rarity.Epic) {
      rarity = {
        id: Rarity.Epic,
        name: i18next.t("rarity.rarity_epic"),
        devName: "epic",
        spiritCost: 175,
        spiritReward: 90,
        spiritCostPrismatic: 450,
        spiritRewardPrismatic: 225,
        cosmeticHardPrice: 200,
        spiritCostCosmetic: 750,
        spiritRewardCosmetic: 375,
        bonusRewardCount: 2,
        color: {r: 144, g: 41, b: 255},
        hex: "#f49ac1",
        isHiddenToUI: false
      };
    }

    if (identifier === Rarity.Legendary) {
      rarity = {
        id: Rarity.Legendary,
        name: i18next.t("rarity.rarity_legendary"),
        devName: "legendary",
        spiritCost: 450,
        spiritReward: 225,
        spiritCostPrismatic: 900,
        spiritRewardPrismatic: 450,
        cosmeticHardPrice: 400,
        spiritCostCosmetic: 1500,
        spiritRewardCosmetic: 750,
        bonusRewardCount: 2,
        color: {r: 255, g: 120, b: 0},
        hex: "#ffac49",
        isHiddenToUI: false
      };
    }

    if (identifier === Rarity.TokenUnit) {
      rarity = {
        id: Rarity.TokenUnit,
        devName: "token",
        name: "Token",
        spiritCost: 0,
        spiritReward: 0,
        bonusRewardCount: 0,
        color: {r: 189, g: 189, b: 189},
        hex: "#BDBDBD",
        isHiddenToUI: true
      };
    }

    if (identifier === Rarity.Mythron) {
      rarity = {
        id: Rarity.Mythron,
        devName: "mythron",
        name: "Mythron",
        spiritCost: 600,
        spiritReward: 300,
        spiritCostPrismatic: 1200,
        spiritRewardPrismatic: 600,
        bonusRewardCount: 0,
        color: {r: 189, g: 189, b: 189},
        hex: "#BDBDBD",
        isHiddenToUI: false
      };
    }

    // no faction found
    if (rarity) {
      return rarity;
    } else {
      return console.error(`RarityFactory.rarityForIdentifier - Unknown rarity identifier: ${identifier}`.red);
    }
  }

  static getIsRarityTypeCraftable(rarityType) {
    return (rarityType !== Rarity.Fixed) && (rarityType !== Rarity.TokenUnit);
  }

  static getAllRarities() {
    const rarities = [];
    for (var rarityName in Rarity) {
      var identifier = Rarity[rarityName];
      var rarity = this.rarityForIdentifier(identifier);
      if (rarity != null) {
        rarities.push(rarity);
      }
    }

    return rarities;
  }
}

module.exports = RarityFactory;
