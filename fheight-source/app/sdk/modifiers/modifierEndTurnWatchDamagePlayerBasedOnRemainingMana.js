/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndEveryTurnWatch = require('./modifierEndEveryTurnWatch');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierEndTurnWatchDamagePlayerBasedOnRemainingMana extends ModifierEndEveryTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchDamagePlayerBasedOnRemainingMana";
    this.type ="ModifierEndTurnWatchDamagePlayerBasedOnRemainingMana";
  
    this.modifierName ="End Watch";
    this.description ="At the end of each turn, deal damage to the player equal to their remaining mana";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch", "FX.Modifiers.ModifierExplosionsNearby"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description;
    }
  }

  onTurnWatch(action) {
    //get remaining mana
    const owner = action.getOwner();
    const damageAmount = owner.getRemainingMana();

    const target = this.getGameSession().getGeneralForPlayer(owner);

    //damage self
    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getCard().getOwnerId());
    damageAction.setSource(this.getCard());
    damageAction.setTarget(target);
    damageAction.setDamageAmount(damageAmount);
    return this.getGameSession().executeAction(damageAction);
  }
}
ModifierEndTurnWatchDamagePlayerBasedOnRemainingMana.initClass();

module.exports = ModifierEndTurnWatchDamagePlayerBasedOnRemainingMana;
