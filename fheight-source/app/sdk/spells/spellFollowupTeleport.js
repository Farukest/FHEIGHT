/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const TeleportAction = require('app/sdk/actions/teleportAction');
const _ = require('underscore');

class SpellFollowupTeleport extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.None;
  
    this.prototype._postFilterApplyPositions = this.prototype._postFilterPlayPositions;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    const applyEffectPosition = {x, y};

    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "SpellFollowupTeleport::onApplyEffectToBoardTile "
    const source = board.getCardAtPosition(this.getTeleportSourcePosition(applyEffectPosition), this.targetType);

    const teleAction = new TeleportAction(this.getGameSession());
    teleAction.setOwnerId(this.getOwnerId());
    teleAction.setSource(source);
    teleAction.setTargetPosition(this.getTeleportTargetPosition(applyEffectPosition));
    teleAction.setFXResource(_.union(teleAction.getFXResource(), this.getFXResource()));
    return this.getGameSession().executeAction(teleAction);
  }

  getTeleportSourcePosition(applyEffectPosition) {
    // override in sub class to provide custom source position
    return this.getFollowupSourcePosition();
  }

  getTeleportSource(applyEffectPosition) {
    return this.getGameSession().getBoard().getCardAtPosition(this.getTeleportSourcePosition(applyEffectPosition), this.targetType);
  }

  getTeleportTargetPosition(applyEffectPosition) {
    // override in sub class to provide custom target position
    return applyEffectPosition;
  }

  getTeleportTarget(applyEffectPosition) {
    return this.getGameSession().getBoard().getCardAtPosition(this.getTeleportTargetPosition(applyEffectPosition), this.targetType);
  }

  _postFilterPlayPositions(spellPositions) {
    // make sure that there is something to teleport at the source position
    if (this.getTeleportSource(this.getApplyEffectPosition()) != null) {
      const validPositions = [];

      for (var position of Array.from(spellPositions)) {
        // make sure that there is nothing at the target position
        if (!this.getGameSession().getBoard().getCardAtPosition(position, this.targetType)) {
          validPositions.push(position);
        }
      }

      return validPositions;
    } else {
      return [];
    }
  }

  static followupConditionTargetToTeleport(cardWithFollowup, followupCard) {
    // make sure that there is something to teleport at the source position
    return followupCard.getTeleportSource(followupCard.getApplyEffectPosition());
  }
}
SpellFollowupTeleport.initClass();

module.exports = SpellFollowupTeleport;
