/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const DamageAction = require('app/sdk/actions/damageAction');
const CONFIG = require('app/common/config');
const CardType = require('app/sdk/cards/cardType');

class ModifierTakeDamageWatchDamageAttacker extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchDamageAttacker";
    this.type ="ModifierTakeDamageWatchDamageAttacker";
  
    this.modifierName ="Take Damage Watch";
    this.description ="Whenever this takes damage, deal %X damage to the attacker";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTakeDamageWatch", "FX.Modifiers.ModifierGenericDamage"];
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.damageAmount);
    } else {
      return this.description;
    }
  }

  onDamageTaken(action) {
    let targetToDamage = __guard__(action.getSource(), x => x.getAncestorCardOfType(CardType.Unit));
    if (!targetToDamage) { // If we couldn't find a unit that dealt the damage, assume the source of damage was spell, in which case damage the general
      targetToDamage = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    }

    if (targetToDamage != null) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getCard().getOwnerId());
      damageAction.setSource(this.getCard());
      damageAction.setTarget(targetToDamage);
      damageAction.setDamageAmount(this.damageAmount);
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierTakeDamageWatchDamageAttacker.initClass();

module.exports = ModifierTakeDamageWatchDamageAttacker;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}