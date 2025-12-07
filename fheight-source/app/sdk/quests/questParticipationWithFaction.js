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
const FactionsLookup = require('app/sdk/cards/factionsLookup');
const FactionFactory = require('app/sdk/cards/factionFactory');
const i18next = require('i18next');

class QuestParticipationWithFaction extends Quest {
  static initClass() {
  
    this.prototype.factionId =null;
  }

  constructor(id,typesIn,reward,factionId){
    this.getFactionId = this.getFactionId.bind(this);
    this.factionId = factionId;
    const faction = FactionFactory.factionForIdentifier(this.factionId);
    const name = i18next.t("quests.quest_faction_games_title", { faction_name: faction.short_name });
    super(id,name,typesIn,reward);
    this.params["factionId"] = this.factionId;
    this.params["completionProgress"] = 4;
  }

  _progressForGameDataForPlayerId(gameData,playerId){
    for (var player of Array.from(gameData.players)) {
      var playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, player.playerId);
      if ((player.playerId === playerId) && (playerSetupData.factionId === this.getFactionId()) && GameType.isCompetitiveGameType(gameData.gameType)) {
        return 1;
      }
    }
    return 0;
  }

  getFactionId(){
    return this.factionId;
  }

  getDescription(){
    const faction = FactionFactory.factionForIdentifier(this.factionId);
    if (this.getFactionId() === FactionsLookup.Abyssian) {
      //TODO: Localization issue?
      //return "Play #{@params["completionProgress"]} online games with an #{@factionName} Deck."
      return i18next.t("quests.quest_faction_abyss_games_desc",{count:this.params["completionProgress"],faction:faction.short_name});
    } else {
      return i18next.t("quests.quest_faction_games_desc",{count:this.params["completionProgress"],faction:faction.short_name});
    }
  }
}
QuestParticipationWithFaction.initClass();
      //return "Play #{@params["completionProgress"]} online games with a #{@factionName} Deck."

module.exports = QuestParticipationWithFaction;
