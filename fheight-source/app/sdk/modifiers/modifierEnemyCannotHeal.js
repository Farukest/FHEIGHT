/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =   require('./modifier');
const HealAction = require('app/sdk/actions/healAction');

class ModifierEnemyCannotHeal extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierEnemyCannotHeal";
    this.type ="ModifierEnemyCannotHeal";
  
    this.modifierName ="ModifierEnemyCannotHeal";
    this.description = "Enemy minions and Generals cannot heal";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEnemyCannotHeal"];
  }

  // watch for enemy heals, and turn them into 0s
  onModifyActionForExecution(e) {
    super.onModifyActionForExecution(e);

    const {
      action
    } = e;
    if (action instanceof HealAction && (__guard__(action.getTarget(), x => x.getOwnerId()) !== this.getCard().getOwnerId())) {
      action.setChangedByModifier(this);
      return action.setHealMultiplier(0);
    }
  }
}
ModifierEnemyCannotHeal.initClass();

module.exports = ModifierEnemyCannotHeal;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}