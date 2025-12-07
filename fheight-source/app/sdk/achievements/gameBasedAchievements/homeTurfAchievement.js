/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const GameType = require('app/sdk/gameType');
const CosmeticsLookup = require('app/sdk/cosmetics/cosmeticsLookup');
const CosmeticsTypeLookup = require('app/sdk/cosmetics/cosmeticsTypeLookup');
const _ = require('underscore');

class HomeTurfAchievement extends Achievement {
  static initClass() {
    this.id = "homeTurf";
    this.title = "Home Turf";
    this.description = "You've won 5 games as Player One. Enjoy a free Premium Battle Map on us!";
    this.progressRequired = 5;
    this.enabled = false;
    this.rewards = {
      newRandomCosmetics: [
        { type: CosmeticsTypeLookup.BattleMap }
      ]
    };
  }

  static progressForGameDataForPlayerId(gameData,playerId,isUnscored,isDraw) {
    if (isUnscored || !GameType.isFactionXPGameType(gameData.gameType)) {
      return 0;
    }

    if ((gameData.players[0].playerId === playerId) && gameData.players[0].isWinner) {
      return 1;
    }

    return 0;
  }
}
HomeTurfAchievement.initClass();

module.exports = HomeTurfAchievement;
