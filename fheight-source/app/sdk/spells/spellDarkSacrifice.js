/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const KillAction = require('app/sdk/actions/killAction');
const PlayerModifierManaModifierSingleUse = require('app/sdk/playerModifiers/playerModifierManaModifierSingleUse');

class SpellDarkSacrifice extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.AllyDirect;
    this.prototype.canTargetGeneral = false;
    this.prototype.costChange = -3;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    const applyEffectPosition = {x, y};
    const entity = board.getCardAtPosition(applyEffectPosition, this.targetType);

    //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "SpellDarkSacrifice::onApplyEffectToBoardTile -> explode #{entity.name}"

    //kill the target entity
    const killAction = new KillAction(this.getGameSession());
    killAction.setOwnerId(this.getOwnerId());
    killAction.setTarget(entity);
    this.getGameSession().executeAction(killAction);

    // add cost reduction for next unit card
    this.getGameSession().applyModifierContextObject(PlayerModifierManaModifierSingleUse.createCostChangeContextObject(this.costChange, CardType.Unit), this.getGameSession().getGeneralForPlayerId(this.getOwnerId()));

    return true;
  }
}
SpellDarkSacrifice.initClass();


module.exports = SpellDarkSacrifice;
