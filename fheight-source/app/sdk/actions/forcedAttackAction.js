/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const AttackAction =   require('./attackAction');

class ForcedAttackAction extends AttackAction {
  static initClass() {
  
    // An attack initiated automatically by a spell or effect
    // Does not count against normal attacks for the turn
    // DOES trigger strikeback, onAttack effects, etc
    // example usage: spell "all enemy minion nearby the enemy General attack it immediately"
  
    this.type ="ForcedAttackAction";
  }

  constructor(gameSession) {
    super(gameSession);
    if (this.type == null) { this.type = ForcedAttackAction.type; }
  }
}
ForcedAttackAction.initClass();

module.exports = ForcedAttackAction;
