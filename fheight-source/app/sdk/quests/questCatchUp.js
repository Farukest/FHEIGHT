/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Quest = require('./quest');
const QuestType = require('./questTypeLookup');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const GameType = require('app/sdk/gameType');
const i18next = require('i18next');

class QuestCatchUp extends Quest {
  static initClass() {
  
    this.Identifier = 20000; // ID to use for this quest
  
    this.prototype.isReplaceable =false; // whether a player can replace this quest
    this.prototype.isCatchUp =true; // defines this as a catchup quest
    this.prototype.goldReward = undefined;
     // This is a changing quantity updated to the database when users gain charges
  }

  constructor(){
    super(QuestCatchUp.Identifier,i18next.t("quests.quest_welcome_back_title"),[QuestType.CatchUp]);
    this.params["completionProgress"] = 3;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    // Gain progress for any games played
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      if ((player.playerId === playerId) && GameType.isCompetitiveGameType(gameData.gameType)) {
        return 1;
      }
    }
    return 0;
  }

  getDescription(){
    return i18next.t("quests.quest_welcome_back_desc",{count:this.params["completionProgress"]});
  }
}
QuestCatchUp.initClass();
    //return "Play #{@params["completionProgress"]} Games."

module.exports = QuestCatchUp;
