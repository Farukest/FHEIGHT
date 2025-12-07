/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const RandomTeleportAction = require('app/sdk/actions/randomTeleportAction');
const CONFIG = require('app/common/config');
const _ = require('underscore');

class ModifierEnvyBaer extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEnvyBaer";
    this.type ="ModifierEnvyBaer";
  
    this.modifierName ="Envybaer";
    this.description ="Whenever this minion damages an enemy, teleport that enemy to a random corner";
  
    this.prototype.maxStacks = 1;
  }

  onDealDamage(action) {
    if (action.getTarget().getOwnerId() !== this.getCard().getOwnerId()) {
      const randomTeleportAction = new RandomTeleportAction(this.getGameSession());
      randomTeleportAction.setOwnerId(this.getCard().getOwnerId());
      randomTeleportAction.setSource(action.getTarget());
      randomTeleportAction.setTeleportPattern(CONFIG.PATTERN_CORNERS);
      randomTeleportAction.setFXResource(_.union(randomTeleportAction.getFXResource(), this.getFXResource()));
      return this.getGameSession().executeAction(randomTeleportAction);
    }
  }
}
ModifierEnvyBaer.initClass();

module.exports = ModifierEnvyBaer;
