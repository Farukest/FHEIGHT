/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */

class Features {
  static initClass() {
  
    this.MainMenuCollection = 100;
    this.MainMenuCodex = 101;
    this.MainMenuCrates = 102;
    this.MainMenuSpiritOrbs = 103;
    this.MainMenuWatch = 104;
  
    this.UtilityMenuFriends = 200;
    this.UtilityMenuQuests = 201;
    this.UtilityMenuProfile = 202;
    this.UtilityMenuShop = 203;
    this.UtilityMenuDailyChallenge = 204;
    this.UtilityMenuFreeCardOfTheDay = 205;
  
    this.PlayModeFriendly = 300;
    this.PlayModePractice = 301;
    this.PlayModeSoloChallenges = 302;
    this.PlayModeCasual = 303;
    this.PlayModeRanked = 304;
    this.PlayModeGauntlet = 305;
    this.PlayModeBossBattle = 306;
    this.PlayModeSandbox = 399;
  
    this.Announcements = 400;
    this.FirstWinOfTheDay = 401;
  }
}
Features.initClass();

module.exports = Features;
