/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOverwatch = require('./modifierOverwatch');
const AttackAction = require('./../actions/attackAction');

class ModifierOverwatchAttacked extends ModifierOverwatch {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchAttacked";
    this.type ="ModifierOverwatchAttacked";
  
    this.description = "When this minion is attacked, %X";
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject != null) {
      return this.description.replace(/%X/, modifierContextObject.description);
    } else {
      return super.getDescription();
    }
  }

  getIsActionRelevant(action) {
    // watch for explicit attacks on this unit
    return action instanceof AttackAction && !action.getIsImplicit() && (action.getTarget() === this.getCard());
  }
}
ModifierOverwatchAttacked.initClass();

module.exports = ModifierOverwatchAttacked;
