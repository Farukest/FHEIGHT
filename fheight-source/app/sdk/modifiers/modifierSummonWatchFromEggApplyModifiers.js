/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const CardType = require('app/sdk/cards/cardType');
const ModifierEgg = require('./modifierEgg');

class ModifierSummonWatchFromEggApplyModifiers extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchFromEggApplyModifiers";
    this.type ="ModifierSummonWatchFromEggApplyModifiers";
  
    this.modifierName ="Summon Watch";
    this.description = "Friendly minions that hatch from Eggs %X";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
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

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    // watch for a unit being summoned from an egg by the player who owns this entity
    if (action instanceof ApplyCardToBoardAction && (action.getOwnerId() === this.getCard().getOwnerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Unit) && (action.getCard() !== this.getCard())) {
      if (action.getTriggeringModifier() instanceof ModifierEgg) {
        const entity = action.getTarget();
        if (entity != null) {
          return Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
            this.getGameSession().applyModifierContextObject(modifierContextObject, entity));
        }
      }
    }
  }
}
ModifierSummonWatchFromEggApplyModifiers.initClass();

module.exports = ModifierSummonWatchFromEggApplyModifiers;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}