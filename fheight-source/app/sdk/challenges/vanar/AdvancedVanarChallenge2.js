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
const i18next = require('i18next');

// http://forums.fheight.com/t/starter-challenge-vanar/7519

class AdvancedVanarChallenge2 extends Challenge {
  static initClass() {
  
    this.type = "AdvancedVanarChallenge2";
    this.prototype.type = "AdvancedVanarChallenge2";
    this.prototype.categoryType = ChallengeCategory.vault2.type;
  
    this.prototype.name = i18next.t("challenges.advanced_vanar_2_title");
    this.prototype.description =i18next.t("challenges.advanced_vanar_2_description");
    this.prototype.iconUrl = RSX.speech_portrait_vanar.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_vanar.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.advanced_vanar_2_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.advanced_vanar_2_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 3;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 6;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction6.General},
      {id: Cards.Spell.RitualOfTheWind},
      {id: Cards.Neutral.PrimusFist},
      {id: Cards.Spell.RitualOfTheWind},
      {id: Cards.Neutral.FirstSwordofAkrane},
      {id: Cards.Spell.RitualOfTheWind},
      {id: Cards.Spell.AspectOfTheWolf}
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
    general1.setPosition({x: 4, y:0});
    general1.maxHP = 25;
    general1.setDamage(25-13);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 4, y: 2});
    general2.maxHP = 25;

    this.applyCardToBoard({id: Cards.Faction6.BonechillBarrier}, 3, 3, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BlazingSpines}, 3, 2, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BonechillBarrier}, 3, 1, myPlayerId);

    this.applyCardToBoard({id: Cards.Faction6.BonechillBarrier}, 4, 3, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BonechillBarrier}, 4, 1, myPlayerId);

    this.applyCardToBoard({id: Cards.Faction6.BonechillBarrier}, 5, 3, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction6.BlazingSpines}, 5, 2, myPlayerId);
    return this.applyCardToBoard({id: Cards.Faction6.BonechillBarrier}, 5, 1, myPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.advanced_vanar_2_taunt"),
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
AdvancedVanarChallenge2.initClass();


module.exports = AdvancedVanarChallenge2;
