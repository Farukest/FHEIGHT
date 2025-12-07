/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');
const i18next = require('i18next');

class ModifierDamageAreaAttack extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDamageAreaAttack";
    this.type ="ModifierDamageAreaAttack";
  }

  onBeforeAction(actionEvent) {
    super.onBeforeAction(actionEvent);

    const a = actionEvent.action;
    if (a instanceof AttackAction && (a.getSource() === this.getCard())) {

      //damage the area too
      const entities = this.getGameSession().getBoard().getFriendlyEntitiesAroundEntity(a.getTarget(), CardType.Unit, 1);
      return (() => {
        const result = [];
        for (var entity of Array.from(entities)) {
          var damageAction = new DamageAction(this.getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          damageAction.setSource(this.getCard());
          damageAction.setTarget(entity);
          damageAction.setDamageAmount(this.getCard().getATK());
          result.push(this.getGameSession().executeAction(damageAction));
        }
        return result;
      })();
    }
  }
}
ModifierDamageAreaAttack.initClass();


module.exports = ModifierDamageAreaAttack;
