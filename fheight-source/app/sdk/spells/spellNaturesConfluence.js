/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity =   require('./spellSpawnEntity.js');
const Factions = require('app/sdk/cards/factionsLookup.js');
const Races = require('app/sdk/cards/racesLookup.js');

class SpellNaturesConfluence extends SpellSpawnEntity {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    // pick random battle pet ONCE, all battle pets that get spawned will be the same pet
    if (!this.cardDataOrIndexToSpawn) {
      // pull faction battle pets + neutral token battle pets
      const factionBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction5).getRace(Races.BattlePet).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      const neutralBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getRace(Races.BattlePet).getIsToken(true).getIsPrismatic(false).getIsSkinned(false).getCards();
      const battlePetCards = [].concat(factionBattlePetCards, neutralBattlePetCards);

      const card = battlePetCards[this.getGameSession().getRandomIntegerForExecution(battlePetCards.length)];
      this.cardDataOrIndexToSpawn = card.createNewCardData();
    }

    // spawn random battle pet
    const spawnAction = this.getSpawnAction(x, y, this.cardDataOrIndexToSpawn);
    if (spawnAction != null) {
      return this.getGameSession().executeAction(spawnAction);
    }
  }
}

module.exports = SpellNaturesConfluence;
