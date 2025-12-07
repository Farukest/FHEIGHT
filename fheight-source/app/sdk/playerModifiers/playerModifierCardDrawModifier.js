/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');
const CardType = require('app/sdk/cards/cardType');

class PlayerModifierCardDrawModifier extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierCardDrawModifier";
    this.type ="PlayerModifierCardDrawModifier";
  }

  static createContextObject(cardDrawChange, duration, options) {
    if (duration == null) { duration = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDrawChange = cardDrawChange;
    contextObject.durationStartTurn = duration;
    return contextObject;
  }

  getCardDrawChange() {
    if (this.getIsActive()) {
      return this.cardDrawChange;
    } else {
      return 0;
    }
  }
}
PlayerModifierCardDrawModifier.initClass();

module.exports = PlayerModifierCardDrawModifier;
