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
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierSpellDamageWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSpellDamageWatch";
    this.type ="ModifierSpellDamageWatch";
  
    this.modifierName ="Spell Damage Watch";
    this.description = "Spell Damage Watch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    // watch for a spell (but not a followup) being cast by player who owns this entity
    if ((action instanceof PlayCardFromHandAction || action instanceof PlaySignatureCardAction) && (action.getOwnerId() === this.getCard().getOwnerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Spell) && this.createdDamageSubaction(action)) {
      return this.onDamagingSpellcast(action);
    }
  }

  onDamagingSpellcast(action) {}
    // override me in sub classes to implement special behavior

  createdDamageSubaction(action) {
    // did the spell cast action create a damage subaction directly?
    for (var subAction of Array.from(action.getSubActions())) {
      if ((subAction.getType() === DamageAction.type) && !subAction.getCreatedByTriggeringModifier()) {
        return true;
      }
    }
    return false;
  }
}
ModifierSpellDamageWatch.initClass();

module.exports = ModifierSpellDamageWatch;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}