/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const moment = require('moment');

// This achievement exists so we can give new players a head start on their collection.
class NewPlayerSpiritLoginAchievement extends Achievement {
  static initClass() {
    this.id = "newPlayerSpiritLoginAchievement";
    this.title = "Welcome to FHEIGHT!";
    this.description = "Use Spirit to craft cards in the Collection menu.";
    this.progressRequired = 1;
    this.rewards =
      {spirit: 50000};
  
    this.enabled = true;
  }

  static progressForLoggingIn(currentLoginMoment) {
    return 1;
  }

  static getLoginAchievementStartsMoment() {
    return moment.utc("2022-10-28T00:00-00:00");
  }
}
NewPlayerSpiritLoginAchievement.initClass();

module.exports = NewPlayerSpiritLoginAchievement;
