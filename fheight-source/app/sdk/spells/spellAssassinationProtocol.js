/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellRefreshExhaustion = require('./spellRefreshExhaustion');
const ModifierCannotAttackGeneral = require('app/sdk/modifiers/modifierCannotAttackGeneral');
const ModifierCannotDamageGenerals = require('app/sdk/modifiers/modifierCannotDamageGenerals');

class SpellAssassinationProtocol extends SpellRefreshExhaustion {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const unit = board.getUnitAtPosition(applyEffectPosition);
    if (unit != null) {
      const cantAttackGeneralModifier = ModifierCannotAttackGeneral.createContextObject();
      cantAttackGeneralModifier.durationEndTurn = 1;
      cantAttackGeneralModifier.isRemovable = false;
      this.getGameSession().applyModifierContextObject(cantAttackGeneralModifier, unit);

      const cantDamageGeneralModifier = ModifierCannotDamageGenerals.createContextObject();
      cantDamageGeneralModifier.durationEndTurn = 1;
      cantDamageGeneralModifier.isRemovable = false;
      return this.getGameSession().applyModifierContextObject(cantDamageGeneralModifier, unit);
    }
  }
}

module.exports = SpellAssassinationProtocol;
