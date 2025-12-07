/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const Modifier = require('./modifier');
const ModifierQuestBuffAbyssian = require('./modifierQuestBuffAbyssian');
const ModifierQuestBuffNeutral = require('./modifierQuestBuffNeutral');
const ModifierQuestBuffVanar = require('./modifierQuestBuffVanar');
const PlayerModifierEmblem = require('app/sdk/playerModifiers/playerModifierEmblem');
const SwapGeneralAction = require('app/sdk/actions/swapGeneralAction');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

class ModifierBackupGeneral extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierBackupGeneral";
    this.type ="ModifierBackupGeneral";
  
    this.description = "";
  }

  onEvent(event) {
    super.onEvent(event);

    if (this._private.listeningToEvents) {
      if (event.type === EVENTS.validate_game_over) {
        return this._onValidateGameOver(event);
      }
    }
  }

  _onValidateGameOver(event) {
    if (this.getGameSession().getIsRunningAsAuthoritative() && this._private.cachedIsActive) {
      // find general
      const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
      if ((general != null) && general.getIsRemoved()) {
        // check for backup generals
        const activeUnits = this.getGameSession().getBoard().getFriendlyEntitiesForEntity(general, CardType.Unit);
        const backupGenerals = [];
        for (var unit of Array.from(activeUnits)) {
          if (!unit.getIsGeneral() && unit.getIsActive() && unit.getIsSameTeamAs(general) && unit.hasActiveModifierClass(ModifierBackupGeneral)) {
            backupGenerals.push(unit);
          }
        }

        if (backupGenerals.length > 0) {
          // choose one backup general at random
          let modifier;
          const backupGeneral = backupGenerals[this.getGameSession().getRandomIntegerForExecution(backupGenerals.length)];
          const backupGeneralModifier = backupGeneral.getModifierByClass(ModifierBackupGeneral);

          // set backup general modifier as triggering
          this.getGameSession().pushTriggeringModifierOntoStack(backupGeneralModifier);

          // remove backup general modifiers from new general
          for (modifier of Array.from(backupGeneral.getModifiersByClass(ModifierBackupGeneral))) {
            this.getGameSession().removeModifier(modifier);
          }

          // remove modifiers applied from existing emblems
          for (modifier of Array.from(backupGeneral.getModifiers())) {
            if (modifier != null) {
              if (modifier instanceof ModifierQuestBuffAbyssian || modifier instanceof ModifierQuestBuffNeutral || modifier instanceof ModifierQuestBuffVanar) {
                this.getGameSession().removeModifier(modifier);
              }
            }
          }

          // swap generals with depth first action
          // so the swap can take place before anything else reacts
          const swapGeneralAction = new SwapGeneralAction(this.getGameSession());
          swapGeneralAction.setIsDepthFirst(true);
          swapGeneralAction.setSource(general);
          swapGeneralAction.setTarget(backupGeneral);
          this.getGameSession().executeAction(swapGeneralAction);

          // stop triggering backup general modifier
          return this.getGameSession().popTriggeringModifierFromStack();
        }
      }
    }
  }
}
ModifierBackupGeneral.initClass();

module.exports = ModifierBackupGeneral;
