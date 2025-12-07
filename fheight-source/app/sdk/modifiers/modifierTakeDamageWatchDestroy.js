/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const KillAction = require('app/sdk/actions/killAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierTakeDamageWatchDestroy extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchDestroy";
    this.type ="ModifierTakeDamageWatchDestroy";
  
    this.modifierName ="Take Damage Watch";
    this.description ="Destroy any minion that deals damage to this one";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTakeDamageWatch"];
  }

  onDamageTaken(action) {
    super.onDamageTaken(action);

    // go back to closest source card that is a unit
    const sourceCard = __guard__(action.getSource(), x => x.getAncestorCardOfType(CardType.Unit));

    // kill any minion that damages this one
    if ((sourceCard != null) && !sourceCard.getIsGeneral()) {
      const target = sourceCard;
      const killAction = new KillAction(this.getGameSession());
      killAction.setOwnerId(this.getCard().getOwnerId());
      killAction.setSource(this.getCard());
      killAction.setTarget(target);
      return this.getGameSession().executeAction(killAction);
    }
  }
}
ModifierTakeDamageWatchDestroy.initClass();

module.exports = ModifierTakeDamageWatchDestroy;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}