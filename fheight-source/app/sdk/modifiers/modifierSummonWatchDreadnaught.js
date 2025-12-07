/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierSummonWatchByCardBuffTarget = require('./modifierSummonWatchByCardBuffTarget');

class ModifierSummonWatchDreadnaught extends ModifierSummonWatchByCardBuffTarget {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchDreadnaught";
    this.type ="ModifierSummonWatchDreadnaught";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  
    this.description = "%X you summon %Y";
    this.prototype.validCardIds = null;
     // array of card IDs to watch for
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const replaceText = this.description.replace(/%X/, modifierContextObject.cardDescription);
      return replaceText.replace(/%Y/, modifierContextObject.buffDescription);
    } else {
      return this.description;
    }
  }

  getIsCardRelevantToWatcher(card) {
    return (__guard__(card.getAppliedToBoardByAction(), x => x.getSource()) !== this.getCard()) && super.getIsCardRelevantToWatcher(card);
  }
}
ModifierSummonWatchDreadnaught.initClass();

module.exports = ModifierSummonWatchDreadnaught;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}