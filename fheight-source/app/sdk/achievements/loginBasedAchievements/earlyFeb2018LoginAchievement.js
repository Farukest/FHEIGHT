/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');
const i18next = require('i18next');

class EarlyFeb2018LoginAchievement extends Achievement {
  static initClass() {
    this.id = "earlyFeb2018LoginAchievement";
    this.title = i18next.t("achievements.early_feb_2018_login_achievement_title");
    this.description = i18next.t("achievements.early_feb_2018_login_achievement_desc");
    this.progressRequired = 1;
    this.rewards =
      {giftChests: [GiftCrateLookup.EarlyFebruary2018Login]};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2018-01-29")) && currentLoginMoment.isBefore(moment.utc("2018-03-01"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2018-01-29");
  }
}
EarlyFeb2018LoginAchievement.initClass();

module.exports = EarlyFeb2018LoginAchievement;
