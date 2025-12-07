/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambitApplyModifiers = require('./modifierOpeningGambitApplyModifiers');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierOpeningGambitApplyModifiersToWraithlings extends ModifierOpeningGambitApplyModifiers {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitApplyModifiersToWraithlings";
    this.type ="ModifierOpeningGambitApplyModifiersToWraithlings";
  
    this.description = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericBuff"];
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
ModifierOpeningGambitApplyModifiersToWraithlings.initClass();

module.exports = ModifierOpeningGambitApplyModifiersToWraithlings;
