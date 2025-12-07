/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDeathWatch = require('./modifierDeathWatch');
const CardType = require('app/sdk/cards/cardType');

class ModifierDeathWatchBuffMinionsInHand extends ModifierDeathWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDeathWatchBuffMinionsInHand";
    this.type ="ModifierDeathWatchBuffMinionsInHand";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDeathwatch", "FX.Modifiers.ModifierGenericBuff"];
  
    this.prototype.modifiersContextObjects = null;
  }

  static createContextObject(modifiersContextObjects, description, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.description = description;
    return contextObject;
  }

  onDeathWatch(action) {

    const cardsInHand = this.getCard().getOwner().getDeck().getCardsInHandExcludingMissing();
    if (cardsInHand != null) {
      return (() => {
        const result = [];
        for (var card of Array.from(cardsInHand)) {
          if ((card != null ? card.getType() : undefined) === CardType.Unit) {
            result.push(Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
              this.getGameSession().applyModifierContextObject(modifierContextObject, card)));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierDeathWatchBuffMinionsInHand.initClass();

module.exports = ModifierDeathWatchBuffMinionsInHand;
