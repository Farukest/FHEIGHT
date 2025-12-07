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
const ModifierSilence = require('./modifierSilence');
const DamageAction = require('app/sdk/actions/damageAction');

/*
This is purposely not a subclass of myAttackWatch, because this dispel should occur
on beforeAction, rather than onAction
*/

class ModifierDispelAreaAttack extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDispelAreaAttack";
    this.type ="ModifierDispelAreaAttack";
  
    this.modifierName ="Magic Buster Cannon";
    this.description ="Whenever this attacks or counterattacks, it damages and dispels the enemy and all enemies nearby that target";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  }

  onBeforeAction(actionEvent) {
    super.onBeforeAction(actionEvent);
    // dispel target before attack action so that it cannot do onAttack actions
    // example: this dispel disables strikeback before it can counter attack
    const a = actionEvent.action;
    if (a instanceof AttackAction && (a.getSource() === this.getCard())) {
      this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), a.getTarget());

      //dispel and damage the area too
      const entities = this.getGameSession().getBoard().getFriendlyEntitiesAroundEntity(a.getTarget(), CardType.Unit, 1);
      return (() => {
        const result = [];
        for (var entity of Array.from(entities)) {
          var damageAction = new DamageAction(this.getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          damageAction.setSource(this.getCard());
          damageAction.setTarget(entity);
          damageAction.setDamageAmount(this.getCard().getATK());
          this.getGameSession().executeAction(damageAction);
          result.push(this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), entity));
        }
        return result;
      })();
    }
  }
}
ModifierDispelAreaAttack.initClass();



module.exports = ModifierDispelAreaAttack;
