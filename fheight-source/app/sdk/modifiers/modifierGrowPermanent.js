/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierGrow = require('./modifierGrow');
const CardType = require('app/sdk/cards/cardType');
const ModifierGrowOnBothTurns = require('./modifierGrowOnBothTurns');

class ModifierGrowPermanent extends ModifierGrow {
  static initClass() {
  
    this.prototype.type ="ModifierGrowPermanent";
    this.type ="ModifierGrowPermanent";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff", "FX.Modifiers.ModifierGrow"];
  }

  // override standard Modifier method applyManagedModifiersFromModifiersContextObjects
  // in this case we want the applied buffs to be permanent even if the Grow Modifier
  // is removed later on
  applyManagedModifiersFromModifiersContextObjects(modifiersContextObjects, card) {
    if ((modifiersContextObjects != null) && (card != null)) {
      return Array.from(modifiersContextObjects).map((modifierContextObject) =>
        this.getGameSession().applyModifierContextObject(modifierContextObject, card));
    }
  }
}
ModifierGrowPermanent.initClass(); // NOT being applied as a child modifier

module.exports = ModifierGrowPermanent;
