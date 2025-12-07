/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DrawCardAction = require('app/sdk/actions/drawCardAction');
const CardType = require('app/sdk/cards/cardType');
const Modifier = require('./modifier');
const CONFIG = require('app/common/config');


class ModifierOpeningGambitDrawCardBothPlayers extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDrawCardBothPlayers";
    this.type = "ModifierOpeningGambitDrawCardBothPlayers";
  
    this.modifierName = "Opening Gambit";
    this.description = "Both players draw a card";
  
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject();
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.damageAmount);
    } else {
      return this.description;
    }
  }

  onOpeningGambit() {
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), general.getOwnerId()));

    const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    return this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), enemyGeneral.getOwnerId()));
  }
}
ModifierOpeningGambitDrawCardBothPlayers.initClass();

module.exports = ModifierOpeningGambitDrawCardBothPlayers;
