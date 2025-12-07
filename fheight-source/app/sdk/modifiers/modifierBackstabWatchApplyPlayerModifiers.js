/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBackstabWatch = require('./modifierBackstabWatch');

class ModifierBackstabWatchApplyPlayerModifiers extends ModifierBackstabWatch {
  static initClass() {
  
    this.prototype.type ="ModifierBackstabWatchApplyPlayerModifiers";
    this.type ="ModifierBackstabWatchApplyPlayerModifiers";
  
    this.prototype.modifiersContextObjects = null; // modifier context objects for modifiers to apply
    this.prototype.managedByCard = false; // whether card with backstab should manage the modifiers applied, i.e. when the card is silenced/killed these modifiers are removed
    this.prototype.applyToOwnPlayer = false;
    this.prototype.applyToEnemyPlayer = false;
  }

  static createContextObject(modifiersContextObjects, managedByCard, applyToOwnPlayer, applyToEnemyPlayer, options) {
    if (managedByCard == null) { managedByCard = false; }
    if (applyToOwnPlayer == null) { applyToOwnPlayer = false; }
    if (applyToEnemyPlayer == null) { applyToEnemyPlayer = false; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.managedByCard = managedByCard;
    contextObject.applyToOwnPlayer = applyToOwnPlayer;
    contextObject.applyToEnemyPlayer = applyToEnemyPlayer;
    return contextObject;
  }

  static createContextObjectToTargetOwnPlayer(modifiersContextObjects, managedByCard, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, true, false, options);
  }

  static createContextObjectToTargetEnemyPlayer(modifiersContextObjects, managedByCard, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, false, true, options);
  }

  onBackstabWatch() {
    if (this.modifiersContextObjects != null) {
      // applying to owner
      let modifierContextObject;
      if (this.applyToOwnPlayer) {
        const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
        for (modifierContextObject of Array.from(this.modifiersContextObjects)) {
          if (this.managedByCard) {
            this.getGameSession().applyModifierContextObject(modifierContextObject, general, this);
          } else {
            this.getGameSession().applyModifierContextObject(modifierContextObject, general);
          }
        }
      }

      // applying to enemy
      if (this.applyToEnemyPlayer) {
        const opponentPlayerId = this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getCard().getOwnerId());
        const opponentGeneral = this.getGameSession().getGeneralForPlayerId(opponentPlayerId);
        return (() => {
          const result = [];
          for (modifierContextObject of Array.from(this.modifiersContextObjects)) {
            if (this.managedByCard) {
              result.push(this.getGameSession().applyModifierContextObject(modifierContextObject, opponentGeneral, this));
            } else {
              result.push(this.getGameSession().applyModifierContextObject(modifierContextObject, opponentGeneral));
            }
          }
          return result;
        })();
      }
    }
  }
}
ModifierBackstabWatchApplyPlayerModifiers.initClass();

module.exports = ModifierBackstabWatchApplyPlayerModifiers;
