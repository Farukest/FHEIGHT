/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const CardType = require('app/sdk/cards/cardType');
const DrawCardAction = require('app/sdk/actions/drawCardAction');

class ModifierTakeDamageWatchOpponentDrawCard extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchOpponentDrawCard";
    this.type ="ModifierTakeDamageWatchOpponentDrawCard";
  }


  static createContextObject(options) {
    const contextObject = super.createContextObject(options);

    return contextObject;
  }

  onDamageTaken(action) {
    super.onDamageTaken(action);

    const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    return this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), enemyGeneral.getOwnerId()));
  }
}
ModifierTakeDamageWatchOpponentDrawCard.initClass();

module.exports = ModifierTakeDamageWatchOpponentDrawCard;
