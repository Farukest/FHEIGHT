/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');

class Frostfire2017BonusLoginAchievement extends Achievement {
  static initClass() {
    this.id = "Frostfire2017BonusLoginAchievement";
    this.title = "It's the most festive time of the season!";
    this.description = "Here's 2 special Frostfire Loot Crates full of festive goodies.";
    this.progressRequired = 1;
    this.rewards = {
      giftChests: [
        GiftCrateLookup.FrostfirePurchasable2017,
        GiftCrateLookup.FrostfirePurchasable2017
      ]
    };
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2017-12-25")) && currentLoginMoment.isBefore(moment.utc("2018-01-04"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2017-12-25");
  }
}
Frostfire2017BonusLoginAchievement.initClass();

module.exports = Frostfire2017BonusLoginAchievement;
