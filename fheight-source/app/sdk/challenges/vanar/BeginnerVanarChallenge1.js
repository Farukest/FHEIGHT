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

// http://forums.fheight.com/t/starter-challenge-vanar/7519

class BeginnerVanarChallenge1 extends Challenge {
  static initClass() {
  
    this.type = "BeginnerVanarChallenge1";
    this.prototype.type = "BeginnerVanarChallenge1";
    this.prototype.categoryType = ChallengeCategory.vault1.type;
  
    this.prototype.name = i18next.t("challenges.beginner_vanar_1_title");
    this.prototype.description =i18next.t("challenges.beginner_vanar_1_description");
    this.prototype.iconUrl = RSX.speech_portrait_vanar.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_vanar.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.beginner_vanar_1_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.beginner_vanar_1_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 3;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 4;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction6.General},
      {id: Cards.Faction6.BoreanBear},
      {id: Cards.Spell.RitualOfTheWind},
      {id: Cards.Spell.Cryogenesis},
      {id: Cards.Spell.IceCage},
      {id: Cards.Spell.AspectOfTheWolf}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction3.General},
      {id: Cards.TutorialSpell.TutorialFireOrb}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 3, y: 3});
    general1.maxHP = 10;
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 6, y: 2});
    general2.maxHP = 8;

    this.applyCardToBoard({id: Cards.Faction6.SnowElemental}, 2, 4, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BonechillBarrier}, 3, 4, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.CrystalCloaker}, 3, 2, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BonechillBarrier}, 4, 4, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BonechillBarrier}, 4, 3, myPlayerId);

    this.applyCardToBoard({id: Cards.Faction3.StarfireScarab},4,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction3.Dervish},5,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction3.PortalGuardian},5,2,opponentPlayerId);
    const dunecasterUnit = this.applyCardToBoard({id: Cards.Faction3.Dunecaster},6,3,opponentPlayerId);
    return this.applyCardToBoard(dunecasterUnit.getCurrentFollowupCard(),5,3,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.beginner_vanar_1_taunt"),
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
BeginnerVanarChallenge1.initClass();


module.exports = BeginnerVanarChallenge1;
