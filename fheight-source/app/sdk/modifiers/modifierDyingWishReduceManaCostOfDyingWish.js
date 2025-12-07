/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const _ = require('underscore');

class ModifierDyingWishReduceManaCostOfDyingWish extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishReduceManaCostOfDyingWish";
    this.type ="ModifierDyingWishReduceManaCostOfDyingWish";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish"];
  
    this.prototype.reduceAmount = 0;
  }

  static createContextObject(reduceAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.reduceAmount = reduceAmount;
    return contextObject;
  }

  onDyingWish() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let cards = [];
      const deck = this.getOwner().getDeck();
      cards = cards.concat(deck.getCardsInHandExcludingMissing(), deck.getCardsInDrawPile());
      return (() => {
        const result = [];
        for (var card of Array.from(cards)) {
        // search for Dying Wish modifier and keyword class Dying Wish
        // searching by keyword class because some units have "dying wishes" that are not specified as Dying Wish keyword
        // (ex - Snow Chaser 'replicate')
        // but don't want to catch minions that grant others Dying Wish (ex - Ancient Grove)
          if (card.hasModifierClass(ModifierDyingWish)) {
            result.push((() => {
              const result1 = [];
              for (var kwClass of Array.from(card.getKeywordClasses())) {
                if (kwClass.belongsToKeywordClass(ModifierDyingWish)) {
                  var manaModifier = ModifierManaCostChange.createContextObject(this.reduceAmount * -1);
                  this.getGameSession().applyModifierContextObject(manaModifier, card);
                  break;
                } else {
                  result1.push(undefined);
                }
              }
              return result1;
            })());
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierDyingWishReduceManaCostOfDyingWish.initClass();

module.exports = ModifierDyingWishReduceManaCostOfDyingWish;
