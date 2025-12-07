/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierMyMinionOrGeneralDamagedWatch = require('./modifierMyMinionOrGeneralDamagedWatch');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierMyMinionOrGeneralDamagedWatchBuffSelf extends ModifierMyMinionOrGeneralDamagedWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyMinionOrGeneralDamagedWatchBuffSelf";
    this.type ="ModifierMyMinionOrGeneralDamagedWatchBuffSelf";
  
    this.modifierName ="My Minion or General Damaged Watch";
    this.description ="Each time a friendly minion or your General takes damage, gain %X";
  }

  static createContextObject(attackBuff, maxHPBuff,options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    const statContextObject = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    statContextObject.appliedName = "Protector\'s Rage";
    contextObject.modifiersContextObjects = [statContextObject];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const subContextObject = modifierContextObject.modifiersContextObjects[0];
      return this.description.replace(/%X/, Stringifiers.stringifyAttackHealthBuff(subContextObject.attributeBuffs.atk,subContextObject.attributeBuffs.maxHP));
    } else {
      return this.description;
    }
  }

  onDamageDealtToMinionOrGeneral(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierMyMinionOrGeneralDamagedWatchBuffSelf.initClass();

module.exports = ModifierMyMinionOrGeneralDamagedWatchBuffSelf;
