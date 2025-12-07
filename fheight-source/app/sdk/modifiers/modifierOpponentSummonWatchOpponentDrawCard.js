/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpponentSummonWatch = require('./modifierOpponentSummonWatch');
const DrawCardAction = require('app/sdk/actions/drawCardAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');

class ModifierOpponentSummonWatchOpponentDrawCard extends ModifierOpponentSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierOpponentSummonWatchOpponentDrawCard";
    this.type ="ModifierOpponentSummonWatchOpponentDrawCard";
  
    this.modifierName ="Opponent Summon Watch";
    this.description = "Whenever your opponent summons a minion, they draw a card";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpponentSummonWatch", "FX.Modifiers.ModifierGenericDamage"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    return this.description;
  }

  onSummonWatch(action) {
    if (action instanceof PlayCardFromHandAction) {
      const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
      return this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), enemyGeneral.getOwnerId()));
    }
  }
}
ModifierOpponentSummonWatchOpponentDrawCard.initClass();

module.exports = ModifierOpponentSummonWatchOpponentDrawCard;
