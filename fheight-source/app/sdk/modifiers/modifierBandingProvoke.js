/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierBanding = require('./modifierBanding');
const ModifierBandedProvoke = require('./modifierBandedProvoke');

class ModifierBandingProvoke extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingProvoke";
    this.type ="ModifierBandingProvoke";
  }

  static createContextObject(options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [ModifierBandedProvoke.createContextObject()];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    return this.description;
  }
}
ModifierBandingProvoke.initClass();

module.exports = ModifierBandingProvoke;
