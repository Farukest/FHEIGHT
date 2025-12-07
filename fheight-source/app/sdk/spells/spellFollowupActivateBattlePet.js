/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell =  require('./spell');
const CardType = require('app/sdk/cards/cardType');
const PlayerModifierBattlePetManager = require('app/sdk/playerModifiers/playerModifierBattlePetManager');
const RefreshExhaustionAction =  require('app/sdk/actions/refreshExhaustionAction');

class SpellFollowupActivateBattlePet extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const applyEffectPosition = {x, y};
      const target = board.getCardAtPosition(applyEffectPosition, this.targetType);
      if (target.getIsBattlePet()) {
        const general = this.getGameSession().getGeneralForPlayerId(target.getOwnerId());
        return general.getModifierByClass(PlayerModifierBattlePetManager).triggerBattlePet(target);
      } else {
        const refreshExhaustionAction = new RefreshExhaustionAction(this.getGameSession());
        refreshExhaustionAction.setTarget(target);
        return this.getGameSession().executeAction(refreshExhaustionAction);
      }
    }
  }
}
SpellFollowupActivateBattlePet.initClass();

module.exports = SpellFollowupActivateBattlePet;
