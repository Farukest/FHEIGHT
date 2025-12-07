/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const Modifier = require('./modifier');

class ModifierOpeningGambitDamageNearbyForAttack extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDamageNearbyForAttack";
    this.type = "ModifierOpeningGambitDamageNearbyForAttack";
  
    this.modifierName = "Opening Gambit";
    this.description = "ALL nearby minions deal damage to themselves equal to their Attack";
  
    this.prototype.targetType = CardType.Unit;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericDamageNearby"];
  }


  onOpeningGambit() {

    return (() => {
      const result = [];
      for (var entity of Array.from(this.getGameSession().getBoard().getEntitiesAroundEntity(this.getCard(), CardType.Unit, 1))) {
        if (!entity.getIsGeneral()) { // this ability only damages minions, not Generals
          var damageAction = new DamageAction(this.getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          // source and target are same because minion deals damage to itself
          damageAction.setSource(entity);
          damageAction.setTarget(entity);
          damageAction.setDamageAmount(entity.getATK());
          result.push(this.getGameSession().executeAction(damageAction));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierOpeningGambitDamageNearbyForAttack.initClass();

module.exports = ModifierOpeningGambitDamageNearbyForAttack;
