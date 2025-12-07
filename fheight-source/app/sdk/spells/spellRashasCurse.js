/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const SpellFilterType = require('./spellFilterType');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const RemoveRandomArtifactAction =  require('app/sdk/actions/removeRandomArtifactAction');

class SpellRashasCurse extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.EnemyIndirect;
    this.prototype.canTargetGeneral = true;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const target = board.getCardAtPosition(applyEffectPosition, this.targetType);
    const dervish = this.getGameSession().getCardCaches().getCardById(Cards.Faction3.Dervish);

    const validFollowupPositions = [];
    for (var position of Array.from(UtilsGameSession.getValidBoardPositionsFromPattern(board, applyEffectPosition, CONFIG.PATTERN_3x3))) {
      if (!board.getObstructionAtPositionForEntity(position, dervish)) {
        validFollowupPositions.push(position);
      }
    }

    if (validFollowupPositions.length === 0) { // if there is nowhere to summon a dervish, still DO remove artifacts from General
      //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "RemoveArtifactsAction::onApplyEffectToBoardTile"
      const removeArtifactAction = new RemoveRandomArtifactAction(this.getGameSession());
      removeArtifactAction.setTarget(target);
      return this.getGameSession().executeAction(removeArtifactAction);
    }
  }
    // if there is a followup position available, let the followup spell remove the artifact
    // NOTE: usually the artifact should be removed in the followup, because otherwise it would be possible
    // to cheat and check which artifact is randomly removed, canceling until you get the one you want

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = [];

    // can only target enemy general
    const general = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId());
    if (general != null) { applyEffectPositions.push(general.getPosition()); }

    return applyEffectPositions;
  }
}
SpellRashasCurse.initClass();

module.exports = SpellRashasCurse;
