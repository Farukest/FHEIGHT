/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOverwatchMovedNearby = require('./modifierOverwatchMovedNearby');

class ModifierOverwatchMovedNearbyAttack extends ModifierOverwatchMovedNearby {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchMovedNearbyAttack";
    this.type ="ModifierOverwatchMovedNearbyAttack";
  }

  onOverwatch(action) {
    const source = action.getSource();
    const attackAction = this.getCard().actionAttack(source);
    attackAction.setIsStrikebackAllowed(false);
    return this.getGameSession().executeAction(attackAction);
  }
}
ModifierOverwatchMovedNearbyAttack.initClass();

module.exports = ModifierOverwatchMovedNearbyAttack;
