/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier.js');
const ModifierMyGeneralDamagedWatch = require('./modifierMyGeneralDamagedWatch.js');
const DamageAction = require('app/sdk/actions/damageAction.js');

class ModifierMyGeneralDamagedWatchBuffSelfAttackForSame extends ModifierMyGeneralDamagedWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyGeneralDamagedWatchBuffSelfAttackForSame";
    this.type ="ModifierMyGeneralDamagedWatchBuffSelfAttackForSame";
  
    this.modifierName ="My General Damaged Watch";
    this.description ="Whenever your General takes damage, this minion gains that much Attack";
  }

  static createContextObject(modifierAppliedName,options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifierAppliedName = modifierAppliedName;
    return contextObject;
  }

  onDamageDealtToGeneral(action) {
    const modifierContextObject = Modifier.createContextObjectWithAttributeBuffs(action.getTotalDamageAmount());
    modifierContextObject.appliedName = this.modifierAppliedName;
    return this.getGameSession().applyModifierContextObject(modifierContextObject, this.getCard(), this);
  }
}
ModifierMyGeneralDamagedWatchBuffSelfAttackForSame.initClass();

module.exports = ModifierMyGeneralDamagedWatchBuffSelfAttackForSame;
