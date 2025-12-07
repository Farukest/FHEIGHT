/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const RemoveAction =  require('app/sdk/actions/removeAction');
const i18next = require('i18next');

class ModifierEphemeral extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEphemeral";
    this.type ="ModifierEphemeral";
  
    this.isKeyworded = true;
    this.keywordDefinition =i18next.t("modifiers.ephemeral_def");
  
    this.isHiddenToUI = true;
    this.modifierName =i18next.t("modifiers.ephemeral_name");
    this.description =null;
    this.prototype.isRemovable = false;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEphemeral"];
  }

  onEndTurn()  {
    super.onEndTurn();

    // then remove entity from the board (just remove, don't die)
    const removeAction = this.getGameSession().createActionForType(RemoveAction.type);
    removeAction.setSource(this.getCard());
    removeAction.setTarget(this.getCard());
    return this.getGameSession().executeAction(removeAction);
  }
}
ModifierEphemeral.initClass();

module.exports = ModifierEphemeral;
