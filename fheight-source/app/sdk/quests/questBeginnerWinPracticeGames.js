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
const i18next = require('i18next');

class QuestBeginnerWinPracticeGames extends QuestBeginner {
  static initClass() {
    this.Identifier = 9901;
    this.prototype.spiritOrbsReward = 1;
    this.prototype.goldReward = null;
     // Awards a Spirit Orb instead of Gold. Adding gold messes up the UI.
  }

  constructor(){
    super(QuestBeginnerWinPracticeGames.Identifier,i18next.t("quests.quest_beginner_win_practice_games_title",{count:1}),[QuestType.Beginner],150);
    this.params["completionProgress"] = 1;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      Logger.module("Quests").debug(`QuestBeginnerWinPracticeGames checking ${player.playerId} game type ${gameData.gameType} winner: ${player.isWinner}`);
      if ((player.playerId === playerId) && player.isWinner && (gameData.gameType === GameType.SinglePlayer)) {
        return 1;
      }
    }
    return 0;
  }

  getDescription(){
    return i18next.t("quests.quest_beginner_win_practice_games_description",{count:this.params["completionProgress"]});
  }
}
QuestBeginnerWinPracticeGames.initClass();

module.exports = QuestBeginnerWinPracticeGames;
