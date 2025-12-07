/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const ModifierCannotBeReplaced = require('app/sdk/modifiers/modifierCannotBeReplaced');
const Cards = require('app/sdk/cards/cardsLookupComplete');

var SpellSwordsBBS = (function() {
  let spellsToGet = undefined;
  SpellSwordsBBS = class SpellSwordsBBS extends Spell {
    static initClass() {
  
      spellsToGet = [
        {id: Cards.Spell.SpellSword1},
        {id: Cards.Spell.SpellSword2},
        {id: Cards.Spell.SpellSword3},
        {id: Cards.Spell.SpellSword4}
      ];
    }

    onApplyOneEffectToBoard(board, x, y, sourceAction) {
      super.onApplyOneEffectToBoard(board, x, y, sourceAction);

      if (this.getGameSession().getIsRunningAsAuthoritative()) {

        const cardData = {};
        cardData.id = spellsToGet[this.getGameSession().getRandomIntegerForExecution(spellsToGet.length)].id;
        if (cardData.additionalModifiersContextObjects == null) { cardData.additionalModifiersContextObjects = []; }
        cardData.additionalModifiersContextObjects.push(ModifierCannotBeReplaced.createContextObject());
        const a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), cardData);
        return this.getGameSession().executeAction(a);
      }
    }
  };
  SpellSwordsBBS.initClass();
  return SpellSwordsBBS;
})();

module.exports = SpellSwordsBBS;
