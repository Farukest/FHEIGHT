/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const GameType = require('app/sdk/gameType');
const i18next = require('i18next');

// Play your first 20 Season Ranked games.

class EnteringGauntletAchievement extends Achievement {
  static initClass() {
    this.id = "enteringGauntletAchievement";
    this.title = i18next.t("achievements.entering_gauntlet_title");
    this.description = i18next.t("achievements.entering_gauntlet_desc");
    this.progressRequired = 20;
    this.rewards =
      {gauntletTicket: 1};
  }

  static progressForGameDataForPlayerId(gameData,playerId,isUnscored,isDraw) {
    if ((gameData.gameType === GameType.Ranked) && !isUnscored) {
      return 1;
    } else {
      return 0;
    }
  }
}
EnteringGauntletAchievement.initClass();

module.exports = EnteringGauntletAchievement;
