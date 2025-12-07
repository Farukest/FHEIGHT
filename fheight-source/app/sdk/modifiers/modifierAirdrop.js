/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =   require('./modifier');

const i18next = require('i18next');

/*
  Aidrop is a special modifier used primarily as a marker for logic in the Entity class (entity.coffee).
  In Entity.coffee the methods `getValidTargetPositions` and `getIsPositionValidTarget` will check for airdrop by modifier name
*/
class ModifierAirdrop extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierAirdrop";
    this.type ="ModifierAirdrop";
  
    this.isKeyworded = true;
    this.prototype.maxStacks = 1;
  
    this.modifierName =i18next.t("modifiers.airdrop_name");
    this.description = null;
    this.keywordDefinition =i18next.t("modifiers.airdrop_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierAirdrop"];
  }
}
ModifierAirdrop.initClass();

module.exports = ModifierAirdrop;
