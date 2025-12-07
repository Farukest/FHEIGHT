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
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');
const QuestType = require('./questTypeLookup');
const moment = require('moment');

class QuestLegacyLaunch extends Quest {
  static initClass() {
  
    this.Identifier = 40003; // ID to use for this quest
    this.prototype.isReplaceable = false; // whether a player can replace this quest
    this.prototype.giftChests = [GiftCrateLookup.LegacyLaunch];
    this.prototype.rewardDetails = "Unlimited Mode Celebration Crate";
  }

  constructor(){
    super(QuestLegacyLaunch.Identifier,"Unlimited Celebration",[QuestType.Promotional]);
    this.params["completionProgress"] = 7;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      if (gameData.gameType === GameType.Casual) {
        return 1;
      }
    }
    return 0;
  }

  getDescription(){
    return `Play ${this.params["completionProgress"]} Unlimited Mode matches before April 30th UTC`;
  }

  isAvailableOn(momentUtc){
    return momentUtc.isAfter(moment.utc("2018-03-14")) && momentUtc.isBefore(moment.utc("2018-04-30"));
  }

  expiresOn(){
    return moment.utc("2018-03-14");
  }
}
QuestLegacyLaunch.initClass();

module.exports = QuestLegacyLaunch;
