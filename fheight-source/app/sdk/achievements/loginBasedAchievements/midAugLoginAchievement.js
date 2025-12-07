/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');

class MidAugLoginAchievement extends Achievement {
  static initClass() {
    this.id = "midAugLoginAchievement";
    this.title = "Thanks for playing FHEIGHT";
    this.description = "Enjoy 3 Unearthed Prophecy Spirit Orbs on us for being a great community!";
    this.progressRequired = 1;
    this.rewards =
      {giftChests: [GiftCrateLookup.MidAugust2017Login]};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2017-08-15")) && currentLoginMoment.isBefore(moment.utc("Thu Aug 31 2017 18:00:00 GMT+0000"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2017-08-15");
  }
}
MidAugLoginAchievement.initClass();

module.exports = MidAugLoginAchievement;
