/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');
const GiftCrateLookup = require('app/sdk/giftCrates/giftCrateLookup');
const i18next = require('i18next');

class CoreshatterLoginAchievement extends Achievement {
  static initClass() {
    this.id = "coreshatterLoginAchievement";
    this.title = "Trials of Mythron Expansion Launch";
    this.description = "Enjoy 3 Trials of Mythron Spirit Orbs to kickstart your collection!";
    this.progressRequired = 1;
    this.rewards =
      {giftChests: [GiftCrateLookup.CoreshatterLogin]};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    if ((currentLoginMoment !== null) && currentLoginMoment.isAfter(moment.utc("2018-03-14")) && currentLoginMoment.isBefore(moment.utc("2018-04-30"))) {
      return 1;
    } else {
      return 0;
    }
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2018-03-14");
  }
}
CoreshatterLoginAchievement.initClass();

module.exports = CoreshatterLoginAchievement;
