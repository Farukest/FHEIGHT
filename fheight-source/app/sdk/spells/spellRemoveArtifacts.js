/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const RemoveArtifactsAction =  require('app/sdk/actions/removeArtifactsAction');

class SpellRemoveArtifacts extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.EnemyIndirect;
    this.prototype.canTargetGeneral = true;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const target = board.getCardAtPosition(applyEffectPosition, this.targetType);

    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "RemoveArtifactsAction::onApplyEffectToBoardTile"
    const removeArtifactsAction = new RemoveArtifactsAction(this.getGameSession());
    removeArtifactsAction.setTarget(target);
    return this.getGameSession().executeAction(removeArtifactsAction);
  }

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = [];

    // can only target enemy general
    const general = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId());
    if (general != null) { applyEffectPositions.push(general.getPosition()); }

    return applyEffectPositions;
  }
}
SpellRemoveArtifacts.initClass();

module.exports = SpellRemoveArtifacts;
