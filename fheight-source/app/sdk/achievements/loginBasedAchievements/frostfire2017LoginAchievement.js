/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');

class Frostfire2017LoginAchievement extends Achievement {
  static initClass() {
    this.id = "frostfire2017LoginAchievement";
    this.title = "Frostfire Festival Has Arrived!";
    this.description = "Here's a special Frostfire Loot Crate full of festive goodies.";
    this.progressRequired = 1;
    this.rewards = {
      giftChests: [
        GiftCrateLookup.FrostfirePurchasable2017
      ]
    };
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2017-11-29")) && currentLoginMoment.isBefore(moment.utc("2017-12-22"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2017-11-29");
  }
}
Frostfire2017LoginAchievement.initClass();

module.exports = Frostfire2017LoginAchievement;
