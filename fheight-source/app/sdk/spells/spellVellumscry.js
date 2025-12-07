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

class SpellSoulclamp extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.AllyDirect;
    this.prototype.canTargetGeneral = false;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    const applyEffectPosition = {x, y};
    const entity = board.getCardAtPosition(applyEffectPosition, this.targetType);

    //kill the target entity
    const killAction = new KillAction(this.getGameSession());
    killAction.setOwnerId(this.getOwnerId());
    killAction.setTarget(entity);
    this.getGameSession().executeAction(killAction);

    return true;
  }
}
SpellSoulclamp.initClass();


module.exports = SpellSoulclamp;
