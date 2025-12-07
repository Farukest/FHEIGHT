/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierCannot = require('./modifierCannot');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const PlaySignatureCardAction = require('app/sdk/actions/playSignatureCardAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierCannotCastSpellsByCost extends ModifierCannot {
  static initClass() {
  
    this.prototype.type = "ModifierCannotCastSpellsByCost";
    this.type = "ModifierCannotCastSpellsByCost";
  
    this.modifierName = "Cannot Cast Spells";
    this.description = "Players can't cast spells.";
  
    this.prototype.manaCostPrevented = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierCannotCastSpellsByCost"];
  }

  static createContextObject(manaCostPrevented) {
    const contextObject = super.createContextObject();
    contextObject.manaCostPrevented = manaCostPrevented;
    return contextObject;
  }

  onValidateAction(actionEvent) {
    const a = actionEvent.action;

    // minion prevents players from casting spells at certain mana costs
    if (((a instanceof PlayCardFromHandAction) || (a instanceof PlaySignatureCardAction)) && a.getIsValid() && !a.getIsImplicit() && (__guard__(a.getCard(), x => x.getType()) === CardType.Spell) && (a.getManaCost() <= this.manaCostPrevented)) {
      return this.invalidateAction(a, this.getCard().getPosition(), "You can't cast that!");
    }
  }
}
ModifierCannotCastSpellsByCost.initClass();

module.exports = ModifierCannotCastSpellsByCost;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}