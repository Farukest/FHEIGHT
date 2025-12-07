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

class ModifierAttacksDamageAllEnemyMinions extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierAttacksDamageAllEnemyMinions";
    this.type ="ModifierAttacksDamageAllEnemyMinions";
  
    this.modifierName ="Attacks Damage All Enemy Minions";
    this.description ="Attacks damage all enemy minions";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  }

  onBeforeAction(actionEvent) {
    super.onBeforeAction(actionEvent);

    const a = actionEvent.action;
    if (a instanceof AttackAction && (a.getSource() === this.getCard())) {

      const entities = this.getGameSession().getBoard().getFriendlyEntitiesForEntity(a.getTarget());
      return (() => {
        const result = [];
        for (var entity of Array.from(entities)) {
          if (!entity.getIsGeneral()) { // do not target the general
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
ModifierAttacksDamageAllEnemyMinions.initClass();

module.exports = ModifierAttacksDamageAllEnemyMinions;
