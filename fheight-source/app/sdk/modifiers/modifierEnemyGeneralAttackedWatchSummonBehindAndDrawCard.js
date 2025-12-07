/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEnemyGeneralAttackedWatch = require('./modifierEnemyGeneralAttackedWatch');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class ModifierEnemyGeneralAttackedWatchSummonBehindAndDrawCard extends ModifierEnemyGeneralAttackedWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEnemyGeneralAttackedWatchSummonBehindAndDrawCard";
    this.type ="ModifierEnemyGeneralAttackedWatchSummonBehindAndDrawCard";
  }

  onEnemyGeneralAttackedWatch(action) {
    const enemyGeneral = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    const board = this.getGameSession().getBoard();

    let playerOffset = 0;
    if (this.getCard().isOwnedByPlayer1()) { playerOffset = 1; } else { playerOffset = -1; }
    const behindPosition = {x:enemyGeneral.getPosition().x+playerOffset, y:enemyGeneral.getPosition().y};

    if (board.isOnBoard(behindPosition) && !board.getObstructionAtPositionForEntity(behindPosition, this.getCard())) {

      const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), behindPosition.x, behindPosition.y, this.getCard().getIndex());
      this.getGameSession().executeAction(playCardAction);

      const deck = this.getGameSession().getPlayerById(this.getCard().getOwnerId()).getDeck();
      return this.getCard().getGameSession().executeAction(deck.actionDrawCard());
    }
  }
}
ModifierEnemyGeneralAttackedWatchSummonBehindAndDrawCard.initClass();

module.exports = ModifierEnemyGeneralAttackedWatchSummonBehindAndDrawCard;
