/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSentinelOpponentSummon = require('./modifierSentinelOpponentSummon');
const Modifier = require('./modifier');
const DrawCardAction = require('app/sdk/actions/drawCardAction');

class ModifierSentinelOpponentSummonBuffItDrawCard extends ModifierSentinelOpponentSummon {
  static initClass() {
  
    this.prototype.type ="ModifierSentinelOpponentSummonBuffItDrawCard";
    this.type ="ModifierSentinelOpponentSummonBuffItDrawCard";
  }

  static createContextObject(description, transformCardId, attackBuff, maxHPBuff, options) {
    if (attackBuff == null) { attackBuff = 2; }
    if (maxHPBuff == null) { maxHPBuff = 2; }
    const contextObject = super.createContextObject(description, transformCardId, options);
    contextObject.attackBuff = attackBuff;
    contextObject.maxHPBuff = maxHPBuff;
    return contextObject;
  }

  onOverwatch(action) {
    super.onOverwatch(action); // transform unit
    // buff unit that was just summoned by enemy
    if (action.getTarget() != null) {
      const statContextObject = Modifier.createContextObjectWithAttributeBuffs(this.attackBuff,this.maxHPBuff);
      statContextObject.appliedName = "Spooky Strength";
      this.getGameSession().applyModifierContextObject(statContextObject, action.getTarget());

      const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
      return this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), enemyGeneral.getOwnerId()));
    }
  }
}
ModifierSentinelOpponentSummonBuffItDrawCard.initClass();


module.exports = ModifierSentinelOpponentSummonBuffItDrawCard;
