/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const HealAction = require('app/sdk/actions/healAction');
const RemoveManaCoreAction = require('app/sdk/actions/removeManaCoreAction');
const Modifier = require('app/sdk/modifiers/modifier');
const ModifierStunned = require('app/sdk/modifiers/modifierStunned');
const Spell = require('./spell');

class SpellSaurianFinality extends Spell {
  static initClass() {
  
    this.prototype.appliedName = null;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    let removeManaCoreAction;
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const position = {x, y};
    const entity = board.getCardAtPosition(position, this.targetType);

    if ((entity != null) && (entity === this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId()))) { // enemy general
      removeManaCoreAction = new RemoveManaCoreAction(this.getGameSession(), 3);
      removeManaCoreAction.setSource(this);
      removeManaCoreAction.setOwnerId(this.getGameSession().getOpponentPlayerIdOfPlayerId(this.getOwnerId()));
      this.getGameSession().executeAction(removeManaCoreAction);

      const stunnedObject = ModifierStunned.createContextObject();
      return this.getGameSession().applyModifierContextObject(stunnedObject, this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId()));

    } else if ((entity != null) && (entity === this.getGameSession().getGeneralForPlayerId(this.getOwnerId()))) { // my general
      removeManaCoreAction = new RemoveManaCoreAction(this.getGameSession(), 3);
      removeManaCoreAction.setSource(this);
      removeManaCoreAction.setOwnerId(this.getOwnerId());
      this.getGameSession().executeAction(removeManaCoreAction);

      const ownGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
      const healAction = new HealAction(this.getGameSession());
      healAction.setOwnerId(this.getOwnerId());
      healAction.setTarget(ownGeneral);
      healAction.setHealAmount(10);
      this.getGameSession().executeAction(healAction);

      const generalBuff = Modifier.createContextObjectWithAttributeBuffs(3,0);
      generalBuff.appliedName = this.appliedName;
      return this.getGameSession().applyModifierContextObject(generalBuff, ownGeneral);
    }
  }

  _findApplyEffectPositions(position, sourceAction) {
    const applyEffectPositions = [];

    // affects both generals
    const enemyGeneral = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId());
    if (enemyGeneral != null) { applyEffectPositions.push(enemyGeneral.getPosition()); }
    const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    if (myGeneral != null) { applyEffectPositions.push(myGeneral.getPosition()); }

    return applyEffectPositions;
  }
}
SpellSaurianFinality.initClass();


module.exports = SpellSaurianFinality;
