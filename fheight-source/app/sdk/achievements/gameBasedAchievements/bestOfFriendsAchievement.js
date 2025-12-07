/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const GameType = require('app/sdk/gameType');
const i18next = require('i18next');

// Play your first game with a Friend.

class BestOfFriendsAchievement extends Achievement {
  static initClass() {
    this.id = "bestOfFriends";
    this.title = i18next.t("achievements.best_of_friends_title");
    this.description = i18next.t("achievements.best_of_friends_desc");
    this.progressRequired = 1;
    this.rewards =
      {spiritOrb: 1};
  }

  static progressForGameDataForPlayerId(gameData,playerId,isUnscored,isDraw) {
    if (gameData.gameType === GameType.Friendly) {
      return 1;
    } else {
      return 0;
    }
  }
}
BestOfFriendsAchievement.initClass();

module.exports = BestOfFriendsAchievement;
