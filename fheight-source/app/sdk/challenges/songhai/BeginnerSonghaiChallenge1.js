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


// http://forums.fheight.com/t/songhype-challenge/8451

class BeginnerSonghaiChallenge1 extends Challenge {
  static initClass() {
  
    this.type = "BeginnerSonghaiChallenge1";
    this.prototype.type = "BeginnerSonghaiChallenge1";
    this.prototype.categoryType = ChallengeCategory.advanced.type;
  
    this.prototype.name = i18next.t("challenges.beginner_songhai_1_title");
    this.prototype.description =i18next.t("challenges.beginner_songhai_1_description");
    this.prototype.iconUrl = RSX.speech_portrait_songhai.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_songhai.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.beginner_songhai_1_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.beginner_songhai_1_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 2;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = 5;
    this.prototype.startingHandSizePlayer = 6;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction2.General},
      {id: Cards.Spell.PhoenixFire},
      {id: Cards.Spell.InnerFocus},
      {id: Cards.Spell.MistDragonSeal},
      {id: Cards.Spell.ManaVortex},
      {id: Cards.Spell.SaberspineSeal}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction5.General},
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
    general1.setDamage(23);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 6, y: 2});
    general2.maxHP = 25;

    this.applyCardToBoard({id: Cards.Faction2.ChakriAvatar}, 3, 1, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction2.MageOfFourWinds}, 3, 3, myPlayerId);

    this.applyCardToBoard({id: Cards.Faction5.Phalanxar},5,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction5.UnstableLeviathan},5,2,opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Faction5.VeteranSilithar},5,1,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.beginner_songhai_1_taunt"),
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
BeginnerSonghaiChallenge1.initClass();


module.exports = BeginnerSonghaiChallenge1;
