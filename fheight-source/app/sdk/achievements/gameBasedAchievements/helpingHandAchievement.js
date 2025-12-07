/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const GameType = require('app/sdk/gameType');
const i18next = require('i18next');

// Given when a player loses 3 games

class HelpingHandAchievement extends Achievement {
  static initClass() {
    this.id = "helpingHand";
    this.title = i18next.t("achievements.helping_hand_title");
    this.description = i18next.t("achievements.helping_hand_desc");
    this.progressRequired = 10;
    this.rewards =
      {gold: 100};
  }

  static progressForGameDataForPlayerId(gameData,playerId,isUnscored,isDraw) {
    if (isUnscored || !GameType.isFactionXPGameType(gameData.gameType)) {
      return 0;
    }

    for (var player of Array.from(gameData.players)) {
      if (player.playerId === playerId) {
        return 1;
      }
    }

    return 0;
  }
}
HelpingHandAchievement.initClass();

module.exports = HelpingHandAchievement;
