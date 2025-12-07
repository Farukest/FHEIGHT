/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('app/sdk/modifiers/modifier');
const ModifierBuilding = require('./modifierBuilding');

class ModifierBuildingSlowEnemies extends ModifierBuilding {
  static initClass() {
  
    this.prototype.type ="ModifierBuildingSlowEnemies";
    this.type ="ModifierBuildingSlowEnemies";
  
    this.prototype.auraAppliedName = null;
    this.prototype.auraAppliedDescription = null;
    this.prototype.speedChangeAppliedName = null;
    this.prototype.speedChangeAppliedDescription = null;
  }

  onActivate() {
    super.onActivate();
    const speedBuffContextObject = Modifier.createContextObjectOnBoard();
    speedBuffContextObject.attributeBuffs = {"speed": 1};
    speedBuffContextObject.attributeBuffsAbsolute = ["speed"];
    speedBuffContextObject.attributeBuffsFixed = ["speed"];
    speedBuffContextObject.appliedName = this.speedChangeAppliedName;
    speedBuffContextObject.appliedDescription = this.speedChangeAppliedDescription;
    const auraContextObject = Modifier.createContextObjectWithOnBoardAuraForAllEnemies([speedBuffContextObject]);
    auraContextObject.auraIncludeGeneral = true;
    auraContextObject.appliedName = this.auraAppliedName;
    auraContextObject.appliedDescription = this.auraAppliedDescription;
    auraContextObject.isRemovable = false;
    return this.getGameSession().applyModifierContextObject(auraContextObject, this.getCard(), this);
  }
}
ModifierBuildingSlowEnemies.initClass();

module.exports = ModifierBuildingSlowEnemies;
