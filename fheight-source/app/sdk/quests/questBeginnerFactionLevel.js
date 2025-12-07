/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const QuestBeginner = require('./questBeginner');
const QuestType = require('./questTypeLookup');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const GameType = require('app/sdk/gameType');
const i18next = require('i18next');

class QuestBeginnerFactionLevel extends QuestBeginner {
  static initClass() {
    this.Identifier = 9906;
  }

  constructor(){
    super(QuestBeginnerFactionLevel.Identifier,i18next.t("quests.quest_beginner_faction_up_title"),[QuestType.Beginner],150);
    this.params["completionProgress"] = 1;
  }

  progressForProgressedFactionData(progressedFactionData){
    if (progressedFactionData && (progressedFactionData.level >= 9)) {
      return 1;
    } else {
      return 0;
    }
  }

  getDescription(){
    return i18next.t("quests.quest_beginner_faction_up_desc");
  }
}
QuestBeginnerFactionLevel.initClass();

//  progressForChallengeId:()->
//    return 1

module.exports = QuestBeginnerFactionLevel;
