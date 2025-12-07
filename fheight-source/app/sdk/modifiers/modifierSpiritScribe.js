/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierSummonWatch = require('./modifierSummonWatch');
const CardType = require('app/sdk/cards/cardType');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const ModifierFrenzy = require('./modifierFrenzy');
const ModifierFlying = require('./modifierFlying');
const ModifierTranscendance = require('./modifierTranscendance');
const ModifierProvoke = require('./modifierProvoke');
const ModifierRanged = require('./modifierRanged');

class ModifierSpiritScribe extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSpiritScribe";
    this.type ="ModifierSpiritScribe";
  
    this.description = "Whenever you summon a minion, this minion gains a random keyword ability";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject() {
    const contextObject = super.createContextObject();
    contextObject.allModifierContextObjects = [
      ModifierFrenzy.createContextObject(),
      ModifierFlying.createContextObject(),
      ModifierTranscendance.createContextObject(),
      ModifierProvoke.createContextObject(),
      ModifierRanged.createContextObject()
    ];
    return contextObject;
  }

  onSummonWatch(action) {
    super.onSummonWatch(action);

    if (this.getGameSession().getIsRunningAsAuthoritative() && (this.allModifierContextObjects.length > 0)) {
      // pick one modifier from the remaining list and splice it out of the set of choices
      const modifierContextObject = this.allModifierContextObjects.splice(this.getGameSession().getRandomIntegerForExecution(this.allModifierContextObjects.length), 1)[0];
      return this.getGameSession().applyModifierContextObject(modifierContextObject, this.getCard());
    }
  }
}
ModifierSpiritScribe.initClass();

module.exports = ModifierSpiritScribe;
