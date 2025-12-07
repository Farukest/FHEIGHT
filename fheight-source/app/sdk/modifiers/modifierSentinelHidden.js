/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOverwatchHidden = require('./modifierOverwatchHidden');

/*
  Generic modifier used to hide the true sentinel modifier from an opponent.
*/
class ModifierSentinelHidden extends ModifierOverwatchHidden {
  static initClass() {
  
    this.prototype.type ="ModifierSentinelHidden";
    this.type ="ModifierSentinelHidden";
  
    this.isKeyworded = true;
    this.keywordDefinition ="Hidden condition is one of: the opponent summons a minion, casts a spell, or attacks with General.";
  
    this.modifierName ="Sentinel";
    this.description = "%X";
  }
}
ModifierSentinelHidden.initClass();

module.exports = ModifierSentinelHidden;
