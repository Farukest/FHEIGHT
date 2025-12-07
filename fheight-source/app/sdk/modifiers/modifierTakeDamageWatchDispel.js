/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const ModifierSilence = require('./modifierSilence');
const CardType = require('app/sdk/cards/cardType');

class ModifierTakeDamageWatchDispel extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchDispel";
    this.type ="ModifierTakeDamageWatchDispel";
  
    this.modifierName ="Take Damage Watch";
    this.description ="Dispel any minion that deals damage to this one";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTakeDamageWatch"];
  }

  onDamageTaken(action) {
    super.onDamageTaken(action);

    // go back to closest source card that is a unit
    const sourceCard = __guard__(action.getSource(), x => x.getAncestorCardOfType(CardType.Unit));

    // dispel any minion that damages this one
    if ((sourceCard != null) && !sourceCard.getIsGeneral()) {
      return this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), sourceCard);
    }
  }
}
ModifierTakeDamageWatchDispel.initClass();

module.exports = ModifierTakeDamageWatchDispel;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}