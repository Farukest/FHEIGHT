/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierEnemySpellWatch = require('./modifierEnemySpellWatch');

class ModifierEnemySpellWatchBuffSelf extends ModifierEnemySpellWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEnemySpellWatchBuffSelf";
    this.type ="ModifierEnemySpellWatchBuffSelf";
  
    this.modifierName ="Enemy Spell Watch Buff Self";
    this.description = "Whenever the opponent casts a spell, this minion gains +X/+X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch", "FX.Modifiers.ModifierGenericBuff"];
  
    this.prototype.statsBuff = null;
  }

  static createContextObject(attackBuff, maxHPBuff, buffName, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const contextObject = super.createContextObject(options);
    const statsBuff = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    statsBuff.appliedName = buffName;
    contextObject.modifiersContextObjects = [statsBuff];
    return contextObject;
  }

  onEnemySpellWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierEnemySpellWatchBuffSelf.initClass();

module.exports = ModifierEnemySpellWatchBuffSelf;
