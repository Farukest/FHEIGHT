/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierCounter = require('./modifierCounter');
const ModifierCounterIntensifyDescription = require('./modifierCounterIntensifyDescription');
const Modifier = require('./modifier');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');

const i18next = require('i18next');

/*
  Counts intensify count on this card
  NOTE: this counter updateCountIfNeeded since Intensify ONLY needs to check for count changes
  after cards are played to board, rather than on any arbitrary action
*/
class ModifierCounterIntensify extends ModifierCounter {
  static initClass() {
  
    this.prototype.type ="ModifierCounterIntensify";
    this.type ="ModifierCounterIntensify";
  
    this.prototype.activeInDeck = false;
    this.prototype.activeOnBoard = false;
  
    this.prototype.maxStacks = 1;
  }

  onActivate() {
    let intensifyCount = 1;
    const relevantActions = this.getGameSession().filterActions(this.getIsActionRelevant.bind(this));
    if (relevantActions != null) {
      intensifyCount += relevantActions.length;
    }
    this._private.currentCount = intensifyCount;
    return this.updateCountIfNeeded();
  }

  updateCountIfNeeded() {
    if (this._private.currentCount !== this._private.previousCount) {
      this.removeSubModifiers();
      this.getGameSession().applyModifierContextObject(this.getModifierContextObjectToApply(), this.getCard(), this);
      return this._private.previousCount = this._private.currentCount;
    }
  }

  getModifierContextObjectToApply() {
    const modContextObject = ModifierCounterIntensifyDescription.createContextObject(this._private.currentCount);
    modContextObject.appliedName = i18next.t("modifiers.intensify_counter_applied_name");
    return modContextObject;
  }

  onAfterAction(event) {
    super.onAfterAction(event);
    const {
      action
    } = event;
    if (action instanceof ApplyCardToBoardAction && (action.getOwnerId() === this.getOwnerId()) && (action.getCard().getBaseCardId() === this.getCard().getBaseCardId())) {
      this._private.currentCount++;
      return this.updateCountIfNeeded();
    }
  }

  getIsActionRelevant(action) {
    // instances playing card this is attached to
    if (action instanceof ApplyCardToBoardAction && (action.getOwnerId() === this.getOwnerId()) && (action.getCard().getBaseCardId() === this.getCard().getBaseCardId())) {
      return true;
    } else {
      return false;
    }
  }
}
ModifierCounterIntensify.initClass();

module.exports = ModifierCounterIntensify;
