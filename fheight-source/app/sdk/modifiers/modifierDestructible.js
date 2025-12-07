/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Modifier =   require('./modifier');
const i18next = require('i18next');

/*
  Destructible is a special modifier used to explain artifacts via keyword popout.
*/
class ModifierDestructible extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDestructible";
    this.type ="ModifierDestructible";
  
    this.modifierName =i18next.t("modifiers.destructible_name");
    this.description = null;
    this.keywordDefinition =i18next.t("modifiers.destructible_def");
    this.isHiddenToUI = true;
    this.isKeyworded = true;
    this.prototype.maxStacks = 1;
  }
}
ModifierDestructible.initClass();

module.exports = ModifierDestructible;
