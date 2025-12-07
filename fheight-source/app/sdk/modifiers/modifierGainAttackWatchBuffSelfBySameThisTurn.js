/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierGainAttackWatch = require('./modifierGainAttackWatch');
const i18next = require('i18next');

class ModifierGainAttackWatchBuffSelfBySameThisTurn extends ModifierGainAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierGainAttackWatchBuffSelfBySameThisTurn";
    this.type ="ModifierGainAttackWatchBuffSelfBySameThisTurn";
  
    this.modifierName ="Gain Attack Watch";
    this.description =i18next.t("modifiers.gain_attack_watch_buff_self_by_same_this_turn_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDrawCardWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  onGainAttackWatch(action) {
    const attackBuff = action.getModifier().attributeBuffs["atk"];
    const modifierContextObject = Modifier.createContextObjectWithAttributeBuffs(attackBuff);
    modifierContextObject.appliedName = i18next.t("modifiers.gain_attack_watch_buff_self_by_same_this_turn_name");
    modifierContextObject.durationEndTurn = 1;
    return this.getGameSession().applyModifierContextObject(modifierContextObject, this.getCard(), this);
  }
}
ModifierGainAttackWatchBuffSelfBySameThisTurn.initClass();

module.exports = ModifierGainAttackWatchBuffSelfBySameThisTurn;
