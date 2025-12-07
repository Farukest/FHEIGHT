/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Modifier = require('./modifier');
const ModifierSynergize = require('./modifierSynergize');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

/*
This modifier is used to apply modifiers to Generals on synergize (when you actiavte your BBS)
examples:
Your General gains +2 Attack
Enemy General gains -2 Attack
*/
class ModifierSynergizeApplyModifiersToGeneral extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeApplyModifiersToGeneral";
    this.type ="ModifierSynergizeApplyModifiersToGeneral";
  
    this.description = "";
  
    this.prototype.modifiersContextObjects = null; // modifier context objects for modifiers to apply
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSynergize", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, applyToOwnGeneral, applyToEnemyGeneral, description, options) {
    if (applyToOwnGeneral == null) { applyToOwnGeneral = false; }
    if (applyToEnemyGeneral == null) { applyToEnemyGeneral = false; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.applyToOwnGeneral = applyToOwnGeneral;
    contextObject.applyToEnemyGeneral = applyToEnemyGeneral;
    contextObject.description = description;
    return contextObject;
  }

  onSynergize() {
    if (this.modifiersContextObjects != null) {
      return Array.from(this.getAffectedEntities()).map((entity) =>
        Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
          this.getGameSession().applyModifierContextObject(modifierContextObject, entity)));
    }
  }

  getAffectedEntities() {
    const affectedEntities = [];
    if (this.applyToOwnGeneral) {
      affectedEntities.push(this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()));
    }
    if (this.applyToEnemyGeneral) {
      affectedEntities.push(this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId()));
    }
    return affectedEntities;
  }
}
ModifierSynergizeApplyModifiersToGeneral.initClass();

module.exports = ModifierSynergizeApplyModifiersToGeneral;
