/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEnemyMinionAttackWatch = require('app/sdk/modifiers/modifierEnemyMinionAttackWatch');
const ModifierFrenzy = require('app/sdk/modifiers/modifierFrenzy');
const ModifierFlying = require('app/sdk/modifiers/modifierFlying');
const ModifierTranscendance = require('app/sdk/modifiers/modifierTranscendance');
const ModifierProvoke = require('app/sdk/modifiers/modifierProvoke');
const ModifierRanged = require('app/sdk/modifiers/modifierRanged');
const ModifierForcefield = require('app/sdk/modifiers/modifierForcefield');

var ModifierEnemyMinionAttackWatchGainKeyword = (function() {
  let allModifierContextObjects = undefined;
  ModifierEnemyMinionAttackWatchGainKeyword = class ModifierEnemyMinionAttackWatchGainKeyword extends ModifierEnemyMinionAttackWatch {
    static initClass() {
  
      this.prototype.type ="ModifierEnemyMinionAttackWatchGainKeyword";
      this.type ="ModifierEnemyMinionAttackWatchGainKeyword";
  
      this.modifierName ="ModifierEnemyMinionAttackWatchGainKeyword";
      this.description ="Whenever an enemy minion attacks, this minion gains a random keyword";
  
      this.prototype.fxResource = ["FX.Modifiers.ModifierEnemyMinionAttackWatch", "FX.Modifiers.ModifierGenericBuff"];
  
      allModifierContextObjects =[];
    }

    static createContextObject() {
      const contextObject = super.createContextObject();
      contextObject.allModifierContextObjects = [
        ModifierFrenzy.createContextObject(),
        ModifierFlying.createContextObject(),
        ModifierTranscendance.createContextObject(),
        ModifierProvoke.createContextObject(),
        ModifierRanged.createContextObject(),
        ModifierForcefield.createContextObject()
      ];
      return contextObject;
    }

    onEnemyMinionAttackWatch(action) {
      super.onEnemyMinionAttackWatch(action);

      if (this.getGameSession().getIsRunningAsAuthoritative() && (this.allModifierContextObjects.length > 0)) {
        // pick one modifier from the remaining list and splice it out of the set of choices
        const modifierContextObject = this.allModifierContextObjects.splice(this.getGameSession().getRandomIntegerForExecution(this.allModifierContextObjects.length), 1)[0];
        return this.getGameSession().applyModifierContextObject(modifierContextObject, this.getCard());
      }
    }
  };
  ModifierEnemyMinionAttackWatchGainKeyword.initClass();
  return ModifierEnemyMinionAttackWatchGainKeyword;
})();
    

module.exports = ModifierEnemyMinionAttackWatchGainKeyword;
