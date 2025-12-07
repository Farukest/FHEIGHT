const SpellApplyModifiers = require('./spellApplyModifiers');

class SpellApplyModifiersToUnitAndGeneral extends SpellApplyModifiers {

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = super._findApplyEffectPositions(position, sourceAction);

    // also affects General
    applyEffectPositions.push(this.getGameSession().getGeneralForPlayerId(this.getOwnerId()).getPosition());

    return applyEffectPositions;
  }
}

module.exports = SpellApplyModifiersToUnitAndGeneral;
