/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType =  require('./spellFilterType');
const ModifierDyingWish = require('app/sdk/modifiers/modifierDyingWish');
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const _ = require('underscore');

class SpellLurkingFear extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralIndirect;
    this.prototype.cardTypeToTarget = CardType.Unit;
     // type of card to target
  }

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

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
                  var manaModifier = ModifierManaCostChange.createContextObject(this.costChange);
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
SpellLurkingFear.initClass();

module.exports = SpellLurkingFear;
