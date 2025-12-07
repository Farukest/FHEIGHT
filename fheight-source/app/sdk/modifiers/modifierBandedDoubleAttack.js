/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBanded = require('./modifierBanded');
const Modifier = require('./modifier');

class ModifierBandedDoubleAttack extends ModifierBanded {
  static initClass() {
  
    this.prototype.type = "ModifierBandedDoubleAttack";
    this.type = "ModifierBandedDoubleAttack";
  
    this.modifierName = "Zealed: Lion's Growth";
    this.description = "Double this minion's Attack at the end of your turn";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZealed", "FX.Modifiers.ModifierZealedDoubleAttack"];
  }

  onEndTurn() {
    super.onEndTurn();

    if (this.getGameSession().getCurrentPlayer() === this.getCard().getOwner()) {
      let modifierContextObject;
      if ((this.getCard().getATK() * 2) < 999) { // arbitrary limit at the moment, don't want to push crazy huge number to firebase. also messes up the UI if attack gets too big
        modifierContextObject = Modifier.createContextObjectWithAttributeBuffs(this.getCard().getATK());
      } else {
        modifierContextObject = Modifier.createContextObjectWithAttributeBuffs(999 - this.getCard().getATK());
      }
      modifierContextObject.appliedName = "Radiance";
      return this.getCard().getGameSession().applyModifierContextObject(modifierContextObject, this.getCard());
    }
  }
}
ModifierBandedDoubleAttack.initClass();


module.exports = ModifierBandedDoubleAttack;
