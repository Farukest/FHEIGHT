/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const DrawCardAction = require('./drawCardAction');

class BurnCardAction extends DrawCardAction {
  static initClass() {
  
    this.type ="BurnCardAction";
  
    this.prototype.burnCard = true;
  }

  constructor() {
    super(...arguments);
    this.type = BurnCardAction.type;
  }
}
BurnCardAction.initClass();

module.exports = BurnCardAction;
