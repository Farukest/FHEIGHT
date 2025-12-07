/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const ModifierForcefieldAbsorb = require('./modifierForcefieldAbsorb');

const i18next = require('i18next');

class ModifierForcefield extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierForcefield";
    this.type ="ModifierForcefield";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.forcefield_def");
  
    this.modifierName =i18next.t("modifiers.forcefield_name");
    this.description =null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierForcefield"];
  }

  onActivate() {
    // apply one-time absorb effect as soon when this modifier becomes active
    this.getGameSession().applyModifierContextObject(ModifierForcefieldAbsorb.createContextObject(), this.getCard(), this);
    return super.onActivate();
  }

  onStartTurn(actionEvent) {
    const subMods = this.getSubModifiers();
    if (!subMods || ((subMods != null ? subMods.length : undefined) === 0)) {
      // re-apply forcefield one-time absorb effect if this modifier has no sub modifiers
      this.getGameSession().applyModifierContextObject(ModifierForcefieldAbsorb.createContextObject(), this.getCard(), this);
    }
    return super.onStartTurn(actionEvent);
  }
}
ModifierForcefield.initClass();

module.exports = ModifierForcefield;
