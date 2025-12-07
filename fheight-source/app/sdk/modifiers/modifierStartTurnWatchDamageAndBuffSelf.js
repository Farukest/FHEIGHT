/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatchBuffSelf = require('./modifierStartTurnWatchBuffSelf');
const DamageAction = require('app/sdk/actions/damageAction');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const CONFIG = require('app/common/config');

class ModifierStartTurnWatchDamageAndBuffSelf extends ModifierStartTurnWatchBuffSelf {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchDamageAndBuffSelf";
    this.type ="ModifierStartTurnWatchDamageAndBuffSelf";
  
    this.modifierName ="Turn Watch";
    this.description ="At the start of your turn, take %X damage but gain %Y";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch", "FX.Modifiers.ModifierGenericChainLightning"];
  }

  static createContextObject(attackBuff, maxHPBuff, damageAmount, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(attackBuff, maxHPBuff, options);
    contextObject.damageAmount = damageAmount;

    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const subContextObject = modifierContextObject.modifiersContextObjects[0];
      const replaceText = this.description.replace(/%Y/, Stringifiers.stringifyAttackHealthBuff(subContextObject.attributeBuffs.atk,subContextObject.attributeBuffs.maxHP));
      return replaceText.replace(/%X/, modifierContextObject.damageAmount);
    } else {
      return this.description;
    }
  }

  onTurnWatch(action) {
    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getCard().getOwnerId());
    damageAction.setSource(this.getCard());
    damageAction.setTarget(this.getCard());
    if (!this.damageAmount) {
      damageAction.setDamageAmount(this.getCard().getATK());
    } else {
      damageAction.setDamageAmount(this.damageAmount);
    }
    this.getGameSession().executeAction(damageAction);

    return super.onTurnWatch(action);
  }
}
ModifierStartTurnWatchDamageAndBuffSelf.initClass(); // then buff self

module.exports = ModifierStartTurnWatchDamageAndBuffSelf;
