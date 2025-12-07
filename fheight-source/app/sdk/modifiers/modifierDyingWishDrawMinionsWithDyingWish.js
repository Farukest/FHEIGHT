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
const CardType = require('app/sdk/cards/cardType');
const ModifierDyingWish = require('./modifierDyingWish');

class ModifierDyingWishDrawMinionsWithDyingWish extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishDrawMinionsWithDyingWish";
    this.type ="ModifierDyingWishDrawMinionsWithDyingWish";
  
    this.description = "Draw minions with a Dying Wish";
  
    this.prototype.numMinions = 0;
  }

  static createContextObject(numMinions) {
    if (numMinions == null) { numMinions = 0; }
    const contextObject = super.createContextObject();
    contextObject.numMinions = numMinions;
    return contextObject;
  }

  onDyingWish(action) {
    super.onDyingWish();

    const gameSession = this.getGameSession();
    if (gameSession.getIsRunningAsAuthoritative()) {
      // calculate minions to draw on the server, since only the server knows contents of both decks
      let cardIndex, cardIndicesToDraw;
      if (!cardIndicesToDraw) {
        cardIndicesToDraw = [];

        // find indices of minions with Dying Wish
        const drawPile = this.getCard().getOwner().getDeck().getDrawPile();
        const indexOfMinions = [];
        for (let i = 0; i < drawPile.length; i++) {
          cardIndex = drawPile[i];
          var cardAtIndex = gameSession.getCardByIndex(cardIndex);
          if ((cardAtIndex != null) && (cardAtIndex.getType() === CardType.Unit)) {
            for (var kwClass of Array.from(cardAtIndex.getKeywordClasses())) {
              if ((kwClass.belongsToKeywordClass(ModifierDyingWish)) && (cardAtIndex.hasModifierClass(ModifierDyingWish))) {
                indexOfMinions.push(i);
                break;
              }
            }
          }
        }

        // find X random dying wish minions
        for (let j = 0, end = this.numMinions, asc = 0 <= end; asc ? j < end : j > end; asc ? j++ : j--) {
          if (indexOfMinions.length > 0) {
            var minionIndexToRemove = this.getGameSession().getRandomIntegerForExecution(indexOfMinions.length);
            var indexOfCardInDeck = indexOfMinions[minionIndexToRemove];
            indexOfMinions.splice(minionIndexToRemove,1);
            cardIndicesToDraw.push(drawPile[indexOfCardInDeck]);
          }
        }
      }

      // put the random minions from deck into hand
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
ModifierDyingWishDrawMinionsWithDyingWish.initClass();

module.exports = ModifierDyingWishDrawMinionsWithDyingWish;
