/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');
const i18next = require('i18next');

class ChristmasLoginAchievement extends Achievement {
  static initClass() {
    this.id = "christmasLoginAchievement";
    this.title = "HAPPY WINTER HOLIDAYS";
    this.description = "ALL THE SNOWCHASERS HAVE GONE OUT TO PLAY, SO TAKE THESE GIFTS TO CELEBRATE THIS SPECIAL DAY";
    this.progressRequired = 1;
    this.rewards =
      {giftChests: [GiftCrateLookup.ChristmasLogin]};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2018-12-21T11:00-08:00")) && currentLoginMoment.isBefore(moment.utc("2018-12-28T11:00-08:00"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2018-12-21T11:00-08:00");
  }
}
ChristmasLoginAchievement.initClass();

module.exports = ChristmasLoginAchievement;
