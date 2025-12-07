/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('./playerModifier');

class PlayerModifierEndTurnWatchRevertBBS extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierEndTurnWatchRevertBBS";
    this.type ="PlayerModifierEndTurnWatchRevertBBS";
  
    this.prototype.bbsToRevertTo = null;
  }

  static createContextObject(bbsToRevertTo) {
    const contextObject = super.createContextObject();
    contextObject.bbsToRevertTo = bbsToRevertTo;
    return contextObject;
  }

  onEndTurn(action) {
    super.onEndTurn(action);
    if (this.bbsToRevertTo != null) {
      this.getCard().setSignatureCardData(this.bbsToRevertTo);
      return this.getGameSession().executeAction(this.getCard().getOwner().actionGenerateSignatureCard());
    }
  }
}
PlayerModifierEndTurnWatchRevertBBS.initClass();

module.exports = PlayerModifierEndTurnWatchRevertBBS;
