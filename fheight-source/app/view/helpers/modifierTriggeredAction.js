/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierAction = require('./modifierAction');

/*
  Action used for modifier removal.
*/
class ModifierTriggeredAction extends ModifierAction {
  static initClass() {
  
    this.type = "ModifierTriggeredAction";
    this.prototype.type = "ModifierTriggeredAction";
  }
}
ModifierTriggeredAction.initClass();

module.exports = ModifierTriggeredAction;
