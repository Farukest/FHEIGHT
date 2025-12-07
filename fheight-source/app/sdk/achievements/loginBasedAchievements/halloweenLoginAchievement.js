/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');
const i18next = require('i18next');

class HalloweenLoginAchievement extends Achievement {
  static initClass() {
    this.id = "halloweenLoginAchievement";
    this.title = "HAPPY HALLOWEEN";
    this.description = "HERE'S 3 MYTHRON TREATS TO CELEBRATE";
    this.progressRequired = 1;
    this.rewards =
      {giftChests: [GiftCrateLookup.HalloweenLogin]};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2018-10-26T11:00-07:00")) && currentLoginMoment.isBefore(moment.utc("2018-11-02T11:00-07:00"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2018-10-26T11:00-07:00");
  }
}
HalloweenLoginAchievement.initClass();

module.exports = HalloweenLoginAchievement;
