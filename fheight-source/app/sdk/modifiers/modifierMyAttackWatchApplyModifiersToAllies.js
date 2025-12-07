/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackWatch = require('./modifierMyAttackWatch');

class ModifierMyAttackWatchApplyModifiersToAllies extends ModifierMyAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackWatchApplyModifiersToAllies";
    this.type ="ModifierMyAttackWatchApplyModifiersToAllies";
  
    this.prototype.modifierContextObjects = null;
    this.prototype.includeGeneral = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modifiers, includeGeneral, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifierContextObjects = modifiers;
    contextObject.includeGeneral = includeGeneral;
    return contextObject;
  }

  onMyAttackWatch(action) {

    const friendlyEntities = this.getGameSession().getBoard().getFriendlyEntitiesForEntity(this.getCard());
    return (() => {
      const result = [];
      for (var entity of Array.from(friendlyEntities)) {
        if (!entity.getIsGeneral() || this.includeGeneral) {
          result.push(Array.from(this.modifierContextObjects).map((modifier) =>
            this.getGameSession().applyModifierContextObject(modifier, entity)));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierMyAttackWatchApplyModifiersToAllies.initClass();

module.exports = ModifierMyAttackWatchApplyModifiersToAllies;
