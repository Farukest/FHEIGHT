/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierApplyMinionToBoardWatch = require('./modifierApplyMinionToBoardWatch');

const i18next = require('i18next');

class ModifierApplyMinionToBoardWatchApplyModifiersToTarget extends ModifierApplyMinionToBoardWatch {
  static initClass() {
  
    this.prototype.type ="ModifierApplyMinionToBoardWatchApplyModifiersToTarget";
    this.type ="ModifierApplyMinionToBoardWatchApplyModifiersToTarget";
  
    this.modifierName =i18next.t("modifiers.apply_minion_to_board_watch_apply_modifiers_to_target_name");
    this.description =i18next.t("modifiers.apply_minion_to_board_watch_apply_modifiers_to_target_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierApplyMinionToBoardWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, buffDescription, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.buffDescription = buffDescription;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return i18next.t("modifiers.apply_minion_to_board_watch_apply_modifiers_to_target_def",{desc:this.buffDescription});
    } else {
      return this.description;
    }
  }

  onApplyToBoardWatch(action) {
    const summonedUnitPosition = __guard__(action.getTarget(), x => x.getPosition());

    if (this.modifiersContextObjects != null) {
      const entity = action.getTarget();
      if (entity != null) {
        return Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
          this.getGameSession().applyModifierContextObject(modifierContextObject, entity));
      }
    }
  }
}
ModifierApplyMinionToBoardWatchApplyModifiersToTarget.initClass();

module.exports = ModifierApplyMinionToBoardWatchApplyModifiersToTarget;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}