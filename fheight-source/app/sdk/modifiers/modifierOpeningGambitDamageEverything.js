/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DamageAction = require('app/sdk/actions/damageAction');

class ModifierOpeningGambitDamageEverything extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitDamageEverything";
    this.type ="ModifierOpeningGambitDamageEverything";
  
    this.prototype.damageAmount = 1;
    this.prototype.includeSelf = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericDamage"];
  }

  static createContextObject(damageAmount, includeSelf, options) {
    if (damageAmount == null) { damageAmount = 1; }
    if (includeSelf == null) { includeSelf = false; }
    const contextObject = super.createContextObject(options);
    contextObject.damageAmount = damageAmount;
    contextObject.includeSelf = includeSelf;
    return contextObject;
  }

  onOpeningGambit(action) {
    return (() => {
      const result = [];
      for (var unit of Array.from(this.getGameSession().getBoard().getUnits())) {
        if (this.includeSelf || (unit !== this.getCard())) {
          var damageAction = new DamageAction(this.getGameSession());
          damageAction.setOwnerId(this.getCard().getOwnerId());
          damageAction.setSource(this.getCard());
          damageAction.setTarget(unit);
          damageAction.setDamageAmount(this.damageAmount);
          result.push(this.getGameSession().executeAction(damageAction));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierOpeningGambitDamageEverything.initClass();

module.exports = ModifierOpeningGambitDamageEverything;
