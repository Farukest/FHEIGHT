/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOverwatchMovedNearby = require('./modifierOverwatchMovedNearby');
const HealAction = require('app/sdk/actions/healAction');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierOverwatchMovedNearbyMiniImmolation extends ModifierOverwatchMovedNearby {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchMovedNearbyMiniImmolation";
    this.type ="ModifierOverwatchMovedNearbyMiniImmolation";
  }

  static createContextObject(damageAmount, options) {
    if (damageAmount == null) { damageAmount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onOverwatch(action) {
    // heal self
    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getCard().getOwnerId());
    healAction.setTarget(this.getCard());
    healAction.setHealAmount(this.getCard().getDamage()); // heal all damage on the unit
    this.getGameSession().executeAction(healAction);

    //damage enemy units around this unit
    const entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        var damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getCard().getOwnerId());
        damageAction.setSource(this.getCard());
        damageAction.setTarget(entity);
        damageAction.setDamageAmount(this.damageAmount);
        result.push(this.getGameSession().executeAction(damageAction));
      }
      return result;
    })();
  }
}
ModifierOverwatchMovedNearbyMiniImmolation.initClass();

module.exports = ModifierOverwatchMovedNearbyMiniImmolation;
