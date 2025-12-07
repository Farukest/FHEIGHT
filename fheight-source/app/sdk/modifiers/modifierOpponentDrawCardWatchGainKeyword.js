/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpponentDrawCardWatch = require('./modifierOpponentDrawCardWatch');
const ModifierFrenzy = require('app/sdk/modifiers/modifierFrenzy');
const ModifierFlying = require('app/sdk/modifiers/modifierFlying');
const ModifierTranscendance = require('app/sdk/modifiers/modifierTranscendance');
const ModifierProvoke = require('app/sdk/modifiers/modifierProvoke');
const ModifierBlastAttack = require('app/sdk/modifiers/modifierBlastAttack');

var ModifierOpponentDrawCardWatchGainKeyword = (function() {
  let allModifierContextObjects = undefined;
  ModifierOpponentDrawCardWatchGainKeyword = class ModifierOpponentDrawCardWatchGainKeyword extends ModifierOpponentDrawCardWatch {
    static initClass() {
  
      this.prototype.type ="ModifierOpponentDrawCardWatchGainKeyword";
      this.type ="ModifierOpponentDrawCardWatchGainKeyword";
  
      this.modifierName ="ModifierOpponentDrawCardWatchGainKeyword";
      this.description = "Whenever your opponent draws a card, this minion gains a random ability.";
  
      allModifierContextObjects = [];
    }

    static createContextObject() {
      const contextObject = super.createContextObject();
      contextObject.allModifierContextObjects = [
        ModifierFrenzy.createContextObject(),
        ModifierFlying.createContextObject(),
        ModifierTranscendance.createContextObject(),
        ModifierProvoke.createContextObject(),
        ModifierBlastAttack.createContextObject()
      ];
      return contextObject;
    }

    onDrawCardWatch(action) {
      super.onDrawCardWatch(action);

      if (this.getGameSession().getIsRunningAsAuthoritative() && (this.allModifierContextObjects.length > 0)) {
        // pick one modifier from the remaining list and splice it out of the set of choices
        const modifierContextObject = this.allModifierContextObjects.splice(this.getGameSession().getRandomIntegerForExecution(this.allModifierContextObjects.length), 1)[0];
        return this.getGameSession().applyModifierContextObject(modifierContextObject, this.getCard());
      }
    }
  };
  ModifierOpponentDrawCardWatchGainKeyword.initClass();
  return ModifierOpponentDrawCardWatchGainKeyword;
})();

module.exports = ModifierOpponentDrawCardWatchGainKeyword;