/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const CardType = require('app/sdk/cards/cardType');
const ModifierStunned =     require('app/sdk/modifiers/modifierStunned');

class SpellYellRealLoud extends SpellApplyModifiers {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};

    const targetEntity = board.getUnitAtPosition(applyEffectPosition);

    const entities = board.getEnemyEntitiesAroundEntity(targetEntity, CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        if (!entity.getIsGeneral()) {
          result.push(this.getGameSession().applyModifierContextObject(ModifierStunned.createContextObject(), entity));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}

module.exports = SpellYellRealLoud;
