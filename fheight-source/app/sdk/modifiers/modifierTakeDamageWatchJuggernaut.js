/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Races = require('app/sdk/cards/racesLookup');
const ModifierEgg = require('app/sdk/modifiers/modifierEgg');
const GameFormat = require('app/sdk/gameFormat');

class ModifierTakeDamageWatchJuggernaut extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchJuggernaut";
    this.type ="ModifierTakeDamageWatchJuggernaut";
  
    this.modifierName ="Take Damage Watch";
    this.description ="When this takes damage, summon that many random Golem eggs";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierTakeDamageWatch", "FX.Modifiers.ModifierGenericSpawn"];
  }

  onDamageTaken(action) {
    super.onDamageTaken(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const spawnLocations = [];
      const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, this.getCard());
      for (let i = 0, end = action.getTotalDamageAmount(), asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        if (validSpawnLocations.length > 0) {
          spawnLocations.push(validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0]);
        }
      }

      let golemCards = [];
      if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
        golemCards = this.getGameSession().getCardCaches().getIsLegacy(false).getRace(Races.Golem).getIsHiddenInCollection(false).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      } else {
        golemCards = this.getGameSession().getCardCaches().getRace(Races.Golem).getIsHiddenInCollection(false).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      }

      if (golemCards.length > 0) {
        return (() => {
          const result = [];
          for (var position of Array.from(spawnLocations)) {
            var cardDataOrIndexToSpawn = {id: Cards.Faction5.Egg};
            // add modifiers to card data
            var card = golemCards[this.getGameSession().getRandomIntegerForExecution(golemCards.length)];
            if (cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
            cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierEgg.createContextObject(card.createNewCardData(), card.getName()));
            var spawnAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, cardDataOrIndexToSpawn);
            spawnAction.setSource(this.getCard());
            result.push(this.getGameSession().executeAction(spawnAction));
          }
          return result;
        })();
      }
    }
  }
}
ModifierTakeDamageWatchJuggernaut.initClass();


module.exports = ModifierTakeDamageWatchJuggernaut;
