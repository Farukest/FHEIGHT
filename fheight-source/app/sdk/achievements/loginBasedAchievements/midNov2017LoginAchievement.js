/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');

class MidNov2017LoginAchievement extends Achievement {
  static initClass() {
    this.id = "midNov2017LoginAchievement";
    this.title = "Immortal Vanguard Expansion Launch";
    this.description = "Enjoy 3 Immortal Vanguard Spirit Orbs to kickstart your collection!";
    this.progressRequired = 1;
    this.rewards =
      {giftChests: [GiftCrateLookup.MidNovember2017Login]};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2017-11-09")) && currentLoginMoment.isBefore(moment.utc("2017-11-28"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2017-11-09");
  }
}
MidNov2017LoginAchievement.initClass();

module.exports = MidNov2017LoginAchievement;
