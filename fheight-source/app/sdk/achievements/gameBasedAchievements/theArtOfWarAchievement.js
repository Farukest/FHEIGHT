/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const GameType = require('app/sdk/gameType');
const i18next = require('i18next');

// Given when a player loses 15 games

class TheArtOfWarAchievement extends Achievement {
  static initClass() {
    this.id = "theArtOfWarAchievement";
    this.title = i18next.t("achievements.art_of_war_title");
    this.description = i18next.t("achievements.art_of_war_desc");
    this.progressRequired = 50;
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
TheArtOfWarAchievement.initClass();

module.exports = TheArtOfWarAchievement;
