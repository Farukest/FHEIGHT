/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyGeneralDamagedWatch = require('./modifierMyGeneralDamagedWatch');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const DrawCardAction = require('app/sdk/actions/drawCardAction');

class ModifierMyGeneralDamagedWatchMiniMinion extends ModifierMyGeneralDamagedWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyGeneralDamagedWatchMiniMinion";
    this.type ="ModifierMyGeneralDamagedWatchMiniMinion";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyGeneralDamagedWatch"];
  
    this.prototype.activeInHand = true;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = false;
  }

  onDamageDealtToGeneral(action) {

    const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
    const board = this.getGameSession().getBoard();

    let playerOffset = 0;
    if (this.getCard().isOwnedByPlayer1()) { playerOffset = 1; } else { playerOffset = -1; }
    const behindPosition = {x:enemyGeneral.getPosition().x+playerOffset, y:enemyGeneral.getPosition().y};

    if (board.isOnBoard(behindPosition) && !board.getObstructionAtPositionForEntity(behindPosition, this.getCard())) {
      const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), behindPosition.x, behindPosition.y, this.getCard().getIndex());
      this.getGameSession().executeAction(playCardAction);
      return this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), this.getCard().getOwnerId()));
    }
  }
}
ModifierMyGeneralDamagedWatchMiniMinion.initClass();

module.exports = ModifierMyGeneralDamagedWatchMiniMinion;
