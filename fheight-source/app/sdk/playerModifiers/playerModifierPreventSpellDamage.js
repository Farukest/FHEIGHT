/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('./playerModifier');
const ModifierImmuneToSpellDamage = require('app/sdk/modifiers/modifierImmuneToSpellDamage');
const CONFIG = require('app/common/config');

class PlayerModifierPreventSpellDamage extends PlayerModifier {
  static initClass() {
  
    this.prototype.type = "PlayerModifierPreventSpellDamage";
    this.type = "PlayerModifierPreventSpellDamage";
  
    this.modifierName = "Prevent Spell Damage";
    this.description = "Prevents ALL damage from spells";
  
    this.prototype.maxStacks = 1;
  
    this.prototype.isAura = true;
    this.prototype.auraIncludeAlly = true;
    this.prototype.auraIncludeBoard = true;
    this.prototype.auraIncludeEnemy = true;
    this.prototype.auraIncludeGeneral = true;
    this.prototype.auraIncludeHand = false;
    this.prototype.auraIncludeSelf = true;
    this.prototype.auraRadius = CONFIG.WHOLE_BOARD_RADIUS;
    this.prototype.modifiersContextObjects = [ModifierImmuneToSpellDamage.createContextObject()];
  }
}
PlayerModifierPreventSpellDamage.initClass();

module.exports = PlayerModifierPreventSpellDamage;
