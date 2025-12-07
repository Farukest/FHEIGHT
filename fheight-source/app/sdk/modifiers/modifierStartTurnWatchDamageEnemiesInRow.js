/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierStartTurnWatchDamageEnemiesInRow extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchDamageEnemiesInRow";
    this.type ="ModifierStartTurnWatchDamageEnemiesInRow";
  
    this.modifierName ="Start Watch";
    this.description ="At the start of your turn, deal %X damage to enemies in row";
  
    this.prototype.damageAmount = 0;
    this.prototype.damageGeneral = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch", "FX.Modifiers.ModifierGenericDamageFire"];
  }

  static createContextObject(damageAmount, damageGeneral, options) {
    if (damageAmount == null) { damageAmount = 0; }
    if (damageGeneral == null) { damageGeneral = false; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    contextObject.damageGenerals = damageGeneral;
    return contextObject;
  }

  onTurnWatch(action) {

    let damageAction, previousOffset, target;
    const board = this.getCard().getGameSession().getBoard();

    let offset = 1;
    let offsetPosition = {x:this.getCard().getPosition().x+offset, y:this.getCard().getPosition().y};
    while (board.isOnBoard(offsetPosition)) {
      target = board.getUnitAtPosition(offsetPosition);
      if ((target != null) && (target.getOwner() !== this.getCard().getOwner())) { // damage any enemy found
        if (this.damageGeneral || !target.getIsGeneral()) {
          damageAction = new DamageAction(this.getCard().getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          damageAction.setTarget(target);
          damageAction.setDamageAmount(this.damageAmount);
          this.getGameSession().executeAction(damageAction);
        }
      }
      previousOffset = offsetPosition;
      offsetPosition = {x:previousOffset.x+offset, y:previousOffset.y};
    }

    offset = -1;
    offsetPosition = {x:this.getCard().getPosition().x+offset, y:this.getCard().getPosition().y};
    return (() => {
      const result = [];
      while (board.isOnBoard(offsetPosition)) {
        target = board.getUnitAtPosition(offsetPosition);
        if ((target != null) && (target.getOwner() !== this.getCard().getOwner())) { // damage any enemy found
          if (this.damageGeneral || !target.getIsGeneral()) {
            damageAction = new DamageAction(this.getCard().getGameSession());
            damageAction.setOwnerId(this.getCard().getOwnerId());
            damageAction.setTarget(target);
            damageAction.setDamageAmount(this.damageAmount);
            this.getGameSession().executeAction(damageAction);
          }
        }
        previousOffset = offsetPosition;
        result.push(offsetPosition = {x:previousOffset.x+offset, y:previousOffset.y});
      }
      return result;
    })();
  }
}
ModifierStartTurnWatchDamageEnemiesInRow.initClass();

module.exports = ModifierStartTurnWatchDamageEnemiesInRow;
