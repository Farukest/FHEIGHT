/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierReplaceWatchSpawnEntity = require('./modifierReplaceWatchSpawnEntity');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierInquisitorKron extends ModifierReplaceWatchSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierInquisitorKron";
    this.type ="ModifierInquisitorKron";
  
    this.prototype.prisonerList = [{id: Cards.Neutral.Prisoner1}, {id: Cards.Neutral.Prisoner2}, {id: Cards.Neutral.Prisoner3}, {id: Cards.Neutral.Prisoner5}, {id: Cards.Neutral.Prisoner6}];
  }

  onReplaceWatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      this.cardDataOrIndexToSpawn = this.prisonerList[this.getGameSession().getRandomIntegerForExecution(this.prisonerList.length)];
      return super.onReplaceWatch(action);
    }
  }
}
ModifierInquisitorKron.initClass();

module.exports = ModifierInquisitorKron;
