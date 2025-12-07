/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const TeleportAction = require('app/sdk/actions/teleportAction');
const CONFIG = require('app/common/config');
const _ = require('underscore');

class SpellMistWalking extends Spell {
  static initClass() {
  
    this.prototype.spellFilterType = SpellFilterType.None;
    this.prototype.targetType = CardType.Unit;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    const applyEffectPosition = {x, y};

    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "SpellMistWalking::onApplyEffectToBoardTile "
    const source = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const teleAction = new TeleportAction(this.getGameSession());
    teleAction.setOwnerId(this.getOwnerId());
    teleAction.setSource(source);
    teleAction.setTargetPosition({x, y});
    teleAction.setFXResource(_.union(teleAction.getFXResource(), this.getFXResource()));
    return this.getGameSession().executeAction(teleAction);
  }


  _filterPlayPositions(spellPositions) {
    const validPositions = [];
    const generalPosition = this.getGameSession().getGeneralForPlayerId(this.getOwnerId()).getPosition();
    const board = this.getGameSession().getBoard();
    for (var position of Array.from(CONFIG.PATTERN_2SPACES)) {
      var pos = {x:generalPosition.x+position.x, y:generalPosition.y+position.y};
      if (!board.getCardAtPosition(pos, CardType.Unit) && board.isOnBoard(pos)) {
        validPositions.push(pos);
      }
    }
    return validPositions;
  }
}
SpellMistWalking.initClass();

module.exports = SpellMistWalking;
