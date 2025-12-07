/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellIntensify = require('./spellIntensify');
const HealAction = require('app/sdk/actions/healAction');

class SpellIntensifyHealMyGeneral extends SpellIntensify {
  static initClass() {
  
    this.prototype.healAmount = 0;
  }

  _findApplyEffectPositions(position, sourceAction) {
    return [this.getGameSession().getGeneralForPlayerId(this.getOwnerId()).getPosition()];
  }

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    const totalHealAmount = this.healAmount * this.getIntensifyAmount();

    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getOwnerId());
    healAction.setTarget(general);
    healAction.setHealAmount(totalHealAmount);
    return this.getGameSession().executeAction(healAction);
  }
}
SpellIntensifyHealMyGeneral.initClass();

module.exports = SpellIntensifyHealMyGeneral;
