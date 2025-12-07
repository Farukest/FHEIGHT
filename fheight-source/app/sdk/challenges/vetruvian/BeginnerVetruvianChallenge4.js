/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Challenge = require("app/sdk/challenges/challenge");
const Instruction   = require('app/sdk/challenges/instruction');
const MoveAction     = require('app/sdk/actions/moveAction');
const AttackAction   = require('app/sdk/actions/attackAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const EndTurnAction   = require('app/sdk/actions/endTurnAction');
const Cards       = require('app/sdk/cards/cardsLookupComplete');
const Deck       = require('app/sdk/cards/deck');
const GameSession       = require('app/sdk/gameSession');
const AgentActions = require('app/sdk/agents/agentActions');
const CONFIG = require('app/common/config');
const RSX = require('app/data/resources');
const ChallengeCategory = require('app/sdk/challenges/challengeCategory');
const ModifierOpeningGambitBuffSelfByShadowTileCount = require('app/sdk/modifiers/modifierOpeningGambitBuffSelfByShadowTileCount');
const i18next = require('i18next');

// http://forums.fheight.com/t/bad-to-the-bone-gate-2-slot-4/14483

class BeginnerVetruvianChallenge4 extends Challenge {
  static initClass() {
  
    this.type = "BeginnerVetruvianChallenge4";
    this.prototype.type = "BeginnerVetruvianChallenge4";
    this.prototype.categoryType = ChallengeCategory.beginner.type;
  
  
    this.prototype.name = i18next.t("challenges.beginner_vetruvian_4_title");
    this.prototype.description =i18next.t("challenges.beginner_vetruvian_4_description");
    this.prototype.iconUrl = RSX.speech_portrait_vetruvian.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_vetruv.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.beginner_vetruvian_4_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.beginner_vetruvian_4_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 0;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = 9;
    this.prototype.startingHandSizePlayer = 4;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction3.General},
      {id: Cards.Spell.BoneSwarm},
      {id: Cards.Spell.AstralPhasing},
      {id: Cards.Neutral.FrostboneNaga}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction5.General},
      {id: Cards.TutorialSpell.TutorialFireOrb}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 4, y: 2});
    general1.maxHP = 25;
    general1.setDamage(25-6);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 8, y: 2});
    general2.maxHP = 25;
    general2.setDamage(25-8);

    this.applyCardToBoard({id: Cards.Neutral.BluetipScorpion},1,2,myPlayerId);
    this.applyCardToBoard({id: Cards.Faction3.OrbWeaver},5,3,myPlayerId);
    this.applyCardToBoard({id: Cards.Faction3.OrbWeaver},5,1,myPlayerId);

    this.applyCardToBoard({id: Cards.Neutral.PrimusShieldmaster},6,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.RockPulverizer},7,3,opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Neutral.RockPulverizer},7,1,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.beginner_vetruvian_4_taunt"),
      isSpeech:true,
      isPersistent:true,
      yPosition:.6,
      isOpponent: true
    }
    ]));
    return this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionPlayCardFindPosition(0,() => {
      return [GameSession.getInstance().getGeneralForPlayer1().getPosition()];
    }));
  }
}
BeginnerVetruvianChallenge4.initClass();


module.exports = BeginnerVetruvianChallenge4;
