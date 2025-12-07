/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

const i18next = require('i18next');

/*
  Generic modifier used to hide the true overwatch modifier from an opponent.
*/
class ModifierOverwatchHidden extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchHidden";
    this.type ="ModifierOverwatchHidden";
  
    this.isKeyworded = true;
    this.keywordDefinition ="A hidden effect which only takes place when a specific event occurs.";
  
    this.modifierName ="Overwatch";
    this.description = "%X";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOverwatch"];
  }

  static createContextObject(manaCost,options) {
    if (manaCost == null) { manaCost = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.manaCost = manaCost;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return i18next.t("modifiers.sentinel_watchful");
    } else {
      return this.description;
    }
  }

  onCreatedToHide(source) {
    super.onCreatedToHide(source);

    // copy base mana cost of source modifier's source card
    return this.contextObject.manaCost = source.getSourceCard().getBaseManaCost();
  }
}
ModifierOverwatchHidden.initClass();

module.exports = ModifierOverwatchHidden;
