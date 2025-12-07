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
const i18next = require('i18next');

// http://forums.fheight.com/t/winds-of-change-gate-5-slot-4/12215

class MediumVetruvianChallenge2 extends Challenge {
  static initClass() {
  
    this.type = "MediumVetruvianChallenge2";
    this.prototype.type = "MediumVetruvianChallenge2";
    this.prototype.categoryType = ChallengeCategory.advanced.type;
  
  
    this.prototype.name = i18next.t("challenges.medium_vetruvian_2_title");
    this.prototype.description =i18next.t("challenges.medium_vetruvian_2_description");
    this.prototype.iconUrl = RSX.speech_portrait_vetruvian.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_vetruv.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.medium_vetruvian_2_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.medium_vetruvian_2_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 6;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = 9;
    this.prototype.startingHandSizePlayer = 4;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction3.General},
      {id: Cards.Spell.RashasCurse},
      {id: Cards.Faction3.BrazierGoldenFlame},
      {id: Cards.Neutral.PrimusFist},
      {id: Cards.Faction3.Dunecaster}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction2.General},
      {id: Cards.TutorialSpell.TutorialFireOrb}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 1, y: 2});
    general1.maxHP = 25;
    general1.setDamage(25-8);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 5, y: 2});
    general2.maxHP = 25;
    general2.setDamage(25-14);

    this.applyCardToBoard({id: Cards.Faction3.SandHowler}, 2, 2, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction3.OrbWeaver}, 3, 3, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction3.OrbWeaver}, 3, 1, myPlayerId);

    this.applyCardToBoard({id: Cards.Neutral.HailstoneHowler},3,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction2.KaidoAssassin},4,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction2.MageOfFourWinds},4,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.FlameWing},5,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.FlameWing},5,0,opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Neutral.HailstoneHowler},6,2,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.medium_vetruvian_2_taunt"),
      isSpeech:true,
      isPersistent:true,
      yPosition:.7,
      isOpponent: true
    }
    ]));
    return this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionPlayCardFindPosition(0,() => {
      return [GameSession.getInstance().getGeneralForPlayer1().getPosition()];
    }));
  }
}
MediumVetruvianChallenge2.initClass();


module.exports = MediumVetruvianChallenge2;
