/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatch = require('./modifierSummonWatch');
const Races = require('app/sdk/cards/racesLookup');

class ModifierSummonWatchHydrax extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchHydrax";
    this.type ="ModifierSummonWatchHydrax";
  
    this.modifierName ="Modifier Summon Watch Hydrax";
    this.description = "Whenever you summon a Battle Pet, it and Hydrax gain %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch"];
  }

  static createContextObject(modifiersContextObjects, buffDescription, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.buffDescription = buffDescription;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.buffDescription);
    } else {
      return this.description;
    }
  }

  onSummonWatch(action) {
    if (this.modifiersContextObjects != null) {
      const entity = action.getTarget();
      if (entity != null) {
        // apply self buff
        this.getGameSession().applyModifierContextObject(this.modifiersContextObjects[0], this.getCard());
        // apply buff to battle pet being spawend
        return this.getGameSession().applyModifierContextObject(this.modifiersContextObjects[1], entity);
      }
    }
  }

  getIsCardRelevantToWatcher(card) {
    return card.getBelongsToTribe(Races.BattlePet);
  }
}
ModifierSummonWatchHydrax.initClass();

module.exports = ModifierSummonWatchHydrax;
