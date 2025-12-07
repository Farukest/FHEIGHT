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

class BeginnerVanarChallenge4 extends Challenge {
  static initClass() {
  
    this.type = "BeginnerVanarChallenge4";
    this.prototype.type = "BeginnerVanarChallenge4";
    this.prototype.categoryType = ChallengeCategory.beginner.type;
  
    this.prototype.name = i18next.t("challenges.beginner_vanar_4_title");
    this.prototype.description =i18next.t("challenges.beginner_vanar_4_description");
    this.prototype.iconUrl = RSX.speech_portrait_vanar.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_vanar.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.beginner_vanar_4_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.beginner_vanar_4_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 0;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = 7;
    this.prototype.startingHandSizePlayer = 4;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction6.General},
      {id: Cards.Faction6.WyrBeast},
      {id: Cards.Spell.BonechillBarrier},
      {id: Cards.Neutral.SaberspineTiger}
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
    general1.setPosition({x: 0, y: 0});
    general1.maxHP = 25;
    general1.setDamage(25-1);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 8, y: 4});
    general2.maxHP = 25;
    general2.setDamage(25-3);

    this.applyCardToBoard({id: Cards.Neutral.Maw}, 2, 2, opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.Maw}, 2, 0, opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.KomodoCharger}, 3, 3, opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.KomodoCharger}, 3, 1, opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction5.YoungSilithar}, 4, 3, opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction5.YoungSilithar}, 4, 1, opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction5.EarthWalker}, 5, 3, opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction5.EarthWalker}, 5, 1, opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction5.Grimrock}, 6, 4, opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Faction5.Grimrock}, 6, 2, opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.beginner_vanar_4_taunt"),
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
BeginnerVanarChallenge4.initClass();


module.exports = BeginnerVanarChallenge4;
