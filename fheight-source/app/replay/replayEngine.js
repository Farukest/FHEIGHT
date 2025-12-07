/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
ReplayEngine - Drives the application through the replay of a game
why is code organized in this weird fashion? check: https://coderwall.com/p/myzvmg
*/
var ReplayEngine = (function() {
  let instance = undefined;
  ReplayEngine = class ReplayEngine {
    static initClass() {
  
      instance = null;
    }

    static create() {
      return new _ReplayEngine();
    }

    static getInstance() {
      return instance != null ? instance : (instance = new _ReplayEngine());
    }

    // alias of "getInstance"
    static current() {
      return instance != null ? instance : (instance = new _ReplayEngine());
    }

    static reset() {
      if (instance != null) { instance.terminate(); }
      return instance = null;
    }
  };
  ReplayEngine.initClass();
  return ReplayEngine;
})();

module.exports = ReplayEngine;

const SDK = require('app/sdk');
const Scene = require('app/view/Scene');
const EventBus = require('app/common/eventbus');
const EVENTS = require('app/common/event_types');
const Logger = require('app/common/logger');
const CONFIG = require('app/common/config');
const NavigationManager = require("app/ui/managers/navigation_manager");

class _ReplayEngine {
  static initClass() {
  
    this.prototype._currentTurnIndex = null; // index of current turn being replayed
    this.prototype._currentStepIndex = null; // index of current step into current turn being replayed
    this.prototype._currentDeserializedStep = null;
    this.prototype._currentStepStartedAt = null;
    this.prototype._currentStepTimestamp = null;
    this.prototype._currentStepDelay = null;
    this.prototype._currentStepDelayBase = null;
    this.prototype._currentStepDelayClamped = null;
    this.prototype._currentStepDelayCulled = null;
    this.prototype._currentStepDelayScale = null;
    this.prototype._currentUIEventIndex = 0;
    this.prototype._currentUIEventStartedAt = null;
    this.prototype._currentUIEventDelay = null;
    this.prototype._gameSessionData = null; // Parsed gamesession data
    this.prototype._gameUIEventData = null; // Array of hover, select, etc data
    this.prototype._isPlaying = false; // whether replay is playing or paused
    this.prototype._isCullingDeadtimeBeforePause = false; // whether replay is culling deadtime as of pause
    this.prototype._opponentStepBuffer = null;
    this.prototype._pausedAt = null;
    this.prototype._replayGameId = null; // game id for active replay
    this.prototype._turns = null;
     // Collection of all turns from parsed data (including current turn)
  }

  constructor() {
    this._eventBus = EventBus.create();
  }

  /**
   * Returns the event bus where all events are piped through.
    */
  getEventBus() {
    return this._eventBus;
  }

  // region START / STOP

  /**
   * Start a game replay from game session data and optionally mouse/ui event data.
   * @public
   * @param  {Object} gameSessionData  game data to replay
   * @param  {Array}  [gameUIEventData=null] array of mouse/ui event data
   * @return  {Promise} Promise that will resolve after replay starts.
   */
  watchReplay(gameSessionData, gameUIEventData) {
    if (this._replayGameId != null) {
      throw new Error("Cannot replay game during existing replay!");
    }

    if ((gameSessionData == null)) {
      throw new Error("Cannot replay game without game data!");
    }

    this._replayGameId = gameSessionData.gameId;
    this._gameSessionData = gameSessionData;
    this._gameUIEventData = gameUIEventData;
    this._isPlaying = true;
    Logger.module("REPLAY").debug(`watchReplay ${this._replayGameId}`);

    // listen for exit to allow cancelling out of replay
    NavigationManager.getInstance().on(EVENTS.user_triggered_exit, this.stopCurrentReplay, this);

    // get all turns
    this._turns = this._gameSessionData.turns.slice(0);

    // the current turn may already have been added to the list of turns
    // in the case of when the game ended as the turn ended
    const {
      currentTurn
    } = this._gameSessionData;
    let needsCurrentTurn = true;
    for (var turn of Array.from(this._turns)) {
      if (currentTurn.createdAt === turn.createdAt) {
        needsCurrentTurn = false;
        break;
      }
    }

    if (needsCurrentTurn) {
      this._turns.push(currentTurn);
    }

    this._currentTurnIndex = 0;
    this._currentStepIndex = 0;
    this._currentStepStartedAt = null;
    this._currentDeserializedStep = null;
    this._opponentStepBuffer = [];
    this._currentStepTimestamp = null;
    this._currentStepDelay = null;
    this._currentStepDelayBase = null;
    this._currentStepDelayClamped = null;
    this._currentStepDelayCulled = null;
    this._currentStepDelayScale = 1.0;

    this._currentUIEventIndex = 0;
    this._currentUIEventStartedAt = null;
    this._currentUIEventDelay = null;

    this._pausedAt = null;
    this._isCullingDeadtimeBeforePause = false;

    // emit event that replay has started
    this._eventBus.trigger(EVENTS.replay_started);

    // short delay then start
    return this._startTimeoutId = setTimeout(() => {
      this._startTimeoutId = null;

      // start replaying steps
      this._startReplayingSteps();

      // schedule first UI event
      return this._startReplayingUIEvents();
    }, 2000.0);
  }

  stopCurrentReplay() {
    Logger.module("REPLAY").debug(`stopCurrentReplay ${this._replayGameId}`);
    if (this._replayGameId != null) {
      // reset replay data
      this._replayGameId = null;
      this._isPlaying = false;
      this._gameSessionData = null;
      this._gameUIEventData = null;
      this._currentDeserializedStep = null;
      this._opponentStepBuffer = null;

      // end all timeouts
      this._clearTimeouts();

      // stop listening to events
      NavigationManager.getInstance().off(EVENTS.user_triggered_exit, this.stopCurrentReplay, this);

      // emit event that replay has stopped
      return this._eventBus.trigger(EVENTS.replay_stopped);
    }
  }

  isPlaying(){
    return this._isPlaying;
  }

  // endregion START / STOP

  // region PAUSE / RESUME

  togglePause(){
    if (this._isPlaying) {
      return this.pause();
    } else {
      return this.resume();
    }
  }

  pause(){
    if ((this._replayGameId != null) && (this._gameSessionData != null) && this._isPlaying) {
      Logger.module("REPLAY").log("pause replay");
      // pause replay
      this._isPlaying = false;
      this._isCullingDeadtimeBeforePause = CONFIG.replaysCullDeadtime;
      this._clearTimeouts();

      // record time paused at
      this._pausedAt = Date.now();

      // emit event that replay has paused
      return this._eventBus.trigger(EVENTS.replay_paused);
    }
  }

  resume(){
    if ((this._replayGameId != null) && (this._gameSessionData != null) && !this._isPlaying) {
      Logger.module("REPLAY").log("resume replay");

      // adjust step time if deadtime culling has changed
      if (this._isCullingDeadtimeBeforePause !== CONFIG.replaysCullDeadtime) {
        this._updateStepTimeForDeadtimeCulling();
      }

      // resume replay
      this._isPlaying = true;
      this._startReplayingSteps();
      this._startReplayingUIEvents();

      // clear pause data
      this._pausedAt = null;
      this._isCullingDeadtimeBeforePause = null;

      // emit event that replay has resumed
      return this._eventBus.trigger(EVENTS.replay_resumed);
    }
  }

  updateTimeForPlayingStep() {
    if (this._isPlaying) {
      Logger.module("REPLAY").log("updateTimeForPlayingStep");
      this._clearTimeouts();

      // record time paused at
      this._pausedAt = Date.now();

      // adjust step time
      this._updateStepTimeForDeadtimeCulling();

      // restart playing steps
      this._startReplayingSteps();
      this._startReplayingUIEvents();

      // clear pause data
      return this._pausedAt = null;
    }
  }

  _updateStepTimeForDeadtimeCulling() {
    if (this._currentStepDelay != null) {
      if (!CONFIG.replaysCullDeadtime) {
        this._currentStepDelayClamped = this._currentStepDelayBase;
      } else {
        this._currentStepDelayClamped = Math.min(this._currentStepDelayCulled, this._currentStepDelayBase);
      }
      this._currentStepDelayScale = this._currentStepDelayClamped / this._currentStepDelayBase;
      return this._currentStepDelay = this._currentStepDelayClamped / CONFIG.replayActionSpeedModifier;
    }
  }

  // endregion PAUSE / RESUME

  // region REPLAY

  _clearTimeouts() {
    this._clearStartTimeout();
    this._clearStepTimeout();
    return this._clearUIEventTimeout();
  }

  _clearStartTimeout() {
    if (this._startTimeoutId != null) {
      clearTimeout(this._startTimeoutId);
      return this._startTimeoutId = null;
    }
  }

  _clearStepTimeout() {
    if (this._currentStepTimeoutId != null) {
      clearTimeout(this._currentStepTimeoutId);
      return this._currentStepTimeoutId = null;
    }
  }

  _clearUIEventTimeout() {
    if (this._currentUIEventTimeoutId != null) {
      clearTimeout(this._currentUIEventTimeoutId);
      return this._currentUIEventTimeoutId = null;
    }
  }

  _startReplayingSteps() {
    if ((this._replayGameId == null) || !this._isPlaying || (this._gameSessionData == null)) {
      return;
    }

    const currentTurn = this._turns[this._currentTurnIndex];
    const currentStep = currentTurn != null ? currentTurn.steps[this._currentStepIndex] : undefined;
    if (currentStep != null) {
      let delay, delayBase;
      if ((this._pausedAt != null) && (this._currentStepStartedAt != null)) {
        delay = this._currentStepDelay - (this._pausedAt - this._currentStepStartedAt);
        delayBase = delay;
        //Logger.module("REPLAY").log("_startReplayingSteps -> resume paused at", @_pausedAt, "timestamp", @_currentStepStartedAt, "original delay", @_currentStepDelay, "delay", delay)
      } else {
        delayBase = currentStep.timestamp - this._gameSessionData.createdAt;
        delay = CONFIG.REPLAY_MAX_STEP_DELAY_STARTING_HAND * 1000.0;
      }
        //Logger.module("REPLAY").log("_startReplayingSteps -> start at", @_gameSessionData.createdAt, "timestamp", currentStep.timestamp, "delay", delay)

      if (delay != null) {
        delay = Math.max(0.0, delay);
        this._currentStepTimestamp = currentStep.timestamp;
        this._currentStepStartedAt = Date.now();

        // skip any delays on opponent mulligan and execute immediately
        if (SDK.GameSession.getInstance().isNew() && (currentStep.playerId === SDK.GameSession.getInstance().getOpponentPlayerId())) {
          this._currentStepDelayBase = (this._currentStepDelayCulled = (this._currentStepDelayClamped = (this._currentStepDelay = 0.0)));
          this._currentStepDelayScale = 1.0;
          return this._replayNextStep();
        } else {
          this._currentStepDelayBase = delayBase;
          this._currentStepDelayCulled = delay;
          if (!CONFIG.replaysCullDeadtime) {
            this._currentStepDelayClamped = this._currentStepDelayBase;
          } else {
            this._currentStepDelayClamped = Math.min(this._currentStepDelayCulled, this._currentStepDelayBase);
          }
          this._currentStepDelayScale = this._currentStepDelayClamped / this._currentStepDelayBase;
          this._currentStepDelay = this._currentStepDelayClamped / CONFIG.replayActionSpeedModifier;
          return this._currentStepTimeoutId = setTimeout(this._replayNextStep.bind(this), this._currentStepDelay);
        }
      }
    }
  }

  _replayNextStep() {
    if ((this._replayGameId == null) || !this._isPlaying || (this._gameSessionData == null)) {
      return;
    }

    this._clearStepTimeout();

    // show current step
    const currentTurnIndex = this._currentTurnIndex;
    const currentStepIndex = this._currentStepIndex;
    const currentTurn = this._turns[currentTurnIndex];
    const currentStep = currentTurn != null ? currentTurn.steps[currentStepIndex] : undefined;
    if ((this._currentDeserializedStep == null) && (currentStep != null)) {
      this._currentDeserializedStep = SDK.GameSession.getInstance().deserializeStepFromFirebase(currentStep);
    }
    const currentDeserializedStep = this._currentDeserializedStep;
    if (currentDeserializedStep != null) {
      let nextDeserializedStep;
      this._currentStepTimestamp = currentDeserializedStep.timestamp;
      this._currentStepStartedAt = Date.now();

      // increment step/turn counters
      this._currentStepIndex++;
      if (this._currentStepIndex >= currentTurn.steps.length) {
        this._currentStepIndex = 0;
        this._currentTurnIndex++;
      }
      //Logger.module("REPLAY").log("_replayNextStep -> turn index #{@_currentTurnIndex} step index #{@_currentStepIndex} action #{currentDeserializedStep.action.type}")
      // get next step/turn
      const nextTurnIndex = this._currentTurnIndex;
      const nextStepIndex = this._currentStepIndex;
      const nextTurn = this._turns[nextTurnIndex];
      const nextStep = nextTurn != null ? nextTurn.steps[nextStepIndex] : undefined;
      if (nextStep != null) {
        nextDeserializedStep = SDK.GameSession.getInstance().deserializeStepFromFirebase(nextStep);
      }
      const nextAction = nextDeserializedStep != null ? nextDeserializedStep.action : undefined;

      // buffer steps in opponent followup chain until final step
      const currentAction = currentDeserializedStep.action;
      const canBuffer = (nextAction != null) && (currentDeserializedStep.playerId === SDK.GameSession.getInstance().getOpponentPlayerId()) && !(nextAction instanceof SDK.PlayCardFromHandAction) && nextAction instanceof SDK.ApplyCardToBoardAction;
      const shouldBuffer = canBuffer && currentAction instanceof SDK.ApplyCardToBoardAction && (__guard__(currentAction.getCard(), x => x.getCurrentFollowup()) != null);
      if (shouldBuffer) {
        this._opponentStepBuffer.push(currentDeserializedStep);
      } else {
        // execute buffered steps
        if (this._opponentStepBuffer.length > 0) {
          const opponentStepBuffer = this._opponentStepBuffer;
          this._opponentStepBuffer = [];
          for (var bufferedStep of Array.from(opponentStepBuffer)) {
            SDK.GameSession.getInstance().executeAuthoritativeStep(bufferedStep);
          }
        }

        // execute step
        SDK.GameSession.getInstance().executeAuthoritativeStep(currentDeserializedStep);
      }

      if (nextDeserializedStep != null) {
        // set next deserialized step as current
        this._currentDeserializedStep = nextDeserializedStep;

        // skip any delays on opponent mulligan and execute immediately
        if (SDK.GameSession.getInstance().isNew() && (nextStep.playerId === SDK.GameSession.getInstance().getOpponentPlayerId())) {
          this._currentStepDelayBase = (this._currentStepDelayCulled = (this._currentStepDelayClamped = (this._currentStepDelay = 0.0)));
          this._currentStepDelayScale = 1.0;
          return this._replayNextStep();
        } else {
          // delay and show next step
          const delay = Math.max(0.0, nextDeserializedStep.timestamp - this._currentStepTimestamp);
          this._currentStepDelayBase = delay;
          if (SDK.GameSession.getInstance().isNew()) {
            this._currentStepDelayCulled = CONFIG.REPLAY_MAX_STEP_DELAY_STARTING_HAND * 1000.0;
          } else {
            this._currentStepDelayCulled = CONFIG.REPLAY_MAX_STEP_DELAY * 1000.0;
          }
          if (!CONFIG.replaysCullDeadtime) {
            this._currentStepDelayClamped = this._currentStepDelayBase;
          } else {
            this._currentStepDelayClamped = Math.min(this._currentStepDelayBase, this._currentStepDelayCulled);
          }
          if ((this._currentStepDelayClamped > 0.0) && (this._currentStepDelayClamped < this._currentStepDelayBase)) {
            this._currentStepDelayScale = this._currentStepDelayClamped / this._currentStepDelayBase;
          } else {
            this._currentStepDelayScale = 1.0;
          }
          this._currentStepDelay = this._currentStepDelayClamped / CONFIG.replayActionSpeedModifier;
          //Logger.module("REPLAY").log("_replayNextStep -> next #{nextAction.type} delay #{@_currentStepDelay} base #{@_currentStepDelayBase} clamped #{@_currentStepDelayClamped} scale #{@_currentStepDelayScale}")
          return this._currentStepTimeoutId = setTimeout(this._replayNextStep.bind(this), this._currentStepDelayClamped);
        }
      } else {
        return this.stopCurrentReplay();
      }
    } else {
      return this.stopCurrentReplay();
    }
  }

  _startReplayingUIEvents() {
    let delay;
    if ((this._replayGameId == null) || !this._isPlaying || (this._gameUIEventData == null) || (this._gameUIEventData.length === 0)) {
      return;
    }

    const eventData = this._gameUIEventData[this._currentUIEventIndex];
    const now = Date.now();

    if (this._pausedAt != null) {
      delay = this._currentUIEventDelay - (this._pausedAt - this._currentUIEventStartedAt);
      //Logger.module("REPLAY").log("_startReplayingUIEvents -> resume paused at", @_pausedAt, "timestamp", @_currentUIEventStartedAt, "original delay", @_currentUIEventDelay, "delay", delay)
    } else {
      const timeSinceStep = now - this._currentStepStartedAt;
      if (this._currentStepTimestamp > eventData.timestamp) {
        const timeToStep = this._currentStepTimestamp - eventData.timestamp;
        delay = this._currentStepDelay - timeSinceStep - (timeToStep * this._currentStepDelayScale);
        //Logger.module("REPLAY").log("_startReplayingUIEvents -> #{eventData.type} before step delay", delay)
      } else {
        const timeFromStep = eventData.timestamp - this._currentStepTimestamp;
        delay = (timeFromStep * this._currentStepDelayScale) - timeSinceStep;
      }
    }
        //Logger.module("REPLAY").log("_startReplayingUIEvents -> #{eventData.type} from step delay", delay)

    if (delay != null) {
      this._currentUIEventStartedAt = now;
      if (delay <= 0.0) {
        this._currentUIEventDelay = 0.0;
        return this._replayNextUIEvent();
      } else {
        this._currentUIEventDelay = delay;
        return this._currentUIEventTimeoutId = setTimeout(this._replayNextUIEvent.bind(this), this._currentUIEventDelay);
      }
    }
  }

  _replayNextUIEvent(){
    if ((this._replayGameId == null) || !this._isPlaying || (this._gameUIEventData == null) || (this._gameUIEventData.length === 0)) {
      return;
    }

    this._clearUIEventTimeout();

    if (this._currentUIEventIndex < this._gameUIEventData.length) {
      // show current UI event
      const eventData = this._gameUIEventData[this._currentUIEventIndex];
      if (eventData != null) {
        //Logger.module("REPLAY").log("_replayNextUIEvent -> current #{eventData.type}", eventData)
        // play current event
        if (eventData.type === EVENTS.network_game_hover) {
          __guard__(Scene.getInstance().getGameLayer(), x => x.onNetworkHover(eventData));
        } else if (eventData.type === EVENTS.network_game_select) {
          __guard__(Scene.getInstance().getGameLayer(), x1 => x1.onNetworkSelect(eventData));
        } else if (eventData.type === EVENTS.network_game_mouse_clear) {
          __guard__(Scene.getInstance().getGameLayer(), x2 => x2.onNetworkMouseClear(eventData));
        } else if (eventData.type === EVENTS.turn_time) {
          SDK.GameSession.getInstance().setTurnTimeRemaining(eventData.time);
        } else if (eventData.type === EVENTS.show_emote) {
          EventBus.getInstance().trigger(EVENTS.show_emote, eventData);
        }

        // increment counter
        this._currentUIEventIndex++;

        // delay and show next UI event
        const nextEventData = this._gameUIEventData[this._currentUIEventIndex];
        if (nextEventData != null) {
          let delay;
          this._currentUIEventStartedAt = Date.now();
          const timeSinceStep = this._currentUIEventStartedAt - this._currentStepStartedAt;
          if (this._currentStepTimestamp > nextEventData.timestamp) {
            const timeToStep = this._currentStepTimestamp - nextEventData.timestamp;
            delay = this._currentStepDelay - timeSinceStep - (timeToStep * this._currentStepDelayScale);
            //Logger.module("REPLAY").log("_replayNextUIEvent -> next #{nextEventData.type} before step delay", delay)
          } else {
            const timeFromStep = nextEventData.timestamp - this._currentStepTimestamp;
            delay = (timeFromStep * this._currentStepDelayScale) - timeSinceStep;
          }
            //Logger.module("REPLAY").log("_replayNextUIEvent -> next #{nextEventData.type} from step delay", delay)
          if (delay <= 0.0) {
            //Logger.module("REPLAY").log("_replayNextUIEvent -> next #{nextEventData.type} instant")
            this._currentUIEventDelay = 0.0;
            return this._replayNextUIEvent();
          } else {
            this._currentUIEventDelay = delay / CONFIG.replayActionSpeedModifier;
            //Logger.module("REPLAY").log("_replayNextUIEvent -> next #{nextEventData.type} delay #{@_currentUIEventDelay}")
            return this._currentUIEventTimeoutId = setTimeout(this._replayNextUIEvent.bind(this), this._currentUIEventDelay);
          }
        }
      }
    }
  }
}
_ReplayEngine.initClass();

  // endregion REPLAY

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}