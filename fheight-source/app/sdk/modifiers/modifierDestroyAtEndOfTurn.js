/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const KillAction = require('app/sdk/actions/killAction');
const i18next = require('i18next');

class ModifierDestroyAtEndOfTurn extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDestroyAtEndOfTurn";
    this.type ="ModifierDestroyAtEndOfTurn";
  
    this.prototype.maxStacks = 1;
  
    this.prototype.durationEndTurn = 1;
  
    this.modifierName = "";
    this.description =i18next.t("modifiers.destroy_at_end_of_turn_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDestroyAtEndOfTurn"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    return this.description;
  }

  onExpire() {
    super.onExpire();

    const killAction = new KillAction(this.getGameSession());
    killAction.setOwnerId(this.getCard().getOwnerId());
    killAction.setSource(this.getCard());
    killAction.setTarget(this.getCard());
    return this.getGameSession().executeAction(killAction);
  }
}
ModifierDestroyAtEndOfTurn.initClass();

module.exports = ModifierDestroyAtEndOfTurn;
