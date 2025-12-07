/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpponentSummonWatch = require('./modifierOpponentSummonWatch');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class ModifierOpponentSummonWatchSummonMinionInFront extends ModifierOpponentSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierOpponentSummonWatchSummonMinionInFront";
    this.type ="ModifierOpponentSummonWatchSummonMinionInFront";
  
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  static createContextObject(cardDataOrIndexToSpawn, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    return contextObject;
  }

  onSummonWatch(action) {

    const unit = action.getTarget();
    if ((unit != null) && (this.cardDataOrIndexToSpawn != null)) {
      let playerOffset = 0;
      if (unit.isOwnedByPlayer1()) { playerOffset = 1; } else { playerOffset = -1; }
      const inFrontOfPosition = {x:unit.getPosition().x+playerOffset, y:unit.getPosition().y};

      const entity = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(this.cardDataOrIndexToSpawn);
      const board = this.getGameSession().getBoard();
      if (board.isOnBoard(inFrontOfPosition) && !board.getObstructionAtPositionForEntity(inFrontOfPosition, entity)) {
        const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), inFrontOfPosition.x, inFrontOfPosition.y, this.cardDataOrIndexToSpawn);
        playCardAction.setSource(this.getCard());
        return this.getGameSession().executeAction(playCardAction);
      }
    }
  }
}
ModifierOpponentSummonWatchSummonMinionInFront.initClass();

module.exports = ModifierOpponentSummonWatchSummonMinionInFront;
