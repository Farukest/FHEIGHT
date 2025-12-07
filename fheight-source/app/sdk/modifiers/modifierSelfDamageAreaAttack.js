/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const ModifierSilence = require('./modifierSilence');
const DamageAction = require('app/sdk/actions/damageAction');
const i18next = require('i18next');

/*
This is purposely not a subclass of myAttackWatch, because this dispel should occur
on beforeAction, rather than onAction
*/

class ModifierSelfDamageAreaAttack extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSelfDamageAreaAttack";
    this.type ="ModifierSelfDamageAreaAttack";
  
    this.modifierName =i18next.t("modifiers.self_damage_area_attack_name");
    this.description =i18next.t("modifiers.self_damage_area_attack_def");
  
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
      let damageAction;
      let selfDamage = this.getCard().getATK();

      //damage the area too
      const entities = this.getGameSession().getBoard().getFriendlyEntitiesAroundEntity(a.getTarget(), CardType.Unit, 1);
      for (var entity of Array.from(entities)) {
        damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getCard().getOwnerId());
        damageAction.setSource(this.getCard());
        damageAction.setTarget(entity);
        damageAction.setDamageAmount(this.getCard().getATK());
        this.getGameSession().executeAction(damageAction);
        selfDamage = selfDamage + this.getCard().getATK();
      }

      //then damage self a proportional amount
      damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getCard().getOwnerId());
      damageAction.setSource(this.getCard());
      damageAction.setTarget(this.getCard());
      damageAction.setDamageAmount(selfDamage);
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierSelfDamageAreaAttack.initClass();

module.exports = ModifierSelfDamageAreaAttack;
