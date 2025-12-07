/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');
const i18next = require('i18next');

class FathersDayLoginAchievement extends Achievement {
  static initClass() {
    this.id = "fathersDayLoginAchievement";
    this.title = "HAPPY FATHER'S DAY";
    this.description = "HERE'S 3 SHIM'ZAR ORBS TO CELEBRATE";
    this.progressRequired = 1;
    this.rewards =
      {giftChests: [GiftCrateLookup.FathersDayLogin]};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2018-06-15T11:00-07:00")) && currentLoginMoment.isBefore(moment.utc("2018-06-22T11:00-07:00"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2018-06-15T11:00-07:00");
  }
}
FathersDayLoginAchievement.initClass();

module.exports = FathersDayLoginAchievement;
