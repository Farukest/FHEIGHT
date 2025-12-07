/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
//_ = require 'underscore'

const PlayCardFromHandAction = require("app/sdk/actions/playCardFromHandAction");
const PlayCardAction = require("app/sdk/actions/playCardAction");
const ApplyCardToBoardAction = require("app/sdk/actions/applyCardToBoardAction");
const GameSession = require("app/sdk/gameSession");
const CONFIG = require("app/common/config");

/*
AgentActions - Creates agent style actions and later interprets them into sdk actions
- Factory class
*/

class AgentActions {
  static initClass() {
    // Hard actions
    this._moveUnitType = "MoveUnit";
    this._attackActionType = "AttackWithUnit";
    this._playCardActionType = "PlayCard";
    this._playCardFindPositionActionType = "PlayCardFindPosition";
    this._playFollowupActionType = "PlayFollowup";
  
    // Soft Actions
    this._tagUnitActionType = "TagUnit";
    this._speechActionType = "Speech";
    this._instructionActionType = "Instruction";
    this._delayActionType = "Delay";
    this._showInstructionLabelsActionType = "ShowInstructionLabels";
  }

  /**
   * @param {string} type - Type of
   */
  static _createBaseAgentAction(type) {
    return {type};
  }

  /**
   * @param {string} unitTag - tag of the unit to perform this action with
   */
  static _createBaseSoftAgentAction(softActionType) {
    const softAgentAction = this._createBaseAgentAction(softActionType);
    softAgentAction.isSoft = true;
    return softAgentAction;
  }


  /**
   * @param {string} unitTag - tag of the unit to perform this action with
   * @param {object} deltaXY- object with X and Y delta for the movement the unit should take
   */
  static createAgentActionMoveUnit(unitTag, deltaXY) {
    const agentAction = this._createBaseAgentAction(this._moveUnitType);
    agentAction.unitTag = unitTag;
    agentAction.deltaXY = deltaXY;
    return agentAction;
  }


  /**
   * @param {string} unitTag - tag of the unit to perform this action with
   * @param {object} attackTargetPosition - object with X and Y delta for the movement the unit should take
   * @param {object} targetPositionIsAbsolute - (optional) flag for whether the attack position should be a delta from attacker or absolute position
   */
  static createAgentActionAttackWithUnit(unitTag, attackTargetPosition, targetPositionIsAbsolute) {
    if (targetPositionIsAbsolute == null) { targetPositionIsAbsolute = true; }
    const agentAction = this._createBaseAgentAction(this._attackActionType);
    agentAction.unitTag = unitTag;
    agentAction.attackTargetPosition = attackTargetPosition;
    agentAction.targetPositionIsAbsolute = targetPositionIsAbsolute;
    return agentAction;
  }


  static createAgentActionPlayCard(handIndex, targetPosition) {
    const agentAction = this._createBaseAgentAction(this._playCardActionType);
    agentAction.handIndex = handIndex;
    agentAction.targetPosition = targetPosition;
    return agentAction;
  }

  static createAgentActionPlayCardFindPosition(handIndex, positionFilter) {
    const agentAction = this._createBaseAgentAction(this._playCardFindPositionActionType);
    agentAction.handIndex = handIndex;
    agentAction.positionFilter = positionFilter;
    return agentAction;
  }


  static createAgentActionPlayFollowup(followupCardId, sourcePosition, targetPosition) {
    const agentAction = this._createBaseAgentAction(this._playFollowupActionType);
    agentAction.followupCardId = followupCardId;
    agentAction.sourcePosition = sourcePosition;
    agentAction.targetPosition = targetPosition;
    return agentAction;
  }


  static createSDKActionFromAgentAction(agent, agentAction) {
    let targetPosition, unit;
    const gameSession = GameSession.current();
    if (agentAction.type === this._moveUnitType) {
      unit = agent.getUnitForTag(gameSession,agentAction.unitTag);
      targetPosition = unit.getPosition();
      targetPosition.x += agentAction.deltaXY.x;
      targetPosition.y += agentAction.deltaXY.y;
      return unit.actionMove(targetPosition);
    } else if (agentAction.type === this._attackActionType) {
      unit = agent.getUnitForTag(gameSession,agentAction.unitTag);
      targetPosition = {x: agentAction.attackTargetPosition.x, y: agentAction.attackTargetPosition.y};
      if (!agentAction.targetPositionIsAbsolute) {
        targetPosition.x += unit.getPositionX();
        targetPosition.y += unit.getPositionY();
      }
      return unit.actionAttackEntityAtPosition(targetPosition);
    } else if (agentAction.type === this._playCardActionType) {
      return new PlayCardFromHandAction(gameSession,gameSession.getCurrentPlayerId(),agentAction.targetPosition.x,agentAction.targetPosition.y,agentAction.handIndex);
    } else if (agentAction.type === this._playFollowupActionType) {
      const playCardAction = new PlayCardAction(gameSession,gameSession.getCurrentPlayerId(),agentAction.targetPosition.x,agentAction.targetPosition.y,{id: agentAction.followupCardId});
      playCardAction.sourcePosition = {x: agentAction.sourcePosition.x, y: agentAction.sourcePosition.y};
      return playCardAction;
    } else if (agentAction.type === this._playCardFindPositionActionType) {
      const possiblePositions = agentAction.positionFilter();
      targetPosition = possiblePositions[0];
      return new PlayCardFromHandAction(gameSession,gameSession.getCurrentPlayerId(),targetPosition.x,targetPosition.y,agentAction.handIndex);
    } else {
      throw new Error(`Unexpected AgentAction type: ${agentAction.type}`);
    }
  }

  static createAgentSoftActionTagUnitAtPosition(unitTag, position) {
    const agentSoftAction = this._createBaseSoftAgentAction(this._tagUnitActionType);
    agentSoftAction.unitTag = unitTag;
    agentSoftAction.position = position;
    return agentSoftAction;
  }

  static createAgentSoftActionShowInstructionLabels(instructionLabels) {
    const agentSoftAction = this._createBaseSoftAgentAction(this._showInstructionLabelsActionType);
    agentSoftAction.instructionLabels = instructionLabels;
    return agentSoftAction;
  }

  static executeSoftActionForAgent(agent, agentSoftAction) {
    const gameSession = GameSession.current();
    if (agentSoftAction.type === this._tagUnitActionType) {
      const unitAtPosition = gameSession.getBoard().getUnitAtPosition(agentSoftAction.position,true,true);
      return agent.addUnitWithTag(unitAtPosition,agentSoftAction.unitTag);
    }
  }
}
AgentActions.initClass();



module.exports = AgentActions;
