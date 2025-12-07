/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const i18next = require('i18next');

const Achievement = require('app/sdk/achievements/achievement');
const GameType = require('app/sdk/gameType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Factions = require('app/sdk/cards/factionsLookup');
const UtilsGameSession = require('app/common/utils/utils_game_session');

// Play your first 20 Season Ranked games.

class WartechGeneralFaction6Achievement extends Achievement {
  static initClass() {
    this.id = "wartechGeneralFaction6Achievement";
    this.title = i18next.t("achievements.wartech_general_achievement_title",{faction_name:i18next.t("factions.faction_6_abbreviated_name")});
    this.description = i18next.t("achievements.wartech_general_achievement_desc",{faction_name:i18next.t("factions.faction_6_abbreviated_name")});
    this.progressRequired = 10;
    this.rewards = {
      cards: [
        Cards.Faction6.ThirdGeneral
      ]
    };
    this.tracksProgress = true;
  }

  static progressForGameDataForPlayerId(gameData,playerId,isUnscored,isDraw) {
    if (!GameType.isCompetitiveGameType(gameData.gameType)) {
      return 0;
    }

    if (isUnscored) {
      return 0;
    }

    const playerSetupData = UtilsGameSession.getPlayerSetupDataForPlayerId(gameData, playerId);
    const playerFactionId = playerSetupData.factionId;
    if (playerFactionId !== Factions.Faction6) {
      return 0;
    }

    if (UtilsGameSession.getWinningPlayerId(gameData) !== playerId) {
      return 0;
    }

    // If the above all are passed 1 progress made
    return 1;
  }

  static progressForArmoryTransaction(armoryTransactionSku) {
    if (armoryTransactionSku.indexOf("WARTECH_PREORDER_35") !== -1) {
      return 10;
    } else {
      return 0;
    }
  }

  static rewardUnlockMessage(progressMade){
    if ((progressMade == null)) {
      progressMade = 0;
    }

    const progressNeeded =   Math.max(this.progressRequired - progressMade,0);

    return `Win ${progressNeeded} more online matches with Vanar to unlock.`;
  }
}
WartechGeneralFaction6Achievement.initClass();

module.exports = WartechGeneralFaction6Achievement;
