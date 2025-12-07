/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Logger = require('app/common/logger');
const EVENTS = require('app/common/event_types');

const _ = require('underscore');

/**
 * Helper object that can attach to any event stream and record specific state for in response to any action event.
 * NOTE: Do not serialize this object.
 * @example
 * var actionStateRecord = new ActionStateRecord()
 * actionStateRecord.startListeningToEvents(gameSession.getEventBus())
 * actionStateRecord.setupToRecordStateOnEvent(EVENTS.action, { "remainingMana" : function () { return player.getRemainingMana(); } })
 */
class ActionStateRecord {
  static initClass() {
  
    this.prototype._currentState = null;
    this.prototype._currentStateByType = null;
    this.prototype._actionIndicesRecorded = null;
    this.prototype._actionIndicesRecordedByEventType = null;
    this.prototype._lastActionIndicesRecordedCache = null;
    this.prototype._lastActionIndicesRecordedByEventTypeCache = null;
    this.prototype._propertyNamesToRecordByEventType = null;
    this.prototype._currentPropertyNamesToRecord = null;
    this.prototype._recordingMethodsByEventType = null;
    this.prototype._currentRecordingMethods = null;
    this.prototype._stateByActionIndex = null;
    this.prototype._stateByActionIndexAndEventType = null;
    this.prototype._eventBus = null;
    this.prototype._listeningToEvents = false;
  }

  // region INITIALIZE

  constructor() {
    this._listeningToEvents = false;
    this._propertyNamesToRecordByEventType = {};
    this._currentPropertyNamesToRecord = [];
    this._recordingMethodsByEventType = {};
    this._currentRecordingMethods = {};
    this._actionIndicesRecorded = [];
    this._actionIndicesRecordedByEventType = {};
    this._lastActionIndicesRecordedCache = {};
    this._lastActionIndicesRecordedByEventTypeCache = {};
    this._stateByActionIndex = {};
    this._currentState = {};
    this._currentStateByType = {};
    this._stateByActionIndexAndEventType = {};
  }

  // endregion INITIALIZE

  // region GETTERS / SETTERS

  /**
   * Returns the current state.
   * @returns {Object} state object with all recorded properties
   */
  getCurrentState() {
    return this._currentState;
  }

  /**
   * Returns the current state for an event type.
   * @returns {Object} state object with all recorded properties
   */
  getCurrentStateForEventType(eventType) {
    return ((eventType != null) && this._currentStateByType[eventType]) || this.getCurrentState();
  }

  /**
   * Returns the state at an action given an index, or if no action passed then the last recorded current state.
   * @param {Action} action action to get the state at
   * @returns {Object} state object with all recorded properties at action
   */
  getStateAtAction(action) {
    return ((action != null) && (this._stateByActionIndex[action.getIndex()] || this._stateByActionIndex[this._getLastActionIndexRecordedAtOrBeforeActionIndex(action.getIndex())])) || this.getCurrentState();
  }

  /**
   * Returns the state at an action given an index and an event type, or if no event type passed gets state at action.
   * @param {Action} action action to get the state at
   * @param {String} eventType event type to get the state at
   * @returns {Object} state object with all recorded properties at action
   */
  getStateAtActionForEventType(action, eventType) {
    return ((action != null) && (eventType != null) && this._stateByActionIndexAndEventType[this._getStateIndexForEventType(this._getLastActionIndexRecordedAtOrBeforeActionIndexForEventType(action.getIndex(), eventType), eventType)]) || this.getStateAtAction(action);
  }

  _getStateIndexForEventType(actionIndex, eventType) {
    return actionIndex + "_" + eventType;
  }

  _getLastActionIndexRecorded() {
    if (this._actionIndicesRecorded.length === 0) {
      return -1;
    } else {
      return this._actionIndicesRecorded[this._actionIndicesRecorded.length - 1];
    }
  }

  _getLastActionIndexRecordedForEventType(eventType) {
    const actionIndicesRecorded = this._actionIndicesRecordedByEventType[eventType];
    if (actionIndicesRecorded.length === 0) {
      return -1;
    } else {
      return actionIndicesRecorded[actionIndicesRecorded.length - 1];
    }
  }

  _getLastActionIndexRecordedAtOrBeforeActionIndex(actionIndex) {
    // attempt to use cached index
    let lastIndex = this._lastActionIndicesRecordedCache[actionIndex];
    if ((lastIndex == null)) {
      // find last index
      lastIndex = -1;
      for (let i = this._actionIndicesRecorded.length - 1; i >= 0; i--) {
        var index = this._actionIndicesRecorded[i];
        if (index <= actionIndex) {
          lastIndex = (this._lastActionIndicesRecordedCache[actionIndex] = index);
          break;
        }
      }
    }
    return lastIndex;
  }

  _getLastActionIndexRecordedAtOrBeforeActionIndexForEventType(actionIndex, eventType) {
    // attempt to use cached index
    const stateIndex = this._getStateIndexForEventType(actionIndex, eventType);
    let lastIndex = this._lastActionIndicesRecordedByEventTypeCache[stateIndex];
    if ((lastIndex == null)) {
      // find last index
      lastIndex = -1;
      const actionIndicesRecorded = this._actionIndicesRecordedByEventType[eventType];
      if ((actionIndicesRecorded != null) && (actionIndicesRecorded.length > 0)) {
        for (let i = actionIndicesRecorded.length - 1; i >= 0; i--) {
          var index = actionIndicesRecorded[i];
          if (index <= actionIndex) {
            lastIndex = (this._lastActionIndicesRecordedByEventTypeCache[stateIndex] = index);
            break;
          }
        }
      }
    }
    return lastIndex;
  }

  getHasRecordedStateForActions() {
    return this._getLastActionIndexRecorded() !== -1;
  }

  // endregion GETTERS / SETTERS

  // region EVENT STREAM

  getIsListeningToEvents() {
    return this._listeningToEvents;
  }

  startListeningToEvents(eventBus) {
    // stop listening to previous if changing eventBus
    if (this._eventBus !== eventBus) {
      this.stopListeningToEvents();
    }

    if (!this._listeningToEvents && (eventBus != null)) {
      this._listeningToEvents = true;
      this._eventBus = eventBus;

      // deserialize listener
      this._eventBus.on(EVENTS.deserialize, this.recordStateAtLastActionRecorded, this);

      // listeners for events
      const eventTypes = Object.keys(this._propertyNamesToRecordByEventType);
      if (eventTypes.length > 0) {
        return Array.from(eventTypes).map((eventType) =>
          this._eventBus.on(eventType, this.onStateRecordingActionEvent, this));
      }
    }
  }

  stopListeningToEvents() {
    if (this._listeningToEvents) {
      this._listeningToEvents = false;

      if (this._eventBus != null) {
        // deserialize listener
        this._eventBus.off(EVENTS.deserialize, this.recordStateAtLastActionRecorded, this);

        // listeners for events
        const eventTypes = Object.keys(this._propertyNamesToRecordByEventType);
        if (eventTypes.length > 0) {
          for (var eventType of Array.from(eventTypes)) {
            this._eventBus.off(eventType, this.onStateRecordingActionEvent, this);
          }
        }

        return this._eventBus = null;
      }
    }
  }

  // endregion EVENT STREAM

  // region STATE

  /**
   * Starts recording properties of a target each time a specific event occurs.
   * @param {String} eventType type of event to record state
   * @param {*} stateTarget object to record state from
   * @param {Object} propertiesToRecord map of names of properties to record to function to use to record
   * @example
   * # record player's remaining mana on every action event using the player's getRemainingMana method
   * actionStateRecord.setupToRecordStateOnEvent(EVENTS.action, { "remainingMana" : player.getRemainingMana.bind(player) })
   */
  setupToRecordStateOnEvent(eventType, propertiesToRecord) {
    if ((eventType != null) && (this._propertyNamesToRecordByEventType[eventType] == null)) {
      //Logger.module("COMMON").log("ActionStateRecord.recordCurrentState", eventType)
      const propertyNamesToRecord = Object.keys(propertiesToRecord);
      const recordingMethods = {};
      for (var propertyName of Array.from(propertyNamesToRecord)) {
        recordingMethods[propertyName] = propertiesToRecord[propertyName];
      }
      if ((this._propertyNamesToRecordByEventType[eventType] == null)) {
        // new event type
        this._propertyNamesToRecordByEventType[eventType] = propertyNamesToRecord;
        this._recordingMethodsByEventType[eventType] = recordingMethods;

        if (this._eventBus != null) {
          this._eventBus.on(eventType, this.onStateRecordingActionEvent, this);
        }
      } else {
        // merge properties into properties recorded for event type
        this._propertyNamesToRecordByEventType[eventType] = _.union(this._propertyNamesToRecordByEventType[eventType], propertyNamesToRecord);
        this._recordingMethodsByEventType[eventType] = _.extend(this._recordingMethodsByEventType[eventType], recordingMethods);
      }

      // add properties to master list of properties recorded
      this._currentPropertyNamesToRecord = _.union(this._currentPropertyNamesToRecord, propertyNamesToRecord);
      this._currentRecordingMethods = _.extend(this._currentRecordingMethods, recordingMethods);

      // reset list of action indices recorded for this event type
      this._actionIndicesRecordedByEventType[eventType] = [];

      // record current state
      return this._recordProperties(eventType, this._getLastActionIndexRecorded());
    }
  }

  /**
   * Tears down the recording of all properties for all event types and deletes all property recording methods, but retains the current state. Effectively undoes all calls to setupToRecordStateOnEvent.
   */
  teardownRecordingStateOnAllEvents() {
    const eventTypes = Object.keys(this._propertyNamesToRecordByEventType);
    if (eventTypes.length > 0) {
      for (var eventType of Array.from(eventTypes)) {
        if (this._eventBus != null) {
          this._eventBus.off(eventType, this.onStateRecordingActionEvent, this);
        }
        delete this._propertyNamesToRecordByEventType[eventType];
        delete this._recordingMethodsByEventType[eventType];
      }
      this._currentPropertyNamesToRecord = {};
      return this._currentRecordingMethods = {};
    }
  }

  /*
   * Records action state for all event types at a given action index, or last action index recorded if none provided.
   * @param {String|Number} [actionIndex=last recorded] action index to record state at
  */
  recordStateEvenIfNotChanged(actionIndex) {
    // fallback to index of last action recorded
    if (actionIndex == null) { actionIndex = this._getLastActionIndexRecorded(); }

    // ignore changed
    const ignoreChanged = true;

    // record for each event type
    const eventTypes = Object.keys(this._propertyNamesToRecordByEventType);
    return Array.from(eventTypes).map((eventType) =>
      this._recordProperties(eventType, actionIndex, ignoreChanged));
  }

  /*
   * Records action state for all event types at the last action index recorded.
  */
  recordStateAtLastActionRecorded() {
    // record for each event type
    const actionIndex = this._getLastActionIndexRecorded();
    const eventTypes = Object.keys(this._propertyNamesToRecordByEventType);
    return Array.from(eventTypes).map((eventType) =>
      this._recordProperties(eventType, actionIndex));
  }

  /*
   * Records all properties for a given event type at an action index, and optionally forces the record to ignore whether the values have changed.
   * @private
  */
  _recordProperties(eventType, actionIndex, ignoreChanged) {
    let propertyNamesToRecord, recordingMethods;
    if (ignoreChanged == null) { ignoreChanged = false; }
    if (eventType != null) {
      propertyNamesToRecord = this._propertyNamesToRecordByEventType[eventType];
      recordingMethods = this._recordingMethodsByEventType[eventType];
    } else {
      propertyNamesToRecord = this._currentPropertyNamesToRecord;
      recordingMethods = this._currentRecordingMethods;
    }
    //Logger.module("COMMON").log("ActionStateRecord.recordCurrentState", eventType, propertyNamesToRecord, recordingMethods)

    // record each property
    let propertyRecorded = false;
    const stateRecord = {};
    for (var propertyName of Array.from(propertyNamesToRecord)) {
      // get property value by recording method
      var recordingMethod = recordingMethods[propertyName];
      var value = recordingMethod();
      //Logger.module("COMMON").log(" > recorded", propertyName, " === ", value, " using", recordingMethod)

      // property value cannot be null/undefined
      if (value != null) {
        propertyRecorded = true;
        stateRecord[propertyName] = value;
        this._currentState[propertyName] = value;
      }
    }

    if (propertyRecorded) {
      let changed = true;

      if (eventType != null) {
        // record new current state for this event type if changed
        changed = ignoreChanged || !_.isEqual(this._currentStateByType[eventType], stateRecord);
        if (changed) {
          this._currentStateByType[eventType] = stateRecord;
          if (actionIndex != null) {
            const stateIndex = this._getStateIndexForEventType(actionIndex, eventType);
            const actionIndicesRecorded = this._actionIndicesRecordedByEventType[eventType];
            if ((actionIndicesRecorded.length === 0) || (actionIndicesRecorded[actionIndicesRecorded.length - 1] !== actionIndex)) {
              actionIndicesRecorded.push(actionIndex);
            }
            this._stateByActionIndexAndEventType[stateIndex] = stateRecord;
          }
        }
      }

      // record new current state
      if (changed) {
        if (actionIndex != null) {
          const newStateRecord = _.extend({}, this._currentState);
          if ((this._actionIndicesRecorded.length === 0) || (this._actionIndicesRecorded[this._actionIndicesRecorded.length - 1] !== actionIndex)) {
            this._actionIndicesRecorded.push(actionIndex);
          }
          return this._stateByActionIndex[actionIndex] = newStateRecord;
        }
      }
    }
  }

  // endregion STATE

  // region EVENTS

  onStateRecordingActionEvent(event) {
    // use event action index
    let actionIndex, eventType;
    if (event != null) {
      actionIndex = event.action != null ? event.action.getIndex() : undefined;
      eventType = event.type;
    }

    // fallback to index of last action recorded
    if (actionIndex == null) { actionIndex = this._getLastActionIndexRecorded(); }

    if (actionIndex != null) {
      //Logger.module("COMMON").log("ActionStateRecord.onStateRecordingActionEvent", eventType, "with action", event?.action?.getLogName())
      return this._recordProperties(eventType, actionIndex);
    }
  }
}
ActionStateRecord.initClass();

  // endregion EVENTS

module.exports = ActionStateRecord;
