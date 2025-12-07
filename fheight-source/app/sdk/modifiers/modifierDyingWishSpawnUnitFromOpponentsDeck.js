/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const ModifierDyingWish = require('./modifierDyingWish');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');

class ModifierDyingWishSpawnUnitFromOpponentsDeck extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishSpawnUnitFromOpponentsDeck";
    this.type ="ModifierDyingWishSpawnUnitFromOpponentsDeck";
  
    this.description = "Summon %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(spawnDescription, spawnCount, spawnPattern, spawnSilently,options) {
    if (spawnDescription == null) { spawnDescription = "random minion"; }
    if (spawnCount == null) { spawnCount = 1; }
    if (spawnPattern == null) { spawnPattern = CONFIG.PATTERN_1x1; }
    if (spawnSilently == null) { spawnSilently = true; }
    const contextObject = super.createContextObject(options);
    contextObject.spawnDescription = spawnDescription;
    contextObject.spawnCount = spawnCount;
    contextObject.spawnPattern = spawnPattern;
    contextObject.spawnSilently = spawnSilently;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      let replaceText = "";
      if (UtilsPosition.getArraysOfPositionsAreEqual(modifierContextObject.spawnPattern, CONFIG.PATTERN_1x1)) {
        replaceText = "a "+modifierContextObject.spawnDescription+" from the opponent\'s deck on this space";
      } else if (modifierContextObject.spawnCount === 1) {
        replaceText = "a "+modifierContextObject.spawnDescription+" from the opponent\'s deck in a random nearby space";
      } else if (modifierContextObject.spawnCount === 8) {
        replaceText = ""+modifierContextObject.spawnDescription+"s from the opponent\'s deck in all nearby spaces";
      } else {
        replaceText = ""+modifierContextObject.spawnDescription+"s from the opponent\'s deck into "+modifierContextObject.spawnCount+" nearby spaces";
      }
      return this.description.replace(/%X/, replaceText);
    } else {
      return this.description;
    }
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.canConvertCardToPrismatic = false; // stealing an actual card, so don't convert to prismatic based on this card

    return p;
  }

  onDyingWish(action) {
    super.onDyingWish(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let card, cardIndex, spawnCount;
      const opponentsDeck = this.getGameSession().getOpponentPlayerOfPlayerId(this.getCard().getOwnerId()).getDeck();
      const indexesOfMinions = [];
      const gameSession = this.getGameSession();
      const drawPile = opponentsDeck.getDrawPile();
      for (let i = 0; i < drawPile.length; i++) {
        cardIndex = drawPile[i];
        card = gameSession.getCardByIndex(cardIndex);
        if ((card != null) && (card.getType() === CardType.Unit)) {
          indexesOfMinions.push(i);
        }
      }

      if (UtilsPosition.getArraysOfPositionsAreEqual(this.contextObject != null ? this.contextObject.spawnPattern : undefined, CONFIG.PATTERN_1x1)) {
        spawnCount = 1;
      } else {
        ({
          spawnCount
        } = this);
      }

      let numSpawned = 0;
      return (() => {
        const result = [];
        while ((indexesOfMinions.length > 0) && (numSpawned < spawnCount)) {
          numSpawned++;
          var indexOfCardInDeck = indexesOfMinions.splice(this.getGameSession().getRandomIntegerForExecution(indexesOfMinions.length), 1)[0];
          cardIndex = drawPile[indexOfCardInDeck];
          card = this.getGameSession().getCardByIndex(cardIndex);
          var spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), action.getTargetPosition(), this.spawnPattern, card, this.getCard(), 1);

          result.push((() => {
            const result1 = [];
            for (var position of Array.from(spawnLocations)) {
              var playCardAction;
              if (!this.spawnSilently) {
                playCardAction = new PlayCardAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, cardIndex);
              } else {
                playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, cardIndex);
              }
              playCardAction.setSource(this.getCard());
              result1.push(this.getGameSession().executeAction(playCardAction));
            }
            return result1;
          })());
        }
        return result;
      })();
    }
  }
}
ModifierDyingWishSpawnUnitFromOpponentsDeck.initClass();

module.exports = ModifierDyingWishSpawnUnitFromOpponentsDeck;
