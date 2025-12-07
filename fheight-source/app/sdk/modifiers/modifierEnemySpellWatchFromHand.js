/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierEnemySpellWatchFromHand extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierEnemySpellWatchFromHand";
    this.type ="ModifierEnemySpellWatchFromHand";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  onBeforeAction(e) {
    super.onBeforeAction(e);

    const {
      action
    } = e;

    // watch for a spell (but not a followup) being cast by player who owns this entity
    if (action instanceof PlayCardFromHandAction && (action.getOwnerId() !== this.getCard().getOwnerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Spell)) {
      return this.onEnemySpellWatchFromHand(action);
    }
  }

  onEnemySpellWatchFromHand(action) {}
}
ModifierEnemySpellWatchFromHand.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierEnemySpellWatchFromHand;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}