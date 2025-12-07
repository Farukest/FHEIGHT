/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellDamage = require('./spellDamage');
const CardType = require('app/sdk/cards/cardType');
const AttackAction = require('app/sdk/actions/attackAction');

class SpellSpiralCounter extends SpellDamage {
  static initClass() {
  
    this.prototype.damageAmount = 8;
  }

  // can only target enemy minions that attacked last turn
  _filterPlayPositions(spellPositions) {

    const finalPositions = [];

    const turns = this.getGameSession().getTurns();
    if (turns.length > 1) {
      const lastTurn = turns[turns.length-1];
      let actions = [];
      const possibleTargets = [];

      for (var step of Array.from(lastTurn.getSteps())) {
        actions = actions.concat(step.getAction().getFlattenedActionTree());
      }

      // find enemy minions that attacked last turn
      for (var action of Array.from(actions)) {
        if (action.getType() === AttackAction.type) {
          var attacker = action.getSource();
          if ((attacker.getType() === CardType.Unit) && !(attacker.getOwnerId() === this.getOwnerId()) && !attacker.getIsGeneral()) {
            possibleTargets.push(attacker);
          }
        }
      }

      for (var target of Array.from(possibleTargets)) {
        if (target.getIsLocatedOnBoard()) {
          finalPositions.push(target.getPosition());
        }
      }
    }

    return finalPositions;
  }
}
SpellSpiralCounter.initClass();

module.exports = SpellSpiralCounter;
