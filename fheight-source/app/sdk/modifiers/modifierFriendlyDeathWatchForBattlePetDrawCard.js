/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierFriendlyDeathWatch = require('./modifierFriendlyDeathWatch');
const Races = require('app/sdk/cards/racesLookup');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierFriendlyDeathWatchForBattlePetDrawCard extends ModifierFriendlyDeathWatch {
  static initClass() {
  
    this.prototype.type ="ModifierFriendlyDeathWatchForBattlePetDrawCard";
    this.type ="ModifierFriendlyDeathWatchForBattlePetDrawCard";
  
    this.description = "Whenever a friendly Battle Pet dies, draw %X";
  }

  static createContextObject(numCards) {
    if (numCards == null) { numCards = 1; }
    const contextObject = super.createContextObject();
    contextObject.numCards = numCards;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      if (modifierContextObject.numCards <= 1) {
        return this.description.replace(/%X/, "a card");
      } else {
        return this.description.replace(/%X/, modifierContextObject.numCards+" cards");
      }
    } else {
      return this.description;
    }
  }

  onFriendlyDeathWatch(action) {
    super.onFriendlyDeathWatch();
    // if dying minion is a Battle Pet OR Ghoulie (Ghoulie belongs to all tribes)
    // need to look specifically for Ghoulie because his ability modifier is the thing that makes him belong to all tribes
    // and once he dies, his modifier is removed. Explicit check needed to work around this.
    if (__guard__(action.getTarget(), x => x.getBelongsToTribe(Races.BattlePet)) || (__guard__(action.getTarget(), x1 => x1.getBaseCardId()) === Cards.Neutral.Ghoulie)) {
      // draw a card
      return (() => {
        const result = [];
        for (let i = 0, end = this.numCards, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          var deck = this.getGameSession().getPlayerById(this.getCard().getOwnerId()).getDeck();
          result.push(this.getCard().getGameSession().executeAction(deck.actionDrawCard()));
        }
        return result;
      })();
    }
  }
}
ModifierFriendlyDeathWatchForBattlePetDrawCard.initClass();

module.exports = ModifierFriendlyDeathWatchForBattlePetDrawCard;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}