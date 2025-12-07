/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ApplyModifierAction = require('app/sdk/actions/applyModifierAction');
const ModifierStunned = require('app/sdk/modifiers/modifierStunned');
const ModifierStunnedVanar = require('app/sdk/modifiers/modifierStunnedVanar');
const ModifierStun = require('app/sdk/modifiers/modifierStun');

class ModifierEnemyStunWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierEnemyStunWatch";
    this.type ="ModifierEnemyStunWatch";
  
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

    // watch for a stun being used on an enemy
    if ((action instanceof ApplyModifierAction) && (action.getModifier() instanceof ModifierStunned || action.getModifier() instanceof ModifierStunnedVanar || action.getModifier() instanceof ModifierStun) && (action.getTarget().getOwnerId() !== this.getCard().getOwnerId())) {
      return this.onEnemyStunWatch(action);
    }
  }

  onEnemyStunWatch(action) {}
}
ModifierEnemyStunWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierEnemyStunWatch;
