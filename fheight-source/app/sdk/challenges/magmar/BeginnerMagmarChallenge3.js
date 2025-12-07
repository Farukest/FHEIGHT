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


// http://forums.fheight.com/t/crushing-reach-basic-otk/11712

class BeginnerMagmarChallenge3 extends Challenge {
  static initClass() {
  
    this.type = "BeginnerMagmarChallenge3";
    this.prototype.type = "BeginnerMagmarChallenge3";
    this.prototype.categoryType = ChallengeCategory.keywords.type;
  
    this.prototype.name = i18next.t("challenges.beginner_magmar_3_title");
    this.prototype.description =i18next.t("challenges.beginner_magmar_3_description");
    this.prototype.iconUrl = RSX.speech_portrait_magmar.img;
  
    this.prototype._musicOverride = RSX.music_gauntlet.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.beginner_magmar_3_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.beginner_magmar_3_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 0;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = 8;
    this.prototype.startingHandSizePlayer = 6;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction5.General},
      {id: Cards.Spell.BoundedLifeforce},
      {id: Cards.Spell.GreaterFortitude}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction6.General},
      {id: Cards.TutorialSpell.TutorialFrozenFinisher}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 2, y:2});
    general1.maxHP = 25;
    general1.setDamage(25-10);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 5, y: 2});
    general2.maxHP = 25;
    general2.setDamage(25-8);

    this.applyCardToBoard({id: Cards.Neutral.FireSpitter},0,4,myPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.ValeHunter},0,0,myPlayerId);

    this.applyCardToBoard({id: Cards.Faction6.BlazingSpines},3,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.CrystalCloaker},3,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BlazingSpines},3,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BlazingSpines},4,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BoreanBear},4,2,opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Faction6.BlazingSpines},4,0,opponentPlayerId);
  }
    //@applyCardToBoard({id: Cards.Neutral.WindStopper},6,2,opponentPlayerId)

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.beginner_magmar_3_taunt"),
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
BeginnerMagmarChallenge3.initClass();


module.exports = BeginnerMagmarChallenge3;
