/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const Modifier = require('./modifier');
const CONFIG = require('app/common/config');


class ModifierOpeningGambitDamageInFront extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitDamageInFront";
    this.type = "ModifierOpeningGambitDamageInFront";
  
    this.modifierName = "Opening Gambit";
    this.description = "Deal %X damage to ANY minion in front of this";
  
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
    const offsetPosition = {x:this.getCard().getPosition().x+playerOffset, y:this.getCard().getPosition().y};
    const target = this.getCard().getGameSession().getBoard().getUnitAtPosition(offsetPosition);

    if ((target != null) && !target.getIsGeneral()) { //if there is a unit in front of this one, then damage it
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.getCard().getOwnerId());
      damageAction.setTarget(target);
      damageAction.setDamageAmount(this.damageAmount);
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierOpeningGambitDamageInFront.initClass();

module.exports = ModifierOpeningGambitDamageInFront;
