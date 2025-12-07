/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackWatch = require('./modifierMyAttackWatch');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierMyAttackWatchAreaAttack extends ModifierMyAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackWatchAreaAttack";
    this.type ="ModifierMyAttackWatchAreaAttack";
  }

  onMyAttackWatch(action) {

    const entities = this.getGameSession().getBoard().getFriendlyEntitiesAroundEntity(action.getTarget(), CardType.Unit, 1);
    if (entities != null) {
      return (() => {
        const result = [];
        for (var entity of Array.from(entities)) {
          if (entity != null) {
            var damageAction = new DamageAction(this.getGameSession());
            damageAction.setOwnerId(this.getCard().getOwnerId());
            damageAction.setSource(this.getCard());
            damageAction.setTarget(entity);
            damageAction.setDamageAmount(this.getCard().getATK());
            result.push(this.getGameSession().executeAction(damageAction));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierMyAttackWatchAreaAttack.initClass();

module.exports = ModifierMyAttackWatchAreaAttack;
