/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const Factions = require('app/sdk/cards/factionsLookup');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Rarity = require('app/sdk/cards/rarityLookup');
const CardSet = require('app/sdk/cards/cardSetLookup');
const _ = require('underscore');
const i18next = require('i18next');

class CollectorSupremeAchievement extends Achievement {
  static initClass() {
    this.id = "collectorSupreme";
    this.title = i18next.t("achievements.collector_supreme_title");
    this.description = i18next.t("achievements.collector_supreme_desc");
    this.progressRequired = 1;
    this.rewards = {
      neutralEpicCard: 1,
      neutralRareCard: 1
    };
  }

  static progressForCardCollection(cardCollection, allCards) {

    if ((cardCollection == null)) {
      return 0;
    }

    // check if player owns one of every common card
    const allCommonCards = _.filter(allCards,card => (card.getRarityId() === Rarity.Common) &&
      (card.getCardSetId() === CardSet.Core) &&
      !card.getIsHiddenInCollection() &&
      card.getIsAvailable() &&
      (card.factionId !== Factions.Tutorial) &&
      !Cards.getIsPrismaticCardId(card.getId()));

    for (var card of Array.from(allCommonCards)) {
      var baseCardId = card.getBaseCardId();
      var prismaticCardId = Cards.getPrismaticCardId(baseCardId);
      var cardCollectionBase = cardCollection[baseCardId];
      var cardCollectionPrismatic = cardCollection[prismaticCardId];
      if ((((cardCollectionBase != null ? cardCollectionBase.count : undefined) || 0) + ((cardCollectionPrismatic != null ? cardCollectionPrismatic.count : undefined) || 0)) === 0) {
        return 0;
      }
    }

    return 1;
  }
}
CollectorSupremeAchievement.initClass();

module.exports = CollectorSupremeAchievement;
