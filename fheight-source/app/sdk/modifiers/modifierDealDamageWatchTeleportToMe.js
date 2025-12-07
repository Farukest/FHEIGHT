/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const TeleportInFrontOfUnitAction = require('app/sdk/actions/teleportInFrontOfUnitAction');
const _ = require('underscore');

class ModifierDealDamageWatchTeleportToMe extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchTeleportToMe";
    this.type ="ModifierDealDamageWatchTeleportToMe";
  
    this.modifierName ="Deal Damage Watch Teleport To Me";
    this.description ="Minions damaged by Syvrel are pulled in front of him";
  
    this.prototype.maxStacks = 1;
  }

  onDealDamage(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      // calculate results of teleport only on server, since results may change at execution time
      const target = action.getTarget();
      if (target && !target.getIsGeneral()) {
        // move target in front of this minion
        const teleAction = new TeleportInFrontOfUnitAction(this.getGameSession(), this.getCard(), target);
        teleAction.setFXResource(_.union(teleAction.getFXResource(), this.getFXResource()));
        return this.getGameSession().executeAction(teleAction);
      }
    }
  }
}
ModifierDealDamageWatchTeleportToMe.initClass();

module.exports = ModifierDealDamageWatchTeleportToMe;
