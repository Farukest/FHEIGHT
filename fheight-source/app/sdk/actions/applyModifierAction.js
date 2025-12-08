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
const UtilsJavascript =     require('app/common/utils/utils_javascript');
const Action = require('./action');
const _ = require("underscore");

class ApplyModifierAction extends Action {
  static initClass() {
  
    this.type ="ApplyModifierAction";
  
    this.prototype.isDepthFirst = true; // modifier actions should execute immediately
    this.prototype.modifierContextObject = null; // context object that will create the modifier
    this.prototype.parentModifierIndex = null; // index of modifier that applied or removed this modifier
    this.prototype.auraModifierId = null;
  
    this.prototype.getCard = this.prototype.getTarget;
     // identifier for which modifier in the parentModifier aura this is
  }

  constructor(gameSession, modifierContextObject, card, parentModifier=null, auraModifierId=null) {
    super(gameSession);
    this.type = ApplyModifierAction.type;
    this.setModifierContextObject(modifierContextObject);
    this.setTarget(card);
    this.setParentModifier(parentModifier);
    this.setAuraModifierId(auraModifierId);
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    // cache
    p.cachedModifier = null;
    p.cachedParentModifier = null;

    return p;
  }

  getLogName() {
    return super.getLogName() + "_" + __guard__(this.getModifier(), x => x.getLogName());
  }

  setModifierContextObject(val) {
    // copy data so we don't modify anything unintentionally
    if ((val != null) && _.isObject(val)) {
      return this.modifierContextObject = UtilsJavascript.fastExtend({}, val);
    } else {
      return this.modifierContextObject = val;
    }
  }

  getModifierContextObject() {
    return this.modifierContextObject;
  }

  getModifier() {
    if ((this._private.cachedModifier == null)) {
      this._private.cachedModifier = this.getGameSession().getOrCreateModifierFromContextObjectOrIndex(this.modifierContextObject);
    }
    return this._private.cachedModifier;
  }

  setParentModifierIndex(val) {
    return this.parentModifierIndex = val;
  }

  getParentModifierIndex() {
    return this.parentModifierIndex;
  }

  setParentModifier(parentModifier) {
    return this.setParentModifierIndex(parentModifier != null ? parentModifier.getIndex() : undefined);
  }

  getParentModifier() {
    if ((this._private.cachedParentModifier == null) && (this.parentModifierIndex != null)) {
      this._private.cachedParentModifier = this.getGameSession().getModifierByIndex(this.parentModifierIndex);
    }
    return this._private.cachedParentModifier;
  }

  setAuraModifierId(val) {
    return this.auraModifierId = val;
  }

  getAuraModifierId() {
    return this.auraModifierId;
  }

  _execute() {
    super._execute();

    const modifier = this.getModifier();
    const target = this.getTarget();
    const parentModifier = this.getParentModifier();

    if (modifier != null) {
      //Logger.module("SDK").debug("#{@getGameSession().gameId} ApplyModifierAction._execute -> modifier #{modifier?.getLogName()} on #{target?.getLogName()} from parent modifier #{parentModifier?.getLogName()}")
      // regenerate context object so we transmit the correct values to the clients
      if (this.getGameSession().getIsRunningAsAuthoritative()) {
        // apply incoming card data before regenerating
        modifier.applyContextObject(this.modifierContextObject);
        this.modifierContextObject = modifier.createContextObject(this.modifierContextObject);

        // flag data as applied locally so that we don't reapply regenerated data on server
        this.modifierContextObject._hasBeenApplied = true;
      }

      // set modifier as applied by this action
      modifier.setAppliedByAction(this);

      // apply modifier
      this.getGameSession().p_applyModifier(modifier, target, parentModifier, this.modifierContextObject, this.auraModifierId);

      // update context object post apply so we transmit the correct values to the clients
      if (this.getGameSession().getIsRunningAsAuthoritative()) { return this.modifierContextObject = modifier.updateContextObjectPostApply(this.modifierContextObject); }
    }
  }

  scrubSensitiveData(actionData, scrubFromPerspectiveOfPlayerId, forSpectator) {
    // transform modifier as needed
    const modifier = this.getModifier();
    if ((modifier != null) && modifier.isHideable(scrubFromPerspectiveOfPlayerId, forSpectator)) {
      const hiddenModifier = modifier.createModifierToHideAs();
      actionData.modifierContextObject = hiddenModifier.createContextObject();
    }
    return actionData;
  }
}
ApplyModifierAction.initClass();

module.exports = ApplyModifierAction;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}