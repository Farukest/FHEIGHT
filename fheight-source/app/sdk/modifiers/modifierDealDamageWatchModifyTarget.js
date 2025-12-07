/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const DamageAction = require('app/sdk/actions/damageAction');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const UtilsGameSession = require('app/common/utils/utils_game_session');

class ModifierDealDamageWatchModifyTarget extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchModifyTarget";
    this.type ="ModifierDealDamageWatchModifyTarget";
  
    this.description ="Whenever this minion damages an enemy minion, %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDealDamageWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiersContextObjects, description, options) {
    if (description == null) { description = ""; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.description = description;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject != null) {
      return this.description.replace(/%X/, modifierContextObject.description);
    } else {
      return this.description;
    }
  }

  onDealDamage(action) {
    const target = action.getTarget();
    if ((target != null) && (target.getOwnerId() !== this.getCard().getOwnerId()) && CardType.getIsEntityCardType(target.getType()) && !target.getIsGeneral()) { //don't fire when we hit a General, only when we hit a minion
      if (this.modifiersContextObjects != null) {
        return Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
          this.getGameSession().applyModifierContextObject(modifierContextObject, target));
      }
    }
  }
}
ModifierDealDamageWatchModifyTarget.initClass();

module.exports = ModifierDealDamageWatchModifyTarget;
