/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Action = require('./action');
const ModifierFirstBlood = require('app/sdk/modifiers/modifierFirstBlood');
const ModifierCardControlledPlayerModifiers = require('app/sdk/modifiers/modifierCardControlledPlayerModifiers');
const RefreshExhaustionAction =  require('./refreshExhaustionAction');

class SwapUnitAllegianceAction extends Action {
  static initClass() {
  
    this.type = "SwapUnitAllegianceAction";
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = SwapUnitAllegianceAction.type; }
  }

  _execute() {

    super._execute();

    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "SwapUnitAllegianceAction::execute"
    const unit = this.getTarget();

    if (unit != null) {
      // determine owners
      let newOwner, originalOwner;
      if (unit.isOwnedByPlayer1()) {
        originalOwner = this.getGameSession().getPlayer1();
        newOwner = this.getGameSession().getPlayer2();
      } else if (unit.isOwnedByPlayer2()) {
        originalOwner = this.getGameSession().getPlayer2();
        newOwner = this.getGameSession().getPlayer1();
      }

      const wasGeneral = unit.getIsGeneral();
      if (wasGeneral) {
        // set unit as no longer being a general
        this.getGameSession().setEntityAsNotGeneral(unit);
      }

      // set new owner
      unit.setOwner(newOwner);

      // exhaust the unit (summoning sickness)
      unit.applyExhaustion();

      // if unit was a rush minion, undo exhaustion
      if (unit.hasActiveModifierClass(ModifierFirstBlood)) {
        const refreshExhaustionAction = this.getGameSession().createActionForType(RefreshExhaustionAction.type);
        refreshExhaustionAction.setSource(unit);
        refreshExhaustionAction.setTarget(unit);
        this.getGameSession().executeAction(refreshExhaustionAction);
      }

      for (var modifier of Array.from(unit.getModifiers())) {
        if (modifier != null) {
          // notify modifier that its card has changed owners
          modifier.onChangeOwner(originalOwner.getPlayerId(), newOwner.getPlayerId());

          // if modifier is transforms during scrubbing
          // move modifier to the card it is already on
          // this will create an exact copy of the existing modifier
          // and the scrubbing systems will correctly transform the modifier based on the new owner
          if (modifier.getTransformModifierTypeForScrubbing() != null) {
            this.getGameSession().moveModifierToCard(modifier, modifier.getCard());
          }
        }
      }

      if (wasGeneral && (this.getGameSession().getGeneralForPlayer(originalOwner) == null)) {
        // notify the game session this entity was a general and has changed allegiance
        // so the original owner no longer has a general and the game is over
        return this.getGameSession().p_requestGameOver();
      }
    }
  }
}
SwapUnitAllegianceAction.initClass();

module.exports = SwapUnitAllegianceAction;
