/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SDKObject = require('./object');
const _ = require('underscore');
const UtilsJavascript = require('app/common/utils/utils_javascript');

class Step extends SDKObject {
  static initClass() {
  
    this.prototype.action = null;
    this.prototype.playerId =null;
    this.prototype.timestamp = null;
    this.prototype.index = null;
    this.prototype.parentStepIndex = null;
    this.prototype.childStepIndex = null;
    this.prototype.transmitted = false;
  }

  constructor(gameSession, playerId) {
    super(gameSession);

    // define public properties here that must be always be serialized
    // do not define properties here that should only serialize if different from the default
    this.playerId = playerId;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.includedRandomness = false; // whether any action in this step included randomness during execution

    return p;
  }

  /**
   * Returns the player id for the player that initiated this step.
   * @returns {Number}
   */
  getPlayerId() {
    return this.playerId;
  }

  /**
   * Returns whether this step has been executed yet. This is not a safe way to check if this step is executing on the server, use GameSession.getIsRunningAsAuthoritative instead.
   * @returns {Boolean}
   */
  isFirstTime() {
    return (this.timestamp == null);
  }

  /**
   * Signs the step by setting its execution timestamp and index.
   */
  addSignature() {
    if (this.isFirstTime()) {
      return this.timestamp = Date.now();
    }
  }

  /**
   * Sets an index of order executed.
   * @param {Number|String}
   */
  setIndex(val) {
    return this.index = val;
  }

  /**
   * Returns an index of order executed.
   * @returns {Number}
   */
  getIndex() {
    return this.index;
  }

  /**
   * Sets an index of the parent step.
   * @param {Step}
   */
  setParentStep(step) {
    return this.parentStepIndex = step.getIndex();
  }

  /**
   * Returns an index of the parent step
   * @returns {Number}
   */
  getParentStepIndex() {
    return this.parentStepIndex;
  }

  /**
   * Returns a parent step if present
   * @returns {Step|Null}
   */
  getParentStep() {
    if (this.parentStepIndex != null) {
      return this.getGameSession().getStepByIndex(this.parentStepIndex);
    }
  }

  /**
   * Records a step as a child of this step.
   * @param {Step}
   */
  setChildStep(step) {
    return this.childStepIndex = step.getIndex();
  }

  /**
   * Returns a the index the child step if one exists.
   * @returns {Number|String|null}
   */
  getChildStepIndex() {
    return this.childStepIndex;
  }

  /**
   * Returns a list of child steps.
   * @returns {Step|null}
   */
  getChildStep() {
    if (this.childStepIndex != null) {
      return this.getGameSession().getStepByIndex(this.childStepIndex);
    }
  }

  /**
   * Sets the explicit action that started this step.
   * @param {Action} action
   */
  setAction(action) {
    return this.action = action;
  }

  /**
   * Returns the explicit action that started this step.
   * @returns {Action}
   */
  getAction() {
    return this.action;
  }

  /**
   * Sets whether this step included randomness at any point during its execution.
   * NOTE: only valid after execution and does not serialize!
   * @param {Boolean} val
   */
  setIncludedRandomness(val) {
    return this._private.includedRandomness = val;
  }

  /**
   * Returns whether this step included randomness at any point during its execution.
   * NOTE: only valid after execution and does not serialize!
   * @returns {Boolean}
   */
  getIncludedRandomness() {
    return this._private.includedRandomness;
  }

  /**
   * Sets whether this step has been transmitted across the network yet.
   * @param {Boolean} transmitted
   */
  setTransmitted(transmitted) {
    return this.transmitted = transmitted;
  }

  /**
   * Returns whether this step has been transmitted across the network yet.
   * @returns {Boolean}
   */
  getTransmitted() {
    return this.transmitted;
  }

  /* JSON serialization */

  deserialize(data) {
    return UtilsJavascript.fastExtend(this,data);
  }
}
Step.initClass();

module.exports = Step;
