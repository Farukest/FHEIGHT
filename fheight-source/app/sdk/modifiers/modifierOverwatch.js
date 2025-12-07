/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const Modifier = require('./modifier');
const ModifierOverwatchHidden = require('./modifierOverwatchHidden');
const RevealHiddenCardAction = require('app/sdk/actions/revealHiddenCardAction');
const DieAction = require('app/sdk/actions/dieAction');

class ModifierOverwatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatch";
    this.type ="ModifierOverwatch";
  
    this.isKeyworded = true;
    this.keywordDefinition ="A hidden effect which only takes place when a specific event occurs.";
  
    this.modifierName ="Guardian";
    this.description = null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
    this.prototype.isRemovable = false;
  
    this.prototype.maxStacks = 1;
  
    this.prototype.hideAsModifierType = ModifierOverwatchHidden.type;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOverwatch"];
  }

  static createContextObject(description,options) {
    const contextObject = super.createContextObject(options);
    contextObject.description = description;
    return contextObject;
  }

  onEvent(event) {
    super.onEvent(event);

    if (this._private.listeningToEvents && this._private.cachedIsActive) {
      const eventType = event.type;
      if (eventType === EVENTS.overwatch) {
        return this.onCheckForOverwatch(event);
      }
    }
  }

  onCheckForOverwatch(e) {
    const {
      action
    } = e;
    if (this.getCanReactToAction(action) && this.getIsActionRelevant(action)) {
      // setup for triggering
      this.getGameSession().pushTriggeringModifierOntoStack(this);

      // reveal the overwatch card
      const revealAction = new RevealHiddenCardAction(this.getGameSession(), this.getOwnerId(), this.getRevealedCardData());
      revealAction.setTarget(this.getSourceCard());
      this.getGameSession().executeAction(revealAction);

      // trigger overwatch
      this.onOverwatch(action);

      // remove self
      this.getGameSession().removeModifier(this);

      // force stop buffering of events
      // the game session does this automatically
      // but we need it to happen directly following all the overwatch actions
      this.getGameSession().executeAction(this.getGameSession().actionStopBufferingEvents());

      // stop triggering
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  getCanReactToAction(action) {
    // overwatch can only react on authoritative source on opponent's turn
    return this.getGameSession().getIsRunningAsAuthoritative() && (this.getGameSession().getCurrentPlayerId() !== this.getOwnerId()) && super.getCanReactToAction(action);
  }

  getIsActionRelevant(action) {
    // override me in sub classes to determine whether overwatch is triggered
    return false;
  }

  getRevealedCardData(){
    const sourceCard = this.getSourceCard();
    return sourceCard && sourceCard.createCardData();
  }

  onOverwatch(action) {}
}
ModifierOverwatch.initClass();
    // override me in sub classes to implement special behavior for when overwatch is triggered

  // if a minion has an overwatch buff and dies without triggering overwatch, then draw a card
  // onAction: (e) ->
  //   super(e)

  //   action = e.action

  //   if action instanceof DieAction and action.getTarget() is @getCard() and @getCard().getIsRemoved()
  //     deck = @getGameSession().getPlayerById(@getCard().getOwnerId()).getDeck()
  //     if deck?
  //       @getCard().getGameSession().executeAction(deck.actionDrawCard())

module.exports = ModifierOverwatch;
