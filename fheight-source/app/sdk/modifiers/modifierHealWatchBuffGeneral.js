/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierHealWatch = require('./modifierHealWatch');
const CardType = require('app/sdk/cards/cardType');

class ModifierHealWatchBuffGeneral extends ModifierHealWatch {
  static initClass() {
  
    this.prototype.type ="ModifierHealWatchBuffGeneral";
    this.type ="ModifierHealWatchBuffGeneral";
  
    this.modifierName ="Heal Watch";
    this.description = "Whenever anything is healed, give your General %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierHealWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, description, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.description = description;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.description);
    } else {
      return this.description;
    }
  }

  onHealWatch(action) {
    const general = this.getGameSession().getGeneralForPlayer(this.getCard().getOwner());
    return Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
      this.getGameSession().applyModifierContextObject(modifierContextObject, general));
  }
}
ModifierHealWatchBuffGeneral.initClass();

module.exports = ModifierHealWatchBuffGeneral;
