/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

const i18next = require('i18next');

class ModifierPortal extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierPortal";
    this.type ="ModifierPortal";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.structure_def");
    this.isHiddenToUI = true;
  
    this.modifierName =i18next.t("modifiers.structure_name");
    this.description =null;
  
    this.prototype.maxStacks = 1;
    this.prototype.isRemovable = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierPortal"];
  }

  onActivate() {
    super.onActivate();
    this.stopMove();
    return this.stopAttack();
  }

  // apply "cannot move" and "cannot attack" modifiers as submodifier of this
  // applying as a submodifier so these modifier can be removed seperately from the "structure" modifier itself
  // (ex spell - your Obelysks can now move and attack)
  stopMove() {
    const speedBuffContextObject = Modifier.createContextObjectOnBoard();
    speedBuffContextObject.attributeBuffs = {"speed": 0};
    speedBuffContextObject.attributeBuffsAbsolute = ["speed"];
    speedBuffContextObject.attributeBuffsFixed = ["speed"];
    speedBuffContextObject.isHiddenToUI = true;
    speedBuffContextObject.isCloneable = false;
    return this.getGameSession().applyModifierContextObject(speedBuffContextObject, this.getCard(), this);
  }

  stopAttack() {
    const attackBuffContextObject = Modifier.createContextObjectOnBoard();
    attackBuffContextObject.attributeBuffs = {"atk": 0};
    attackBuffContextObject.attributeBuffsAbsolute = ["atk"];
    attackBuffContextObject.attributeBuffsFixed = ["atk"];
    attackBuffContextObject.isHiddenToUI = true;
    attackBuffContextObject.isCloneable = false;
    return this.getGameSession().applyModifierContextObject(attackBuffContextObject, this.getCard(), this);
  }

  // if we ever want to allow this Structure to move, remove the cannot move hidden submodifier
  allowMove() {
    return (() => {
      const result = [];
      for (var subMod of Array.from(this.getSubModifiers())) {
        if (subMod.getBuffsAttribute("speed")) {
          result.push(this.getGameSession().removeModifier(subMod));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  // if we ever want to allow this Structure to attack, remove the cannot attack hidden submodifier
  allowAttack() {
    return (() => {
      const result = [];
      for (var subMod of Array.from(this.getSubModifiers())) {
        if (subMod.getBuffsAttribute("atk")) {
          result.push(this.getGameSession().removeModifier(subMod));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierPortal.initClass();

module.exports = ModifierPortal;
