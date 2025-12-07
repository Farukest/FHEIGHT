/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');
const DrawCardAction = require('app/sdk/actions/drawCardAction');
const DieAction = require('app/sdk/actions/dieAction');
const CardType = require('app/sdk/cards/cardType');

class PlayerModifierMyDeathwatchDrawCard extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierMyDeathwatchDrawCard";
    this.type ="PlayerModifierMyDeathwatchDrawCard";
  }

  static createContextObject(duration, options) {
    if (duration == null) { duration = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.durationEndTurn = duration;
    return contextObject;
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;
    const target = action.getTarget();
    // watch for a friendly unit dying
    if (action instanceof DieAction && ((target != null ? target.type : undefined) === CardType.Unit) && ((target != null ? target.getOwnerId() : undefined) === this.getPlayerId()) && (target !== this.getCard())) {
      // draw a card
      const deck = this.getGameSession().getPlayerById(this.getPlayerId()).getDeck();
      return this.getGameSession().executeAction(deck.actionDrawCard());
    }
  }
}
PlayerModifierMyDeathwatchDrawCard.initClass();


module.exports = PlayerModifierMyDeathwatchDrawCard;
