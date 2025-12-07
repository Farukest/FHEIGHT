/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('./playerModifier');
const ModifierAlwaysBackstabbed = require('app/sdk/modifiers/modifierAlwaysBackstabbed');
const CONFIG = require('app/common/config');

class PlayerModifierTeamAlwaysBackstabbed extends PlayerModifier {
  static initClass() {
  
    this.prototype.type = "PlayerModifierTeamAlwaysBackstabbed";
    this.type = "PlayerModifierTeamAlwaysBackstabbed";
    this.isHiddenToUI = true;
  
    this.prototype.maxStacks = 1;
  
    this.prototype.isAura = true;
    this.prototype.auraIncludeAlly = true;
    this.prototype.auraIncludeBoard = true;
    this.prototype.auraIncludeEnemy = false;
    this.prototype.auraIncludeGeneral = true;
    this.prototype.auraIncludeHand = false;
    this.prototype.auraIncludeSelf = true;
    this.prototype.auraRadius = CONFIG.WHOLE_BOARD_RADIUS;
  
    this.prototype.modifiersContextObjects = null;
  }

  static createContextObject(auraModifierAppliedName, auraModifierAppliedDescription, options) {
    const contextObject = super.createContextObject(options);
    const auraModifier = ModifierAlwaysBackstabbed.createContextObject();
    auraModifier.appliedName = auraModifierAppliedName;
    auraModifier.appliedDescription = auraModifierAppliedDescription;
    contextObject.modifiersContextObjects = [auraModifier];
    return contextObject;
  }
}
PlayerModifierTeamAlwaysBackstabbed.initClass();

module.exports = PlayerModifierTeamAlwaysBackstabbed;