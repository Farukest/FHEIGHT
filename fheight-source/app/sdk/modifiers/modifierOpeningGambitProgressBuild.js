/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('app/sdk/modifiers/modifierOpeningGambit');
const ModifierBuilding = require('app/sdk/modifiers/modifierBuilding');

class ModifierOpeningGambitProgressBuild extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitProgressBuild";
    this.type = "ModifierOpeningGambitProgressBuild";
  
    this.modifierName = "Opening Gambit";
    this.description = "Progress your buildings by 1";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit() {
    return Array.from(this.getGameSession().getBoard().getFriendlyEntitiesForEntity(this.getCard())).map((unit) =>
      Array.from(unit.getActiveModifiersByClass(ModifierBuilding)).map((buildModifier) =>
        buildModifier.progressBuild()));
  }
}
ModifierOpeningGambitProgressBuild.initClass();

module.exports = ModifierOpeningGambitProgressBuild;
