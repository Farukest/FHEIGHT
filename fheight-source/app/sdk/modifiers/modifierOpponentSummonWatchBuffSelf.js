/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierOpponentSummonWatch = require('./modifierOpponentSummonWatch');
const applyCardToBoardAction =     require('app/sdk/actions/applyCardToBoardAction');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierOpponentSummonWatchBuffSelf extends ModifierOpponentSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierOpponentSummonWatchBuffSelf";
    this.type ="ModifierOpponentSummonWatchBuffSelf";
  
    this.modifierName ="Opponent Summon Watch";
    this.description = "Whenever opponent summons a minion, this minion gains %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpponentSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(attackBuff, maxHPBuff, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    const statContextObject = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff,{
      modifierName:this.modifierName,
      description:Stringifiers.stringifyAttackHealthBuff(attackBuff,maxHPBuff),
    });
    statContextObject.appliedName = "Overseer's Growth";
    contextObject.modifiersContextObjects = [
      statContextObject
    ];
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

  onSummonWatch(action) {
    // override me in sub classes to implement special behavior
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierOpponentSummonWatchBuffSelf.initClass();

module.exports = ModifierOpponentSummonWatchBuffSelf;
