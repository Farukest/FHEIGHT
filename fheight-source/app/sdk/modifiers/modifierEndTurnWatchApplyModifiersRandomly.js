/*
 * decaffeinate suggestions:
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatchApplyModifiers = require('./modifierEndTurnWatchApplyModifiers');
const CardType = require('app/sdk/cards/cardType');

class ModifierEndTurnWatchApplyModifiersRandomly extends ModifierEndTurnWatchApplyModifiers {
  static initClass() {
  
    /*
    This modifier is used to apply modifiers RANDOMLY to X entities around an entity on end turn.
    examples:
    2 random nearby friendly minions gain +1/+1
    1 random friendly minion gains provoke
    */
  
    this.prototype.type ="ModifierEndTurnWatchApplyModifiersRandomly";
    this.type ="ModifierEndTurnWatchApplyModifiersRandomly";
  
    this.description = "At the end of your turn, %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, auraIncludeSelf, auraIncludeAlly, auraIncludeEnemy, auraRadius, auraIncludeGeneral, description, numberOfApplications, options) {
    const contextObject = super.createContextObject(modifiersContextObjects, auraIncludeSelf, auraIncludeAlly, auraIncludeEnemy, auraRadius, auraIncludeGeneral, description, options);
    contextObject.numberOfApplications = numberOfApplications;
    return contextObject;
  }

  getAffectedEntities(action) {
    const affectedEntities = [];
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const potentialAffectedEntities = super.getAffectedEntities(action);
      for (let i = 0, end = this.numberOfApplications, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        if (potentialAffectedEntities.length > 0) {
          affectedEntities.push(potentialAffectedEntities.splice(this.getGameSession().getRandomIntegerForExecution(potentialAffectedEntities.length), 1)[0]);
        }
      }
    }
    return affectedEntities;
  }
}
ModifierEndTurnWatchApplyModifiersRandomly.initClass();

module.exports = ModifierEndTurnWatchApplyModifiersRandomly;
