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

class QuestBeginnerWinThreeQuickMatches extends QuestBeginner {
  static initClass() {
    this.Identifier = 9908;
    this.prototype.isRequired = false;
  }

  // TODO: needs to unlock codex somehow
  constructor(){
    super(QuestBeginnerWinThreeQuickMatches.Identifier,"Lore master",[QuestType.Beginner],150);
    this.params["completionProgress"] = 3;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      if ((player.playerId === playerId) && player.isWinner && (gameData.gameType === GameType.Casual)) {
        return 1;
      }
    }
    return 0;
  }

  getDescription(){
    return `Win ${this.params["completionProgress"]} games in Quick Match.`;
  }
}
QuestBeginnerWinThreeQuickMatches.initClass();

module.exports = QuestBeginnerWinThreeQuickMatches;
