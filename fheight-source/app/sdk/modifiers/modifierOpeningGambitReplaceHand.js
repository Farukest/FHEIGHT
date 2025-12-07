/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const ReplaceCardFromHandAction = require('app/sdk/actions/replaceCardFromHandAction');
const PlayerModifierCannotReplace = require('app/sdk/playerModifiers/playerModifierCannotReplace');

class ModifierOpeningGambitReplaceHand extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitReplaceHand";
    this.type ="ModifierOpeningGambitReplaceHand";
  }

  onOpeningGambit(action) {
    super.onOpeningGambit(action);
    // don't try to replace anything if deck is empty
    if (this.getCard().getOwner().getDeck().getDrawPile().length < 1) {
      return;
    }

    if (this.getOwner().getActivePlayerModifiersByClass(PlayerModifierCannotReplace).length === 0) { // if not being blocked by the Riddle (cannot replace any cards)
      // replace each card in hand - but don't count against normal replaces
      return (() => {
        const result = [];
        const iterable = this.getOwner().getDeck().getHand();
        for (let handIndex = 0; handIndex < iterable.length; handIndex++) {
          var card = iterable[handIndex];
          if (card != null) {
            var a = new ReplaceCardFromHandAction(this.getGameSession(), this.getCard().getOwnerId(), handIndex);
            a.forcedReplace = true;
            result.push(this.getGameSession().executeAction(a));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierOpeningGambitReplaceHand.initClass();

module.exports = ModifierOpeningGambitReplaceHand;
