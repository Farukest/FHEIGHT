/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOverwatchSpellTarget = require('./modifierOverwatchSpellTarget');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierOverwatchSpellTargetDamageEnemies extends ModifierOverwatchSpellTarget {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchSpellTargetDamageEnemies";
    this.type ="ModifierOverwatchSpellTargetDamageEnemies";
  }

  static createContextObject(damageAmount, options) {
    if (damageAmount == null) { damageAmount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  onOverwatch(action) {
    //damage enemy units around this unit
    return (() => {
      const result = [];
      for (var entity of Array.from(this.getGameSession().getBoard().getEnemyEntitiesForEntity(this.getCard()))) {
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
ModifierOverwatchSpellTargetDamageEnemies.initClass();

module.exports = ModifierOverwatchSpellTargetDamageEnemies;
