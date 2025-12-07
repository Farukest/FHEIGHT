/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierTakeDamageWatchSpawnEntity = require('./modifierTakeDamageWatchSpawnEntity');
const Factions = require('app/sdk/cards/factionsLookup.js');
const Races = require('app/sdk/cards/racesLookup.js');

class ModifierTakeDamageWatchSpawnRandomBattlePet extends ModifierTakeDamageWatchSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchSpawnRandomBattlePet";
    this.type ="ModifierTakeDamageWatchSpawnRandomBattlePet";
  
    this.description ="Whenever this minion takes damage, summon a random Battle Pet nearby";
  }

  getCardDataOrIndexToSpawn() {
    const neutralBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getRace(Races.BattlePet).getIsToken(true).getIsPrismatic(false).getIsSkinned(false).getCards();
    const card = neutralBattlePetCards[this.getGameSession().getRandomIntegerForExecution(neutralBattlePetCards.length)];
    return card.createNewCardData();
  }
}
ModifierTakeDamageWatchSpawnRandomBattlePet.initClass();

module.exports = ModifierTakeDamageWatchSpawnRandomBattlePet;
