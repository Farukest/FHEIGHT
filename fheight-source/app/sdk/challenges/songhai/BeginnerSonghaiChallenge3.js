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


// http://forums.fheight.com/t/songhai-controlled-chaos/10473

class BeginnerSonghaiChallenge3 extends Challenge {
  static initClass() {
  
    this.type = "BeginnerSonghaiChallenge3";
    this.prototype.type = "BeginnerSonghaiChallenge3";
    this.prototype.categoryType = ChallengeCategory.vault2.type;
  
    this.prototype.name = i18next.t("challenges.beginner_songhai_3_title");
    this.prototype.description =i18next.t("challenges.beginner_songhai_3_description");
    this.prototype.iconUrl = RSX.speech_portrait_songhai.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_songhai.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.beginner_songhai_3_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.beginner_songhai_3_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 2;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 6;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction2.General},
      {id: Cards.Spell.DeathstrikeSeal},
      {id: Cards.Spell.SpiralTechnique},
      {id: Cards.Spell.TwinStrike}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction4.General},
      {id: Cards.TutorialSpell.TutorialFrozenFinisher}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 3, y: 4});
    general1.maxHP = 25;
    general1.setDamage(20);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 7, y: 2});
    general2.maxHP = 25;
    general2.setDamage(25-13);

    this.applyCardToBoard({id: Cards.Faction2.Heartseeker},1,2,myPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.Manaforger},2,2,myPlayerId);
    this.applyCardToBoard({id: Cards.Faction2.ChakriAvatar},3,0,myPlayerId);
    this.applyCardToBoard({id: Cards.Faction2.JadeOgre},4,2,myPlayerId);

    this.applyCardToBoard({id: Cards.Neutral.ChaosElemental},5,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.ChaosElemental},5,0,opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Neutral.WhistlingBlade},6,2,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.beginner_songhai_3_taunt"),
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
BeginnerSonghaiChallenge3.initClass();


module.exports = BeginnerSonghaiChallenge3;
