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


// http://forums.fheight.com/t/magmar-rampage/8452

class MediumMagmarChallenge1 extends Challenge {
  static initClass() {
  
    this.type = "MediumMagmarChallenge1";
    this.prototype.type = "MediumMagmarChallenge1";
    this.prototype.categoryType = ChallengeCategory.vault1.type;
  
    this.prototype.name = i18next.t("challenges.medium_magmar_1_title");
    this.prototype.description =i18next.t("challenges.medium_magmar_1_description");
    this.prototype.iconUrl = RSX.speech_portrait_magmar.img;
  
    this.prototype._musicOverride = RSX.music_training.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.medium_magmar_1_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.medium_magmar_1_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 6;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 6;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction5.General},
      {id: Cards.Spell.FlashReincarnation},
      {id: Cards.Spell.Amplification},
      {id: Cards.Spell.FractalReplication},
      {id: Cards.Faction5.Elucidator},
      {id: Cards.Spell.DiretideFrenzy}
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
    general1.maxHP = 10;
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 6, y: 2});
    general2.maxHP = 9;

    this.applyCardToBoard({id: Cards.Faction5.Kujata},1,2,myPlayerId);

    this.applyCardToBoard({id: Cards.Faction6.ArcticRhyno},3,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.ArcticRhyno},3,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.FenrirWarmaster},4,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.FenrirWarmaster},4,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.ArcticDisplacer},5,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.PrismaticGiant},5,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.ArcticDisplacer},5,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BlazingSpines},5,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BlazingSpines},5,0,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BlazingSpines},6,3,opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Faction6.BlazingSpines},6,1,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.medium_magmar_1_taunt"),
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
MediumMagmarChallenge1.initClass();


module.exports = MediumMagmarChallenge1;
