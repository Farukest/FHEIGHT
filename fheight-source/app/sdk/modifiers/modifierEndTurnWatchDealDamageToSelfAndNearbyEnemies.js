/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierEndTurnWatchDealDamageToSelfAndNearbyEnemies extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchDealDamageToSelfAndNearbyEnemies";
    this.type ="ModifierEndTurnWatchDealDamageToSelfAndNearbyEnemies";
  
    this.modifierName ="End Watch";
    this.description ="At the end of your turn, deal %X damage to self and all nearby enemies";
  
    this.prototype.damageAmount = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch", "FX.Modifiers.ModifierExplosionsNearby"];
  }

  static createContextObject(damageAmount, damageGenerals, damageAmountDelta, options) {
    if (damageAmount == null) { damageAmount = 1; }
    if (damageGenerals == null) { damageGenerals = true; }
    if (damageAmountDelta == null) { damageAmountDelta = 2; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    contextObject.damageGenerals = damageGenerals;
    contextObject.damageAmountDelta = damageAmountDelta;
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
    let damageAction;
    const entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    for (var entity of Array.from(entities)) {
      // don't damage enemy General unless specifically allowed, but do damage enemy units
      if (this.damageGenerals || (!this.damageGenerals && !entity.getIsGeneral())) {
        damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getCard().getOwnerId());
        damageAction.setSource(this.getCard());
        damageAction.setTarget(entity);
        damageAction.setDamageAmount(this._private.currentDamageAmount);
        this.getGameSession().executeAction(damageAction);
      }
    }

    //damage self too
    damageAction = new DamageAction(this.getGameSession());
    damageAction.setOwnerId(this.getCard().getOwnerId());
    damageAction.setSource(this.getCard());
    damageAction.setTarget(this.getCard());
    damageAction.setDamageAmount(this._private.currentDamageAmount);
    this.getGameSession().executeAction(damageAction);

    //increment the damage amount
    this._private.currentDamageAmount *= this.damageAmountDelta;
    const description1 = `At the end of ${this.getCard().getIsGeneral() ? this.getCard().getName() + "'s" : "your"} turn, deal `;
    const description2 = " damage to self and all nearby enemies.";
    const updatedDamage = this._private.currentDamageAmount;
    let descriptionFinal = description1.concat(updatedDamage);
    descriptionFinal = descriptionFinal.concat(description2);

    this.contextObject.description = descriptionFinal;
    this._private.cachedDescription = descriptionFinal;
    return this.getCard().flushCachedDescription();
  }



  onActivate() {
    super.onActivate();
    return this._private.currentDamageAmount = this.damageAmount;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.currentDamageAmount = this.damageAmount;

    return p;
  }
}
ModifierEndTurnWatchDealDamageToSelfAndNearbyEnemies.initClass();

module.exports = ModifierEndTurnWatchDealDamageToSelfAndNearbyEnemies;
