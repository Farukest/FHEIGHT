/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ReplaceCardFromHandAction = require('app/sdk/actions/replaceCardFromHandAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const Action = require('app/sdk/actions/action');

const i18next = require('i18next');

class ModifierFate extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierFate";
    this.type ="ModifierFate";
  
    this.isKeyworded = true;
    this.modifierName = "Trial";
    this.description = null;
    this.keywordDefinition = "Starts locked in your action bar. Complete the Trial to unlock the ability to play this card.";
  
    this.prototype.activeInHand = true;
    this.prototype.activeInDeck = true;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = false;
  
    this.prototype.isRemovable = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierFate"];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.fateFulfilled = false;

    return p;
  }

  onValidateAction(actionEvent) {
    const a = actionEvent.action;

    if (!this.fateConditionFulfilled()) {
      if (a instanceof PlayCardFromHandAction && a.getIsValid() && this.getCard().getIsLocatedInHand() && (a.getOwner() === this.getCard().getOwner())) {
        if (__guard__(this.getCard().getOwner().getDeck().getCardInHandAtIndex(a.indexOfCardInHand), x => x.getIndex()) === this.getCard().getIndex()) {
          return this.invalidateAction(a, this.getCard().getPosition(), "Cannot be played until the Fate condition is met.");
        }
      }
    }
  }

  onActivate() {
    // when initially activated, check fate condition across game session
    // this is done in case the fate card is added mid-game
    return this.checkFate(this.getGameSession().filterActions(this.getIsActionRelevant.bind(this)));
  }

  onAction(e) {
    const {
      action
    } = e;
    return this.checkFate([action]);
  }

  checkFate(actions) {
    if (!this._private.fateFulfilled && (actions != null)) {
      return (() => {
        const result = [];
        for (var action of Array.from(actions)) {
          if ((action != null) && action instanceof Action) {
            result.push(this.updateFateCondition(action));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  fateConditionFulfilled() {
    return this._private.fateFulfilled;
  }

  unlockFateCard() {}
    // override if something needs to happen when fate card is unlocked

  getIsActionRelevant(action) {
    // override in sub class to filter only actions to check for fate condition
    return true;
  }

  updateFateCondition(action) {
    // override in sub class to check if fate condition has been fulfilled
    if (this.fateConditionFulfilled()) {
      return this.unlockFateCard();
    }
  }
}
ModifierFate.initClass();

module.exports = ModifierFate;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}