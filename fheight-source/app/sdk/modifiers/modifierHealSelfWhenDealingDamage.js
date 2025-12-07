/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const HealAction = require('app/sdk/actions/healAction');
const DamageAction = require('app/sdk/actions/damageAction');
const Modifier = require('./modifier');

class ModifierHealSelfWhenDealingDamage extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierHealSelfWhenDealingDamage";
    this.type ="ModifierHealSelfWhenDealingDamage";
  
    this.description ="Whenever this deals damage, restore that much Health to it";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  onBeforeAction(event) {
    super.onBeforeAction(event);
    const {
      action
    } = event;
    if (action instanceof DamageAction && (action.getSource() === this.getCard())) {
      if (this.getCard().getHP() < this.getCard().getMaxHP()) {
        const healAction = this.getCard().getGameSession().createActionForType(HealAction.type);
        healAction.setTarget(this.getCard());
        let damageToHeal = action.getTotalDamageAmount();
        if (damageToHeal > this.getCard().getDamage()) {
          damageToHeal = this.getCard().getDamage();
        }
        healAction.setHealAmount(damageToHeal);
        return this.getCard().getGameSession().executeAction(healAction);
      }
    }
  }
}
ModifierHealSelfWhenDealingDamage.initClass();

module.exports = ModifierHealSelfWhenDealingDamage;
