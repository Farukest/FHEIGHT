/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const CONFIG = require('app/common/config');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierEndTurnWatchDamageAllMinions extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchDamageAllMinions";
    this.type ="ModifierEndTurnWatchDamageAllMinions";
  
    this.modifierName ="Turn Watch";
    this.description ="At the end of your turn, deal %X damage to ALL other minions";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch", "FX.Modifiers.ModifierGenericChainLightning"];
  }

  static createContextObject(damageAmount, auraRadius, options) {
    if (damageAmount == null) { damageAmount = 0; }
    if (auraRadius == null) { auraRadius = CONFIG.WHOLE_BOARD_RADIUS; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    contextObject.auraRadius = auraRadius;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const replaceText = this.description.replace(/%X/, modifierContextObject.damageAmount);

      return replaceText;
    } else {
      return this.description;
    }
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    const entities = this.getGameSession().getBoard().getEntitiesAroundEntity(this.getCard(), CardType.Unit, this.auraRadius);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        if (!entity.getIsGeneral()) {
          var damageAction = new DamageAction(this.getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          damageAction.setSource(this.getCard());
          damageAction.setTarget(entity);
          damageAction.setDamageAmount(this.damageAmount);
          result.push(this.getGameSession().executeAction(damageAction));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierEndTurnWatchDamageAllMinions.initClass();

module.exports = ModifierEndTurnWatchDamageAllMinions;
