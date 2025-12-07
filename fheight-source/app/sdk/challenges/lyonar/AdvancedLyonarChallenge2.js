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
const UtilsGameSession = require('app/common/utils/utils_game_session');
const _ = require('underscore');
const i18next = require('i18next');


// http://forums.fheight.com/t/inspiring-presence-gate-7-slot-5/12982

class AdvancedLyonarChallenge2 extends Challenge {
  static initClass() {
  
    this.type = "AdvancedLyonarChallenge2";
    this.prototype.type = "AdvancedLyonarChallenge2";
    this.prototype.categoryType = ChallengeCategory.expert.type;
  
    this.prototype.name = i18next.t("challenges.advanced_lyonar_2_title");
    this.prototype.description =i18next.t("challenges.advanced_lyonar_2_description");
    this.prototype.iconUrl = RSX.speech_portrait_lyonar_side.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_songhai.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.advanced_lyonar_2_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.advanced_lyonar_2_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 1;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 3;
  }

  constructor(){
    super();
    this.hiddenUIElements = _.without(this.hiddenUIElements, "SignatureCard");
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction1.General},
      {id: Cards.Neutral.SilhoutteTracer},
      {id: Cards.Artifact.SunstoneBracers},
      {id: Cards.Spell.Magnetize},
      {id: Cards.Artifact.IndomitableWill},
      {id: Cards.Spell.LionheartBlessing}
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
    general1.setPosition({x: 0, y:2});
    general1.maxHP = 25;
    general1.setDamage(25-12);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 7, y: 2});
    general2.maxHP = 25;
    general2.setDamage(25-25);

    // set signature card to be always ready for this session
    gameSession.getPlayer1().setIsSignatureCardActive(true);

    this.applyCardToBoard({id: Cards.Faction1.LysianBrawler},1,3,myPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.Manaforger},4,2,myPlayerId);
    this.applyCardToBoard({id: Cards.Faction1.WindbladeAdept},3,1,myPlayerId);
    this.applyCardToBoard({id: Cards.Faction1.WindbladeCommander},6,3,myPlayerId);
    this.applyCardToBoard({id: Cards.Faction1.IroncliffeGuardian},3,2,myPlayerId);
    this.applyCardToBoard({id: Cards.Faction1.WindbladeCommander},6,1,myPlayerId);

    this.applyCardToBoard({id: Cards.Neutral.HailstoneHowler},2,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.WhistlingBlade},3,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.HailstoneHowler},4,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction2.CelestialPhantom},7,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction2.CelestialPhantom},7,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction2.Widowmaker},8,4,opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Faction2.Widowmaker},8,0,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.advanced_lyonar_2_taunt"),
      isSpeech:true,
      yPosition:.7,
      isPersistent: true,
      isOpponent: true
    }
    ]));
    return this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionPlayCardFindPosition(0,() => {
      return [GameSession.getInstance().getGeneralForPlayer1().getPosition()];
    }));
  }
}
AdvancedLyonarChallenge2.initClass();


module.exports = AdvancedLyonarChallenge2;
