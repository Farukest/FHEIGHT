/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Enum for the different types of Analytics Event Priority
// Lower numbers are lower priority, actual interger values are arbitrary


class AnalyticsEventCategory {
  static initClass() {
  
    this.Marketing = "marketing";
    this.FTUE = "first time user experience";
    this.Game = "game";
    this.Quest = "quest";
    this.Chat = "chat";
    this.Matchmaking = "matchmaking";
    this.SpiritOrbs = "spirit orbs";
    this.Challenges = "challenges";
    this.Shop = "shop";
    this.Gauntlet = "gauntlet";
    this.Watch = "watch";
    this.Codex = "codex";
    this.Crate = "crate";
    this.Boss = "boss";
    this.Rift = "rift";
    this.Inventory = "inventory";
    this.Debug = "debug";
  }
}
AnalyticsEventCategory.initClass();


module.exports = AnalyticsEventCategory;
