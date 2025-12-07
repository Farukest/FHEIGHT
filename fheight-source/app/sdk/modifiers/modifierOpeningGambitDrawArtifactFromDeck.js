/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DieAction = require('app/sdk/actions/dieAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierOpeningGambitDrawArtifactFromDeck extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitDrawArtifactFromDeck";
    this.type ="ModifierOpeningGambitDrawArtifactFromDeck";
  
    this.description = "Draw %X from your deck";
  }

  static createContextObject(numArtifacts) {
    if (numArtifacts == null) { numArtifacts = 1; }
    const contextObject = super.createContextObject();
    contextObject.numArtifacts = numArtifacts;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      if (modifierContextObject.numArtifacts <= 1) {
        return this.description.replace(/%X/, "a random artifact");
      } else {
        return this.description.replace(/%X/, "up to "+modifierContextObject.numArtifacts+" Artifacts");
      }
    } else {
      return this.description;
    }
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    const gameSession = this.getGameSession();
    if (gameSession.getIsRunningAsAuthoritative()) {
      // calculate artifacts to draw on the server, since only the server knows contents of both decks
      let cardIndex, cardIndicesToDraw;
      if (!cardIndicesToDraw) {
        cardIndicesToDraw = [];

        // find indices of artifacts
        const drawPile = this.getCard().getOwner().getDeck().getDrawPile();
        const indexOfArtifacts = [];
        for (let i = 0; i < drawPile.length; i++) {
          cardIndex = drawPile[i];
          if (__guard__(gameSession.getCardByIndex(cardIndex), x => x.getType()) === CardType.Artifact) {
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
      }

      // put the random artifacts from deck into hand
      if (cardIndicesToDraw && (cardIndicesToDraw.length > 0)) {
        return (() => {
          const result = [];
          for (cardIndex of Array.from(cardIndicesToDraw)) {
            var drawCardAction =  this.getGameSession().getPlayerById(this.getCard().getOwnerId()).getDeck().actionDrawCard(cardIndex);
            result.push(this.getGameSession().executeAction(drawCardAction));
          }
          return result;
        })();
      }
    }
  }
}
ModifierOpeningGambitDrawArtifactFromDeck.initClass();

module.exports = ModifierOpeningGambitDrawArtifactFromDeck;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}