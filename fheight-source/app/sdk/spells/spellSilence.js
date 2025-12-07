/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell =           require('./spell');
const IntentType =         require('app/sdk/intentType');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType =       require('./spellFilterType');
const ModifierSilence =     require('app/sdk/modifiers/modifierSilence');
const _ = require('underscore');

class SpellSilence extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Entity;
    this.prototype.spellFilterType = SpellFilterType.NeutralDirect;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const entities = board.getEntitiesAtPosition(applyEffectPosition, true);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        if (entity != null) {
          result.push(this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), entity));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  _getEntitiesForFilter() {
    const entities = super._getEntitiesForFilter(true); // allow untargetable (tile) entities
    const silenceableEntities = [];
    for (var entity of Array.from(entities)) {
      // both tiles and units can be dispelled
      if ((entity != null) && ((entity.getType() === CardType.Tile) || (entity.getType() === CardType.Unit))) {
        // only add the position as valid once, for the first
        if (!_.contains(silenceableEntities, entity)) {
          silenceableEntities.push(entity);
        }
      }
    }

    return silenceableEntities;
  }
}
SpellSilence.initClass();


module.exports = SpellSilence;
