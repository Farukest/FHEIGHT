/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');

class PlayerModifierChangeSignatureCard extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierChangeSignatureCard";
    this.type ="PlayerModifierChangeSignatureCard";
  }

  static createContextObject(cardDataOrIndex, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndex = cardDataOrIndex;
    return contextObject;
  }

  getSignatureCardData() {
    return this.cardDataOrIndex;
  }

  onActivate()  {
    super.onActivate();

    return this.getGameSession().executeAction(this.getPlayer().actionGenerateSignatureCard());
  }

  onDeactivate()  {
    super.onDeactivate();

    return this.getGameSession().executeAction(this.getPlayer().actionGenerateSignatureCard());
  }
}
PlayerModifierChangeSignatureCard.initClass();

module.exports = PlayerModifierChangeSignatureCard;
