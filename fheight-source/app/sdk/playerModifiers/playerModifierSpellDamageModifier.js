/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('./playerModifier');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');


class PlayerModifierSpellDamageModifier extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierSpellDamageModifier";
    this.type ="PlayerModifierSpellDamageModifier";
  
    this.prototype.spellDamageChange = null;
    this.prototype.spellDamageMultiplier = null;
  }

  setSpellDamageChange(damageChange) {
    return this.spellDamageChange = damageChange;
  }

  setSpellDamageMultiplier(damageMultiplier) {
    return this.spellDamageMultiplier = damageMultiplier;
  }

  onModifyActionForExecution(actionEvent) {
    super.onModifyActionForExecution(actionEvent);
    const a = actionEvent.action;
    // watch for damageActions created by this player that were not triggered by a modifier
    if ((a.getOwnerId() === this.getPlayerId()) && a instanceof DamageAction && !a.getCreatedByTriggeringModifier()) {
      const rootAction = a.getRootAction();
      // this action was not triggered by a modifier, but was it caused by a spell cast?
      if (rootAction instanceof ApplyCardToBoardAction && (__guard__(__guard__(rootAction.getCard(), x1 => x1.getRootCard()), x => x.getType()) === CardType.Spell)) {
        // modify the damageAmount
        a.setChangedByModifier(this);
        if (this.spellDamageChange != null) {
          a.changeDamageBy(this.spellDamageChange);
        }
        if (this.spellDamageMultiplier != null) {
          return a.changeDamageMultiplierBy(this.spellDamageMultiplier);
        }
      }
    }
  }
}
PlayerModifierSpellDamageModifier.initClass();

module.exports = PlayerModifierSpellDamageModifier;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}