/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatch = require('./modifierSummonWatch');
const BurnCardAction =  require('app/sdk/actions/burnCardAction');

class ModifierSummonWatchBurnOpponentCards extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchBurnOpponentCards";
    this.type ="ModifierSummonWatchBurnOpponentCards";
  
    this.prototype.cardsToBurn = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch"];
  }

  static createContextObject(cardsToBurn, options) {
    if (cardsToBurn == null) { cardsToBurn = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.cardsToBurn = cardsToBurn;
    return contextObject;
  }

  onSummonWatch(action) {
    return (() => {
      const result = [];
      for (let i = 1, end = this.cardsToBurn, asc = 1 <= end; asc ? i <= end : i >= end; asc ? i++ : i--) {
        var burnCardAction = new BurnCardAction(this.getGameSession(), this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId()).getOwnerId());
        result.push(this.getGameSession().executeAction(burnCardAction));
      }
      return result;
    })();
  }
}
ModifierSummonWatchBurnOpponentCards.initClass();

module.exports = ModifierSummonWatchBurnOpponentCards;
