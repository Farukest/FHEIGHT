/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierOpeningGambitDamageInFrontRow extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDamageInFrontRow";
    this.type = "ModifierOpeningGambitDamageInFrontRow";
  
    this.modifierName = "Opening Gambit";
    this.description = "Deal %X damage to all enemies in front of this";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  static createContextObject(damageAmount, options) {
    const contextObject = super.createContextObject();
    contextObject.damageAmount = damageAmount;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.damageAmount);
    } else {
      return this.description;
    }
  }

  onOpeningGambit() {
    let playerOffset = 0;
    if (this.getCard().isOwnedByPlayer1()) { playerOffset = 1; } else { playerOffset = -1; }
    const board = this.getCard().getGameSession().getBoard();
    let offsetPosition = {x:this.getCard().getPosition().x+playerOffset, y:this.getCard().getPosition().y};
    return (() => {
      const result = [];
      while (board.isOnBoard(offsetPosition)) {
        var target = board.getUnitAtPosition(offsetPosition);

        if ((target != null) && (target.getOwner() !== this.getCard().getOwner())) { // damage any enemy found
          var damageAction = new DamageAction(this.getCard().getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          damageAction.setTarget(target);
          damageAction.setDamageAmount(this.damageAmount);
          this.getGameSession().executeAction(damageAction);
        }
        var previousOffset = offsetPosition;
        result.push(offsetPosition = {x:previousOffset.x+playerOffset, y:previousOffset.y});
      }
      return result;
    })();
  }
}
ModifierOpeningGambitDamageInFrontRow.initClass();


module.exports = ModifierOpeningGambitDamageInFrontRow;
