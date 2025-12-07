/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');
const DamageAsAttackAction = require('./damageAsAttackAction');

class FightAction extends Action {
  static initClass() {
  
    this.type ="FightAction";
  }

  constructor(gameSession) {
    super(gameSession);
    if (this.type == null) { this.type = FightAction.type; }
  }

  _execute() {

    const source = this.getSource();
    const target = this.getTarget();

    const damageAction1 = new DamageAsAttackAction(this.getGameSession());
    damageAction1.setOwnerId(source.getOwnerId());
    damageAction1.setSource(source);
    damageAction1.setTarget(target);
    damageAction1.setDamageAmount(source.getATK());
    this.getGameSession().executeAction(damageAction1);

    const damageAction2 = new DamageAsAttackAction(this.getGameSession());
    damageAction2.setOwnerId(target.getOwnerId());
    damageAction2.setSource(target);
    damageAction2.setTarget(source);
    damageAction2.setDamageAmount(target.getATK());
    return this.getGameSession().executeAction(damageAction2);
  }
}
FightAction.initClass();

module.exports = FightAction;
