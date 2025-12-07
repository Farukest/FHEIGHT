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


// http://forums.fheight.com/t/stronger-scythe-otk-1/11401

class AdvancedSonghaiChallenge1 extends Challenge {
  static initClass() {
  
    this.type = "AdvancedSonghaiChallenge1";
    this.prototype.type = "AdvancedSonghaiChallenge1";
    this.prototype.categoryType = ChallengeCategory.contest1.type;
  
    this.prototype.name = i18next.t("challenges.advanced_songhai_1_title");
    this.prototype.description =i18next.t("challenges.advanced_songhai_1_description");
    this.prototype.iconUrl = RSX.speech_portrait_songhai.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_songhai.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.advanced_songhai_1_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.advanced_songhai_1_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 2;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = 6;
    this.prototype.startingHandSizePlayer = 6;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction2.General},
      {id: Cards.Spell.Juxtaposition},
      {id: Cards.Spell.InnerFocus},
      {id: Cards.Spell.MistDragonSeal},
      {id: Cards.Artifact.MaskOfBloodLeech},
      {id: Cards.Spell.Juxtaposition},
      {id: Cards.Neutral.PhaseHound}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction3.General},
      {id: Cards.TutorialSpell.TutorialFrozenFinisher}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 5, y:3});
    general1.maxHP = 25;
    general1.setDamage(25-7);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 8, y: 0});
    general2.maxHP = 25;
    general2.setDamage(25-15);

    this.applyCardToBoard({id: Cards.Neutral.SyvrelTheExile},4,2,myPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.DragoneboneGolem},6,2,myPlayerId);

    const dioltas = this.applyCardToBoard({id: Cards.Neutral.Dilotas},7,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.WhistlingBlade},7,0,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.WhistlingBlade},8,1,opponentPlayerId);

    this.applyCardToBoard({id: Cards.Spell.DrainMorale},4,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Spell.CosmicFlesh},7,1,opponentPlayerId);
    return dioltas.setDamage(dioltas.getMaxHP()-1);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.advanced_songhai_1_taunt"),
      isSpeech:true,
      isPersistent: true,
      yPosition:.7,
      isOpponent: true
    }
    ]));
    return this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionPlayCardFindPosition(0,() => {
      return [GameSession.getInstance().getGeneralForPlayer1().getPosition()];
    }));
  }
}
AdvancedSonghaiChallenge1.initClass();


module.exports = AdvancedSonghaiChallenge1;
