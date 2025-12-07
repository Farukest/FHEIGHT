/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EventBus = require('app/common/eventbus');
const EVENTS = require('app/common/event_types');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const GameSession = require('app/sdk/gameSession');
const GameStatus = require('app/sdk/gameStatus');
const GameType = require('app/sdk/gameType');
const GameSetup = require('app/sdk/gameSetup');
const Card = require('app/sdk/cards/card');
const StaticAgent = require('app/sdk/agents/staticAgent');
const DrawStartingHandAction = require('app/sdk/actions/drawStartingHandAction');
const BattleMapTemplate = require('app/sdk/battleMapTemplate');
const i18next = require('i18next');

class Challenge {
  static initClass() {
  
    this.type = "Challenge";
    this.prototype.type = "Challenge";
    this.prototype.name = "Challenge";
    this.prototype.description = "Learn how to play FHEIGHT.";
  
    this.prototype.battleMapTemplateIndex = 0; // when set will attempt to force battlemap to a specific template
    this.prototype._currentInstruction = null;
    this.prototype._currentPlayerTurn = null;
    this.prototype._eventBus =null;
    this.prototype.hiddenUIElements =null; // array of strings representing unneeded ui elements # TODO: this is just a hacky string checker
    this.prototype.iconUrl = null; // path to icon resource
    this.prototype._instructions =null;
    this.prototype._instructionQueueByTurnIndex =null; // Map of instruction queues by player turn index
    this.prototype.isChallengeLost = false; // (boolean) Tracks whether the current challenge has been lost (resets on rollback)
    this.prototype._musicOverride = undefined; // (RSX entry) Manual override of the music to play for this map
    this.prototype._nextInstructionIndex = 0;
    this.prototype._playerOwnedBoardTemplate = undefined; // array of arrays that can be filled with unit card ids the player owns at start of challenge
    this.prototype.prerequisiteChallengeTypes = null; // list of challenge types that must be completed before this challenge is enabled
    this.prototype._opponentAgent =null;
    this.prototype._opponentOwnedBoardTemplate = undefined; // array of arrays that can be filled with unit card ids the player owns at start of challenge
    this.prototype.otkChallengeFailureCount = null; // Integer representing quantity of times otk challenge has been failed
    this.prototype.otkChallengeFailureMessages = null; // Array of strings, advances each time challenge has been failed
    this.prototype.otkChallengeStartMessage = null; // String to display when starting otk challenge
    this.prototype.requiredMulliganHandIndices = null;
    this.prototype.showCardInstructionalTextForTurns = 0; // integer - will show instructional ui on cards for this many turns
    this.prototype.customBoard = true; // whether challenge uses a custom board, when true will start board completely empty except for generals
    this.prototype.skipMulligan = true;
    this.prototype.snapShotOnPlayerTurn = null;
    this.prototype.startingHandSize = null; // (Integer, optional) number of cards to have in hand at start of challenge (0-6)
    this.prototype.startingHandSizePlayer = null; // (Integer, optional) number of cards to have in player hand at start of challenge (0-6)
    this.prototype.startingHandSizeOpponent = null; // (Integer, optional) number of cards to have in opponent hand at start of challenge (0-6)
    this.prototype.startingMana = null; // (Integer, optional) starting amount of mana, +1 for player 2
    this.prototype.startingManaPlayer = null; // (Integer, optional) starting amount of mana for player, +1 when player 2
    this.prototype.startingManaOpponent = null; // (Integer, optional) starting amount of mana for opponent, +1 when player 2
    this.prototype.unmulliganableHandIndices = null;
    this.prototype.userIsPlayer1 = true;
    this.prototype.usesResetTurn = true;
     // (boolean) If true, end turn functionality will be replaced with resetting OTK
  }

  /**
   * Challenge constructor.
   * @public
   */
  constructor(){
    this._eventBus = EventBus.create();
    this._instructions = [];
    this.hiddenUIElements = ["SignatureCard"];
    this._instructionsByTurnIndex = [];
    this._nextInstructionIndex = 0;
    this.unmulliganableHandIndices = [];
    this.requiredMulliganHandIndices = [];
    this.prerequisiteChallengeTypes = [];
    this.otkChallengeFailureCount = 0;
  }

  /**
   * SDK event handler. Do not call this method manually.
   */
  onEvent(event) {
    if (event.type === EVENTS.validate_game_over) {
      this._onValidateGameOver(event);
    } else if (event.type === EVENTS.start_turn) {
      this._onStartTurn(event);
    }

    if (this._currentInstruction != null) {
      return this._currentInstruction.onEvent(event);
    }
  }

  /**
   * Get the event bus for this challenge.
   * @public
   */
  getEventBus(){
    return this._eventBus;
  }

  getType() {
    return this.type;
  }

  getSkipMulligan() {
    return this.skipMulligan;
  }

  /**
   * Get an array of all the instructions for this challenge.
   * @public
   * @return  {Array}    Array of Instruction objects.
   */
  getInstructions(){
    return this._instructions;
  }

  /**
   * Get current instruction for this challenge.
   * @public
   * @return  {Instruction}    Current instruction.
   */
  getCurrentInstruction(){
    return this._currentInstruction;
  }

  /**
   * Get opponent agent for this challenge.
   * @public
   * @return  {BaseAgent}    Current instruction.
   */
  getOpponentAgent(){
    return this._opponentAgent;
  }

  /**
   * Returns deck data for my player.
   * @param {GameSession} gameSession
   * @returns {Array}
   */
  getMyPlayerDeckData(gameSession) {
    // override in subclass
    return [];
  }

  /**
   * Returns deck data for opponent player
   * @param {GameSession} gameSession
   * @returns {Array}
   */
  getOpponentPlayerDeckData(gameSession) {
    // override in subclass
    return [];
  }

  /**
   * Set up the GameSession for this challenge.
   * @public
   */
  setupSession(gameSession, player1Data, player2Data){
    // set game session challenge
    let player1DeckData, player1Id, player1Name, player1StartingHandSize, player1StartingMana, player2DeckData, player2Id, player2Name, player2StartingHandSize, player2StartingMana;
    gameSession.setChallenge(this);

    // set modes
    this.setupSessionModes(gameSession);

    // set battlemap template
    if (this.battleMapTemplateIndex != null) {
      gameSession.setBattleMapTemplate(new BattleMapTemplate(gameSession, this.battleMapTemplateIndex));
    }

    // get ids and names
    if (this.userIsPlayer1) {
      player1Name = i18next.t("battle.your_name_default_label");
      player2Name = i18next.t("battle.opponent_name_default_label");
      player1Id = gameSession.getUserId();
      player2Id = "CPU";
      player1StartingMana = (this.startingManaPlayer != null) ? this.startingManaPlayer : (this.startingMana != null) ? this.startingMana : null;
      player2StartingMana = (this.startingManaOpponent != null) ? this.startingManaOpponent : (this.startingMana != null) ? (this.startingMana + 1) : null;
      player1StartingHandSize = (this.startingHandSizePlayer != null) ? this.startingHandSizePlayer : this.startingHandSize;
      player2StartingHandSize = (this.startingHandSizeOpponent != null) ? this.startingHandSizeOpponent : this.startingHandSize;
      player1DeckData = this.getMyPlayerDeckData(gameSession);
      player2DeckData = this.getOpponentPlayerDeckData(gameSession);
    } else {
      player1Name = i18next.t("battle.opponent_name_default_label");
      player2Name = i18next.t("battle.your_name_default_label");
      player1Id = "CPU";
      player2Id = gameSession.getUserId();
      player1StartingMana = (this.startingManaOpponent != null) ? this.startingManaOpponent : (this.startingMana != null) ? this.startingMana : null;
      player2StartingMana = (this.startingManaPlayer != null) ? this.startingManaPlayer : (this.startingMana != null) ? (this.startingMana + 1) : null;
      player1StartingHandSize = (this.startingHandSizeOpponent != null) ? this.startingHandSizeOpponent : this.startingHandSize;
      player2StartingHandSize = (this.startingHandSizePlayer != null) ? this.startingHandSizePlayer : this.startingHandSize;
      player1DeckData = this.getOpponentPlayerDeckData(gameSession);
      player2DeckData = this.getMyPlayerDeckData(gameSession);
    }

    // ensure basic player data
    player1Data = UtilsJavascript.fastExtend({
      userId: player1Id,
      name: player1Name,
      deck: player1DeckData,
      startingHandSize: player1StartingHandSize,
      startingMana: player1StartingMana
    }, player1Data);
    player2Data = UtilsJavascript.fastExtend({
      userId: player2Id,
      name: player2Name,
      deck: player2DeckData,
      startingHandSize: player2StartingHandSize,
      startingMana: player2StartingMana
    }, player2Data);

    // setup session
    GameSetup.setupNewSession(gameSession, player1Data, player2Data, this.customBoard);

    // skip mulligan as needed
    if (this.skipMulligan) {
      gameSession.setStatus(GameStatus.active);
      for (var player of Array.from(gameSession.players)) {
        player.setHasStartingHand(true);
      }
    }

    // setup board
    this.setupBoard(gameSession);

    // setup agent
    this.setupOpponentAgent(gameSession);

    // force game session to sync state
    // in case any challenges set custom board state or stats
    gameSession.syncState();

    // snapshot complete session
    this._snapShotChallengeIfNeeded();

    return gameSession;
  }

  /**
   * Sets up the game session modes before creating any game elements.
   * @param {GameSession} gameSession
   */
  setupSessionModes(gameSession) {
    gameSession.setGameType(GameType.Challenge);
    return gameSession.setIsRunningAsAuthoritative(true);
  }

  /**
   * Sets up the board state.
   * @param {GameSession} gameSession
   */
  setupBoard(gameSession) {}
    // override in subclass

  /**
   * Creates the opponent agent.
   * @param {GameSession} gameSession
   */
  setupOpponentAgent(gameSession) {
    // get agent player id
    let cpuGeneral, cpuPlayer, cpuPlayerId;
    if (this.userIsPlayer1) {
      cpuPlayer = gameSession.getPlayer2();
      cpuPlayerId = cpuPlayer.getPlayerId();
      cpuGeneral = gameSession.getGeneralForPlayer2();
    } else {
      cpuPlayer = gameSession.getPlayer1();
      cpuPlayerId = cpuPlayer.getPlayerId();
      cpuGeneral = gameSession.getGeneralForPlayer1();
    }

    // create agent
    this._opponentAgent = new StaticAgent(cpuPlayerId);

    // skip agent mulligan
    cpuPlayer.setHasStartingHand(true);

    // tag general
    return this._opponentAgent.addUnitWithTag(cpuGeneral, "general");
  }

  /**
   * Pushes an instruction onto the queue for a turn
   * @param  {Object}  event  event data with format {step:...}
   * @private
   */
  addInstructionToQueueForTurnIndex(turnIndex, instruction) {
    if (!this._instructionsByTurnIndex[turnIndex]) {
      this._instructionsByTurnIndex[turnIndex] = [];
    }

    return this._instructionsByTurnIndex[turnIndex].push(instruction);
  }


  //#*
  //Activates the next instruction if it's the players turn
  // TODO: Can check here for if the last instruction was completed to allow for instructions that span multiple steps
  //@private
  //#
  activateNextInstruction(){
    if (this._currentInstruction) {
      this._currentInstruction = null;
    }

    if (!GameSession.current().isMyTurn()) {
      return;
    }

    // Get the player turn index
    const currentTurnIndex = GameSession.current().getNumberOfTurns(); // current turn count calculation is ugly
    const playersTurnIndex = Math.floor(currentTurnIndex / 2); // represents the index of turn for this player

    // check for a new turn
    if ((this._currentPlayerTurn == null) || (this._currentPlayerTurn !== playersTurnIndex)) {
      this._currentPlayerTurn = playersTurnIndex;
      this._nextInstructionIndex = 0;
    }

    const nextInstruction = this._instructionsByTurnIndex[playersTurnIndex] != null ? this._instructionsByTurnIndex[playersTurnIndex][this._nextInstructionIndex] : undefined;

    if (nextInstruction) {
      this._currentInstruction = nextInstruction;
      this._eventBus.trigger(EVENTS.instruction_triggered, {type: EVENTS.instruction_triggered, instruction:nextInstruction});
      return this._nextInstructionIndex++;
    }
  }

  hasInstructionForGameTurn(gameTurnIndex) {
    const playersTurnIndex = Math.floor(gameTurnIndex / 2); // represents the index of turn for this player
    return (this._instructionsByTurnIndex[playersTurnIndex] != null);
  }

  _onStartTurn(e) {
    return this._snapShotChallengeIfNeeded();
  }

  _snapShotChallengeIfNeeded() {
    if ((this.snapShotOnPlayerTurn != null) && (GameSession.current().getCurrentPlayerId() === GameSession.current().getMyPlayerId())) {
      // Get the player turn index
      const currentTurnIndex = GameSession.current().getNumberOfTurns(); // current turn count calculation is ugly
      const playersTurnIndex = Math.floor(currentTurnIndex / 2); // represents the index of turn for this player

      if ((playersTurnIndex === this.snapShotOnPlayerTurn) && !this._snapShotData) {
        const gameSession = GameSession.current();
        this._snapShotData = gameSession.serializeToJSON(gameSession);
        return this._eventBus.trigger(EVENTS.challenge_start, {type: EVENTS.challenge_start});
      }
    }
  }

  _onValidateGameOver(){
    const gameSession = GameSession.current();
    const myGeneral = gameSession.getGeneralForPlayerId(gameSession.getMyPlayerId());

    if ((this.snapShotOnPlayerTurn != null) && myGeneral.getIsRemoved()) {
      // set general as not removed so that game does not end
      myGeneral.setIsRemoved(false);

      // trigger challenge loss
      return this.onChallengeLost();
    }
  }

  onChallengeLost() {
    // record loss
    this.otkChallengeFailureCount++;
    this.isChallengeLost = true;

    // trigger challenge lost event
    return this._eventBus.trigger(EVENTS.challenge_lost, {type: EVENTS.challenge_lost, needsRollback:true});
  }

  challengeReset() {
    // trigger challenge loss
    this.onChallengeLost();

    // trigger challenge reset event
    return this._eventBus.trigger(EVENTS.challenge_reset, {type: EVENTS.challenge_reset});
  }

  challengeRollback() {
    const gameSession = GameSession.current();
    gameSession._rollbackToSnapshot(this._snapShotData);
    // Reset opponent agents action sequence
    this._opponentAgent.currentTurnIndex = undefined;
    this._opponentAgent.currentActionIndexInTurn = 0;
    return this.isChallengeLost = false;
  }

  applyCardToBoard(cardOrCardData, boardX, boardY, ownerId) {
    const gameSession = GameSession.getInstance();

    // create card as needed
    if (!(cardOrCardData instanceof Card)) {
      cardOrCardData = gameSession.getExistingCardFromIndexOrCreateCardFromData(cardOrCardData);
    }

    // apply card
    if (cardOrCardData != null) {
      if (ownerId != null) { cardOrCardData.setOwnerId(ownerId); }

      gameSession.applyCardToBoard(cardOrCardData, boardX, boardY);

      if (cardOrCardData.refreshExhaustion) {
        cardOrCardData.refreshExhaustion();
      }

      return cardOrCardData;
    }
  }
}
Challenge.initClass();


module.exports = Challenge;
