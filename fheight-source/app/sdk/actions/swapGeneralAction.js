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
const ModifierCardControlledPlayerModifiers = require('app/sdk/modifiers/modifierCardControlledPlayerModifiers');
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');
const PlayerModifierBattlePetManager = require('app/sdk/playerModifiers/playerModifierBattlePetManager');

class SwapGeneralAction extends Action {
  static initClass() {
  
    this.type ="SwapGeneralAction";
    this.prototype.isDepthFirst = true;
     // swapping generals must be depth first to ensure general modifiers are preserved
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = SwapGeneralAction.type; }
  }

  _execute() {
    super._execute();

    const source = this.getSource();
    const target = this.getTarget();
    if ((source != null) && (target != null)) {
      //Logger.module("SDK").debug("#{@getGameSession().gameId} SwapGeneralAction._execute -> swap from #{source.getLogName()} to #{target.getLogName()}")
      // get all modifiers on the current general that must move to the new general
      // remove any modifiers controlled by new general that were targeting the old general
      const modifiersToMove = [];
      const iterable = source.getModifiers();
      for (let i = iterable.length - 1; i >= 0; i--) {
        var modifier = iterable[i];
        var parentModifier = modifier.getParentModifier();
        if (modifier instanceof PlayerModifier || parentModifier instanceof ModifierCardControlledPlayerModifiers) {
          if ((parentModifier != null) && (parentModifier.getCard() === target)) {
            // remove any modifiers that are controlled by the new general
            if (parentModifier instanceof ModifierCardControlledPlayerModifiers) {
              this.getGameSession().removeModifier(parentModifier);
            } else {
              this.getGameSession().removeModifier(modifier);
            }
          } else if (modifier instanceof PlayerModifierBattlePetManager && target.hasModifierClass(PlayerModifierBattlePetManager)) {
            // don't move battle pet managers if target already has one (i.e. target is already a general)
            this.getGameSession().removeModifier(modifier);
          } else {
            // move any modifiers that are uncontrolled
            // or controlled by units other than the new general
            modifiersToMove.unshift(modifier);
          }
        }
      }

      // set new general
      this.getGameSession().setEntityAsNewGeneral(target);

      // copy base General's signature card to new General
      target.setSignatureCardData(source.getBaseSignatureCardData());

      // reset the new general's event stream to ensure it reacts to events first
      target.startListeningToEvents();

      // move modifiers to new general
      return Array.from(modifiersToMove).map((playerModifier) =>
        this.getGameSession().moveModifierToCard(playerModifier, target));
    }
  }
}
SwapGeneralAction.initClass();

module.exports = SwapGeneralAction;
