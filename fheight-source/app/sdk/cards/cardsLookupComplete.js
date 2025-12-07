/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  Cards lookup. Includes base cards lookup as well as prismatics and skins.
  NOTE: in any case where you might need prismatics or card skins, you should require this file instead of cardsLookup.coffee!
*/

let cardId, cardName, group, groupName, PRISMATIC_OFFSET, SKIN_OFFSET;
const _ = require("underscore");
const CardsLookup = require('app/sdk/cards/cardsLookup');
const CosmeticsLookup = require('app/sdk/cosmetics/cosmeticsLookup');
const CosmeticsFactory = require('app/sdk/cosmetics/cosmeticsFactory');

const CardsLookupComplete = _.extend({}, CardsLookup);
const SKIN_IDS_BY_CARD_ID = {};
const CARD_IDS_BY_SKIN_ID = {};

CardsLookupComplete.Prismatic = (PRISMATIC_OFFSET = 1000000);
CardsLookupComplete.Skin = (SKIN_OFFSET = PRISMATIC_OFFSET + 1000000);

CardsLookupComplete.getBaseCardId = cardId => CardsLookupComplete.getNonSkinnedCardId(cardId) % PRISMATIC_OFFSET;

CardsLookupComplete.getSkinnedCardId = function(cardId, skinNum) {
  const skinnedCardId = CardsLookupComplete.getBaseCardId(cardId) + (Math.max(skinNum, 0) * SKIN_OFFSET);
  if (CardsLookupComplete.getIsPrismaticCardId(cardId)) { return skinnedCardId + PRISMATIC_OFFSET; } else { return skinnedCardId; }
};

CardsLookupComplete.getCardSkinNum = cardId => Math.floor(cardId / SKIN_OFFSET);

CardsLookupComplete.getIsSkinnedCardId = cardId => cardId > SKIN_OFFSET;

CardsLookupComplete.getNonSkinnedCardId = cardId => cardId % SKIN_OFFSET;

CardsLookupComplete.getNonPrismaticCardId = function(cardId) {
  const nonSkinnedCardId = CardsLookupComplete.getNonSkinnedCardId(cardId);
  if (CardsLookupComplete.getIsPrismaticCardId(nonSkinnedCardId)) { return cardId - PRISMATIC_OFFSET; } else { return cardId; }
};

CardsLookupComplete.getIsPrismaticCardId = cardId => CardsLookupComplete.getNonSkinnedCardId(cardId) > PRISMATIC_OFFSET;

CardsLookupComplete.getPrismaticCardId = function(cardId) {
  const nonSkinnedCardId = CardsLookupComplete.getNonSkinnedCardId(cardId);
  if (CardsLookupComplete.getIsPrismaticCardId(nonSkinnedCardId)) { return cardId; } else { return cardId + PRISMATIC_OFFSET; }
};

CardsLookupComplete.getCardSkinIdForCardId = function(cardId) {
  const nonPrismaticCardId = CardsLookupComplete.getNonPrismaticCardId(cardId);
  return SKIN_IDS_BY_CARD_ID[nonPrismaticCardId];
};

CardsLookupComplete.getCardIdForCardSkinId = cardSkinId => CARD_IDS_BY_SKIN_ID[cardSkinId];

// map groups for all cards
const GROUP_FOR_CARD_ID = {};
const NAME_FOR_CARD_ID = {};
for (groupName in CardsLookupComplete) {
  group = CardsLookupComplete[groupName];
  if (_.isObject(group)) {
    for (cardName in group) {
      cardId = group[cardName];
      GROUP_FOR_CARD_ID[cardId] = group;
      NAME_FOR_CARD_ID[cardId] = cardName;
    }
  }
}

// add card skin ids for all card skins
for (var skinIdKey in CosmeticsLookup.CardSkin) {
  var skinId = CosmeticsLookup.CardSkin[skinIdKey];
  var cosmeticData = CosmeticsFactory.cosmeticForIdentifier(skinId);
  ({
    cardId
  } = cosmeticData);
  cardName = NAME_FOR_CARD_ID[cardId];
  var {
    skinNum
  } = cosmeticData;
  group = GROUP_FOR_CARD_ID[cardId];
  var skinnedCardId = CardsLookupComplete.getSkinnedCardId(cardId, skinNum);
  group[cardName + "Skin" + skinNum] = skinnedCardId;
  SKIN_IDS_BY_CARD_ID[skinnedCardId] = skinId;
  CARD_IDS_BY_SKIN_ID[skinId] = skinnedCardId;
}

// add prismatic ids for all cards
for (groupName in CardsLookupComplete) {
  group = CardsLookupComplete[groupName];
  if (_.isObject(group)) {
    for (cardName in group) {
      cardId = group[cardName];
      var prismaticCardId = CardsLookupComplete.getPrismaticCardId(cardId);
      group[cardName + "Prismatic"] = prismaticCardId;
    }
  }
}

module.exports = CardsLookupComplete;
