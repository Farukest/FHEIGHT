/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Action = require('./action');

class RemoveModifierAction extends Action {
  static initClass() {
  
    this.type ="RemoveModifierAction";
  
    this.prototype.isDepthFirst = true; // modifier actions should execute immediately
    this.prototype.modifierIndex = null;
  
    this.prototype.getCard = this.prototype.getTarget;
     // index of modifier to remove
  }

  constructor(gameSession, modifier) {
    super(gameSession);
    if (this.type == null) { this.type = RemoveModifierAction.type; }
    this.setModifier(modifier);
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.cachedModifier = null;

    return p;
  }

  getLogName() {
    return super.getLogName() + "_" + __guard__(this.getModifier(), x => x.getLogName());
  }

  setModifierIndex(val) {
    return this.modifierIndex = val;
  }

  getModifierIndex() {
    return this.modifierIndex;
  }

  setModifier(modifier) {
    return this.setModifierIndex(modifier != null ? modifier.getIndex() : undefined);
  }

  getModifier() {
    if (this.modifierIndex != null) {
      if (this._private.cachedModifier == null) { this._private.cachedModifier = this.getGameSession().getModifierByIndex(this.modifierIndex); }
      return this._private.cachedModifier;
    }
  }

  getTargetIndex() {
    return __guard__(this.getModifier(), x => x.getCardAffectedIndex());
  }

  getTarget() {
    if ((this._private.target == null) && (this.modifierIndex != null)) {
      this._private.target = __guard__(this.getModifier(), x => x.getCardAffected());
    }
    return this._private.target;
  }

  _execute() {
    super._execute();

    const modifier = this.getModifier();
    if (modifier != null) {
      //Logger.module("SDK").debug("#{@getGameSession().gameId} RemoveModifierAction._execute -> modifier #{modifier?.getLogName()}")
      // set modifier as removed by this action
      modifier.setRemovedByAction(this);

      // remove modifier
      return this.getGameSession().p_removeModifier(modifier);
    }
  }
}
RemoveModifierAction.initClass();

module.exports = RemoveModifierAction;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}