/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Factions = require('app/sdk/cards/factionsLookup');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const GameFormat = require('app/sdk/gameFormat');

class SpellEquipVetArtifacts extends Spell {

  _filterApplyPositions(validPositions) {
    const finalPositions = [];
    const ownGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    finalPositions.push(ownGeneral.getPosition());

    return finalPositions;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    const gameSession = this.getGameSession();

    let vetArtifacts = [];
    if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
      vetArtifacts = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(Factions.Faction3).getType(CardType.Artifact).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
    } else {
      vetArtifacts = this.getGameSession().getCardCaches().getFaction(Factions.Faction3).getType(CardType.Artifact).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
    }

    if (vetArtifacts.length > 0) {
      const artifactData = [];
      for (var artifact of Array.from(vetArtifacts)) {
        artifactData.push(artifact);
      }

      const cardDataToPlay = [];
      const artifact1 = artifactData.splice(this.getGameSession().getRandomIntegerForExecution(artifactData.length),1)[0]; // random artifact
      const artifact2 = artifactData.splice(this.getGameSession().getRandomIntegerForExecution(artifactData.length),1)[0]; // random artifact
      cardDataToPlay.push(artifact1);
      cardDataToPlay.push(artifact2);

      // equip the random artifacts
      if ((cardDataToPlay != null) && (cardDataToPlay.length > 0)) {
        return (() => {
          const result = [];
          for (var cardData of Array.from(cardDataToPlay)) {
            var playCardAction = new PlayCardSilentlyAction(gameSession, this.getOwnerId(), x, y, cardData.createNewCardData());
            playCardAction.setSource(this);
            result.push(gameSession.executeAction(playCardAction));
          }
          return result;
        })();
      }
    }
  }
}

module.exports = SpellEquipVetArtifacts;
