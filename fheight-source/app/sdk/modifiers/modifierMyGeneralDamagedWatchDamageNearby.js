/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierMyGeneralDamagedWatch = require('./modifierMyGeneralDamagedWatch');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierMyGeneralDamagedWatchDamageNearby extends ModifierMyGeneralDamagedWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyGeneralDamagedWatchDamageNearby";
    this.type ="ModifierMyGeneralDamagedWatchDamageNearby";
  
    this.modifierName ="My General Damage Watch Damage Nearby";
    this.description = "Whenever your General takes damage, deal %X damage to %Y";
  
    this.prototype.damageAmount = 0;
    this.prototype.includeAllies = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyGeneralDamagedWatch", "FX.Modifiers.ModifierGenericDamageNearby"];
  }

  static createContextObject(damageAmount, includeAllies, options) {
    if (includeAllies == null) { includeAllies = false; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    contextObject.includeAllies = includeAllies;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      let replaceText = this.description.replace(/%X/, modifierContextObject.damageAmount);
      if (modifierContextObject.includeAllies) {
        replaceText = replaceText.replace(/%Y/, "a random nearby minion");
      } else {
        replaceText = replaceText.replace(/%Y/, "a random nearby enemy minion");
      }
      return replaceText;
    } else {
      return this.description;
    }
  }

  onDamageDealtToGeneral(action) {
    super.onDamageDealtToGeneral(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let entities;
      if (this.includeAllies) {
        entities = this.getGameSession().getBoard().getEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
      } else {
        entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
      }

      // don't damage the Generals with this counter-attack
      const validEntities = [];
      for (var entity of Array.from(entities)) {
        if (!entity.getIsGeneral()) {
          validEntities.push(entity);
        }
      }

      if (validEntities.length > 0) {
        const unitToDamage = validEntities[this.getGameSession().getRandomIntegerForExecution(validEntities.length)];
        const damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getCard().getOwnerId());
        damageAction.setSource(this.getCard());
        damageAction.setTarget(unitToDamage);
        damageAction.setDamageAmount(this.damageAmount);
        return this.getGameSession().executeAction(damageAction);
      }
    }
  }
}
ModifierMyGeneralDamagedWatchDamageNearby.initClass();

module.exports = ModifierMyGeneralDamagedWatchDamageNearby;
