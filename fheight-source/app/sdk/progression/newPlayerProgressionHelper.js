/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

// lookups
const NewPlayerProgressionStageEnum = require('./newPlayerProgressionStageEnum');
const NewPlayerFeatureLookup = require('./newPlayerProgressionFeatureLookup');

// quests
const QuestBeginnerWinPracticeGames = require('app/sdk/quests/questBeginnerWinPracticeGames');
const QuestBeginnerPlayPracticeGames = require('app/sdk/quests/questBeginnerPlayPracticeGames');
const QuestBeginnerCompleteSoloChallenges = require('app/sdk/quests/questBeginnerCompleteSoloChallenges');
const QuestBeginnerPlayOneQuickMatch = require('app/sdk/quests/questBeginnerPlayOneQuickMatch');
const QuestBeginnerFactionLevel = require('app/sdk/quests/questBeginnerFactionLevel');
const QuestBeginnerWinFourPracticeGames = require('app/sdk/quests/questBeginnerWinFourPracticeGames');
const QuestBeginnerWinThreeQuickMatches = require('app/sdk/quests/questBeginnerWinThreeQuickMatches');
const QuestBeginnerWinThreeRankedMatches = require('app/sdk/quests/questBeginnerWinThreeRankedMatches');
const QuestBeginnerWinTwoPracticeGames = require('app/sdk/quests/questBeginnerWinTwoPracticeGames');
const QuestBeginnerWinOneSeasonGame = require('app/sdk/quests/questBeginnerWinOneSeasonGame');

class NewPlayerProgression {
  static initClass() {
  
    this.featureToCoreStageMapping ={};
  
    this.FinalStage = NewPlayerProgressionStageEnum.FirstFactionLevelingDone;
    this.DailyQuestsStartToGenerateStage = NewPlayerProgressionStageEnum.FirstGameDone;
    this.FirstWinOfTheDayAvailableStage = NewPlayerProgressionStageEnum.FirstGameDone;
  }

  /**
   * Check if a feature is available at a certain stage in new player guided progression.
   * @param  feature    Number(NewPlayerFeatureLookup)      Which feature.
   * @param  stage    Enum(NewPlayerProgressionStageEnum)    Which stage.
   * @returns         Boolean    Is it available.
   */
  static isFeatureAvailableAtStage(feature,stage){
    // make sure to cast any stringts to enum
    stage = NewPlayerProgressionStageEnum[stage];
    const stageWhenFeatureIsAvailable = NewPlayerProgression.featureToCoreStageMapping[feature];

    if ((stageWhenFeatureIsAvailable == null)) {
      return true;
    }

    // return if the current stage is greater or equal to the stage when this feature becomes available
    return stage.value >= stageWhenFeatureIsAvailable.value;
  }

  /**
   * Get quests for the current stage in new user guided progression.
   * @returns     Array    array of quest object instances.
   */
  static questsForStage(stage){
    stage = NewPlayerProgressionStageEnum[stage];
    switch (stage) {
      case NewPlayerProgressionStageEnum.TutorialDone:
        return [ new QuestBeginnerWinPracticeGames() ];
      case NewPlayerProgressionStageEnum.FirstPracticeDuelDone:
        return [ new QuestBeginnerWinTwoPracticeGames() ];
      case NewPlayerProgressionStageEnum.ExtendedPracticeDone:
        return [ new QuestBeginnerWinOneSeasonGame() ];
      case NewPlayerProgressionStageEnum.FirstGameDone:
        return [ new QuestBeginnerCompleteSoloChallenges(), new QuestBeginnerFactionLevel() ];
    }
  }
}
NewPlayerProgression.initClass();

// feature to stage mapping
const fMap = NewPlayerProgression.featureToCoreStageMapping;
// main menu
fMap[NewPlayerFeatureLookup.MainMenuCollection] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.MainMenuWatch] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.MainMenuCodex] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.MainMenuCrates] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.MainMenuSpiritOrbs] = NewPlayerProgressionStageEnum.TutorialDone;
// utility menu
fMap[NewPlayerFeatureLookup.UtilityMenuFriends] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.UtilityMenuQuests] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.UtilityMenuShop] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.UtilityMenuDailyChallenge] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.UtilityMenuFreeCardOfTheDay] = NewPlayerProgressionStageEnum.TutorialDone;
// play modes
fMap[NewPlayerFeatureLookup.PlayModeFriendly] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.PlayModePractice] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.PlayModeSoloChallenges] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.PlayModeBossBattle] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.PlayModeCasual] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.PlayModeRanked] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.PlayModeGauntlet] = NewPlayerProgressionStageEnum.TutorialDone;
// misc
fMap[NewPlayerFeatureLookup.FirstWinOfTheDay] = NewPlayerProgressionStageEnum.TutorialDone;
fMap[NewPlayerFeatureLookup.Announcements] = NewPlayerProgressionStageEnum.TutorialDone;

module.exports = NewPlayerProgression;
