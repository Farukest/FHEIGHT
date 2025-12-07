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

class RestoreChargeToAllArtifactsAction extends Action {
  static initClass() {
  
    this.type ="RestoreChargeToAllArtifactsAction";
    this.prototype.fxResource = ["FX.Actions.RefreshArtifacts"];
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = RestoreChargeToAllArtifactsAction.type; }
  }

  _execute() {
    super._execute();
    const target = this.getTarget();

    if ((target != null) && target.getIsGeneral()) {
      //iterate over all modifiers, and if any have durabilty < maxDurablity, add 1 durability
      //(only artifacts have durability, regular modifiers do not)
      const allModifiers = target.getModifiers();
      return (() => {
        const result = [];
        for (var modifier of Array.from(allModifiers)) {
          if ((modifier != null) && (modifier.getDurability() < modifier.getMaxDurability())) {
            result.push(modifier.setDurability(modifier.getDurability()+1));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
RestoreChargeToAllArtifactsAction.initClass();

module.exports = RestoreChargeToAllArtifactsAction;
