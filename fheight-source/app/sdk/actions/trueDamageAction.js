/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DamageAction =     require('./damageAction');
const _ = require('underscore');

/*
  True damage actions cannot be modified in any way and always deals the exact damage initially set in the action.
*/
class TrueDamageAction extends DamageAction {
  static initClass() {
  
    this.type ="TrueDamageAction";
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = TrueDamageAction.type; }
  }

  getTotalDamageAmount() {
    return this.getDamageAmount();
  }
}
TrueDamageAction.initClass();

module.exports = TrueDamageAction;
