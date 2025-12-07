/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class Achievement {
  static initClass() {
  
    this.id = null; // lookup id for achievement
    this.title = null; // player visible title of achievement
    this.description = null; // player visible description of achievement
    this.progressRequired = null; // integer of how many sub completions are required to finish achievement
    // NOTE: rewards can only be of one type (cards, gold, spirit, booster,etc) for now due to UI
    this.rewards = undefined; // object representing rewards
    // example rewards:
  //    gauntletTicket: 1
  //    gold: 100
  //    spirit: 100
  //    spiritOrb: 1
    this.enabled = true;
  }


  constructor() {}
    // No need initialize this object

  // returns the amount of progress made by completing a given quest ID
  static progressForCompletingQuestId(questId) {}
    // Extend in subclass

  // returns how much progress is made for completing the passed in game data
  static progressForGameDataForPlayerId(gameData,playerId,isUnscored,isDraw) {}
    // Extend in subclass

  // returns how much progress is made by crafting the passed in cardId
  static progressForCrafting(cardId) {}
    // extend in subclass

  // returns how much progress is made by disenchanting the passed in cardId
  static progressForDisenchanting(cardId) {}
    // extend in subclass

  // returns how much progress is made by owning the passed in card collection
  static progressForCardCollection(cardCollection, allCards) {}
    // extend in subclass

  // returns progress made by achieving the passed in rank
  static progressForAchievingRank(rank) {}
    // extend in subclass

  // returns progress made by performing armory transaction
  static progressForArmoryTransaction(armoryTransactionSku) {}
    // extend in subclass

  // returns progress made by a referral program event
  static progressForReferralEvent(referralEventType){}
    // extend in subclass

  // returns progress made by reaching a state of faction progression
  static progressForFactionProgression(factionProgressionData) {}
    // extend in subclass

  // returns progress made by receiving a loot crate
  static progressForReceivingCosmeticChest(cosmeticChestType) {}
    // extend in subclass

  // returns progress made by logging in at a time
  static progressForLoggingIn(currentLoginMoment) {}
    // extend in subclass

  // returns when a login achievement begins as a moment
  static getLoginAchievementStartsMoment() {
    // extend in subclass
    return null;
  }

  // returns a user facing string for how to unlock rewards
  static rewardUnlockMessage(progressMade) {
    // extend in subclass
    return "";
  }

  // returns progress made by opening spirit orb
  static progressForOpeningSpiritOrb(orbSet) {}
    // extend in subclass


  static getId(){
    return this.id;
  }

  static getTitle(){
    return this.title;
  }

  static getDescription(){
    return this.description;
  }

  static getRewards(){
    return this.rewards;
  }
}
Achievement.initClass();



module.exports = Achievement;
