/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatchSpawnEntity = require('./modifierTakeDamageWatchSpawnEntity');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierTakeDamageWatchSpawnRandomHaunt extends ModifierTakeDamageWatchSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchSpawnRandomHaunt";
    this.type ="ModifierTakeDamageWatchSpawnRandomHaunt";
  
    this.description ="Whenever this minion takes damage, summon a random haunt nearby";
  
    this.prototype.possibleTokens = [
      {id: Cards.Boss.Boss31Haunt1 },
      {id: Cards.Boss.Boss31Haunt2 },
      {id: Cards.Boss.Boss31Haunt3 }
    ];
  }

  getCardDataOrIndexToSpawn() {
    return this.possibleTokens[this.getGameSession().getRandomIntegerForExecution(this.possibleTokens.length)];
  }
}
ModifierTakeDamageWatchSpawnRandomHaunt.initClass();

module.exports = ModifierTakeDamageWatchSpawnRandomHaunt;
