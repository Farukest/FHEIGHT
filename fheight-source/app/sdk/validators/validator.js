/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');

class Validator {
  static initClass() {
  
    this.prototype.type ="Validator";
    this.type ="Validator";
  
    this.prototype._gameSession = null;
  }

  // region INITIALIZE

  constructor(gameSession) {
    this._gameSession = gameSession;
  }

  // endregion INITIALIZE

  // region EVENTS

  /**
   * SDK event handler. Do not call this method manually.
   */
  onEvent(event) {
    if (event.type === EVENTS.terminate) {
      return this._onTerminate(event);
    } else if (event.type === EVENTS.validate_action) {
      return this.onValidateAction(event);
    }
  }

  // endregion EVENTS

  // region GETTERS / SETTERS

  getGameSession() {
    return this._gameSession;
  }

  getType() {
    return this.type;
  }

  // endregion GETTERS / SETTERS

  // region VALIDATION

  invalidateAction(action, position, message) {
    // helper method for invalidating an action at a position with a message
    if (message == null) { message = "Invalid Action!"; }
    action.setIsValid(false);
    action.setValidationMessage(message);
    action.setValidationMessagePosition(position);
    return action.setValidatorType(this.getType());
  }

  // endregion VALIDATION

  // region EVENTS

  _onTerminate() {}
    // this method is automatically called when this object will never be used again

  onValidateAction(event) {}
}
Validator.initClass();
    // override in sub-class and set action's isValid state

  // endregion EVENTS

module.exports = Validator;
