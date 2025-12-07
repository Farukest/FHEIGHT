/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Modifier = require('./modifier');
const ModifierWall = require('./modifierWall');
const ModifierOpeningGambitApplyModifiers = require('./modifierOpeningGambitApplyModifiers');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

class ModifierOpeningGambitRazorback extends ModifierOpeningGambitApplyModifiers {
  static initClass() {
  
    /*
    OpeningGambitApplyModifers - but specifically exclude walls minions
    */
  
    this.prototype.type ="ModifierOpeningGambitRazorback";
    this.type ="ModifierOpeningGambitRazorback";
  }

  static createContextObject(modifiersContextObjects, managedByCard, description, options) {
    const contextObject = super.createContextObject(modifiersContextObjects, managedByCard, false, true, false, false, CONFIG.WHOLE_BOARD_RADIUS, description, options);
    return contextObject;
  }

  getAffectedEntities() {
    const entityList = super.getAffectedEntities();
    const affectedEntities = [];
    for (var entity of Array.from(entityList)) {
      if (!entity.hasModifierType(ModifierWall.type)) {
        affectedEntities.push(entity);
      }
    }
    return affectedEntities;
  }
}
ModifierOpeningGambitRazorback.initClass();


module.exports = ModifierOpeningGambitRazorback;
