/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');

class PlayerModifierEmblem extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierEmblem";
    this.type ="PlayerModifierEmblem";
  
    // emblems should be visible
    this.isHiddenToUI = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEmblem"];
  }
}
PlayerModifierEmblem.initClass();

module.exports = PlayerModifierEmblem;
