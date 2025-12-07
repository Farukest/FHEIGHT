/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyPlayerModifiers = require('./spellApplyPlayerModifiers');
const CardType = require('app/sdk/cards/cardType');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const CloneEntityAsTransformAction = require('app/sdk/actions/cloneEntityAsTransformAction');

class SpellKineticSurge extends SpellApplyPlayerModifiers {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let action;
      super.onApplyEffectToBoardTile(board,x,y,sourceAction); // apply player modifier to General

      // find all summon actions that summoned a friendly unit this turn
      const summonActions = [];
      let actions = [];
      for (var step of Array.from(this.getGameSession().getCurrentTurn().getSteps())) {
        if (step !== this.getGameSession().getExecutingStep()) { // don't need to check current step since player modifier will catch summons on this step
          actions = step.getAction().getFlattenedActionTree();
          for (action of Array.from(actions)) {
            if (action instanceof ApplyCardToBoardAction && (action.getTarget().getType() === CardType.Unit) && (action.getTarget().getOwnerId() === this.getOwnerId())) {
              summonActions.push(action);
            }
          }
        }
      }

      // and apply modifiers to all friendly units summoned this turn as well
      return (() => {
        const result = [];
        for (action of Array.from(summonActions)) {
        // but ignore transforms
          if (!(action instanceof PlayCardAsTransformAction || action instanceof CloneEntityAsTransformAction)) {
            var targetUnit = action.getTarget();
            if (targetUnit != null) {
              result.push(Array.from(this.targetModifiersContextObjects[0].modifiersContextObjects).map((modifierContextObject) =>
                this.getGameSession().applyModifierContextObject(modifierContextObject, targetUnit)));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}


module.exports = SpellKineticSurge;
