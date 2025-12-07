/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierAction = require('./modifierAction');

/*
  Action used for modifier deactivation.
*/
class ModifierDeactivatedAction extends ModifierAction {
  static initClass() {
  
    this.type = "ModifierDeactivatedAction";
    this.prototype.type = "ModifierDeactivatedAction";
  }
}
ModifierDeactivatedAction.initClass();

module.exports = ModifierDeactivatedAction;
