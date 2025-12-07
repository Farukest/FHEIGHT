/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');
const DrawCardAction = require('app/sdk/actions/drawCardAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const CardType = require('app/sdk/cards/cardType');

class PlayerModifierAncestralPact extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierAncestralPact";
    this.type ="PlayerModifierAncestralPact";
  }

  static createContextObject(duration, options) {
    if (duration == null) { duration = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.durationEndTurn = duration;
    return contextObject;
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;
    // watch for this player playing a unit from hand
    if (action instanceof PlayCardFromHandAction && (action.getOwnerId() === this.getPlayerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Unit)) {
      // draw a card
      const deck = this.getGameSession().getPlayerById(this.getPlayerId()).getDeck();
      return this.getGameSession().executeAction(deck.actionDrawCard());
    }
  }
}
PlayerModifierAncestralPact.initClass();

module.exports = PlayerModifierAncestralPact;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}