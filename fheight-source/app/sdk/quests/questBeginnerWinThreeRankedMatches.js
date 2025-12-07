/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const QuestBeginner = require('./questBeginner');
const QuestType = require('./questTypeLookup');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const GameType = require('app/sdk/gameType');

class QuestBeginnerWinThreeRankedMatches extends QuestBeginner {
  static initClass() {
    this.Identifier = 9907;
  }

  constructor(){
    super(QuestBeginnerWinThreeRankedMatches.Identifier,"Rank up",[QuestType.Beginner],150);
    this.params["completionProgress"] = 3;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      // TODO: ensure this allows a player who is ranked playing vs a casual to progress (looks like it should)
      if ((player.playerId === playerId) && player.isWinner && (gameData.gameType === GameType.Ranked)) {
        return 1;
      }
    }
    return 0;
  }

  getDescription(){
    return `Win ${this.params["completionProgress"]} Ranked Games.`;
  }
}
QuestBeginnerWinThreeRankedMatches.initClass();

module.exports = QuestBeginnerWinThreeRankedMatches;
