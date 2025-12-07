/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOverwatchMovedNearby = require('./modifierOverwatchMovedNearby');
const ModifierSilence = require('./modifierSilence');
const ModifierProvoke = require('./modifierProvoke');

class ModifierOverwatchMovedNearbyDispelAndProvoke extends ModifierOverwatchMovedNearby {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchMovedNearbyDispelAndProvoke";
    this.type ="ModifierOverwatchMovedNearbyDispelAndProvoke";
  }

  onOverwatch(action) {
    // dispel enemy
    const source = action.getSource();
    this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), source);

    // give provoke to self
    return this.getGameSession().applyModifierContextObject(ModifierProvoke.createContextObject(), this.getCard());
  }
}
ModifierOverwatchMovedNearbyDispelAndProvoke.initClass();

module.exports = ModifierOverwatchMovedNearbyDispelAndProvoke;
