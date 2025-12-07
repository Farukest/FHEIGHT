/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =       require('app/common/config');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const Logger =       require('app/common/logger');

const _ = require('underscore');
const GameSession = require('app/sdk/gameSession');
const BaseAgent = require('./baseAgent');
const AgentActions = require('./agentActions');
const Step = require('app/sdk/step');

/*
StaticAgent - Takes a set of actions it's supposed to execute at a certain step index
*/


class StaticAgent extends BaseAgent {
  static initClass() {
    this.prototype.name = "StaticAgent";
    this.prototype.actionsByTurn = null; // Map of turn indices to arrays containing the steps to be executed in order on that turn
    this.prototype.currentTurnIndex = undefined; // players turn index, so it goes by 0,1,2,... instead of 0,2,4,6 like sdk turns would
    this.prototype.currentActionIndexInTurn = undefined; // index into the agent actions for the current turn this agent is currently on
    this.prototype.delayBetweenActions = 0; // milliseconds between agent firing actions
    this.prototype.currentActions = undefined;
     // array of actions to be taken, an empty array means end turn
  }

  /**
   * ReactiveAgent constructor.
   * @public
   */
  constructor(playerId){
    super(playerId);
    this.actionsByTurn = {};
    this.currentTurnIndex = 0;
    this.currentActionIndexInTurn = 0;
    this.currentActions = undefined;
  }

  /**
   * _reactToGameStep
   * @param  {integer} turnIndex - index of turn this action is supposed to occur in
   * @param  {Object} agentAction - agentAction this agent is supposed to execute
   */
  addActionForTurn(turnIndex,agentAction) {
    if (!agentAction) {
      throw new Error("StaticAgent:addActionForTurn - Attempted to add faulty action");
    }

    if (!this.actionsByTurn[turnIndex]) {
      this.actionsByTurn[turnIndex] = [];
    }

    return this.actionsByTurn[turnIndex].push(agentAction);
  }


  /**
   * gatherAgentActionSequenceAfterStep - builds the queue of actions to take after this step
   * @param  {Step Object} lastStep - Last step shown by GameLayer - if null, this is first step in game
   */
  gatherAgentActionSequenceAfterStep(lastStep) {
    this.currentSpeechActions = [];
    this.currentInstructionActions = [];


    const gameSession = GameSession.current();
    // Static doesn't track or perform anything during opponents turn
    if (gameSession.getCurrentPlayerId() !== this.playerId) {
      return;
    }

    // TODO: there is no delay for showing end of turn so add a small delay to first action

    // It's agent's turn proceed to execute
    const currentTurnIndex = gameSession.getNumberOfTurns(); // current turn count calculation is ugly
    const playersTurnIndex = Math.floor(currentTurnIndex / 2); // represents the index of turn for this player
    const actionsForThisTurn = this.actionsByTurn[playersTurnIndex];

    // check if we're in a new turn
    if (this.currentTurnIndex !== playersTurnIndex) {
      Logger.module("Agent").log(`Detected start of new turn: ${playersTurnIndex}`);
      this.currentTurnIndex = playersTurnIndex;
      this.currentActionIndexInTurn = 0;
    }

    this.currentActions = [];
    // Gather any soft actions
    let keepScanningForSoftActions = true;
    while (keepScanningForSoftActions) {
      keepScanningForSoftActions = false;

      // check that we're not out of actions
      if (actionsForThisTurn && (this.currentActionIndexInTurn < actionsForThisTurn.length)) {
        var currentAction = actionsForThisTurn[this.currentActionIndexInTurn];
        if (currentAction.isSoft) {
          AgentActions.executeSoftActionForAgent(this,currentAction);
          this.currentActions.push(currentAction);
          this.currentActionIndexInTurn++;
          keepScanningForSoftActions = true;
        }
      }
    }

    // if there are no actions for this turn or we have done all actions in this turn go ahead and end the turn
    if (!actionsForThisTurn || (this.currentActionIndexInTurn >= actionsForThisTurn.length)) {
      // end turn is assumed if there is no hard action at the end of action list
      return;
    }

    // grab the action we're supposed to execute
    const agentActionToExecute = actionsForThisTurn[this.currentActionIndexInTurn];
    this.currentActions.push(agentActionToExecute);

    // iterate current action index
    return this.currentActionIndexInTurn++;
  }
}
StaticAgent.initClass();


module.exports = StaticAgent;
