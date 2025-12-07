/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const HealAction = require('app/sdk/actions/healAction');

class SpellResilience extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const position = {x, y};
    const unit = board.getUnitAtPosition(position);
    if (unit.getDamage() > 0) {
      const healAction = new HealAction(this.getGameSession());
      healAction.setOwnerId(this.getOwnerId());
      healAction.setTarget(unit);
      healAction.setHealAmount(unit.getDamage());
      this.getGameSession().executeAction(healAction);
    }

    const drawPile = this.getOwner().getDeck().getDrawPile();
    let indexOfCard = -1;
    let cardFound = false;

    for (let i = 0; i < drawPile.length; i++) {
      var cardIndex = drawPile[i];
      var cardAtIndex = this.getGameSession().getCardByIndex(cardIndex);
      if ((cardAtIndex != null ? cardAtIndex.getBaseCardId() : undefined) === unit.getBaseCardId()) {
        indexOfCard = i;
        cardFound = true;
        break;
      }
    }

    if (cardFound) {
      const cardIndexToDraw = drawPile[indexOfCard];
      if (cardIndexToDraw != null) {
        const card = this.getGameSession().getCardByIndex(cardIndexToDraw);
        const drawCardAction = this.getGameSession().getPlayerById(this.getOwner().getPlayerId()).getDeck().actionDrawCard(cardIndexToDraw);
        return this.getGameSession().executeAction(drawCardAction);
      }
    }
  }
}

module.exports = SpellResilience;
