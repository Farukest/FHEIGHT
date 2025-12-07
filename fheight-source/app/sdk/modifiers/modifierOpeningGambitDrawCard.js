/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DrawCardAction = require('app/sdk/actions/drawCardAction');
const ModifierOpeningGambit = require('app/sdk/modifiers/modifierOpeningGambit');

class ModifierOpeningGambitDrawCard extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDrawCard";
    this.type = "ModifierOpeningGambitDrawCard";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  
    this.prototype.numCards = 1;
  }

  static createContextObject(numCards, options) {
    if (numCards == null) { numCards = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.numCards = numCards;
    return contextObject;
  }

  onOpeningGambit() {
    return __range__(0, this.numCards, false).map((i) =>
      this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), this.getCard().getOwnerId())));
  }
}
ModifierOpeningGambitDrawCard.initClass();

module.exports = ModifierOpeningGambitDrawCard;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}