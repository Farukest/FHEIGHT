/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class CardSet {
  static initClass() {
    this.GauntletSpecial = -1;
  
    // Core set.
    this.Core = 1;
  
    // Denizens of Shim'Zar.
    this.Shimzar = 2;
  
    // Ancient Bonds or Rise of the Bloodbound (disabled).
    this.Bloodborn = 3;
  
    // Bloodbound Ancients (merged Ancient Bonds and Rise of the Bloodbound).
    this.Unity = 4;
  
    // Unearthed Prophecy.
    this.FirstWatch = 5;
  
    // Immortal Vanguard.
    this.Wartech = 6;
  
    this.CombinedUnlockables = 7;
  
    // Trials of Mythron.
    this.Coreshatter = 8;
  }
}
CardSet.initClass();

module.exports = CardSet;
