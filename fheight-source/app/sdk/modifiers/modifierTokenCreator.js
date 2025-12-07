/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

const i18next = require('i18next');

class ModifierTokenCreator extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierTokenCreator";
    this.type ="ModifierTokenCreator";
  
    this.isHiddenToUI = true;
  
    this.modifierName = "Token"; //TO DO: move this text to translation files
  
    this.prototype.isRemovable = false;
  }
}
ModifierTokenCreator.initClass();

module.exports = ModifierTokenCreator;
