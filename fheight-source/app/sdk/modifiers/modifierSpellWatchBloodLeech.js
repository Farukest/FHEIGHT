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
const HealAction = require('app/sdk/actions/healAction');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierSpellWatchBloodLeech extends ModifierSpellWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSpellWatchBloodLeech";
    this.type ="ModifierSpellWatchBloodLeech";
  
    this.prototype.damageAmount = 0;
    this.prototype.healAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch", "FX.Modifiers.ModifierGenericChain"];
  }

  static createContextObject(damageAmount, healAmount,options) {
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  onSpellWatch(action) {
    super.onSpellWatch(action);

    const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    const myGeneral = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    //damage enemy general
    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getCard().getOwnerId());
    damageAction.setSource(this.getCard());
    damageAction.setTarget(enemyGeneral);
    damageAction.setDamageAmount(this.damageAmount);
    this.getGameSession().executeAction(damageAction);

    //heal my general
    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getCard().getOwnerId());
    healAction.setSource(this.getCard());
    healAction.setTarget(myGeneral);
    healAction.setHealAmount(this.healAmount);
    return this.getCard().getGameSession().executeAction(healAction);
  }
}
ModifierSpellWatchBloodLeech.initClass();

module.exports = ModifierSpellWatchBloodLeech;
