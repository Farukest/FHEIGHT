/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ApplyModifierAction = require('app/sdk/actions/applyModifierAction');

class ModifierGainAttackWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierGainAttackWatch";
    this.type ="ModifierGainAttackWatch";
  
    this.modifierName ="GainAttackWatch";
    this.description = "GainAttackWatch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGainAttackWatch"];
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    // watch for any of my minions gaining Attack
    if (action instanceof ApplyModifierAction && (action.getTarget().getOwnerId() === this.getCard().getOwnerId()) && action.getModifier().getBuffsAttribute("atk") && !__guardMethod__(action.getTarget(), 'getIsGeneral', o => o.getIsGeneral())) {
      const modifier = action.getModifier();
      if (modifier.getBuffsAttribute("atk") && (modifier.attributeBuffs["atk"] > 0) && !modifier.getRebasesAttribute("atk") && !modifier.getBuffsAttributeAbsolutely("atk")) {
        return this.onGainAttackWatch(action);
      }
    }
  }

  onGainAttackWatch(action) {}
}
ModifierGainAttackWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierGainAttackWatch;

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}