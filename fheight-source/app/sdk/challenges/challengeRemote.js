/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Challenge     = require("app/sdk/challenges/challenge");
const GameSession   = require('app/sdk/gameSession');
const FactionFactory   = require('app/sdk/cards/factionFactory');
const AgentActions   = require('app/sdk/agents/agentActions');
const RSX       = require('app/data/resources');
const BattleMapTemplate = require('app/sdk/battleMapTemplate');
const fetch = require('isomorphic-fetch');
const Promise = require('bluebird');
const i18next = require('i18next');

class ChallengeRemote extends Challenge {
  static initClass() {
  
    this.type = "rando-1";
    this.prototype.type = "rando-1";
    this.prototype.categoryType = null;
    this.prototype.isDaily = true;
  
    this.prototype.name ="<name>";
    this.prototype.description ="<description>";
    this.prototype.iconUrl = RSX.speech_portrait_vanar.img;
    this.prototype._musicOverride = RSX.music_battlemap_vanar.audio;
  
    this.prototype.otkChallengeStartMessage = "<instructions>";
    this.prototype.otkChallengeFailureMessages = [
      "Hint:..."
    ];
  
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype._gameSessionData = null;
  }

  static loadAndCreateFromModelData(modelAttributes){
    return Promise.resolve(fetch(modelAttributes.url))
    .bind(this)
    .timeout(10000)
    .catch(this._networkError)
    .then(function(res){
      if (res.ok) {
        return res.json();
      } else {
        const err = new Error(res.statusText);
        err.status = res.status;
        throw err;
      }}).then(data => {
      return this.createFromGameSessionData(modelAttributes,data);
    });
  }

  static createFromGameSessionData(modelAttributes,data){
    const challenge = new ChallengeRemote(data);
    challenge.type = modelAttributes.challenge_id;
//    challenge.name = modelAttributes.title
//    challenge.description = modelAttributes.description
    challenge.name = i18next.t("challenges.daily_challenge_label");
    let opponentFactionName = "enemy";
    if (__guard__(__guard__(__guard__(data != null ? data.gameSetupData : undefined, x2 => x2.players), x1 => x1[1]), x => x.factionId) != null) {
      const opponentFullFactionName = FactionFactory.factionForIdentifier(data.gameSetupData.players[1].factionId).name;
      opponentFactionName = opponentFullFactionName.split(" ")[0];
    }
    challenge.goldReward = modelAttributes.gold;
    //challenge.description = "Defeat the #{opponentFactionName} General in ONE turn."
    challenge.description = i18next.t("challenges.daily_challenge_desc",{faction:this.opponentFactionName});
    challenge.otkChallengeStartMessage = modelAttributes.instructions;
//    challenge.otkChallengeFailureMessages = [modelAttributes.hint]
    challenge.otkChallengeFailureMessages = [];

    // This is only present when a challenge is loaded from QA tool by date, NOT INTENDED FOR OTHER USE
    challenge.dateKey = modelAttributes.dateKey;

    // Set up iconUrl
    if (__guard__(__guard__(__guard__(data != null ? data.gameSetupData : undefined, x5 => x5.players), x4 => x4[0]), x3 => x3.generalId) != null) {
      const {
        generalId
      } = data.gameSetupData.players[0];
      const generalSdkCard = GameSession.getCardCaches().getCardById(generalId);
      const generalSpeechResource = generalSdkCard.getSpeechResource();
      if (generalSpeechResource != null) {
        challenge.iconUrl = generalSpeechResource.img;
      }
    }

    return Promise.resolve(challenge);
  }

  constructor(data){
    super();

    this.hiddenUIElements = _.without(this.hiddenUIElements, "SignatureCard");

    this._gameSessionData = data;
  }

  /**
   * Set up the GameSession for this challenge.
   * @public
   */
  setupSession(gameSession, player1Data, player2Data){

    // overwrite players names
    this._gameSessionData.players[0].username = i18next.t("challenges.challenge_p1_label");
    this._gameSessionData.players[1].username = i18next.t("challenges.challenge_p2_label");


    gameSession.deserializeSessionFromFirebase(this._gameSessionData);

    gameSession.setUserId(gameSession.getPlayer1Id());

    // set game session challenge
    gameSession.setChallenge(this);

    // set modes
    this.setupSessionModes(gameSession);

    // Disable ability to replace
    const player1 = gameSession != null ? gameSession.getPlayer1() : undefined;
    const deck = player1 != null ? player1.getDeck() : undefined;
    if (deck != null) {
      deck.setNumCardsReplacedThisTurn(1);
    }

    // set battlemap template
    if (this.battleMapTemplateIndex != null) {
      gameSession.setBattleMapTemplate(new BattleMapTemplate(gameSession, this.battleMapTemplateIndex));
    }

    // setup agent
    this.setupOpponentAgent(gameSession);

    // force game session to sync state
    // in case any challenges set custom board state or stats
    gameSession.syncState();

    const currentTurnIndex = GameSession.current().getNumberOfTurns(); // current turn count calculation is ugly
    const playersTurnIndex = Math.floor(currentTurnIndex / 2); // represents the index of turn for this player

    this.snapShotOnPlayerTurn = playersTurnIndex;

    // snapshot complete session
    this._snapShotChallengeIfNeeded();

    return gameSession;
  }

  /**
   * Set up the Oppponent Agent action for this challenge.
   * @public
   */
  setupOpponentAgent(gameSession) {

    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:"Say your prayers.",
      isSpeech:true,
      yPosition:.7,
      isPersistent: true,
      isOpponent: true
    }
    ]));

    return this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionPlayCardFindPosition(0,() => {
      return [gameSession.getGeneralForPlayer1().getPosition()];
    }));
  }
}
ChallengeRemote.initClass();


module.exports = ChallengeRemote;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}