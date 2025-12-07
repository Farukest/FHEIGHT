/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const ModifierDoomed = require('./modifierDoomed');
const i18next = require('i18next');

class ModifierDoomed2 extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type = "ModifierDoomed2";
    this.type = "ModifierDoomed2";
  
    this.modifierName =i18next.t("modifiers.doomed_name");
    this.description =i18next.t("modifiers.doomed_2_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDoomed2"];
  
    this.prototype.isRemovable = false;
    this.prototype.maxStacks = 1;
  }

  onTurnWatch() {
    super.onTurnWatch();

    if (this.numEndTurnsElapsed > 1) { // don't apply and remove self in same turn!
      // apply next stage of Doom and remove self
      this.getGameSession().applyModifierContextObject(ModifierDoomed.createContextObject(), this.getCard());
      return this.getGameSession().removeModifier(this);
    }
  }
}
ModifierDoomed2.initClass();

module.exports = ModifierDoomed2;
