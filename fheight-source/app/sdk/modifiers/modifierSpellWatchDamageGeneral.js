/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierSpellWatch = require('./modifierSpellWatch');
const CardType = require('app/sdk/cards/cardType');
const Modifier = require('./modifier');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierSpellWatchDamageGeneral extends ModifierSpellWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSpellWatchDamageGeneral";
    this.type ="ModifierSpellWatchDamageGeneral";
  
    this.modifierName ="Spell Watch (Damage General)";
    this.description ="Whenever you cast a spell, deal %X damage to the enemy General";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch", "FX.Modifiers.ModifierGenericDamage"];
  }

  static createContextObject(damageAmount,options) {
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

  onSpellWatch(action) {
    super.onSpellWatch(action);

    const general = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getCard().getOwnerId());
    damageAction.setSource(this.getCard());
    damageAction.setTarget(general);
    damageAction.setDamageAmount(this.damageAmount);
    return this.getGameSession().executeAction(damageAction);
  }
}
ModifierSpellWatchDamageGeneral.initClass();

module.exports = ModifierSpellWatchDamageGeneral;
