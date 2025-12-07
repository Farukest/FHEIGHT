/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const PlaySignatureCardAction = require('app/sdk/actions/playSignatureCardAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierSpellWatchAnywhereApplyModifiers extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSpellWatchAnywhereApplyModifiers";
    this.type ="ModifierSpellWatchAnywhereApplyModifiers";
  
    this.prototype.activeInHand = true;
    this.prototype.activeInDeck = true;
    this.prototype.activeInSignatureCards = true;
    this.prototype.activeOnBoard = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  static createContextObject(modifiers, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiers;
    return contextObject;
  }

  onAfterAction(e) {
    super.onAfterAction(e);

    const {
      action
    } = e;

    // watch for a spell (but not a followup) being cast by player who owns this entity
    if (this.getIsActionRelevant(action)) {
      return this.onSpellWatch(action);
    }
  }

  getIsActionRelevant(action) {
    return (action instanceof PlayCardFromHandAction || action instanceof PlaySignatureCardAction) && (action.getOwnerId() === this.getCard().getOwnerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Spell);
  }

  onSpellWatch(action) {
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }

  onActivate() {
    // special check on activation in case this card is created mid-game
    // need to check all actions that occured this gamesession for triggers
    const spellActions = this.getGameSession().filterActions(this.getIsActionRelevant.bind(this));
    return Array.from(spellActions).map((action) =>
      this.onSpellWatch(action));
  }
}
ModifierSpellWatchAnywhereApplyModifiers.initClass();

module.exports = ModifierSpellWatchAnywhereApplyModifiers;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}