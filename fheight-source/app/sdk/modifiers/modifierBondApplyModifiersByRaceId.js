/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBondAplyModifiers = require('./modifierBondApplyModifiers');
const CardType = require('app/sdk/cards/cardType');

class ModifierBondApplyModifiersByRaceId extends ModifierBondAplyModifiers {
  static initClass() {
  
    this.prototype.type ="ModifierBondApplyModifiersByRaceId";
    this.type ="ModifierBondApplyModifiersByRaceId";
  
    this.description = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, managedByCard, auraIncludeSelf, auraIncludeAlly, auraIncludeEnemy, auraIncludeGeneral, auraRadius, raceId, description, options) {
    const contextObject = super.createContextObject(modifiersContextObjects, managedByCard, auraIncludeSelf, auraIncludeAlly, auraIncludeEnemy, auraIncludeGeneral, auraRadius, description, options);
    contextObject.raceId = raceId;
    return contextObject;
  }

  getAffectedEntities(action) {
    const affectedEntities = [];
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const potentialAffectedEntities = super.getAffectedEntities(action);
      for (var entity of Array.from(potentialAffectedEntities)) {
        if (entity.getBelongsToTribe(this.raceId)) {
          affectedEntities.push(entity);
        }
      }
    }
    return affectedEntities;
  }
}
ModifierBondApplyModifiersByRaceId.initClass();

module.exports = ModifierBondApplyModifiersByRaceId;
