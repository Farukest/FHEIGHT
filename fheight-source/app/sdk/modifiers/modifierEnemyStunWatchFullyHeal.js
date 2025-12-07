/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEnemyStunWatch = require('./modifierEnemyStunWatch');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const ModifierTransformed = require('app/sdk/modifiers/modifierTransformed');
const HealAction = require('app/sdk/actions/healAction');

class ModifierEnemyStunWatchFullyHeal extends ModifierEnemyStunWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEnemyStunWatchFullyHeal";
    this.type ="ModifierEnemyStunWatchFullyHeal";
  
    this.prototype.cardDataOrIndexToSpawn = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  onEnemyStunWatch(action) {
    super.onEnemyStunWatch(action);

    if (this.getCard().getHP() < this.getCard().getMaxHP()) {
      const healAction = this.getCard().getGameSession().createActionForType(HealAction.type);
      healAction.setTarget(this.getCard());
      healAction.setHealAmount(this.getCard().getMaxHP() - this.getCard().getHP());
      return this.getCard().getGameSession().executeAction(healAction);
    }
  }
}
ModifierEnemyStunWatchFullyHeal.initClass();

module.exports = ModifierEnemyStunWatchFullyHeal;
