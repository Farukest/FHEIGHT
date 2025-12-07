/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class PlayModes {
  static initClass() {
  
    this.Practice = "practice";
    this.Challenges = "challenges";
    this.Ranked = "ranked";
    this.Casual = "casual";
    this.Gauntlet = "gauntlet";
    this.BossBattle = "boss_battle";
    this.Sandbox = "sandbox";
    this.Developer = "developer";
    this.Friend = "friendly";
    this.Rift = "rift";
  }
}
PlayModes.initClass();

module.exports = PlayModes;
