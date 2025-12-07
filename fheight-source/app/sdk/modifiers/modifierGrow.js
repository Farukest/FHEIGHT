/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatchBuffSelf = require('./modifierStartTurnWatchBuffSelf');
const CardType = require('app/sdk/cards/cardType');
const ModifierGrowOnBothTurns = require('./modifierGrowOnBothTurns');

const i18next = require('i18next');

class ModifierGrow extends ModifierStartTurnWatchBuffSelf {
  static initClass() {
  
    this.prototype.type ="ModifierGrow";
    this.type ="ModifierGrow";
  
    this.isKeyworded = true;
    this.keywordDefinition =i18next.t("modifiers.grow_def");
  
    this.modifierName =i18next.t("modifiers.grow_name");
    this.description = "+%X/+%X";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff", "FX.Modifiers.ModifierGrow"];
  }

  static createContextObject(growValue,options) {
    if (growValue == null) { growValue = 0; }
    if (options == null) { options = {}; }
    options.appliedName = "Grow";
    const contextObject = super.createContextObject(growValue, growValue, options);
    contextObject.growValue = growValue;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject != null) {
      if (!modifierContextObject.isInherent) {
        return "Gains " + this.description.replace(/%X/g, modifierContextObject.growValue) + " at start of your turn.";
      } else {
        return this.description.replace(/%X/g, modifierContextObject.growValue);
      }
    } else {
      return this.description;
    }
  }

  onStartTurn(e) {
    // check if we need to grow on enemy's turn as well
    if (!this.getCard().isOwnersTurn()) {
      if (this.getCard().hasModifierType(ModifierGrowOnBothTurns.type)) {
        this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
      }
    }
    return super.onStartTurn(e); // always grow on our own turn
  }

  activateGrow() {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }

  getGrowBonus() {
    return this.growValue;
  }
}
ModifierGrow.initClass();

module.exports = ModifierGrow;
