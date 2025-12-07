/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SDK = require('../../sdk');

// regex requires into cache generation code with the following
// find: ([A-z]+) = ([ \S])*[\n]*
// subs: @_achievementsCache[$1.id] = new $1()\n

const GiftCrateLookup = require("./giftCrateLookup");
const Cards = require("app/sdk/cards/cardsLookupComplete");
const RarityLookup = require("app/sdk/cards/rarityLookup");
const CosmeticsLookup = require("app/sdk/cosmetics/cosmeticsLookup");
const CosmeticsChestTypeLookup = require("app/sdk/cosmetics/cosmeticsChestTypeLookup");
const CardSet = require('app/sdk/cards/cardSetLookup');
const _ = require('underscore');
const moment = require('moment');

class GiftCrateFactory {
  static initClass() {
    this._giftCrateTemplateCache = null;
  }

  static _generateCache(){
    if (this._giftCrateTemplateCache !== null) {
      return;
    }

    Logger.module("SDK").debug("AchievementsFactory::_generateCache - starting");

    this._giftCrateTemplateCache = {};

    // winter holiday 2015
    this._giftCrateTemplateCache[GiftCrateLookup.WinterHoliday2015] = {
      titleText: "FROSTFIRE FESTIVAL GIFT BOX",
      subtitleText: "A FRIENDLY SNOWCHASER LEFT THIS FOR YOU. HAPPY HOLIDAYS!",
      availableAt: moment.utc(0).year(2015).month(11).date(20).valueOf(), // December 20th 2015
      rewards: {
        spirit: 100,
        spirit_orbs: 1,
        cosmetics: [CosmeticsLookup.Emote.OtherSnowChaserHoliday2015]
      }
    };

    // winter holiday 2015
    this._giftCrateTemplateCache[GiftCrateLookup.FebruaryLag2016] = {
      titleText: "ONE TIME BONUS BOX",
      subtitleText: "Due to recent server performance issues, we're giving away a ONE TIME bonus box.",
      availableAt: moment.utc(0).year(2016).month(1).date(0).valueOf(), // Jan 31st 2016 (i think that's what this means)
      rewards: {
        gold: 100,
        gauntlet_tickets: 1
      }
    };

    // 7 day mystery box
    this._giftCrateTemplateCache[GiftCrateLookup.SevenDayMysteryBox] = {
      titleText: "MYSTERY BOX",
      subtitleText: "A MYSTERY BOX FOR YOUR FUTURE BATTLES!",
      rewards: {
        gold: 250,
        spirit_orbs: 1,
        random_cards: [ { rarity:RarityLookup.Epic }, { rarity:RarityLookup.Legendary } ]
      }
    };

    // Frostfire 2016 BOX
    this._giftCrateTemplateCache[GiftCrateLookup.Frostfire2016] = {
      titleText: "Frostfire Festival Gift Box",
      subtitleText: "A FRIENDLY SNOWCHASER LEFT THIS FOR YOU. HAPPY HOLIDAYS!",
      rewards: {
        gold: 100,
        cosmetics: [ CosmeticsLookup.CardSkin.FrostfireTiger ],
        crate_keys: [ CosmeticsChestTypeLookup.Rare ]
      }
    };

    // Anniversary 2017
    this._giftCrateTemplateCache[GiftCrateLookup.Anniversary2017] = {
      titleText: "Anniversary 2017 Gift Box",
      subtitleText: "Celebrating One Year of FHEIGHT!",
      rewards: {
        card_ids: [Cards.getPrismaticCardId(Cards.Neutral.Serpenti)],
        cosmetics: [CosmeticsLookup.Emote.emote_fog_taunt_alt]
      }
    };

    // BN Promo login crate
    this._giftCrateTemplateCache[GiftCrateLookup.BNLogin2017] = {
      titleText: "Re-Launch Gift Box",
      subtitleText: "Welcome back!",
      rewards: {
        spirit_orbs: 3,
        cosmetics: [CosmeticsLookup.CardSkin.HealingMysticBN]
      }
    };

    // MidAugust login crate
    this._giftCrateTemplateCache[GiftCrateLookup.MidAugust2017Login] = {
      titleText: "Thanks for playing FHEIGHT",
      subtitleText: "Here's a FREE GIFT CRATE to celebrate our new partnership!",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.FirstWatch
      }
    };

    // Mid November 2017 login crate
    this._giftCrateTemplateCache[GiftCrateLookup.MidNovember2017Login] = {
      titleText: "Thanks for playing FHEIGHT",
      subtitleText: "Here's a FREE GIFT CRATE to celebrate the launch of the Immortal Vanguard expansion!",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.Wartech
      }
    };

    // Frostfire 2017 Purchase crate
    this._giftCrateTemplateCache[GiftCrateLookup.FrostfirePurchasable2017] = {
      titleText: "Frostfire Festival",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 1,
        spirit_orbs_set: CardSet.Core,
        spirit_box: 1,
        cosmetic_box: 1
      }
    };

    // Frostfire 2017 Premium Purchase crate
    this._giftCrateTemplateCache[GiftCrateLookup.FrostfirePremiumPurchasable2017] = {
      titleText: "Frostfire Festival",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 2,
        spirit_orbs_set: CardSet.Wartech,
        spirit_box: 1,
        cosmetic_box: 1
      }
    };

    // Frostfire 2017 Premium Purchase crate
    this._giftCrateTemplateCache[GiftCrateLookup.EarlyFebruary2018Login] = {
      titleText: "Valentine's Gift",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.Core
      }
    };

    // Coreshatter login celebration
    this._giftCrateTemplateCache[GiftCrateLookup.CoreshatterLogin] = {
      titleText: "Trials of Mythron Launch!",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.Coreshatter
      }
    };

    // Legacy mode celbration crate
    this._giftCrateTemplateCache[GiftCrateLookup.LegacyLaunch] = {
      titleText: "Unlmited Mode Celbration Crate",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 5,
        spirit_orbs_set: CardSet.Shimzar
      }
    };

    // Memorial Day login celebration
    this._giftCrateTemplateCache[GiftCrateLookup.MemorialDayLogin] = {
      titleText: "HAPPY MEMORIAL DAY",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.Core
      }
    };

    // Fathers Day login celebration
    this._giftCrateTemplateCache[GiftCrateLookup.FathersDayLogin] = {
      titleText: "HAPPY FATHERS DAY",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.Shimzar
      }
    };

    // Fourth of July login celebration
    this._giftCrateTemplateCache[GiftCrateLookup.FourthOfJulyLogin] = {
      titleText: "4TH OF JULY CELEBRATION",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.CombinedUnlockables
      }
    };

    // Summer login celebration
    this._giftCrateTemplateCache[GiftCrateLookup.SummerLogin] = {
      titleText: "SUMMER TIME CELEBRATION",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.FirstWatch
      }
    };

    // Labor Day login celebration
    this._giftCrateTemplateCache[GiftCrateLookup.LaborDayLogin] = {
      titleText: "Labor Day CELEBRATION",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.Wartech
      }
    };

    // Halloween login celebration
    this._giftCrateTemplateCache[GiftCrateLookup.HalloweenLogin] = {
      titleText: "Halloween CELEBRATION",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 3,
        spirit_orbs_set: CardSet.Coreshatter
      }
    };

    // Thanksgiving login celebration
    this._giftCrateTemplateCache[GiftCrateLookup.ThanksgivingLogin] = {
      titleText: "Thanksgiving CELEBRATION",
      subtitleText: "___",
      rewards: {
        spirit_orbs: 5,
        spirit_orbs_set: CardSet.Core,
        random_cards: [ { rarity:RarityLookup.Legendary } ]
      }
    };

    // Christmas login celebration
    this._giftCrateTemplateCache[GiftCrateLookup.ChristmasLogin] = {
      titleText: "Christmas CELEBRATION",
      subtitleText: "___",
      rewards: {
        card_ids: [Cards.Neutral.PennyPacker],
        crate_keys: [ CosmeticsChestTypeLookup.Common, CosmeticsChestTypeLookup.Rare, CosmeticsChestTypeLookup.Epic ],
        gold: 300
      }
    };

    // QA crate that is unavailable until 2050
    return this._giftCrateTemplateCache[GiftCrateLookup.Unavailable2050] = {
      titleText: "__Unavailable2050 Title",
      subtitleText: "__Unavailable2050 Subtitle",
      availableAt: moment.utc().startOf('year').year(2050).valueOf(),
      rewards: {
        spirit: 100,
        card_ids: [Cards.Neutral.SarlacTheEternal,Cards.Neutral.BlackLocust],
        gold: 100,
        cosmetics: [CosmeticsLookup.Emote.Faction1Taunt]
      }
    };
  }

  static getIsCrateTypeAvailable(crateType,systemTime) {
    const MOMENT_NOW_UTC = moment(systemTime) || moment().utc();
    this._generateCache();
    const giftCrateTemplate = this.giftCrateTemplateForType(crateType);

    if ((giftCrateTemplate == null)) { // No template, so consider unavailable
      return false;
    }

    if ((giftCrateTemplate.availableAt == null)) { // If available at is not defined or 0 it is available
      return true;
    }

    return MOMENT_NOW_UTC.add(1, 'hours').isAfter(moment(giftCrateTemplate.availableAt)); // Last, compare available at with now + 1 hour
  }

  static giftCrateTemplateForType(crateType) {
    this._generateCache();
    return this._giftCrateTemplateCache[crateType];
  }
}
GiftCrateFactory.initClass();

module.exports = GiftCrateFactory;
