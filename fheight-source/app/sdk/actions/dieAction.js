/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger =     require('app/common/logger');
const RemoveAction = require('./removeAction');
const CardType =       require('app/sdk/cards/cardType');
const _ = require('underscore');

class DieAction extends RemoveAction {
  static initClass() {
  
    this.type ="DieAction";
  }

  constructor() {
    super(...arguments);
    this.type = DieAction.type;
  }
}
DieAction.initClass();

module.exports = DieAction;
