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
const ModifierDyingWish = require('./modifierDyingWish');
const DieAction = require('app/sdk/actions/dieAction');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierDyingWishEquipArtifactFromDeck extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishEquipArtifactFromDeck";
    this.type ="ModifierDyingWishEquipArtifactFromDeck";
    this.description = "Equip %X from your deck";
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
        return this.description.replace(/%X/, ""+modifierContextObject.numArtifacts+" random artifacts");
      }
    } else {
      return this.description;
    }
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.canConvertCardToPrismatic = false; // equiping an actual card, so don't convert to prismatic based on this card

    return p;
  }

  onDyingWish(action) {
    super.onDyingWish(action);

    const gameSession = this.getGameSession();
    if (gameSession.getIsRunningAsAuthoritative()) {
      let cardIndex;
      const cardIndicesToPlay = [];

      // find indices of artifacts
      const drawPile = this.getCard().getOwner().getDeck().getDrawPile();
      const indexOfArtifacts = [];
      for (let i = 0; i < drawPile.length; i++) {
        cardIndex = drawPile[i];
        if (__guard__(gameSession.getCardByIndex(cardIndex), x => x.getType()) === CardType.Artifact) {
          indexOfArtifacts.push(i);
        }
      }

      // find all artifacts on the General
      const general = gameSession.getGeneralForPlayerId(this.getCard().getOwnerId());
      const modifiersByArtifact = general.getArtifactModifiersGroupedByArtifactCard();

      // make sure we don't try to equip more than 3 artifacts
      let numArtifactsToEquip = this.numArtifacts;
      if ((modifiersByArtifact.length + numArtifactsToEquip) > CONFIG.MAX_ARTIFACTS) {
        numArtifactsToEquip = CONFIG.MAX_ARTIFACTS - modifiersByArtifact.length;
      }

      // find X random artifacts
      for (let j = 0, end = numArtifactsToEquip, asc = 0 <= end; asc ? j < end : j > end; asc ? j++ : j--) {
        if (indexOfArtifacts.length > 0) {
          var artifactIndexToRemove = this.getGameSession().getRandomIntegerForExecution(indexOfArtifacts.length);
          var indexOfCardInDeck = indexOfArtifacts[artifactIndexToRemove];
          indexOfArtifacts.splice(artifactIndexToRemove,1);
          cardIndicesToPlay.push(drawPile[indexOfCardInDeck]);
        }
      }

      // equip the random artifacts from deck
      if ((cardIndicesToPlay != null) && (cardIndicesToPlay.length > 0)) {
        return (() => {
          const result = [];
          for (cardIndex of Array.from(cardIndicesToPlay)) {
            var playCardAction = new PlayCardSilentlyAction(gameSession, this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, cardIndex);
            playCardAction.setSource(this.getCard());
            result.push(gameSession.executeAction(playCardAction));
          }
          return result;
        })();
      }
    }
  }
}
ModifierDyingWishEquipArtifactFromDeck.initClass();

module.exports = ModifierDyingWishEquipArtifactFromDeck;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}