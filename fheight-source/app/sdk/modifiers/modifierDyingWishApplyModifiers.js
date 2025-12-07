/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierDyingWish = require('./modifierDyingWish');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

class ModifierDyingWishApplyModifiers extends ModifierDyingWish {
  static initClass() {
  
    /*
    This modifier is used to apply modifiers entities around an entity when that entity dies.
    examples:
    All nearby friendly minions gain strikeback
    All nearby enemy minions gain -2 attack
    */
  
    this.prototype.type ="ModifierDyingWishApplyModifiers";
    this.type ="ModifierDyingWishApplyModifiers";
  
    this.description = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericBuff"];
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

  onDyingWish(action) {
    if (this.modifiersContextObjects != null) {
      return Array.from(this.getAffectedEntities()).map((entity) =>
        Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
          this.getGameSession().applyModifierContextObject(modifierContextObject, entity)));
    }
  }

  getAffectedEntities(action) {
    const entityList = this.getGameSession().getBoard().getCardsWithinRadiusOfPosition(this.getCard().position, this.auraFilterByCardType, this.auraRadius, this.auraIncludeSelf);
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
ModifierDyingWishApplyModifiers.initClass();


module.exports = ModifierDyingWishApplyModifiers;
