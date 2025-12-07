const SpellDamage = require('./spellDamage');


class SpellDamageUnitAndGeneral extends SpellDamage {

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = super._findApplyEffectPositions(position, sourceAction);
    const general = this.getGameSession().getGeneralForPlayerId(this.getGameSession().getOpponentPlayerOfPlayerId(this.getOwnerId()).getPlayerId());
    applyEffectPositions.push(general.getPosition());
    return applyEffectPositions;
  }
}

module.exports = SpellDamageUnitAndGeneral;
