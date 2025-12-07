/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const _ = require('underscore');
const Cards = require('app/sdk/cards/cardsLookupComplete');

const ChallengeCategory = require('./challengeCategory');

const Sandbox = require('./sandbox');
const SandboxDeveloper = require('./sandboxDeveloper');
const Lesson1 = require('./tutorial/lesson1');
const Lesson2 = require('./tutorial/lesson2');
const Lesson4 = require('./tutorial/lesson4');
const BeginnerLyonarChallenge1 = require('./lyonar/BeginnerLyonarChallenge1');
const BeginnerLyonarChallenge2 = require('./lyonar/BeginnerLyonarChallenge2');
const BeginnerRangedChallenge1 = require('./tutorial/BeginnerRangedChallenge1');
const BeginnerFlyingChallenge1 = require('./tutorial/BeginnerFlyingChallenge1');
const BeginnerVanarChallenge1 = require('./vanar/BeginnerVanarChallenge1');
const BeginnerAbyssianChallenge1 = require('./abyssian/BeginnerAbyssianChallenge1');
const BeginnerMagmarChallenge1 = require('./magmar/BeginnerMagmarChallenge1');
const BeginnerVetruvianChallenge1 = require('./vetruvian/BeginnerVetruvianChallenge1');
const BeginnerMagmarChallenge2 = require('./magmar/BeginnerMagmarChallenge2');
const BeginnerAbyssianChallenge2 = require('./abyssian/BeginnerAbyssianChallenge2');
const BeginnerSonghaiChallenge1 = require('./songhai/BeginnerSonghaiChallenge1');
const MediumMagmarChallenge1 = require('./magmar/MediumMagmarChallenge1');
const MediumAbyssianChallenge1 = require('./abyssian/MediumAbyssianChallenge1');
const BeginnerSonghaiChallenge2 = require('./songhai/BeginnerSonghaiChallenge2');
const BeginnerVanarChallenge2 = require('./vanar/BeginnerVanarChallenge2');
const BeginnerAbyssianChallenge3 = require('./abyssian/BeginnerAbyssianChallenge3');
const BeginnerVetruvianChallenge2 = require('./vetruvian/BeginnerVetruvianChallenge2');
const BeginnerVanarChallenge3 = require('./vanar/BeginnerVanarChallenge3');
const BeginnerSonghaiChallenge3 = require('./songhai/BeginnerSonghaiChallenge3');
const BeginnerLyonarChallenge3 = require('./lyonar/BeginnerLyonarChallenge3');
const MediumSonghaiChallenge1 = require('./songhai/MediumSonghaiChallenge1');
const MediumVetruvianChallenge1 = require('./vetruvian/MediumVetruvianChallenge1');
const BeginnerSonghaiChallenge4 = require('./songhai/BeginnerSonghaiChallenge4');
const BeginnerVetruvianChallenge3 = require('./vetruvian/BeginnerVetruvianChallenge3');
const BeginnerAbyssianChallenge4 = require('./abyssian/BeginnerAbyssianChallenge4');
const BeginnerMagmarChallenge3 = require('./magmar/BeginnerMagmarChallenge3');
const BeginnerVanarChallenge4 = require('./vanar/BeginnerVanarChallenge4');
const AdvancedLyonarChallenge1 = require('./lyonar/AdvancedLyonarChallenge1');
const AdvancedSonghaiChallenge1 = require('./songhai/AdvancedSonghaiChallenge1');
const AdvancedVetruvianChallenge1 = require('./vetruvian/AdvancedVetruvianChallenge1');
const AdvancedAbyssianChallenge1 = require('./abyssian/AdvancedAbyssianChallenge1');
const AdvancedMagmarChallenge1 = require('./magmar/AdvancedMagmarChallenge1');
const AdvancedVanarChallenge1 = require('./vanar/AdvancedVanarChallenge1');
const BeginnerAbyssianChallenge5 = require('./abyssian/BeginnerAbyssianChallenge5');
const BeginnerVetruvianChallenge4 = require('./vetruvian/BeginnerVetruvianChallenge4');
const BeginnerMagmarChallenge4 = require('./magmar/BeginnerMagmarChallenge4');
const AdvancedVanarChallenge2 = require('./vanar/AdvancedVanarChallenge2');
const MediumVetruvianChallenge2 = require('./vetruvian/MediumVetruvianChallenge2');
const MediumSonghaiChallenge2 = require('./songhai/MediumSonghaiChallenge2');
const AdvancedVetruvianChallenge2 = require('./vetruvian/AdvancedVetruvianChallenge2');
const AdvancedLyonarChallenge2 = require('./lyonar/AdvancedLyonarChallenge2');
const BeginnerSonghaiChallenge5 = require('./songhai/BeginnerSonghaiChallenge5');
const BeginnerVetruvianChallenge5 = require('./vetruvian/BeginnerVetruvianChallenge5');
const BeginnerAbyssianChallenge6 = require('./abyssian/BeginnerAbyssianChallenge6');
const BeginnerVanarChallenge5 = require('./vanar/BeginnerVanarChallenge5');
const BeginnerLyonarChallenge4 = require('./lyonar/BeginnerLyonarChallenge4');

class ChallengeFactory {
  static initClass() {
  
    this._challengeCardRewards = null; // {Array} card ids to give user 3 copies of
    this._challengeGoldRewards = null; // {integer} quantity of gold to give user
    this._challengeSpiritRewards = null; // {integer} quantity of spirit to give user
    // {array} contains a quantity of booster packs to give the user, each element is the additional properties the booster should have, for a basic pack use {}
    this._challengeBoosterPackRewards = null;
  }

  static challengeForType(type) {
    if (type === Sandbox.type) {
      return new Sandbox();
    }

    if (type === SandboxDeveloper.type) {
      return new SandboxDeveloper();
    }

    // Find any matching tutorial lesson
    const matchingTutorialChallenge = _.find(this.getAllChallenges(),challenge => challenge.type === type);
    if (matchingTutorialChallenge != null) {
      return matchingTutorialChallenge;
    }

    // no challenge found
    return console.error(`ChallengeFactory.challengeForType - Unknown type: ${type}`.red);
  }

  static getAllChallenges() {
    return [
      new Lesson1(), //Knowledge is Power
      new Lesson2(), //Ready Player Two
      new Lesson4(), //The Artifact Itself

      //keywords Elemental Secrets
      new BeginnerFlyingChallenge1(), //Earn Your Wings
      new BeginnerSonghaiChallenge4(), // Leaf on the Wind
      new BeginnerVetruvianChallenge3(), //Call to Action
      new BeginnerAbyssianChallenge4(), //Creeping Darkness
      new BeginnerMagmarChallenge3(), //Crushing Reach

      //beginner2 Form of Focus
      new BeginnerAbyssianChallenge1(), //Shadow Ritual
      new BeginnerSonghaiChallenge5(), //Eye of the Tiger
      new BeginnerMagmarChallenge1(), //Beast of War
      new BeginnerVetruvianChallenge1(), //Ready for a Blast
      new BeginnerLyonarChallenge2(), //Divine Zeal

      //starter Path of Champions
      new BeginnerVetruvianChallenge5(), //Ties that Bind
      new BeginnerAbyssianChallenge6(), //Alluring Demise
      new BeginnerVanarChallenge5(), //Behind Enemy Lines
      new BeginnerLyonarChallenge4(), //Honor the Fallen
      new BeginnerSonghaiChallenge2(), //Path of the Mistwalkers

      //beginner The Realm of Dreams
      new BeginnerLyonarChallenge1(), //Swiftness of Movement
      new BeginnerAbyssianChallenge5(), //Gifts Unforgiven
      new BeginnerMagmarChallenge4(), //Shattered Memories
      new BeginnerVetruvianChallenge4(), //Bad to the Bone
      new BeginnerVanarChallenge4(), //Approaching Cold

      //advanced The Vault of Generations
      new BeginnerVanarChallenge2(), //Frozen Shadows
      new MediumVetruvianChallenge2(), //Winds of Change
      new BeginnerRangedChallenge1(), //Dead Center
      new BeginnerAbyssianChallenge3(), //Power Overwhelming
      new BeginnerSonghaiChallenge1(), //Evolution to Ash

      //expert Trials of the Seven Stars
      new BeginnerAbyssianChallenge2(), //Engulf the Flame
      new BeginnerMagmarChallenge2(), //Breaking the Bad
      new BeginnerVanarChallenge3(), //Final Whispers
      new BeginnerVetruvianChallenge2(), //Relics Reclaimed
      new AdvancedLyonarChallenge2(), //Inspiring Presence

      //#vault1 Adeptus Gate
      new MediumSonghaiChallenge1(), //Songhai Shuffle
      new BeginnerVanarChallenge1(), //Freezing Sand
      new MediumMagmarChallenge1(), //In a Frenzy
      new MediumAbyssianChallenge1(), //Shadows of Light
      new AdvancedVetruvianChallenge2(), //Wishful Thinking

      //#vault2 Sacred Path of Aperion
      new MediumVetruvianChallenge1(), //Knowledge of the Scions
      new BeginnerSonghaiChallenge3(), //Chaos Control
      new BeginnerLyonarChallenge3(), //Power of Wisdom
      new AdvancedVanarChallenge2(), //Ice Box
      new MediumSonghaiChallenge2(), //Jack of Blades

      //contest1 Tacticians Contest
      new AdvancedLyonarChallenge1(), //Desperation
      new AdvancedSonghaiChallenge1(), //The Stronger Scythe
      new AdvancedVetruvianChallenge1(), //Patience

      //contest2 Contest of Grandmasters
      new AdvancedAbyssianChallenge1(), //Malediction
      new AdvancedMagmarChallenge1(), //Mind Game
      new AdvancedVanarChallenge1(), //The Locked Library

      // sandbox
      new Sandbox(),
      new SandboxDeveloper()
    ];
  }

  static getAllChallengeCategories() {
    // TODO: kv search over cats
    // return [ChallengeCategory.tutorial, ChallengeCategory.keywords, ChallengeCategory.beginner2, ChallengeCategory.starter, ChallengeCategory.beginner, ChallengeCategory.advanced, ChallengeCategory.expert, ChallengeCategory.vault1, ChallengeCategory.vault2, ChallengeCategory.contest1, ChallengeCategory.contest2]
    return [ChallengeCategory.tutorial, ChallengeCategory.keywords, ChallengeCategory.beginner2, ChallengeCategory.starter, ChallengeCategory.beginner, ChallengeCategory.advanced, ChallengeCategory.expert];
  }

  static getCategoryForType(categoryType) {
    return _.find(this.getAllChallengeCategories(), category => category.type === categoryType);
  }

  static getChallengesForCategoryType(challengeCategoryType) {
    const allChallenges = this.getAllChallenges();
    return _.filter(allChallenges, challenge => challenge.categoryType === challengeCategoryType);
  }

  static getChallengeForType(challengeType) {
    return _.find(this.getAllChallenges(), challenge => challenge.type === challengeType);
  }

  static _buildChallengeRewards() {
    if (this._challengeCardRewards && this._challengeGoldRewards) {
      return;
    }

    this._challengeCardRewards = {};
    this._challengeGoldRewards = {};
    this._challengeSpiritRewards = {};
    this._challengeBoosterPackRewards = {};

    /*
    * EXAMPLE rewards for a lesson
    * This will make MadeUpLesson give 3 True strikes, 3 dragon larks, 1000 gold, 1000 spirit and 2 normal booster packs
    @_challengeCardRewards[MadeUpLesson.type] = [Cards.Spell.TrueStrike, Cards.Neutral.SpottedDragonlark]
    @_challengeGoldRewards[MadeUpLesson.type] = 1000
    @_challengeSpiritRewards[MadeUpLesson.type] = 1000
    @_challengeBoosterPackRewards[MadeUpLesson.type] = [{},{}]
    */

//    @_challengeGoldRewards[Lesson1.type] = 25
//
//    @_challengeGoldRewards[Lesson2.type] = 25
//
//    @_challengeGoldRewards[Lesson3.type] = 25
//
//    @_challengeGoldRewards[Lesson4.type] = 25

    this._challengeGoldRewards[BeginnerFlyingChallenge1.type] = 5;
    this._challengeGoldRewards[BeginnerSonghaiChallenge4.type] = 5;
    this._challengeGoldRewards[BeginnerVetruvianChallenge3.type] = 10;
    this._challengeGoldRewards[BeginnerAbyssianChallenge4.type] = 10;
    this._challengeGoldRewards[BeginnerMagmarChallenge3.type] = 10;

    this._challengeGoldRewards[BeginnerAbyssianChallenge1.type] = 10;
    this._challengeGoldRewards[BeginnerSonghaiChallenge5.type] = 5;
    this._challengeGoldRewards[BeginnerMagmarChallenge1.type] = 5;
    this._challengeGoldRewards[BeginnerVetruvianChallenge1.type] = 5;
    this._challengeGoldRewards[BeginnerLyonarChallenge2.type] = 10;

    this._challengeGoldRewards[BeginnerVetruvianChallenge5.type] = 5;
    this._challengeGoldRewards[BeginnerAbyssianChallenge6.type] = 5;
    this._challengeGoldRewards[BeginnerVanarChallenge5.type] = 10;
    this._challengeGoldRewards[BeginnerLyonarChallenge4.type] = 5;
    this._challengeGoldRewards[BeginnerSonghaiChallenge2.type] = 10;

    this._challengeGoldRewards[BeginnerLyonarChallenge1.type] = 5;
    this._challengeGoldRewards[BeginnerAbyssianChallenge5.type] = 10;
    this._challengeGoldRewards[BeginnerMagmarChallenge4.type] = 5;
    this._challengeGoldRewards[BeginnerVetruvianChallenge4.type] = 5;
    this._challengeGoldRewards[BeginnerVanarChallenge4.type] = 10;

    this._challengeGoldRewards[BeginnerVanarChallenge2.type] = 5;
    this._challengeGoldRewards[MediumVetruvianChallenge2.type] = 5;
    this._challengeGoldRewards[BeginnerRangedChallenge1.type] = 5;
    this._challengeGoldRewards[BeginnerAbyssianChallenge3.type] = 5;
    this._challengeGoldRewards[BeginnerSonghaiChallenge1.type] = 5;

    this._challengeGoldRewards[BeginnerAbyssianChallenge2.type] = 5;
    this._challengeGoldRewards[BeginnerMagmarChallenge2.type] = 5;
    this._challengeGoldRewards[BeginnerVanarChallenge3.type] = 5;
    this._challengeGoldRewards[BeginnerVetruvianChallenge2.type] = 5;
    this._challengeGoldRewards[AdvancedLyonarChallenge2.type] = 5;

    this._challengeGoldRewards[MediumSonghaiChallenge1.type] = 5;
    this._challengeGoldRewards[BeginnerVanarChallenge1.type] = 5;
    this._challengeGoldRewards[MediumMagmarChallenge1.type] = 5;
    this._challengeGoldRewards[MediumAbyssianChallenge1.type] = 5;
    this._challengeGoldRewards[AdvancedVetruvianChallenge2.type] = 5;

    this._challengeGoldRewards[MediumVetruvianChallenge1.type] = 5;
    this._challengeGoldRewards[BeginnerSonghaiChallenge3.type] = 5;
    this._challengeGoldRewards[BeginnerLyonarChallenge3.type] = 5;
    this._challengeGoldRewards[AdvancedVanarChallenge2.type] = 5;
    this._challengeGoldRewards[MediumSonghaiChallenge2.type] = 5;

    this._challengeGoldRewards[AdvancedLyonarChallenge1.type] = 5;
    this._challengeGoldRewards[AdvancedSonghaiChallenge1.type] = 5;
    this._challengeGoldRewards[AdvancedVetruvianChallenge1.type] = 5;

    this._challengeGoldRewards[AdvancedAbyssianChallenge1.type] = 5;
    this._challengeGoldRewards[AdvancedMagmarChallenge1.type] = 5;
    return this._challengeGoldRewards[AdvancedVanarChallenge1.type] = 5;
  }


  static getCardIdsRewardedForChallengeType(type) {
    this._buildChallengeRewards();
    return _.clone(this._challengeCardRewards[type]);
  }

  static getGoldRewardedForChallengeType(type) {
    this._buildChallengeRewards();
    return this._challengeGoldRewards[type];
  }

  static getSpiritRewardedForChallengeType(type) {
    this._buildChallengeRewards();
    return this._challengeSpiritRewards[type];
  }

  static getBoosterPacksRewardedForChallengeType(type) {
    this._buildChallengeRewards();
    return _.clone(this._challengeBoosterPackRewards[type]);
  }

  static getFactionUnlockedRewardedForChallengeType(type){
    // end of tutorial unlocks Lyonar faction
    if (type === Lesson4.type) {
      return 1;
    }
  }

  static getRewardsObjectForChallengeType(type) {
    return {
      goldReward: this.getGoldRewardedForChallengeType(type),
      cardRewards: this.getCardIdsRewardedForChallengeType(type),
      spiritReward: this.getSpiritRewardedForChallengeType(type),
      boosterPackRewards: this.getBoosterPacksRewardedForChallengeType(type),
      factionsUnlockedRewards: this.getFactionUnlockedRewardedForChallengeType(type)
    };
  }
}
ChallengeFactory.initClass();


module.exports = ChallengeFactory;
