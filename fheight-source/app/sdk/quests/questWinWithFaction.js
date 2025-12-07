/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Quest = require('./quest');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const GameType = require('app/sdk/gameType');

class QuestWinWithFaction extends Quest {
  static initClass() {
  
    this.prototype.factionId =null;
    this.prototype.factionName =null;
  }

  constructor(id,name,typesIn,reward,factionId,factionName){
    super(id,name,typesIn,reward);
    this.factionId = factionId;
    this.factionName = factionName;
    this.params["factionId"] = this.factionId;
    this.params["completionProgress"] = 2;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      if ((player.playerId === playerId) && player.isWinner && (playerSetupData.factionId === this.getFactionId()) && GameType.isCompetitiveGameType(gameData.gameType)) {
        return 1;
      }
    }
    return 0;
  }

  getFactionId(){
    return this.factionId;
  }

  getDescription(){
    return `Win ${this.params["completionProgress"]} games with a ${this.factionName} Deck.`;
  }
}
QuestWinWithFaction.initClass();

module.exports = QuestWinWithFaction;
