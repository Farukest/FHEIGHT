/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellSpawnEntity = require('./spellSpawnEntity');
const DieAction = require('app/sdk/actions/dieAction');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Rarity = require('app/sdk/cards/rarityLookup');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

var SpellFollowupSpawnEntityFromDeck = (function() {
  let hasSearchedForCardOnSendingSide = undefined;
  SpellFollowupSpawnEntityFromDeck = class SpellFollowupSpawnEntityFromDeck extends SpellSpawnEntity {
    static initClass() {
  
      this.prototype.canBeAppliedAnywhere = false;
      this.prototype.spawnSilently = true;
      this.prototype.cardDataOrIndexToSpawn = null;
      hasSearchedForCardOnSendingSide = false;
       // search for card in deck once when sending request to play followup
    }

    getPrivateDefaults(gameSession) {
      const p = super.getPrivateDefaults(gameSession);

      p.cardToFind = {id: Cards.Faction1.Friendsguard}; // we're looking for a friendsguard
      p.hasSearchedForCard = false; // only search for the card in deck once locally

      return p;
    }

    getCardDataOrIndexToSpawn() {
      // if we haven't yet checked if the target card is in the deck
      if ((this.getGameSession().getIsRunningAsAuthoritative() && !this._private.hasSearchedForCard) || !this.hasSearchedForCardOnSendingSide) {
        // find the card in the deck
        const drawPile = this.getOwner().getDeck().getDrawPile();
        const indexesOfDraw = [];
        for (let i = 0; i < drawPile.length; i++) {
          var cardIndex = drawPile[i];
          var cardAtIndex = this.getGameSession().getCardByIndex(cardIndex);
          if (cardAtIndex.getBaseCardId() === this._private.cardToFind.id) {
            indexesOfDraw.push(i);
          }
        }

        if (indexesOfDraw.length > 0) {
          const minionIndexToPlay = this.getGameSession().getRandomIntegerForExecution(indexesOfDraw.length);
          const indexOfCardInDeck = indexesOfDraw[minionIndexToPlay];
          this.cardDataOrIndexToSpawn = drawPile[indexOfCardInDeck];
        }
        this.hasSearchedForCardOnSendingSide = true; // we won't check if the card is in deck again on sending side
        this._private.hasSearchedForCard = true;
      }
      return super.getCardDataOrIndexToSpawn();
    }


    _postFilterPlayPositions(validPositions) {
      this.getCardDataOrIndexToSpawn();
      if (!this.cardDataOrIndexToSpawn) {
        return super._postFilterPlayPositions([]);
      } else {
        return super._postFilterPlayPositions(validPositions);
      }
    }
  };
  SpellFollowupSpawnEntityFromDeck.initClass();
  return SpellFollowupSpawnEntityFromDeck;
})();

module.exports = SpellFollowupSpawnEntityFromDeck;
