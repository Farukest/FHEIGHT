/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const KillAction = require('app/sdk/actions/killAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierOpeningGambitDestroyNearbyMinions extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDestroyNearbyMinions";
    this.type = "ModifierOpeningGambitDestroyNearbyMinions";
  
    this.modifierName = "Opening Gambit";
    this.description = "Destroy %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericChainLightningRed"];
  }

  static createContextObject(includeAllies, options) {
    if (includeAllies == null) { includeAllies = true; }
    const contextObject = super.createContextObject();
    contextObject.includeAllies = includeAllies;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      let replaceText;
      if (modifierContextObject.includeAllies) {
        replaceText = " ALL nearby minions";
      } else {
        replaceText = " all nearby enemy minions";
      }
      return this.description.replace(/%X/, replaceText);
    } else {
      return this.description;
    }
  }

  onOpeningGambit() {
    let entities;
    if (this.includeAllies) {
      entities = this.getGameSession().getBoard().getEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    } else {
      entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    }

    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        if (!entity.getIsGeneral()) { // this ability only kills minions, not Generals
          var killAction = new KillAction(this.getGameSession());
          killAction.setOwnerId(this.getCard().getOwnerId());
          killAction.setSource(this.getCard());
          killAction.setTarget(entity);
          result.push(this.getGameSession().executeAction(killAction));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierOpeningGambitDestroyNearbyMinions.initClass();

module.exports = ModifierOpeningGambitDestroyNearbyMinions;
