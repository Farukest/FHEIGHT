/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const ModifierDoomed2 = require('./modifierDoomed2');
const i18next = require('i18next');

class ModifierDoomed3 extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type = "ModifierDoomed3";
    this.type = "ModifierDoomed3";
  
    this.modifierName =i18next.t("modifiers.doomed_name");
    this.description =i18next.t("modifiers.doomed_3_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDoomed3"];
  
    this.prototype.isRemovable = false;
    this.prototype.maxStacks = 1;
  }

  onTurnWatch() {
    super.onTurnWatch();

    // apply next stage of Doom and remove self
    this.getGameSession().applyModifierContextObject(ModifierDoomed2.createContextObject(), this.getCard());
    return this.getGameSession().removeModifier(this);
  }
}
ModifierDoomed3.initClass();

module.exports = ModifierDoomed3;
