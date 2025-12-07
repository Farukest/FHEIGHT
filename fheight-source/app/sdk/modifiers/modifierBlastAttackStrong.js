/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBlastAttack = require('./modifierBlastAttack');

class ModifierBlastAttackStrong extends ModifierBlastAttack {
  static initClass() {
  
    this.prototype.type ="ModifierBlastAttackStrong";
    this.type ="ModifierBlastAttackStrong";
  
    this.prototype.cardFXResource = ["FX.Cards.Faction3.BlastStrong"];
  }
}
ModifierBlastAttackStrong.initClass();

module.exports = ModifierBlastAttackStrong;
