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


// http://forums.fheight.com/t/abyss-super-creep-medium/8970

class MediumAbyssianChallenge1 extends Challenge {
  static initClass() {
  
    this.type = "MediumAbyssianChallenge1";
    this.prototype.type = "MediumAbyssianChallenge1";
    this.prototype.categoryType = ChallengeCategory.vault1.type;
  
    this.prototype.name =i18next.t("challenges.medium_abyss_1_title");
    this.prototype.description =i18next.t("challenges.medium_abyss_1_description");
    this.prototype.iconUrl = RSX.speech_portrait_abyssian.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_abyssian.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.medium_abyss_1_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.medium_abyss_1_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 0;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 6;
    this.prototype.usesResetTurn = false;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction4.General},
      {id: Cards.Spell.DarkSacrifice},
      {id: Cards.Spell.SoulshatterPact},
      {id: Cards.Spell.VoidPulse},
      {id: Cards.Faction4.DarkSiren},
      {id: Cards.Spell.ShadowNova},
      {id: Cards.Neutral.Manaforger}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction1.General},
      {id: Cards.TutorialSpell.TutorialFireOrb}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 2, y: 2});
    general1.maxHP = 4;
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 7, y: 2});
    general2.maxHP = 20;

    this.applyCardToBoard({id: Cards.Faction4.SharianShadowdancer}, 1, 2, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.AbyssalCrawler}, 3, 3, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.AbyssalCrawler}, 3, 1, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.AbyssalJuggernaut}, 4, 4, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.AbyssalJuggernaut}, 4, 0, myPlayerId);
    this.applyCardToBoard({id: Cards.Artifact.SpectralBlade}, 2, 2, myPlayerId);

    this.applyCardToBoard({id: Cards.Faction1.WindbladeAdept},6,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Spell.WarSurge},4,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction1.AzuriteLion},5,0,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction1.LysianBrawler},5,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction1.SunstoneTemplar},5,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Spell.WarSurge},4,2,opponentPlayerId);
    return this.applyCardToBoard({id: Cards.Faction1.SilverguardKnight},6,3,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.medium_abyss_1_taunt"),
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
MediumAbyssianChallenge1.initClass();


module.exports = MediumAbyssianChallenge1;
