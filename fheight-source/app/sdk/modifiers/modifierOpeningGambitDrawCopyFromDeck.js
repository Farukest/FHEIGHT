/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');

class ModifierOpeningGambitDrawCopyFromDeck extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDrawCopyFromDeck";
    this.type = "ModifierOpeningGambitDrawCopyFromDeck";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit() {

    let i;
    const drawPile = this.getOwner().getDeck().getDrawPile();
    let indexOfCard = -1;
    let cardFound = false;

    for (i = 0; i < drawPile.length; i++) {
      var cardIndex = drawPile[i];
      var cardAtIndex = this.getGameSession().getCardByIndex(cardIndex);
      if ((cardAtIndex != null ? cardAtIndex.getBaseCardId() : undefined) === this.getCard().getBaseCardId()) {
        indexOfCard = i;
        cardFound = true;
        break;
      }
    }

    if (cardFound) {
      const cardIndexToDraw = drawPile[i];
      if (cardIndexToDraw != null) {
        const card = this.getGameSession().getCardByIndex(cardIndexToDraw);
        const drawCardAction = this.getGameSession().getPlayerById(this.getOwner().getPlayerId()).getDeck().actionDrawCard(cardIndexToDraw);
        drawCardAction.isDepthFirst = true;
        return this.getGameSession().executeAction(drawCardAction);
      }
    }
  }
}
ModifierOpeningGambitDrawCopyFromDeck.initClass();

module.exports = ModifierOpeningGambitDrawCopyFromDeck;
