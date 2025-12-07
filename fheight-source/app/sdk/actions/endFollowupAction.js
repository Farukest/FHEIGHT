/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger =     require('app/common/logger');
const StopBufferingEventsAction =     require('./stopBufferingEventsAction');

class EndFollowupAction extends StopBufferingEventsAction {
  static initClass() {
  
    this.type ="EndFollowupAction";
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = EndFollowupAction.type; }
  }

  isRemovableDuringScrubbing() {
    return false;
  }
}
EndFollowupAction.initClass();

module.exports = EndFollowupAction;
