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
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierEndTurnWatchDamageNearbyEnemy extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchDamageNearbyEnemy";
    this.type ="ModifierEndTurnWatchDamageNearbyEnemy";
  
    this.modifierName ="End Watch";
    this.description ="At the end of your turn, deal %X damage to all %Y";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch", "FX.Modifiers.ModifierGenericDamageNearby"];
  }

  static createContextObject(damageAmount, damageGenerals, options) {
    if (damageAmount == null) { damageAmount = 1; }
    if (damageGenerals == null) { damageGenerals = false; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    contextObject.damageGenerals = damageGenerals;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      let replaceText = this.description.replace(/%X/, modifierContextObject.damageAmount);
      if (modifierContextObject.damageGenerals) {
        replaceText = replaceText.replace(/%Y/, "nearby enemies");
      } else {
        replaceText = replaceText.replace(/%Y/, "nearby enemy minions");
      }
      return replaceText;
    } else {
      return this.description;
    }
  }

  onTurnWatch(action) {
    const entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
      // don't damage enemy General unless specifically allowed, but do damage enemy units
        if (this.damageGenerals || (!this.damageGenerals && !entity.getIsGeneral())) {
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
ModifierEndTurnWatchDamageNearbyEnemy.initClass();

module.exports = ModifierEndTurnWatchDamageNearbyEnemy;
