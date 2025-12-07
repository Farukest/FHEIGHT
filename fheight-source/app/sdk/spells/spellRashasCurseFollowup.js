/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellSpawnEntity =  require('./spellSpawnEntity');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const RemoveRandomArtifactAction =  require('app/sdk/actions/removeRandomArtifactAction');

class SpellRashasCurseFollowup extends SpellSpawnEntity {

  getValidTargetPositions() {
    if ((this._private.cachedValidTargetPositions == null)) {
      this._private.cachedValidTargetPositions = this._filterPlayPositions(UtilsGameSession.getValidBoardPositionsFromPattern(this.getGameSession().getBoard(), this.getFollowupSourcePosition(), this.getFollowupSourcePattern()));
    }
    return this._private.cachedValidTargetPositions;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "RemoveArtifactsAction::onApplyEffectToBoardTile"
    const removeArtifactAction = new RemoveRandomArtifactAction(this.getGameSession());
    removeArtifactAction.setTarget(board.getUnitAtPosition(this.getFollowupSourcePosition()));
    this.getGameSession().executeAction(removeArtifactAction);
    return super.onApplyEffectToBoardTile(board,x,y,sourceAction); //and summon the Dervish
  }
}

module.exports = SpellRashasCurseFollowup;
