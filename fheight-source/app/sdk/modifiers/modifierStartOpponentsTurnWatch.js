/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierStartOpponentsTurnWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierStartOpponentsTurnWatch";
    this.type ="ModifierStartOpponentsTurnWatch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  onStartTurn(e) {
    super.onStartTurn(e);

    if (!this.getCard().isOwnersTurn()) {
      const action = this.getGameSession().getExecutingAction();
      return this.onTurnWatch(action);
    }
  }

  onTurnWatch(action) {}
}
ModifierStartOpponentsTurnWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierStartOpponentsTurnWatch;
