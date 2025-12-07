/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierOpeningGambitSpawnPartyAnimals extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitSpawnPartyAnimals";
    this.type ="ModifierOpeningGambitSpawnPartyAnimals";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericSpawn"];
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    const possibleAnimals = [
      {id: Cards.Neutral.PartyAnimal1},
      {id: Cards.Neutral.PartyAnimal2},
      {id: Cards.Neutral.PartyAnimal3},
      {id: Cards.Neutral.PartyAnimal4}
    ];

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      const animalToSpawn = possibleAnimals.splice(this.getGameSession().getRandomIntegerForExecution(possibleAnimals.length), 1)[0];
      const animalCard = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(animalToSpawn);
      const ownerId = this.getOwnerId();
      const validSpawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), this.getGameSession().getGeneralForPlayerId(ownerId).getPosition(), CONFIG.PATTERN_3x3, animalCard, this.getCard(), 8);
      this.summonAnimals(animalToSpawn, ownerId, validSpawnLocations);

      const enemyAnimalToSpawn = possibleAnimals.splice(this.getGameSession().getRandomIntegerForExecution(possibleAnimals.length), 1)[0];
      const enemyAnimalCard = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(enemyAnimalToSpawn);
      const opponentId = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId()).getOwnerId();
      const enemyValidSpawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId()).getPosition(), CONFIG.PATTERN_3x3, enemyAnimalCard, this.getCard(), 8);
      return this.summonAnimals(enemyAnimalToSpawn, opponentId, enemyValidSpawnLocations);
    }
  }

  summonAnimals(animal, playerId, validSpawnLocations) {

    const spawnLocations = [];

    for (let i = 0; i < 3; i++) {
      if (validSpawnLocations.length > 0) {
        spawnLocations.push(validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0]);
      }
    }

    return (() => {
      const result = [];
      for (var position of Array.from(spawnLocations)) {
        var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), playerId, position.x, position.y, animal);
        playCardAction.setSource(this.getCard());
        result.push(this.getGameSession().executeAction(playCardAction));
      }
      return result;
    })();
  }
}
ModifierOpeningGambitSpawnPartyAnimals.initClass();

module.exports = ModifierOpeningGambitSpawnPartyAnimals;