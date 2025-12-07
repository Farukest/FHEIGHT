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
const Logger = require('app/common/logger');

class QuestBeginnerPlayPracticeGames extends QuestBeginner {
  static initClass() {
    this.Identifier = 9902;
  }

  constructor(){
    super(QuestBeginnerPlayPracticeGames.Identifier,"Play 3 Practice Games",[QuestType.Beginner],150);
    this.params["completionProgress"] = 3;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      if ((player.playerId === playerId) && (gameData.gameType === GameType.SinglePlayer)) {
        return 1;
      }
    }
    return 0;
  }

  getDescription(){
    return `Play ${this.params["completionProgress"]} games in practice mode.`;
  }
}
QuestBeginnerPlayPracticeGames.initClass();

module.exports = QuestBeginnerPlayPracticeGames;
