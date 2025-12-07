/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const KillAction = require('app/sdk/actions/killAction');

class ModifierWhenAttackedDestroyThis extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierWhenAttackedDestroyThis";
    this.type ="ModifierWhenAttackedDestroyThis";
  }

  onAfterAction(event) {
    super.onAfterAction(event);
    const {
      action
    } = event;

    // when attacked, remove self immediately
    if (action instanceof AttackAction && (action.getTarget() === this.getCard()) && !action.getIsImplicit()) {
      if (__guard__(this.getCard(), x => x.getIsActive())) {
        const killAction = new KillAction(this.getGameSession());
        killAction.setOwnerId(this.getCard().getOwnerId());
        killAction.setSource(this.getCard());
        killAction.setTarget(this.getCard());
        return this.getGameSession().executeAction(killAction);
      }
    }
  }
}
ModifierWhenAttackedDestroyThis.initClass();

module.exports = ModifierWhenAttackedDestroyThis;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}