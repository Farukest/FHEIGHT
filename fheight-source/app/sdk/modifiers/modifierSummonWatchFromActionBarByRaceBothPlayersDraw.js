/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatchFromActionBar = require('./modifierSummonWatchFromActionBar');
const DrawCardAction = require('app/sdk/actions/drawCardAction');

class ModifierSummonWatchFromActionBarByRaceBothPlayersDraw extends ModifierSummonWatchFromActionBar {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchFromActionBarByRaceBothPlayersDraw";
    this.type ="ModifierSummonWatchFromActionBarByRaceBothPlayersDraw";
  
    this.prototype.targetRaceId = null;
    this.prototype.drawAmount = 1;
  }

  static createContextObject(targetRaceId, drawAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.targetRaceId = targetRaceId;
    contextObject.drawAmount = drawAmount;
    return contextObject;
  }

  onSummonWatch(action) {

    return (() => {
      const result = [];
      for (let x = 1, end = this.drawAmount, asc = 1 <= end; asc ? x <= end : x >= end; asc ? x++ : x--) {
        var general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
        this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), general.getOwnerId()));

        var enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
        result.push(this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), enemyGeneral.getOwnerId())));
      }
      return result;
    })();
  }

  getIsCardRelevantToWatcher(card) {
    return card.getBelongsToTribe(this.targetRaceId);
  }
}
ModifierSummonWatchFromActionBarByRaceBothPlayersDraw.initClass();

module.exports = ModifierSummonWatchFromActionBarByRaceBothPlayersDraw;
