/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');

class SpellDrawArtifact extends Spell {
  static initClass() {
  
    this.prototype.numArtifacts = 1;
  }

  _findApplyEffectPositions(position, sourceAction) {
    return [this.getGameSession().getGeneralForPlayerId(this.getOwnerId()).getPosition()];
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    let cardIndex;
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    // find all spells in the deck
    const cardIndicesToDraw = [];
    const drawPile = this.getOwner().getDeck().getDrawPile();
    const indexOfArtifacts = [];
    for (let i = 0; i < drawPile.length; i++) {
      cardIndex = drawPile[i];
      if (__guard__(this.getGameSession().getCardByIndex(cardIndex), x1 => x1.getType()) === CardType.Artifact) {
        indexOfArtifacts.push(i);
      }
    }

    // find X random artifacts
    for (let j = 0, end = this.numArtifacts, asc = 0 <= end; asc ? j < end : j > end; asc ? j++ : j--) {
      if (indexOfArtifacts.length > 0) {
        var artifactIndexToRemove = this.getGameSession().getRandomIntegerForExecution(indexOfArtifacts.length);
        var indexOfCardInDeck = indexOfArtifacts[artifactIndexToRemove];
        indexOfArtifacts.splice(artifactIndexToRemove,1);
        cardIndicesToDraw.push(drawPile[indexOfCardInDeck]);
      }
    }

    // create put card in hand action
    if (cardIndicesToDraw && (cardIndicesToDraw.length > 0)) {
      return (() => {
        const result = [];
        for (cardIndex of Array.from(cardIndicesToDraw)) {
          var drawCardAction =  this.getGameSession().getPlayerById(this.getOwner().getPlayerId()).getDeck().actionDrawCard(cardIndex);
          result.push(this.getGameSession().executeAction(drawCardAction));
        }
        return result;
      })();
    }
  }
}
SpellDrawArtifact.initClass();

module.exports = SpellDrawArtifact;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}