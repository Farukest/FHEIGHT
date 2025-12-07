/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifierEmblemSummonWatch = require('./playerModifierEmblemSummonWatch');
const RandomDamageAction = require('app/sdk/actions/randomDamageAction');

class PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest extends PlayerModifierEmblemSummonWatch {
  static initClass() {
  
    this.prototype.type ="PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest";
    this.type ="PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest";
  
    this.prototype.maxStacks = 1;
  }

  onSummonWatch(action) {

    const unit = action.getTarget();
    if ((unit != null) && (unit.getManaCost() > 0)) {
      const randomDamageAction = new RandomDamageAction(this.getGameSession());
      randomDamageAction.setOwnerId(this.getCard().getOwnerId());
      randomDamageAction.setSource(unit);
      randomDamageAction.setDamageAmount(unit.getManaCost());
      randomDamageAction.canTargetGenerals = true;
      return this.getGameSession().executeAction(randomDamageAction);
    }
  }
}
PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest.initClass();

module.exports = PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest;
