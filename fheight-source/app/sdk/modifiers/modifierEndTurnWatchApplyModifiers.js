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
const HealAction = require('app/sdk/actions/healAction');

class ModifierEndTurnWatchApplyModifiers extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchApplyModifiers";
    this.type ="ModifierEndTurnWatchApplyModifiers";
  
    this.modifierName ="End Watch";
    this.description ="At the end of your turn, %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, auraIncludeSelf, auraIncludeAlly, auraIncludeEnemy, auraRadius, canTargetGeneral, description, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.auraIncludeAlly = auraIncludeAlly;
    contextObject.auraIncludeEnemy = auraIncludeEnemy;
    contextObject.auraIncludeSelf = auraIncludeSelf;
    contextObject.auraRadius = auraRadius;
    contextObject.canTargetGeneral = canTargetGeneral;
    contextObject.description = description;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.description);
    } else {
      return this.description;
    }
  }

  onTurnWatch(action) {
    if (this.modifiersContextObjects != null) {
      return Array.from(this.getAffectedEntities()).map((entity) =>
        Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
          this.getGameSession().applyModifierContextObject(modifierContextObject, entity)));
    }
  }

  getAffectedEntities(action) {
    const entityList = this.getGameSession().getBoard().getCardsWithinRadiusOfPosition(this.getCard().getPosition(), this.auraFilterByCardType, this.auraRadius, this.auraIncludeSelf);
    const affectedEntities = [];
    for (var entity of Array.from(entityList)) {
      if ((this.auraIncludeAlly && entity.getIsSameTeamAs(this.getCard())) || (this.auraIncludeEnemy && !entity.getIsSameTeamAs(this.getCard()))) {
        if (this.canTargetGeneral || !entity.getIsGeneral()) {
          affectedEntities.push(entity);
        }
      }
    }
    return affectedEntities;
  }
}
ModifierEndTurnWatchApplyModifiers.initClass();

module.exports = ModifierEndTurnWatchApplyModifiers;
