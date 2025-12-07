/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyTeamMoveWatchAnyReason = require('./modifierMyTeamMoveWatchAnyReason');

class ModifierMyTeamMoveWatchAnyReasonBuffTarget extends ModifierMyTeamMoveWatchAnyReason {
  static initClass() {
  
    this.prototype.type ="ModifierMyTeamMoveWatchAnyReasonBuffTarget";
    this.type ="ModifierMyTeamMoveWatchAnyReasonBuffTarget";
  
    this.modifierName ="My Team Move Watch Any Reason Buff Target";
    this.description = "Whenever a friendly minion is moved for any reason, %Y";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyTeamMoveWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modContextObject, description, options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modContextObject;
    contextObject.modDescription = description;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%Y/, modifierContextObject.modDescription);
    } else {
      return this.description;
    }
  }

  onMyTeamMoveWatch(action, buffTarget) {
    // apply modifiers to card being summoned
    if (buffTarget != null) {
      return Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
        this.getGameSession().applyModifierContextObject(modifierContextObject, buffTarget));
    }
  }
}
ModifierMyTeamMoveWatchAnyReasonBuffTarget.initClass();

module.exports = ModifierMyTeamMoveWatchAnyReasonBuffTarget;
