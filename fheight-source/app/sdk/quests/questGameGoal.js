/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Quest = require('./quest');
const GameStatus = require('app/sdk/gameStatus');
const GameType = require('app/sdk/gameType');
const UtilsGameSession = require('app/common/utils/utils_game_session');

/*
  QuestGameGoal - creates a quest that makes progress through a goalTester
*/

class QuestGameGoal extends Quest {
  static initClass() {
    this.prototype.description = undefined; // user visible description of quest
    // goalTester format : (gameSessionData,playerIdString) -> return questProgress
    this.prototype.goalTester = undefined;
     // see format above
  }

  // numGamesRequiredToSatisfyQuest - how many times the goal must be met to award quest gold
  constructor(id, name, typesIn, reward, numGamesRequiredToSatisfyQuest, description, goalTester){
    super(id,name,typesIn,reward);
    this.params["completionProgress"] = numGamesRequiredToSatisfyQuest;
    this.description = description;
    this.goalTester = goalTester;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      if ((player.playerId === playerId) && GameType.isCompetitiveGameType(gameData.gameType)) {
        return this.goalTester(gameData,playerId);
      }
    }
    return 0;
  }

  getDescription(){
    return this.description;
  }
}
QuestGameGoal.initClass();

module.exports = QuestGameGoal;
