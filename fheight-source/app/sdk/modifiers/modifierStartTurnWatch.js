/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DieAction = require('app/sdk/actions/dieAction');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierStartTurnWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatch";
    this.type ="ModifierStartTurnWatch";
  
    this.modifierName ="Start Turn Watch";
    this.description = "Start Turn Watch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch"];
  }

  onStartTurn(e) {
    super.onStartTurn(e);

    if (this.getCard().isOwnersTurn()) {
      const action = this.getGameSession().getExecutingAction();
      return this.onTurnWatch(action);
    }
  }

  onTurnWatch(action) {}
}
ModifierStartTurnWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierStartTurnWatch;
