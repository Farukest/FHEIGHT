/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Modifier = require('./modifier');
const ModifierSynergize = require('./modifierSynergize');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

/*
This modifier is used to apply modifiers to entities around an entity on synergize (when bloodborn spell is activated).
*/
class ModifierSynergizeApplyModifiers extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeApplyModifiers";
    this.type ="ModifierSynergizeApplyModifiers";
  
    this.description = "";
  
    this.prototype.modifiersContextObjects = null; // modifier context objects for modifiers to apply
    this.prototype.managedByCard = false; // whether card with opening gambit should manage the modifiers applied, i.e. when the card is silenced/killed these modifiers are removed
    this.prototype.auraIncludeSelf = true; // whether modifiers should target card with opening gambit
    this.prototype.auraIncludeAlly = true; // whether modifiers should target allied units
    this.prototype.auraIncludeEnemy = true; // whether modifiers should target enemy units
    this.prototype.auraIncludeGeneral = true; // whether modifiers should target enemy units
    this.prototype.auraRadius = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSynergize", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, managedByCard, auraIncludeSelf, auraIncludeAlly, auraIncludeEnemy, auraIncludeGeneral, auraRadius, description, options) {
    if (managedByCard == null) { managedByCard = false; }
    if (auraIncludeSelf == null) { auraIncludeSelf = true; }
    if (auraIncludeAlly == null) { auraIncludeAlly = true; }
    if (auraIncludeEnemy == null) { auraIncludeEnemy = true; }
    if (auraIncludeGeneral == null) { auraIncludeGeneral = true; }
    if (auraRadius == null) { auraRadius = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.managedByCard = managedByCard;
    contextObject.auraIncludeAlly = auraIncludeAlly;
    contextObject.auraIncludeEnemy = auraIncludeEnemy;
    contextObject.auraIncludeSelf = auraIncludeSelf;
    contextObject.auraIncludeGeneral = auraIncludeGeneral;
    contextObject.auraRadius = auraRadius;
    contextObject.description = description;
    return contextObject;
  }

  static createContextObjectForAllUnitsAndGenerals(modifiersContextObjects, managedByCard, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, true, true, true, true, CONFIG.WHOLE_BOARD_RADIUS, description, options);
  }

  static createContextObjectForAllies(modifiersContextObjects, managedByCard, auraRadius, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, false, true, false, false, auraRadius, description, options);
  }

  static createContextObjectForNearbyAllies(modifiersContextObjects, managedByCard, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, false, true, false, false, 1, description, options);
  }

  static createContextObjectForAllAllies(modifiersContextObjects, managedByCard, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, false, true, false, false, CONFIG.WHOLE_BOARD_RADIUS, description, options);
  }

  static createContextObjectForEnemies(modifiersContextObjects, managedByCard, auraRadius, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, false, false, true, false, auraRadius, description, options);
  }

  static createContextObjectForNearbyEnemies(modifiersContextObjects, managedByCard, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, false, false, true, false, 1, description, options);
  }

  static createContextObjectForAllEnemies(modifiersContextObjects, managedByCard, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, false, false, true, false, CONFIG.WHOLE_BOARD_RADIUS, description, options);
  }

  static createContextObjectForAllAlliesAndSelf(modifiersContextObjects, managedByCard, description, options) {
    return this.createContextObject(modifiersContextObjects, managedByCard, true, true, false, false, CONFIG.WHOLE_BOARD_RADIUS, description, options);
  }

  onSynergize() {
    if (this.modifiersContextObjects != null) {
      return Array.from(this.getAffectedEntities()).map((entity) =>
        Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
          this.managedByCard ?
            this.getGameSession().applyModifierContextObject(modifierContextObject, entity, this)
          :
            this.getGameSession().applyModifierContextObject(modifierContextObject, entity)));
    }
  }

  getAffectedEntities() {
    const entityList = this.getGameSession().getBoard().getCardsWithinRadiusOfPosition(this.getCard().position, this.auraFilterByCardType, this.auraRadius, this.auraIncludeSelf, true, true);
    const affectedEntities = [];
    for (var entity of Array.from(entityList)) {
      if ((this.auraIncludeAlly && entity.getIsSameTeamAs(this.getCard())) || (this.auraIncludeEnemy && !entity.getIsSameTeamAs(this.getCard()))) {
        if (this.auraIncludeGeneral || !entity.getIsGeneral()) {
          affectedEntities.push(entity);
        }
      }
    }
    return affectedEntities;
  }
}
ModifierSynergizeApplyModifiers.initClass();


module.exports = ModifierSynergizeApplyModifiers;
