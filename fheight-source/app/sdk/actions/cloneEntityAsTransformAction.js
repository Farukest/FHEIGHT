/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger =     require('app/common/logger');
const UtilsJavascript =     require('app/common/utils/utils_javascript');
const CloneEntityAction =     require('./cloneEntityAction');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

/*
Clone an entity on the board silently as a transform.
*/

class CloneEntityAsTransformAction extends CloneEntityAction {
  static initClass() {
  
    this.type ="CloneEntityAsTransformAction";
  }

  constructor() {
    super(...arguments);
    this.type = CloneEntityAsTransformAction.type;
  }
}
CloneEntityAsTransformAction.initClass();

module.exports = CloneEntityAsTransformAction;
