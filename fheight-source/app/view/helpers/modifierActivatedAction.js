/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierAction = require('./modifierAction');

/*
  Action used for modifier activation.
*/
class ModifierActivatedAction extends ModifierAction {
  static initClass() {
  
    this.type = "ModifierActivatedAction";
    this.prototype.type = "ModifierActivatedAction";
  }
}
ModifierActivatedAction.initClass();

module.exports = ModifierActivatedAction;
