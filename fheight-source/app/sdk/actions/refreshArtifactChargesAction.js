/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');
const CardType =       require('app/sdk/cards/cardType');

class RefreshArtifactChargesAction extends Action {
  static initClass() {
  
    this.type ="RefreshArtifactChargesAction";
    this.prototype.fxResource = ["FX.Actions.RefreshArtifacts"];
  }

  constructor() {
    super(...arguments);
    this.type = RefreshArtifactChargesAction.type;
  }

  _execute() {
    super._execute();
    const target = this.getTarget();
    if ((target != null) && target.getIsGeneral()) {
      //iterate over all modifiers, and if any have durabilty < maxDurablity, refresh them to max
      //(only artifacts have durability, regular modifiers do not)
      const allModifiers = target.getModifiers();
      return (() => {
        const result = [];
        for (var modifier of Array.from(allModifiers)) {
          if ((modifier != null) && (modifier.getDurability() < modifier.getMaxDurability())) {
            result.push(modifier.setDurability(modifier.getMaxDurability()));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
RefreshArtifactChargesAction.initClass();

module.exports = RefreshArtifactChargesAction;
