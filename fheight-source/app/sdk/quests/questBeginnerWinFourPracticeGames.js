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

class QuestBeginnerWinFourPracticeGames extends QuestBeginner {
  static initClass() {
    this.Identifier = 9905;
  }

  constructor(){
    super(QuestBeginnerWinFourPracticeGames.Identifier,"Win 4 Practice Games",[QuestType.Beginner],150);
    this.params["completionProgress"] = 4;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      Logger.module("Quests").debug(`QuestBeginnerWinFourPracticeGames checking ${player.playerId} game type ${playerSetupData.gameType} winner: ${player.isWinner}`);
      if ((player.playerId === playerId) && player.isWinner && (gameData.gameType === GameType.SinglePlayer)) {
        return 1;
      }
    }
    return 0;
  }

  getDescription(){
    return `Win ${this.params["completionProgress"]} game in practice mode.`;
  }
}
QuestBeginnerWinFourPracticeGames.initClass();

module.exports = QuestBeginnerWinFourPracticeGames;
