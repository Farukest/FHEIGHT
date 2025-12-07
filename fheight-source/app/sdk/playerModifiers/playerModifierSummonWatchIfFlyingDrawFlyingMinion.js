/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifierSummonWatchFromActionBar = require('./playerModifierSummonWatchFromActionBar');
const CardType = require('app/sdk/cards/cardType');
const ModifierFlying = require('app/sdk/modifiers/modifierFlying');

class PlayerModifierSummonWatchIfFlyingDrawFlyingMinion extends PlayerModifierSummonWatchFromActionBar {
  static initClass() {
  
    this.prototype.type ="PlayerModifierSummonWatchIfFlyingDrawFlyingMinion";
    this.type ="PlayerModifierSummonWatchIfFlyingDrawFlyingMinion";
  }

  onSummonWatch(action) {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const cardSummoned = action.getTarget();
      if ((cardSummoned != null) && cardSummoned.hasModifierClass(ModifierFlying)) {
        let cardIndexToDraw = null;

        // find all flying minions in the deck
        const drawPile = this.getOwner().getDeck().getDrawPile();
        const indexOfFlyingMinions = [];
        for (let i = 0; i < drawPile.length; i++) {
          var cardIndex = drawPile[i];
          var cardAtIndex = this.getGameSession().getCardByIndex(cardIndex);
          if ((cardAtIndex != null ? cardAtIndex.getType() : undefined) === CardType.Unit) {
            if (cardAtIndex.hasModifierClass(ModifierFlying)) {
              indexOfFlyingMinions.push(i);
            }
          }
        }

        if (indexOfFlyingMinions.length > 0) {
          const minionIndexToRemove = this.getGameSession().getRandomIntegerForExecution(indexOfFlyingMinions.length);
          const indexOfCardInDeck = indexOfFlyingMinions[minionIndexToRemove];
          cardIndexToDraw = drawPile[indexOfCardInDeck];

          // create put card in hand action
          if (cardIndexToDraw != null) {
            const card = this.getGameSession().getCardByIndex(cardIndexToDraw);
            const drawCardAction = this.getGameSession().getPlayerById(this.getOwner().getPlayerId()).getDeck().actionDrawCard(cardIndexToDraw);
            drawCardAction.isDepthFirst = true;
            return this.getGameSession().executeAction(drawCardAction);
          }
        }
      }
    }
  }
}
PlayerModifierSummonWatchIfFlyingDrawFlyingMinion.initClass();

module.exports = PlayerModifierSummonWatchIfFlyingDrawFlyingMinion;
