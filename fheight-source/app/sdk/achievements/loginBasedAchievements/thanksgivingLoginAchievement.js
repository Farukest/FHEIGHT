/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');
const i18next = require('i18next');

class ThanksgivingLoginAchievement extends Achievement {
  static initClass() {
    this.id = "thanksgivingLoginAchievement";
    this.title = "HAPPY THANKSGIVING";
    this.description = "WE'RE THANKFUL TODAY FOR OUR LOVING FANS, SO WE'RE GIVING BACK WITH A SPECIAL GIFT";
    this.progressRequired = 1;
    this.rewards =
      {giftChests: [GiftCrateLookup.ThanksgivingLogin]};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2018-11-16T11:00-08:00")) && currentLoginMoment.isBefore(moment.utc("2018-11-23T11:00-08:00"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2018-11-16T11:00-08:00");
  }
}
ThanksgivingLoginAchievement.initClass();

module.exports = ThanksgivingLoginAchievement;
