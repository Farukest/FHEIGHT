/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSynergizeApplyModifiers = require('./modifierSynergizeApplyModifiers');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierSynergizeApplyModifiersToWraithlings extends ModifierSynergizeApplyModifiers {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeApplyModifiersToWraithlings";
    this.type ="ModifierSynergizeApplyModifiersToWraithlings";
  
    this.description = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSynergize", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, auraRadius, description, options) {
    const contextObject = super.createContextObject(modifiersContextObjects, false, false, true, false, false, auraRadius, description, options);
    contextObject.cardId = Cards.Faction4.Wraithling;
    return contextObject;
  }

  getAffectedEntities(action) {
    const affectedEntities = [];
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const potentialAffectedEntities = super.getAffectedEntities(action);
      for (var entity of Array.from(potentialAffectedEntities)) {
        if (entity.getBaseCardId() === this.cardId) {
          affectedEntities.push(entity);
        }
      }
    }
    return affectedEntities;
  }
}
ModifierSynergizeApplyModifiersToWraithlings.initClass();

module.exports = ModifierSynergizeApplyModifiersToWraithlings;
