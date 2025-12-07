/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellHeal = require('./spellHeal');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const DamageAction = require('app/sdk/actions/damageAction');

class SpellHealYourGeneral extends SpellHeal {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.None;
    this.prototype.healModifier = 0;
  }

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = [];

    // can only target enemy general
    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    if (general != null) { applyEffectPositions.push(general.getPosition()); }

    return applyEffectPositions;
  }
}
SpellHealYourGeneral.initClass();

module.exports = SpellHealYourGeneral;
