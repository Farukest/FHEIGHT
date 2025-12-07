/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Quest = require('./quest');
const GameStatus = require('app/sdk/gameStatus');
const GameType = require('app/sdk/gameType');
const UtilsGameSession = require('app/common/utils/utils_game_session');

class QuestAlternateDealDamage extends Quest {

  constructor(id,name,typesIn,reward){
    super(id,name,typesIn,reward);
    this.params["completionProgress"] = 40;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      if ((player.playerId === playerId) && GameType.isCompetitiveGameType(gameData.gameType)) {
        return player.totalDamageDealt;
      }
    }
    return 0;
  }

  getDescription(){
    return `Deal ${this.params["completionProgress"]} damage to enemy units.`;
  }
}

module.exports = QuestAlternateDealDamage;
