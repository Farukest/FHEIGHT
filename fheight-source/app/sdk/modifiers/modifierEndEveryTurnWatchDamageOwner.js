/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndEveryTurnWatch = require('./modifierEndEveryTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierEndEveryTurnWatchDamageOwner extends ModifierEndEveryTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndEveryTurnWatchDamageOwner";
    this.type ="ModifierEndEveryTurnWatchDamageOwner";
  
    this.modifierName ="Turn Watch";
    this.description ="At end of EACH turn, deal %X damage to your General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch", "FX.Modifiers.ModifierGenericDamageEnergySmall"];
  }

  static createContextObject(damageAmount, options) {
    if (damageAmount == null) { damageAmount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const replaceText = this.description.replace(/%X/, modifierContextObject.damageAmount);
      return replaceText;
    } else {
      return this.description;
    }
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    const myGeneral = this.getGameSession().getGeneralForPlayer(this.getCard().getOwner());

    if (myGeneral != null) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getCard().getOwnerId());
      damageAction.setSource(this.getCard());
      damageAction.setTarget(myGeneral);
      damageAction.setDamageAmount(this.damageAmount);
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierEndEveryTurnWatchDamageOwner.initClass();

module.exports = ModifierEndEveryTurnWatchDamageOwner;
