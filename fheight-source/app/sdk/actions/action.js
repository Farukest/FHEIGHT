/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SDKObject = require('app/sdk/object');
const CONFIG =       require('app/common/config');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const CardType =       require('app/sdk/cards/cardType');
const Logger =       require('app/common/logger');
const _ = require('underscore');

class Action extends SDKObject {
  static initClass() {
  
    this.type ="Action";
  
    this.prototype.changedByModifierIndices = null;
    this.prototype.isDepthFirst = false;
    this.prototype.fxResource = null; // array of strings that map to fx data, ex: ["Actions.Teleport"]
    this.prototype.index = null; // unique index of action, set automatically by game session
    this.prototype.isAutomatic = false; // actions that act as explicit actions even though they are not player generated (example - battle pets)
    this.prototype.manaCost = 0;
    this.prototype.ownerId = null;
    this.prototype.parentActionIndex = null; // index of action this should be executed as a result of
    this.prototype.resolveParentActionIndex = null; // index of action this was actually resolved after
    this.prototype.resolveSubActionIndices = null; // action indices resolved after this action
    this.prototype.sourceIndex = null;
    this.prototype.sourcePosition = null;
    this.prototype.subActionsOrderedByEventType = null; // actions executed by event type
    this.prototype.targetIndex = null;
    this.prototype.targetPosition = null;
    this.prototype.timestamp = null;
    this.prototype.triggeringModifierIndex = null;
  }

  constructor(gameSession) {
    super(gameSession);

    // define public properties here that must be always be serialized
    // do not define properties here that should only serialize if different from the default
    if (this.type == null) { this.type = Action.type; }
    this.setOwnerId(this.getGameSession().getCurrentPlayer().getPlayerId());
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    // cache
    p.cachedRootAction = null;
    p.cachedResolveSubActions = null;
    p.cachedSubActions = null; // cached list of actions executed after this action
    p.cachedSubActionsQueue = null;

    // targeting
    p.source = null; // where the action is coming from
    p.target = null; // where the action is being applied
    p.includedRandomness = false; // whether action included randomness during execution

    // modifiers data
    p.activatedModifiersData = null;
    p.deactivatedModifiersData = null;
    p.triggeredModifiersData = null;

    // validity
    p.isValid = true; // validators can check if this action can be executed after it is generated. EXAMPLE: a unit has provoke/taunt and can say that attacking anything nearby is invalid
    p.validationMessage = null;
    p.validationMessagePosition = null;
    p.validatorType = null;

    return p;
  }

  getType() {
    return this.constructor.type || this.type; // Fix decaffeinate constructor order
  }

  getLogName(){
    let logName = `${this.getType().replace(' ','_')}[${this.getIndex()}]`;
    if (this.sourceIndex != null) {
      logName += `_s(${this.sourceIndex})`;
    } else if (this.sourcePosition != null) {
      logName += `_s(x:${this.sourcePosition.x},y:${this.sourcePosition.y})`;
    } else {
      logName += "_s()";
    }
    if (this.targetIndex != null) {
      logName += `_t(${this.targetIndex})`;
    } else if (this.targetPosition != null) {
      logName += `_t(x:${this.targetPosition.x},y:${this.targetPosition.y})`;
    } else {
      logName += "_t()";
    }
    return logName;
  }

  setOwnerId(ownerId) {
    return this.ownerId = ownerId;
  }

  getOwnerId() {
    return this.ownerId;
  }

  getOwner() {
    return this.getGameSession().getPlayerById(this.ownerId);
  }

  /**
   * Returns whether this action has been executed yet. This is not a safe way to check if this action is executing on the server, use GameSession.getIsRunningAsAuthoritative instead.
   * @returns {Boolean}
   */
  isFirstTime() {
    return (this.timestamp == null);
  }

  /**
   * Signs the action by setting its execution timestamp.
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
   * Returns the mana cost of an action.
   * @returns {Number}
   */
  getManaCost() {
    return this.manaCost;
  }

  getIsValid() {
    return this._private.isValid;
  }

  setIsValid(val) {
    return this._private.isValid = val;
  }

  setValidationMessage(val) {
    return this._private.validationMessage = val;
  }

  getValidationMessage() {
    return this._private.validationMessage;
  }

  setValidationMessagePosition(val) {
    return this._private.validationMessagePosition = val;
  }

  getValidationMessagePosition() {
    return this._private.validationMessagePosition;
  }

  setValidatorType(val) {
    return this._private.validatorType = val;
  }

  getValidatorType() {
    return this._private.validatorType;
  }

  getIsDepthFirst() {
    return this.isDepthFirst;
  }

  setIsDepthFirst(val) {
    return this.isDepthFirst = val;
  }

  setIsAutomatic(val) {
    return this.isAutomatic = val;
  }

  getIsAutomatic() {
    return this.isAutomatic;
  }

  getIncludedRandomness() {
    return this._private.includedRandomness;
  }

  setIncludedRandomness(val) {
    return this._private.includedRandomness = val;
  }

  /**
   * Returns the source card of the action, if any. Source cards are found by source card.
   * NOTE: only valid if sourceIndex is set or after the action is executed!
   * @returns {Card}
   */
  getSource() {
    if ((this._private.source == null)) {
      if (this.sourceIndex != null) {
        this._private.source = this.getGameSession().getCardByIndex(this.sourceIndex);
      } else {
        // check for a modifier that triggered and created this action
        const triggeringModifier = this.getTriggeringModifier();
        if (triggeringModifier != null) {
          this._private.source = triggeringModifier.getCardAffected();
        }
      }
    }
    return this._private.source;
  }

  /**
   * Sets the immediate source card of the action by setting its index and position. If possible, this should ALWAYS be set before executing the action.
   * @param {Card}
   */
  setSource(source) {
    this._private.source = source;
    this.setSourceIndex(source != null ? source.getIndex() : undefined);
    return this.setSourcePosition(source != null ? source.getPosition() : undefined);
  }

  /**
   * Sets the position of the immediate source card of the action. If possible, this should ALWAYS be set before executing the action.
   * @param {Vec2|Object}
   */
  setSourcePosition(sourcePosition) {
    return this.sourcePosition = sourcePosition;
  }

  /**
   * Returns the source position of the action, if any.
   * @returns {Vec2|Object}
   */
  getSourcePosition() {
    if ((this.sourcePosition == null)) {
      const source = this.getSource();
      if (source != null) {
        this.sourcePosition = source.getPosition();
      }
    }
    return this.sourcePosition;
  }

  /**
   * Sets the index of the immediate source card of the action. If possible, this should ALWAYS be set before executing the action.
   * @param {Number}
   */
  setSourceIndex(sourceIndex) {
    return this.sourceIndex = sourceIndex;
  }

  /**
   * Returns the index of the immediate source card of the action.
   * NOTE: only valid if set when action created or always after the action is executed!
   * @returns {Number}
   */
  getSourceIndex() {
    if ((this.sourceIndex == null)) {
      const source = this.getSource();
      if (source != null) {
        this.sourceIndex = source.getIndex();
      }
    }
    return this.sourceIndex;
  }

  /**
   * Returns the target of the action, if any. Target cards are found by target card index.
   * NOTE: only valid if targetIndex is set or after the action is executed!
   * @returns {Card}
   */
  getTarget() {
    if ((this._private.target == null) && (this.targetIndex != null)) {
      this._private.target = this.getGameSession().getCardByIndex(this.targetIndex);
    }
    return this._private.target;
  }

  /**
   * Sets the target card of the action by setting its index and position. If possible, this should ALWAYS be set before executing the action.
   * @param {Card}
   */
  setTarget(target) {
    this._private.target = target;
    this.setTargetIndex(target != null ? target.getIndex() : undefined);
    return this.setTargetPosition(target != null ? target.getPosition() : undefined);
  }

  /**
   * Sets the position of the target card of the action. If possible, this should ALWAYS be set before executing the action.
   * @param {Vec2|Object}
   */
  setTargetPosition(targetPosition) {
    return this.targetPosition = targetPosition;
  }

  /**
   * Returns the target position of the action, if any.
   * @returns {Vec2|Object}
   */
  getTargetPosition() {
    if ((this.targetPosition == null)) {
      const target = this.getTarget();
      if (target != null) {
        this.targetPosition = target.getPosition();
      }
    }
    return this.targetPosition;
  }

  /**
   * Sets the index of the target card of the action. If possible, this should ALWAYS be set before executing the action.
   * @param {Number}
   */
  setTargetIndex(targetIndex) {
    return this.targetIndex = targetIndex;
  }

  /**
   * Returns the index of the target card of the action.
   * NOTE: only valid if set when action created or always after the action is executed!
   * @returns {Number}
   */
  getTargetIndex() {
    if ((this.targetIndex == null) && (this._private.target != null)) {
      const target = this.getTarget();
      if (target != null) {
        this.targetIndex = this._private.target.getIndex();
      }
    }
    return this.targetIndex;
  }

  /**
   * Returns whether this action is a sub action (i.e. created by another action and not the user)
   * @returns {Boolean}
   */
  getIsImplicit() {
    return (this.parentActionIndex != null);
  }

  setFXResource(fxResource) {
    if ((fxResource == null) || (fxResource.length === 0)) {
      return this.fxResource = null;
    } else {
      return this.fxResource = fxResource;
    }
  }

  getFXResource() {
    return this.fxResource || [];
  }

  /**
   * Modifies the action for execution. Useful for things like finding targets at execution time, before modifiers have modified this action.
   */
  _modifyForExecution() {}
    // override in sub class to add pre-execution behavior

  /**
   * Executes the action.
   */
  _execute() {}
    // override in sub class to add execution behavior

  /**
   * Sets the execution parent action of an action.
   * @param {Action} action
   */
  setParentAction(action) {
    if (action != null) {
      // record parent's index
      return this.parentActionIndex = action.getIndex();
    }
  }

  /**
   * Returns the execution parent action.
   * @returns {Action}
   */
  getParentAction() {
    if (this.parentActionIndex != null) { return this.getGameSession().getActionByIndex(this.parentActionIndex); }
  }

  /**
   * Returns the index of the execution parent action.
   * @returns {Number}
   */
  getParentActionIndex() {
    return this.parentActionIndex;
  }

  /**
   * Returns the execution root action.
   * @returns {Action}
   */
  getRootAction() {
    if ((this._private.cachedRootAction == null)) {
      if (this.parentActionIndex != null) {
        // parent or higher is root
        const parentAction = this.getGameSession().getActionByIndex(this.parentActionIndex);
        if (parentAction != null) {
          this._private.cachedRootAction = parentAction.getRootAction();
        } else {
          this._private.cachedRootAction = this;
        }
      } else {
        // this action is root
        this._private.cachedRootAction = this;
      }
    }
    return this._private.cachedRootAction;
  }

  /**
   * Returns an execution ancestor action that matches the parameters.
   * @param {Action|String} classOrType action class or action type
   * @param {Card} [source=null] action source
   * @param {Card} [target=null] action target
   * @returns {Action}
   */
  getMatchingAncestorAction(classOrType, source, target) {
    // walk up parent action chain to find the first ancestor of action
    // that optionally matches an action class, source, and/or target
    if (this.parentActionIndex != null) {
      const parentAction = this.getGameSession().getActionByIndex(this.parentActionIndex);
      if (parentAction != null) {
        if (((classOrType == null) || (_.isString(classOrType) && (parentAction.getType() === classOrType)) || parentAction instanceof classOrType) && ((source == null) || (parentAction.getSource() === source)) && ((target == null) || (parentAction.getTarget() === target))) {
          return parentAction;
        } else {
          return parentAction.getMatchingAncestorAction(classOrType, source, target);
        }
      }
    } else {
      return null;
    }
  }

  /**
   * Returns a resolve ancestor action that matches the parameters.
   * @param {Action|String} classOrType action class or action type
   * @param {Card} [source=null] action source
   * @param {Card} [target=null] action target
   * @returns {Action}
   */
  getMatchingResolveAncestorAction(classOrType, source, target) {
    // walk up parent action chain to find the first ancestor of action
    // that optionally matches an action class, source, and/or target
    if (this.resolveParentActionIndex != null) {
      const resolveParentAction = this.getGameSession().getActionByIndex(this.resolveParentActionIndex);
      if (resolveParentAction != null) {
        if (((classOrType == null) || (_.isString(classOrType) && (resolveParentAction.getType() === classOrType)) || resolveParentAction instanceof classOrType) && ((source == null) || (resolveParentAction.getSource() === source)) && ((target == null) || (resolveParentAction.getTarget() === target))) {
          return resolveParentAction;
        } else {
          return resolveParentAction.getMatchingResolveAncestorAction(classOrType, source, target);
        }
      }
    } else {
      return null;
    }
  }

  /**
   * Returns whether an action is the ancestor of this action.
   * @returns {Boolean}
   */
  getIsActionMyAncestor(action) {
    const parentAction = this.getParentAction();
    return (parentAction != null) || (parentAction === action) || parentAction.getIsActionMyAncestor(action);
  }

  /**
   * Adds an action as an execution sub action.
   * @param {Action} action
   */
  addSubAction(action) {
    if (action != null) {
      // add action to list sub actions data objects
      // each data object retains the event type and a list of events executed during that event
      // sub action data objects are always in order of execution
      if (this.subActionsOrderedByEventType == null) { this.subActionsOrderedByEventType = []; }
      const subActionsData = this.subActionsOrderedByEventType[this.subActionsOrderedByEventType.length - 1];
      const eventType = this.getGameSession().getActionExecutionEventType();
      if ((subActionsData == null) || (subActionsData.eventType !== eventType)) {
        // add new sub actions map
        this.subActionsOrderedByEventType.push({eventType, actions: [action]});
      } else {
        // add action to current event type map
        subActionsData.actions.push(action);
      }

      // flush cache
      this._private.cachedSubActions = null;

      // ensure parent is set correctly
      return action.setParentAction(this);
    }
  }

  /**
   * Returns an array of sub action data objects, each containing an eventType and actions executed for that eventType
   * @returns {Array}
   */
  getSubActionsOrderedByEventType() {
    return this.subActionsOrderedByEventType || [];
  }

  /**
   * Returns an array of ordered execution sub actions.
   * @returns {Array}
   */
  getSubActions() {
    if ((this._private.cachedSubActions == null)) {
      this._private.cachedSubActions = [];
      if (this.subActionsOrderedByEventType != null) {
        for (var subActionsData of Array.from(this.subActionsOrderedByEventType)) {
          this._private.cachedSubActions = this._private.cachedSubActions.concat(subActionsData.actions);
        }
      }
    }
    return this._private.cachedSubActions;
  }

  getSubActionsQueue() {
    return this._private.cachedSubActionsQueue;
  }

  /**
   * Executes all sub actions from the authoritative sub action queue if next event type matches current session event type.
   * @param {String} eventType
   */
  executeNextOfEventTypeFromAuthoritativeSubActionQueue(eventType) {
    if (this.subActionsOrderedByEventType != null) {
      // make a copy of the sub actions ordered by event type
      if (this._private.cachedSubActionsQueue == null) { this._private.cachedSubActionsQueue = this.subActionsOrderedByEventType.slice(0); }

      // check next sub actions data
      if (this._private.cachedSubActionsQueue.length > 0) {
        const subActionsData = this._private.cachedSubActionsQueue[0];
        if (subActionsData.eventType === eventType) {
          // event types match, remove from queue
          this._private.cachedSubActionsQueue.shift();

          // execute all sub actions for this eventType
          return Array.from(subActionsData.actions).map((action) =>
            this.getGameSession().executeAction(action));
        }
      }
    }
  }

  /**
   * Returns a recursive array of ordered execution actions.
   * @returns {Array}
   */
  getFlattenedActionTree() {
    const actions = [this];
    const subActions = this.getSubActions();
    if (subActions.length > 0) {
      let actionsProcessing = subActions.slice(0);
      let actionsToProcess = [];
      while (actionsProcessing.length > 0) {
        var subAction = actionsProcessing.shift();
        actions.push(subAction);
        var subSubActions = subAction.getSubActions();
        if (subSubActions.length > 0) {
          if (subAction.getIsDepthFirst()) {
            actionsProcessing = actionsProcessing.concat(subSubActions);
          } else {
            actionsToProcess = actionsToProcess.concat(subSubActions);
          }
        }

        if ((actionsProcessing.length === 0) && (actionsToProcess.length > 0)) {
          actionsProcessing = actionsToProcess;
          actionsToProcess = [];
        }
      }
    }
    return actions;
  }

  /**
   * Returns an array of execution sibling actions
   * @returns {Array}
   */
  getSiblingActions() {
    const parentAction = this.getParentAction();
    if (parentAction != null) {
      return parentAction.getSubActions();
    } else {
      return [];
    }
  }

  /**
   * Sets the resolve parent action of an action.
   * NOTE: Resolve sub actions are created as a result of this action executing and resolving.
   * @param {Action} action
   */
  setResolveParentAction(action) {
    if (action != null) {
      // record parent's index
      return this.resolveParentActionIndex = action.getIndex();
    }
  }

  /**
   * Returns the resolve parent action.
   * NOTE: Resolve sub actions are created as a result of this action executing and resolving.
   * @returns {Action}
   */
  getResolveParentAction() {
    if (this.resolveParentActionIndex != null) { return this.getGameSession().getActionByIndex(this.resolveParentActionIndex); }
  }

  /**
   * Returns the index of the resolve parent action.
   * NOTE: Resolve sub actions are created as a result of this action executing and resolving.
   * @returns {Number}
   */
  getResolveParentActionIndex() {
    return this.resolveParentActionIndex;
  }

  /**
   * Adds an action as a resolve sub action of this action.
   * NOTE: Resolve sub actions are created as a result of this action executing and resolving.
   * @param {Action} action
   */
  addResolveSubAction(action) {
    if (action != null) {
      // add action index to list of sub actions
      const index = action.getIndex();
      if (_.indexOf(this.resolveSubActionIndices, index) === -1) {
        if (this.resolveSubActionIndices == null) { this.resolveSubActionIndices = []; }
        this.resolveSubActionIndices.push(index);
        if (this._private.cachedResolveSubActions == null) { this._private.cachedResolveSubActions = []; }
        return this._private.cachedResolveSubActions.push(action);
      }
    }
  }

  /**
   * Returns an array of resolve sub action indices.
   * NOTE: Resolve sub actions are created as a result of this action executing and resolving.
   * @returns {Array}
   */
  getResolveSubActionsIndices() {
    return this.resolveSubActionIndices || [];
  }

  /**
   * Returns an array of resolve sub actions.
   * NOTE: Resolve sub actions are created as a result of this action executing and resolving.
   * @returns {Array}
   */
  getResolveSubActions() {
    if ((this.resolveSubActionIndices != null) && ((this._private.cachedResolveSubActions == null) || (this._private.cachedResolveSubActions.length !== this.resolveSubActionIndices.length))) {
      this._private.cachedResolveSubActions = this.getGameSession().getActionsByIndices(this.resolveSubActionIndices);
    }
    return this._private.cachedResolveSubActions || [];
  }

  /**
   * Returns an array of resolve sibling actions, including this action.
   * @returns {Array}
   */
  getResolveSiblingActions() {
    const resolveParentAction = this.getResolveParentAction();
    if (resolveParentAction != null) {
      return resolveParentAction.getResolveSubActions();
    } else {
      return [];
    }
  }

  /**
   * Records the modifier that triggered to create this action.
   * @param {Modifier} modifier
   */
  setTriggeringModifier(modifier) {
    if (modifier != null) {
      // record parent's index
      return this.triggeringModifierIndex = modifier.getIndex();
    }
  }

  /**
   * Returns the modifier that triggered to create this action.
   * @returns {Modifier}
   */
  getTriggeringModifier() {
    if (this.triggeringModifierIndex != null) { return this.getGameSession().getModifierByIndex(this.triggeringModifierIndex); }
  }

  /**
   * Returns the index of the modifier that triggered to create this action.
   * @returns {Number}
   */
  getTriggeringModifierIndex() {
    return this.triggeringModifierIndex;
  }

  /**
   * Returns whether this action was created by a triggering modifier at any point up the parent chain.
   * @returns {Boolean}
   */
  getCreatedByTriggeringModifier() {
    return (this.getTriggeringModifierIndex() != null) || __guard__(this.getResolveParentAction(), x => x.getCreatedByTriggeringModifier());
  }

  _getModifierIndices(indicesData) {
    const modifierIndices = [];
    if (indicesData != null) {
      const actionIndex = this.getIndex();
      for (let i = 0; i < indicesData.length; i += 3) {
        var dataModifierIndex = indicesData[i];
        var dataActionIndex = indicesData[i+1];
        var dataResolveActionIndex = indicesData[i+2];
        if ((dataActionIndex === actionIndex) && ((dataActionIndex !== dataResolveActionIndex) || (dataModifierIndex !== lastDataModifierIndex))) {
          modifierIndices.push(dataModifierIndex);
        }
        var lastDataModifierIndex = dataModifierIndex;
      }
    }
    return modifierIndices;
  }

  _getResolveModifierIndices(indicesData) {
    const modifierIndices = [];
    if (indicesData != null) {
      const actionIndex = this.getIndex();
      for (let i = 0; i < indicesData.length; i += 3) {
        var dataModifierIndex = indicesData[i];
        var dataActionIndex = indicesData[i+1];
        var dataResolveActionIndex = indicesData[i+2];
        if ((dataResolveActionIndex === actionIndex) && ((dataResolveActionIndex !== dataActionIndex) || (dataModifierIndex !== lastDataModifierIndex))) {
          modifierIndices.push(dataModifierIndex);
        }
        var lastDataModifierIndex = dataModifierIndex;
      }
    }
    return modifierIndices;
  }

  /**
   * Stores a modifier as triggered by this action.
   * @param {Modifier} modifier
   * @param {Action} resolveAction
   */
  onTriggeredModifier(modifier, resolveAction) {
    if (modifier != null) {
      // record modifier index
      const modifierIndex = modifier.getIndex();
      const actionIndex = this.getIndex();
      const resolveActionIndex = resolveAction.getIndex();
      if (this._private.triggeredModifiersData == null) { this._private.triggeredModifiersData = []; }
      return this._private.triggeredModifiersData.push(modifierIndex, actionIndex, resolveActionIndex);
    }
  }

  /**
   * Returns a list of data for modifiers triggered by this action.
   * - n+0 = modifierIndex
   * - n+1 = actionIndex
   * - n+2 = resolveActionIndex
   * @returns {Array}
   */
  getTriggeredModifiersData() {
    return this._private.triggeredModifiersData || [];
  }

  /**
   * Returns a list of modifier indices triggered by this action.
   * @returns {Array}
   */
  getTriggeredModifierIndices() {
    return this._getModifierIndices(this._private.triggeredModifiersData);
  }

  /**
   * Returns a list of modifiers triggered by this action.
   * @returns {Array}
   */
  getTriggeredModifiers() {
    return this.getGameSession().getModifiersByIndices(this.getTriggeredModifierIndices());
  }

  /**
   * Stores a modifier as triggered by this action during resolve.
   * @param {Modifier} modifier
   * @param {Action} action
   */
  onResolveTriggeredModifier(modifier, action) {
    if (modifier != null) {
      // record modifier index
      const modifierIndex = modifier.getIndex();
      const actionIndex = action.getIndex();
      const resolveActionIndex = this.getIndex();
      if (this._private.triggeredModifiersData == null) { this._private.triggeredModifiersData = []; }
      return this._private.triggeredModifiersData.push(modifierIndex, actionIndex, resolveActionIndex);
    }
  }

  /**
   * Returns a list of modifier indices triggered by this action during resolve.
   * @returns {Array}
   */
  getResolveTriggeredModifierIndices() {
    return this._getResolveModifierIndices(this._private.triggeredModifiersData);
  }

  /**
   * Returns a list of modifiers triggered by this action during resolve.
   * @returns {Array}
   */
  getResolveTriggeredModifiers() {
    return this.getGameSession().getModifiersByIndices(this.getResolveTriggeredModifierIndices());
  }

  /**
   * Stores a modifier as activated by this action.
   * @param {Modifier} modifier
   * @param {Action} resolveAction
   */
  onActivatedModifier(modifier, resolveAction) {
    if (modifier != null) {
      // record modifier index
      const modifierIndex = modifier.getIndex();
      const actionIndex = this.getIndex();
      const resolveActionIndex = resolveAction.getIndex();
      if (this._private.activatedModifiersData == null) { this._private.activatedModifiersData = []; }
      return this._private.activatedModifiersData.push(modifierIndex, actionIndex, resolveActionIndex);
    }
  }

  /**
   * Returns a list of data for modifiers activated by this action.
   * - n+0 = modifierIndex
   * - n+1 = actionIndex
   * - n+2 = resolveActionIndex
   * @returns {Array}
   */
  getActivatedModifiersData() {
    return this._private.activatedModifiersData || [];
  }

  /**
   * Returns a list of modifier indices activated by this action.
   * @returns {Array}
   */
  getActivatedModifierIndices() {
    return this._getModifierIndices(this._private.activatedModifiersData);
  }

  /**
   * Returns a list of modifiers activated by this action.
   * @returns {Array}
   */
  getActivatedModifiers() {
    return this.getGameSession().getModifiersByIndices(this.getActivatedModifierIndices());
  }

  /**
   * Stores a modifier as activated by this action during resolve.
   * @param {Modifier} modifier
   * @param {Action} action
   */
  onResolveActivatedModifier(modifier, action) {
    if (modifier != null) {
      // record modifier index
      const modifierIndex = modifier.getIndex();
      const actionIndex = action.getIndex();
      const resolveActionIndex = this.getIndex();
      if (this._private.activatedModifiersData == null) { this._private.activatedModifiersData = []; }
      return this._private.activatedModifiersData.push(modifierIndex, actionIndex, resolveActionIndex);
    }
  }

  /**
   * Returns a list of modifier indices activated by this action during resolve.
   * @returns {Array}
   */
  getResolveActivatedModifierIndices() {
    return this._getResolveModifierIndices(this._private.activatedModifiersData);
  }

  /**
   * Returns a list of modifiers activated by this action during resolve.
   * @returns {Array}
   */
  getResolveActivatedModifiers() {
    return this.getGameSession().getModifiersByIndices(this.getResolveActivatedModifierIndices());
  }

  /**
   * Stores a modifier as deactivated by this action.
   * @param {Modifier} modifier
   * @param {Action} resolveAction
   */
  onDeactivatedModifier(modifier, resolveAction) {
    if (modifier != null) {
      // record modifier index
      const modifierIndex = modifier.getIndex();
      const actionIndex = this.getIndex();
      const resolveActionIndex = resolveAction.getIndex();
      if (this._private.deactivatedModifiersData == null) { this._private.deactivatedModifiersData = []; }
      return this._private.deactivatedModifiersData.push(modifierIndex, actionIndex, resolveActionIndex);
    }
  }

  /**
   * Returns a list of data for modifiers deactivated by this action.
   * - n+0 = modifierIndex
   * - n+1 = actionIndex
   * - n+2 = resolveActionIndex
   * @returns {Array}
   */
  getDeactivatedModifiersData() {
    return this._private.deactivatedModifiersData || [];
  }

  /**
   * Returns a list of modifier indices deactivated by this action.
   * @returns {Array}
   */
  getDeactivatedModifierIndices() {
    return this._getModifierIndices(this._private.deactivatedModifiersData);
  }

  /**
   * Returns a list of modifiers deactivated by this action.
   * @returns {Array}
   */
  getDeactivatedModifiers() {
    return this.getGameSession().getModifiersByIndices(this.getDeactivatedModifierIndices());
  }

  /**
   * Stores a modifier as deactivated by this action during resolve.
   * @param {Modifier} modifier
   * @param {Action} action
   */
  onResolveDeactivatedModifier(modifier, action) {
    if (modifier != null) {
      // record modifier index
      const modifierIndex = modifier.getIndex();
      const actionIndex = action.getIndex();
      const resolveActionIndex = this.getIndex();
      if (this._private.deactivatedModifiersData == null) { this._private.deactivatedModifiersData = []; }
      return this._private.deactivatedModifiersData.push(modifierIndex, actionIndex, resolveActionIndex);
    }
  }

  /**
   * Returns a list of modifier indices deactivated by this action during resolve.
   * @returns {Array}
   */
  getResolveDeactivatedModifierIndices() {
    return this._getResolveModifierIndices(this._private.deactivatedModifiersData);
  }

  /**
   * Returns a list of modifiers deactivated by this action during resolve.
   * @returns {Array}
   */
  getResolveDeactivatedModifiers() {
    return this.getGameSession().getModifiersByIndices(this.getResolveDeactivatedModifierIndices());
  }

  /**
   * Stores a modifier as changing this action. This must be called manually when a modifier changes any property of an action in response to an event.
   * @param {Modifier} modifier
   */
  setChangedByModifier(modifier) {
    // record modifier
    if ((modifier != null) && !this.getChangedByModifier(modifier)) {
      const index = modifier.getIndex();
      if (this.changedByModifierIndices == null) { this.changedByModifierIndices = []; }
      return this.changedByModifierIndices.push(index);
    }
  }

  /**
   * Returns a list of modifiers that changed this action.
   * @returns {Array}
   */
  getChangedByModifiers() {
    return this.getGameSession().getModifiersByIndices(this.changedByModifierIndices);
  }

  /**
   * Returns a list of modifier indices that changed this action.
   * @returns {Array}
   */
  getChangedByModifierIndices() {
    return this.changedByModifierIndices || [];
  }

  /**
   * Returns whether a modifier changed this action.
   * @param {Modifier} modifier
   * @returns {Boolean}
   */
  getChangedByModifier(modifier) {
    if (this.changedByModifierIndices != null) {
      return _.includes(this.changedByModifierIndices, modifier.getIndex());
    }
    return false;
  }

  /* JSON serialization */

  /*
  Returns whether this action can be removed during scrubbing.
  @param   {String}   scrubFromPerspectiveOfPlayerId    The player for who we want to scrub. (The player that is not allowed to see the data).
  @param   {Boolean}   forSpectator              Should the scrubbing be done for someone watching the game? If so we usually want to blank out the deck since even if a buddy can see your hand, they shouldn't be able to deck snipe.
  @returns {Object}
     */
  isRemovableDuringScrubbing(scrubFromPerspectiveOfPlayerId, forSpectator) {
    // override in sub class to modify and return action data
    return true;
  }

  /*
  Resets/scrubs all cheat sensitive data in action data.
  @param   {Object}   actionData              Plain js object for action data.
  @param   {String}   scrubFromPerspectiveOfPlayerId    The player for who we want to scrub. (The player that is not allowed to see the data).
  @param   {Boolean}   forSpectator              Should the scrubbing be done for someone watching the game? If so we usually want to blank out the deck since even if a buddy can see your hand, they shouldn't be able to deck snipe.
  @returns {Object}
     */
  scrubSensitiveData(actionData, scrubFromPerspectiveOfPlayerId, forSpectator) {
    // override in sub class to modify and return action data
    return actionData;
  }

  /*
   * Resets action properties for execution on an authoritative session.
  */
  resetForAuthoritativeExecution() {
    delete this.timestamp;
    delete this.subActionsOrderedByEventType;
    return delete this.resolveSubActionIndices;
  }

  deserialize(data) {
    UtilsJavascript.fastExtend(this,data);

    // deserialize all sub actions
    const {
      subActionsOrderedByEventType
    } = this;
    if (subActionsOrderedByEventType != null) {
      this.subActionsOrderedByEventType = [];
      return (() => {
        const result = [];
        for (var subActionsData of Array.from(subActionsOrderedByEventType)) {
          var subActionsToDeserialize = subActionsData.actions;
          subActionsData.actions = [];
          for (var subActionToDeserialize of Array.from(subActionsToDeserialize)) {
            var subAction = this.getGameSession().deserializeActionFromFirebase(subActionToDeserialize);
            subActionsData.actions.push(subAction);
          }
          result.push(this.subActionsOrderedByEventType.push(subActionsData));
        }
        return result;
      })();
    }
  }
}
Action.initClass();

module.exports = Action;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}