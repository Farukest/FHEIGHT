/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierKillWatch = require('./modifierKillWatch');
const Races = require('app/sdk/cards/racesLookup');
const CardType = require('app/sdk/cards/cardType');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierKillWatchDeceptibot extends ModifierKillWatch {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchDeceptibot";
    this.type ="ModifierKillWatchDeceptibot";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierKillWatch"];
  }

  onKillWatch(action) {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      // find all mechs in the deck
      const drawPile = this.getOwner().getDeck().getDrawPile();
      const indexesOfMechs = [];
      for (let i = 0; i < drawPile.length; i++) {
        var cardIndex = drawPile[i];
        var cardAtIndex = this.getGameSession().getCardByIndex(cardIndex);
        if (((cardAtIndex != null ? cardAtIndex.getType() : undefined) === CardType.Unit) && (cardAtIndex.getRaceId() === Races.Mech) && (cardAtIndex.getBaseCardId() !== Cards.Neutral.Deceptibot)) {
          indexesOfMechs.push(i);
        }
      }

      if (indexesOfMechs.length > 0) {
        const minionIndexToRemove = this.getGameSession().getRandomIntegerForExecution(indexesOfMechs.length);
        const indexOfCardInDeck = indexesOfMechs[minionIndexToRemove];
        const cardIndexToDraw = drawPile[indexOfCardInDeck];

        const card = this.getGameSession().getCardByIndex(cardIndexToDraw);

        let spawnLocation = null;
        const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, card);
        if ((validSpawnLocations != null ? validSpawnLocations.length : undefined) > 0) {
          spawnLocation = validSpawnLocations[this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length)];

          if (spawnLocation != null) {
            const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), spawnLocation.x, spawnLocation.y, card);
            playCardAction.setSource(this.getCard());
            return this.getGameSession().executeAction(playCardAction);
          }
        }
      }
    }
  }
}
ModifierKillWatchDeceptibot.initClass();

module.exports = ModifierKillWatchDeceptibot;
