/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOverwatch = require('./modifierOverwatch');
const MoveAction = require('./../actions/moveAction');

class ModifierOverwatchMovedNearby extends ModifierOverwatch {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchMovedNearby";
    this.type ="ModifierOverwatchMovedNearby";
  
    this.description = "When an enemy minion moves next to this minion, %X";
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject != null) {
      return this.description.replace(/%X/, modifierContextObject.description);
    } else {
      return super.getDescription();
    }
  }

  getIsActionRelevant(action) {
    // watch for explicit minion move next to this unit
    if (action instanceof MoveAction && !action.getIsImplicit()) {
      const card = this.getCard();
      const source = action.getSource();
      if ((source !== card) && !source.getIsSameTeamAs(card) && !source.getIsGeneral()) {
        const myPosition = card.getPosition();
        const targetPosition = action.getTargetPosition();
        return (Math.abs(myPosition.x - targetPosition.x) <= 1) && (Math.abs(myPosition.y - targetPosition.y) <= 1);
      }
    }
    return false;
  }
}
ModifierOverwatchMovedNearby.initClass();

module.exports = ModifierOverwatchMovedNearby;
