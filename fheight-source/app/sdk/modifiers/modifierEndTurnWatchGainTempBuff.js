/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const Modifier = require('./modifier');

class ModifierEndTurnWatchGainTempBuff extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type = "ModifierEndTurnWatchGainTempBuff";
    this.type = "ModifierEndTurnWatchGainTempBuff";
  
    this.modifierName = "End Turn Watch Temp Buff";
    this.description = "Gain a buff on your opponent's turn";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch"];
  
    this.prototype.attackBuff = 0;
    this.prototype.healthBuff = 0;
    this.prototype.modifierName = null;
  }

  onActivate() {
    super.onActivate();

    // when activated on opponent's turn, immediately activate buff for this turn
    if (!this.getCard().isOwnersTurn()) {
      const statContextObject = Modifier.createContextObjectWithAttributeBuffs(this.attackBuff, this.healthBuff);
      statContextObject.appliedName = this.modifierName;
      statContextObject.durationEndTurn = 1;
      return this.getGameSession().applyModifierContextObject(statContextObject, this.getCard());
    }
  }

  static createContextObject(attackBuff, healthBuff, modifierName, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (healthBuff == null) { healthBuff = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.attackBuff = attackBuff;
    contextObject.healthBuff = healthBuff;
    contextObject.modifierName = modifierName;
    return contextObject;
  }

  onTurnWatch() {
    super.onTurnWatch();
    // at end of my turn, activate buff (so it will be active on opponent's turn)
    const statContextObject = Modifier.createContextObjectWithAttributeBuffs(this.attackBuff, this.healthBuff);
    statContextObject.appliedName = this.modifierName;
    statContextObject.durationEndTurn = 2;
    return this.getGameSession().applyModifierContextObject(statContextObject, this.getCard());
  }
}
ModifierEndTurnWatchGainTempBuff.initClass();

module.exports = ModifierEndTurnWatchGainTempBuff;
