/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOnDying = require('./modifierOnDying');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierOnDyingInfest extends ModifierOnDying {
  static initClass() {
  
    this.prototype.type ="ModifierOnDyingInfest";
    this.type ="ModifierOnDyingInfest";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierInfest", "FX.Modifiers.ModifierGenericChain"];
  }

  onDying() {

    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    const damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getCard().getOwnerId());
    damageAction.setSource(this.getCard());
    damageAction.setTarget(general);
    damageAction.setDamageAmount(2);
    this.getGameSession().executeAction(damageAction);

    const nearbyAllies = this.getGameSession().getBoard().getFriendlyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var entity of Array.from(nearbyAllies)) {
        if ((entity != null) && !entity.getIsGeneral()) {
          var deathPlagueModifier = ModifierOnDyingInfest.createContextObject();
          deathPlagueModifier.appliedName = this.appliedName;
          deathPlagueModifier.appliedDescription = this.appliedDescription;
          result.push(this.getGameSession().applyModifierContextObject(deathPlagueModifier, entity));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierOnDyingInfest.initClass();

module.exports = ModifierOnDyingInfest;
