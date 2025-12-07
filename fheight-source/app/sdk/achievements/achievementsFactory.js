/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');

// regex requires into cache generation code with the following
// find: ([A-z]+) = ([ \S])*[\n]*
// subs: @_achievementsCache[$1.id] = new $1()\n

// Armory
const NamasteAchievement = require('./armoryBasedAchievements/namasteAchievement');
const BronzeStarterBundleAchievement = require('./armoryBasedAchievements/bronzeStarterBundleAchievement');
const SilverStarterBundleAchievement = require('./armoryBasedAchievements/silverStarterBundleAchievement');
const GoldStarterBundleAchievement = require('./armoryBasedAchievements/goldStarterBundleAchievement');

// Referral
const FirstReferralPurchase = require('./referralBasedAchievements/firstReferralPurchaseAchievement');

// Crafting
const WelcomeToCraftingAchievement = require('./craftingBasedAchievements/welcomeToCraftingAchievement');

// Game based
const BestOfFriendsAchievement = require('./gameBasedAchievements/bestOfFriendsAchievement');
const EnteringGauntletAchievement = require('./gameBasedAchievements/enteringGauntletAchievement');
const HelpingHandAchievement = require('./gameBasedAchievements/helpingHandAchievement');
const TheArtOfWarAchievement = require('./gameBasedAchievements/theArtOfWarAchievement');
const HomeTurfAchievement = require('./gameBasedAchievements/homeTurfAchievement');

// faction progress based
const BloodbornAchievement = require('./factionProgressBasedAchievements/bloodbornAchievement');
const WorldExplorerAchievement = require('./factionProgressBasedAchievements/worldExplorerAchievement');

// inventory based
const CollectorSupremeAchievement = require('./inventoryBasedAchievements/collectorSupremeAchievement');
const SwornSisterAchievement = require('./inventoryBasedAchievements/swornSisterAchievement');
const SunSisterAchievement = require('./inventoryBasedAchievements/sunSisterAchievement');
const LightningSisterAchievement = require('./inventoryBasedAchievements/lightningSisterAchievement');
const SandSisterAchievement = require('./inventoryBasedAchievements/sandSisterAchievement');
const ShadowSisterAchievement = require('./inventoryBasedAchievements/shadowSisterAchievement');
const EarthSisterAchievement = require('./inventoryBasedAchievements/earthSisterAchievement');
const WindSisterAchievement = require('./inventoryBasedAchievements/windSisterAchievement');
const FirstLootCrateAchievement = require('./inventoryBasedAchievements/firstLootCrateAchievement.js');

// quest based
const EpicQuestorAchievement = require('./questBasedAchievements/epicQuestorAchievement');
const IndomitableSpiritAchievement = require('./questBasedAchievements/indomitableSpiritAchievement');
const LegendaryQuestorAchievement = require('./questBasedAchievements/legendaryQuestorAchievement');
const JourneymanQuestorAchievement = require('./questBasedAchievements/journeymanQuestorAchievement');

// rank based
const SilverDivisionAchievement = require('./rankBasedAchievements/silverDivisionAchievement');

// login based
const BNPromoAchievement = require('./loginBasedAchievements/bnPromoAchievement');
const MidAugLoginAchievement = require('./loginBasedAchievements/midAugLoginAchievement');
const MidNov2017LoginAchievement = require('./loginBasedAchievements/midNov2017LoginAchievement');
const FrostfirePurchasable2017 = require('./loginBasedAchievements/frostfire2017LoginAchievement.js');
const FrostfireBonus2017 = require('./loginBasedAchievements/frostfire2017BonusLoginAchievement.js');
const EarlyFeb2018LoginAchievement = require('./loginBasedAchievements/earlyFeb2018LoginAchievement.js');
const CoreshatterLoginAchievement = require('./loginBasedAchievements/coreshatterLoginAchievement.js');
const MemorialDayLoginAchievement = require('./loginBasedAchievements/memorialDayLoginAchievement.js');
const FathersDayLoginAchievement = require('./loginBasedAchievements/fathersDayLoginAchievement.js');
const FourthOfJulyLoginAchievement = require('./loginBasedAchievements/fourthOfJulyLoginAchievement.js');
const SummerLoginAchievement = require('./loginBasedAchievements/summerLoginAchievement.js');
const LaborDayLoginAchievement = require('./loginBasedAchievements/laborDayLoginAchievement.js');
const HalloweenLoginAchievement = require('./loginBasedAchievements/halloweenLoginAchievement.js');
const ThanksgivingLoginAchievement = require('./loginBasedAchievements/thanksgivingLoginAchievement.js');
const ChristmasLoginAchievement = require('./loginBasedAchievements/christmasLoginAchievement.js');
const NewPlayerGoldLoginAchievement = require('./loginBasedAchievements/newPlayerGoldLoginAchievement.js');
const NewPlayerSpiritLoginAchievement = require('./loginBasedAchievements/newPlayerSpiritLoginAchievement.js');

// Wartech general achievements
const WartechGeneralFaction1Achievement = require('./wartechAchievements/wartechGeneralFaction1Achievement');
const WartechGeneralFaction2Achievement = require('./wartechAchievements/wartechGeneralFaction2Achievement');
const WartechGeneralFaction3Achievement = require('./wartechAchievements/wartechGeneralFaction3Achievement');
const WartechGeneralFaction4Achievement = require('./wartechAchievements/wartechGeneralFaction4Achievement');
const WartechGeneralFaction5Achievement = require('./wartechAchievements/wartechGeneralFaction5Achievement');
const WartechGeneralFaction6Achievement = require('./wartechAchievements/wartechGeneralFaction6Achievement');

// Orb opening achievements
const MythronOrb1Achievement = require('./orbOpeningAchievements/mythronOrb1Achievement');
const MythronOrb2Achievement = require('./orbOpeningAchievements/mythronOrb2Achievement');
const MythronOrb3Achievement = require('./orbOpeningAchievements/mythronOrb3Achievement');
const MythronOrb4Achievement = require('./orbOpeningAchievements/mythronOrb4Achievement');
const MythronOrb5Achievement = require('./orbOpeningAchievements/mythronOrb5Achievement');
const MythronOrb6Achievement = require('./orbOpeningAchievements/mythronOrb6Achievement');
const MythronOrb7Achievement = require('./orbOpeningAchievements/mythronOrb7Achievement');

const _ = require('underscore');

class AchievementsFactory {
  static initClass() {
  
    // global cache for quick access
    this._achievementsCache =null;
    this._enabledAchievementsCache =null;
  }

  // TODO: Could be more performant by separating achievements by what they respond to in bucketed caches

  static _generateCache(){
    Logger.module("SDK").debug("AchievementsFactory::_generateCache - starting");

    this._achievementsCache = {};

    // armory based
    this._achievementsCache[NamasteAchievement.id] = NamasteAchievement;
    this._achievementsCache[BronzeStarterBundleAchievement.id] = BronzeStarterBundleAchievement;
    this._achievementsCache[SilverStarterBundleAchievement.id] = SilverStarterBundleAchievement;
    this._achievementsCache[GoldStarterBundleAchievement.id] = GoldStarterBundleAchievement;
    // Referral based
    this._achievementsCache[FirstReferralPurchase.id] = FirstReferralPurchase;
    // Crafting
    this._achievementsCache[WelcomeToCraftingAchievement.id] = WelcomeToCraftingAchievement;
    // Game based
    this._achievementsCache[BestOfFriendsAchievement.id] = BestOfFriendsAchievement;
    this._achievementsCache[EnteringGauntletAchievement.id] = EnteringGauntletAchievement;
    this._achievementsCache[HelpingHandAchievement.id] = HelpingHandAchievement;
    this._achievementsCache[TheArtOfWarAchievement.id] = TheArtOfWarAchievement;
    this._achievementsCache[HomeTurfAchievement.id] = HomeTurfAchievement;
    // faction progress based
    this._achievementsCache[BloodbornAchievement.id] = BloodbornAchievement;
    this._achievementsCache[WorldExplorerAchievement.id] = WorldExplorerAchievement;
    // inventory based
    this._achievementsCache[CollectorSupremeAchievement.id] = CollectorSupremeAchievement;
    this._achievementsCache[SwornSisterAchievement.id] = SwornSisterAchievement;
    this._achievementsCache[SunSisterAchievement.id] = SunSisterAchievement;
    this._achievementsCache[LightningSisterAchievement.id] = LightningSisterAchievement;
    this._achievementsCache[SandSisterAchievement.id] = SandSisterAchievement;
    this._achievementsCache[ShadowSisterAchievement.id] = ShadowSisterAchievement;
    this._achievementsCache[EarthSisterAchievement.id] = EarthSisterAchievement;
    this._achievementsCache[WindSisterAchievement.id] = WindSisterAchievement;
    //@_achievementsCache[FirstLootCrateAchievement.id] = FirstLootCrateAchievement
    // quest based
    this._achievementsCache[EpicQuestorAchievement.id] = EpicQuestorAchievement;
    this._achievementsCache[IndomitableSpiritAchievement.id] = IndomitableSpiritAchievement;
    this._achievementsCache[LegendaryQuestorAchievement.id] = LegendaryQuestorAchievement;
    this._achievementsCache[JourneymanQuestorAchievement.id] = JourneymanQuestorAchievement;
    // rank based
    this._achievementsCache[SilverDivisionAchievement.id] = SilverDivisionAchievement;
    // login based
    this._achievementsCache[BNPromoAchievement.id] = BNPromoAchievement;
    this._achievementsCache[MidAugLoginAchievement.id] = MidAugLoginAchievement;
    this._achievementsCache[MidNov2017LoginAchievement.id] = MidNov2017LoginAchievement;
    this._achievementsCache[EarlyFeb2018LoginAchievement.id] = EarlyFeb2018LoginAchievement;
    this._achievementsCache[FrostfirePurchasable2017.id] = FrostfirePurchasable2017;
    this._achievementsCache[FrostfireBonus2017.id] = FrostfireBonus2017;
    this._achievementsCache[CoreshatterLoginAchievement.id] = CoreshatterLoginAchievement;
    this._achievementsCache[MemorialDayLoginAchievement.id] = MemorialDayLoginAchievement;
    this._achievementsCache[FathersDayLoginAchievement.id] = FathersDayLoginAchievement;
    this._achievementsCache[FourthOfJulyLoginAchievement.id] = FourthOfJulyLoginAchievement;
    this._achievementsCache[SummerLoginAchievement.id] = SummerLoginAchievement;
    this._achievementsCache[LaborDayLoginAchievement.id] = LaborDayLoginAchievement;
    this._achievementsCache[HalloweenLoginAchievement.id] = HalloweenLoginAchievement;
    this._achievementsCache[ThanksgivingLoginAchievement.id] = ThanksgivingLoginAchievement;
    this._achievementsCache[ChristmasLoginAchievement.id] = ChristmasLoginAchievement;
    this._achievementsCache[NewPlayerGoldLoginAchievement.id] = NewPlayerGoldLoginAchievement;
    this._achievementsCache[NewPlayerSpiritLoginAchievement.id] = NewPlayerSpiritLoginAchievement;
    // wartech
    this._achievementsCache[WartechGeneralFaction1Achievement.id] = WartechGeneralFaction1Achievement;
    this._achievementsCache[WartechGeneralFaction2Achievement.id] = WartechGeneralFaction2Achievement;
    this._achievementsCache[WartechGeneralFaction3Achievement.id] = WartechGeneralFaction3Achievement;
    this._achievementsCache[WartechGeneralFaction4Achievement.id] = WartechGeneralFaction4Achievement;
    this._achievementsCache[WartechGeneralFaction5Achievement.id] = WartechGeneralFaction5Achievement;
    this._achievementsCache[WartechGeneralFaction6Achievement.id] = WartechGeneralFaction6Achievement;
    // orb opening
    this._achievementsCache[MythronOrb1Achievement.id] = MythronOrb1Achievement;
    this._achievementsCache[MythronOrb2Achievement.id] = MythronOrb2Achievement;
    this._achievementsCache[MythronOrb3Achievement.id] = MythronOrb3Achievement;
    this._achievementsCache[MythronOrb4Achievement.id] = MythronOrb4Achievement;
    this._achievementsCache[MythronOrb5Achievement.id] = MythronOrb5Achievement;
    this._achievementsCache[MythronOrb6Achievement.id] = MythronOrb6Achievement;
    this._achievementsCache[MythronOrb7Achievement.id] = MythronOrb7Achievement;

    // store the enabled achievements
    this._enabledAchievementsCache = {};
    return (() => {
      const result = [];
      for (var k in this._achievementsCache) {
        var v = this._achievementsCache[k];
        if (v.enabled) {
          result.push(this._enabledAchievementsCache[k] = v);
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }


  static achievementForIdentifier(identifier) {
    if (!this._achievementsCache) {
      this._generateCache();
    }

    return this._achievementsCache[identifier];
  }

  static getEnabledAchievementsMap() {
    if (!this._enabledAchievementsCache) {
      this._generateCache();
    }

    return this._enabledAchievementsCache;
  }
}
AchievementsFactory.initClass();


module.exports = AchievementsFactory;
