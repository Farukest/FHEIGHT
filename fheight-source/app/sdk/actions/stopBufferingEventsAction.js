/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger =     require('app/common/logger');
const Action =     require('./action');

class StopBufferingEventsAction extends Action {
  static initClass() {
  
    this.type ="StopBufferingEventsAction";
  }

  constructor() {
    super(...arguments);
    this.type = StopBufferingEventsAction.type;
  }

  isRemovableDuringScrubbing() {
    return false;
  }

  _execute() {
    super._execute();

    return this.getGameSession().p_stopBufferingEvents();
  }
}
StopBufferingEventsAction.initClass();

module.exports = StopBufferingEventsAction;
