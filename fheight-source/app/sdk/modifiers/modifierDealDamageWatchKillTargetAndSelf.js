/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const KillAction = require('app/sdk/actions/killAction');

class ModifierDealDamageWatchKillTargetAndSelf extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchKillTargetAndSelf";
    this.type ="ModifierDealDamageWatchKillTargetAndSelf";
  
    this.modifierName ="Clumsy Assassin";
    this.description ="Whenever this unit deals damage to an enemy minion, destroy itself and the enemy minion";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDealDamageWatch", "FX.Modifiers.ModifierGenericKill"];
  }

  onEvent(event) {
    super.onEvent(event);

    if (this._private.listeningToEvents) {
      if (event.type === EVENTS.entities_involved_in_attack) {
        return this.onEntitiesInvolvedInAttack(event);
      }
    }
  }

  getIsActionRelevant(a) {
    // kill the target as long as it isn't a general
    return super.getIsActionRelevant(a) && !(__guard__(a.getTarget(), x => x.getIsGeneral()));
  }

  onDealDamage(action) {
    const target = action.getTarget();

    // kill target
    let killAction = new KillAction(this.getGameSession());
    killAction.setOwnerId(this.getCard().getOwnerId());
    killAction.setSource(this.getCard());
    killAction.setTarget(target);
    this.getGameSession().executeAction(killAction);

    // kill self
    killAction = new KillAction(this.getGameSession());
    killAction.setOwnerId(this.getCard().getOwnerId());
    killAction.setSource(this.getCard());
    killAction.setTarget(this.getCard());
    return this.getGameSession().executeAction(killAction);
  }

  onEntitiesInvolvedInAttack(actionEvent) {
    const a = actionEvent.action;
    if (this.getIsActive() && this.getIsActionRelevant(a)) {
      // kill target
      let killAction = new KillAction(this.getGameSession());
      killAction.setOwnerId(this.getCard().getOwnerId());
      killAction.setSource(this.getCard());
      killAction.setTarget(target);
      actionEvent.actions.push(killAction);

      // kill self
      killAction = new KillAction(this.getGameSession());
      killAction.setOwnerId(this.getCard().getOwnerId());
      killAction.setSource(this.getCard());
      killAction.setTarget(this.getCard());
      return actionEvent.actions.push(killAction);
    }
  }
}
ModifierDealDamageWatchKillTargetAndSelf.initClass();

module.exports = ModifierDealDamageWatchKillTargetAndSelf;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}