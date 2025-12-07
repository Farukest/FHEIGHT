/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Modifier = require('./modifier');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const CardType = require('app/sdk/cards/cardType');
const PlaySignatureCardAction = require('app/sdk/actions/playSignatureCardAction');

class ModifierSynergizeSpawnEntityFromDeck extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeSpawnEntityFromDeck";
    this.type ="ModifierSynergizeSpawnEntityFromDeck";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = true;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = false;
  
    this.prototype.maxStacks = 1;
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.spawnLocation = null;
  }

  static createContextObject(cardDataOrIndexToSpawn, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    return contextObject;
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;

    // watch for a spell being cast from Signature Card slot by player who owns this entity
    if ((action instanceof PlaySignatureCardAction) && (action.getOwnerId() === this.getCard().getOwnerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Spell)) {
      return this.onSynergize(action);
    }
  }

  onSynergize(action) {

    let card;
    console.log("hsdflkjsdflksdjfsdlkfj MAKING IT HERE");

    const deck = this.getOwner().getDeck();
    const drawPile = deck.getDrawPile();
    const indexesOfMinions = [];
    for (let i = 0; i < drawPile.length; i++) {
      var cardIndex = drawPile[i];
      card = this.getGameSession().getCardByIndex(cardIndex);
      if ((card != null) && (card.getType() === CardType.Unit) && (card.getBaseCardId() === this.cardDataOrIndexToSpawn.id)) {
        indexesOfMinions.push(i);
      }
    }

    console.log("indexesOfMinions = ", indexesOfMinions);

    if (indexesOfMinions.length > 0) {
      const indexOfCardInDeck = indexesOfMinions[this.getGameSession().getRandomIntegerForExecution(indexesOfMinions.length)];
      const cardIndexToDraw = drawPile[indexOfCardInDeck];
      card = this.getGameSession().getCardByIndex(cardIndexToDraw);
      const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

      const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), general.getPosition(), CONFIG.PATTERN_3x3, card);
      if ((validSpawnLocations != null ? validSpawnLocations.length : undefined) > 0) {
        const spawnLocation = validSpawnLocations[this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length)];

        if (spawnLocation != null) {
          const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), spawnLocation.x, spawnLocation.y, card);
          playCardAction.setSource(this.getCard());
          return this.getGameSession().executeAction(playCardAction);
        }
      }
    }
  }
}
ModifierSynergizeSpawnEntityFromDeck.initClass();

module.exports = ModifierSynergizeSpawnEntityFromDeck;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}