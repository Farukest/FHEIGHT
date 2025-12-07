/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');

class BNPromoAchievement extends Achievement {
  static initClass() {
    this.id = "bnPromoAchievement";
    this.title = "BANDAI NAMCO PARTNERSHIP EVENT";
    this.description = "Here's a FREE GIFT CRATE to celebrate our new partnership!";
    this.progressRequired = 1;
    this.rewards =
      {giftChests: [GiftCrateLookup.BNLogin2017]};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2017-07-03")) && currentLoginMoment.isBefore(moment.utc("2017-08-01"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2017-07-01 00:01");
  }
}
BNPromoAchievement.initClass();

module.exports = BNPromoAchievement;
