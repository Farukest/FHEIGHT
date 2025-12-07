/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellDamage = require('./spellDamage');

class SpellDamageOwnGeneral extends SpellDamage {

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = [];

    // can only target enemy general
    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    if (general != null) {
      // apply spell on enemy General
      applyEffectPositions.push(general.getPosition());
    }

    return applyEffectPositions;
  }
}

module.exports = SpellDamageOwnGeneral;
