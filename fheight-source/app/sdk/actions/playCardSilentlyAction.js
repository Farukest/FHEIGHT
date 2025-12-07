/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger =     require('app/common/logger');
const ApplyCardToBoardAction =     require('./applyCardToBoardAction');
const ModifierOpeningGambit =     require('app/sdk/modifiers/modifierOpeningGambit');
const _ = require('underscore');

/*
Play a card on the board and bypass the active card flow (i.e. followups and opening gambits are disabled)
*/

class PlayCardSilentlyAction extends ApplyCardToBoardAction {
  static initClass() {
  
    this.type ="PlayCardSilentlyAction";
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = PlayCardSilentlyAction.type; }
  }

  getCard() {
    if ((this._private.cachedCard == null)) {
      // create and cache card
      super.getCard();

      if (this._private.cachedCard != null) {
        // clear the card's followups
        this._private.cachedCard.clearFollowups();
      }
    }

    return this._private.cachedCard;
  }
}
PlayCardSilentlyAction.initClass();

module.exports = PlayCardSilentlyAction;
