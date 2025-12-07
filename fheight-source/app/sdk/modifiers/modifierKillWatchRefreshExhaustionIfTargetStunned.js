/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierKillWatchRefreshExhaustion = require('./modifierKillWatchRefreshExhaustion');
const ModifierStunned = require('./modifierStunned');

class ModifierKillWatchRefreshExhaustionIfTargetStunned extends ModifierKillWatchRefreshExhaustion {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchRefreshExhaustionIfTargetStunned";
    this.type ="ModifierKillWatchRefreshExhaustionIfTargetStunned";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierKillWatch"];
  }

  onKillWatch(action) {

    const target = action.getTarget();
    if ((target != null) && target.hasActiveModifierClass(ModifierStunned)) {
      return super.onKillWatch();
    }
  }
}
ModifierKillWatchRefreshExhaustionIfTargetStunned.initClass();

module.exports = ModifierKillWatchRefreshExhaustionIfTargetStunned;
