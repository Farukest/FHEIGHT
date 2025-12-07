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

class ModifierEnemyCannotCastBBS extends ModifierCannot {
  static initClass() {
  
    this.prototype.type = "ModifierEnemyCannotCastBBS";
    this.type = "ModifierEnemyCannotCastBBS";
  
  
    this.prototype.manaCostPrevented = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierCannotCastSpellsByCost"];
  }

  static createContextObject() {
    const contextObject = super.createContextObject();
    return contextObject;
  }

  onValidateAction(actionEvent) {
    const a = actionEvent.action;

    // prevents owner from casting BBS
    if ((a instanceof PlaySignatureCardAction && (a.getOwner() !== this.getOwner())) && a.getIsValid() && !a.getIsImplicit() && (__guard__(a.getCard(), x => x.getType()) === CardType.Spell)) {
      return this.invalidateAction(a, this.getCard().getPosition(), "You can't cast that!");
    }
  }
}
ModifierEnemyCannotCastBBS.initClass();

module.exports = ModifierEnemyCannotCastBBS;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}