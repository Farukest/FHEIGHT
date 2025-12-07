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

class QuestBeginnerCompleteSoloChallenges extends QuestBeginner {
  static initClass() {
    this.Identifier = 9904;
    this.prototype.isRequired =false;
  }

  constructor(){
    super(QuestBeginnerCompleteSoloChallenges.Identifier,i18next.t("quests.quest_beginner_complete_solo_challenges_title"),[QuestType.Beginner],150);
    this.params["completionProgress"] = 3;
  }

  getDescription(){
    return i18next.t("quests.quest_beginner_complete_solo_challenges_desc",{count:this.params["completionProgress"]});
  }
    //return "Complete #{@params["completionProgress"]} Solo Challenges."

  progressForChallengeId(){
    return 1;
  }
}
QuestBeginnerCompleteSoloChallenges.initClass();

module.exports = QuestBeginnerCompleteSoloChallenges;
