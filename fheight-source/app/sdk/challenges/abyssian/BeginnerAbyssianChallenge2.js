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
const _ = require('underscore');
const i18next = require('i18next');


// http://forums.fheight.com/t/abyssian-dance-of-shadows/8288

class BeginnerAbyssianChallenge2 extends Challenge {
  static initClass() {
  
    this.type = "BeginnerAbyssianChallenge2";
    this.prototype.type = "BeginnerAbyssianChallenge2";
    this.prototype.categoryType = ChallengeCategory.expert.type;
  
    this.prototype.name =i18next.t("challenges.beginner_abyss_2_title");
    this.prototype.description =i18next.t("challenges.beginner_abyss_2_description");
    this.prototype.iconUrl = RSX.speech_portrait_abyssian.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_abyssian.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.beginner_abyss_2_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.beginner_abyss_2_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 5;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 6;
  }

  constructor(){
    super();
    this.hiddenUIElements = _.without(this.hiddenUIElements, "SignatureCard");
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction4.General},
      {id: Cards.Neutral.SaberspineTiger},
      {id: Cards.Faction4.DeepfireDevourer}
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
    general1.setPosition({x: 2, y: 2});
    general1.maxHP = 25;
    general1.setDamage(25-4);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 7, y: 2});
    general2.maxHP = 25;
    general2.setDamage(25-16);

    // set signature card to be always ready for this session
    gameSession.getPlayer1().setIsSignatureCardActive(true);

    this.applyCardToBoard({id: Cards.Faction4.SharianShadowdancer}, 1, 2, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.BloodmoonPriestess}, 2, 0, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.BloodmoonPriestess}, 2, 4, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.GloomChaser}, 3, 2, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling}, 1, 0, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling}, 3, 0, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling}, 1, 4, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling}, 3, 4, myPlayerId);

    this.applyCardToBoard({id: Cards.Faction2.LanternFox},5,3,opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Faction2.LanternFox},5,1,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.beginner_abyss_2_taunt"),
      isSpeech:true,
      yPosition:.6,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    return this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionPlayCardFindPosition(0,() => {
      return [GameSession.getInstance().getGeneralForPlayer1().getPosition()];
    }));
  }
}
BeginnerAbyssianChallenge2.initClass();


module.exports = BeginnerAbyssianChallenge2;
