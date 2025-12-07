/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =            require('./modifier');
const CardType =         require('app/sdk/cards/cardType');
const CONFIG = require('app/common/config');

const i18next = require('i18next');

class ModifierRanged extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierRanged";
    this.type ="ModifierRanged";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.ranged_def");
    this.prototype.maxStacks = 1;
  
    this.modifierName =i18next.t("modifiers.ranged_name");
    this.description = null;
  
    this.prototype.attributeBuffs =
      {reach: CONFIG.REACH_RANGED - CONFIG.REACH_MELEE};
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierRanged"];
  }
}
ModifierRanged.initClass();

module.exports = ModifierRanged;
