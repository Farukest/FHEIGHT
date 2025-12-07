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
const ModifierSummonWatchByEntityBuffSelf = require('app/sdk/modifiers/modifierSummonWatchByEntityBuffSelf');
const i18next = require('i18next');


// http://forums.fheight.com/t/abyss-super-creep-medium/8970

class BeginnerAbyssianChallenge3 extends Challenge {
  static initClass() {
  
    this.type = "BeginnerAbyssianChallenge3";
    this.prototype.type = "BeginnerAbyssianChallenge3";
    this.prototype.categoryType = ChallengeCategory.advanced.type;
  
    this.prototype.name =i18next.t("challenges.beginner_abyss_3_title");
    this.prototype.description =i18next.t("challenges.beginner_abyss_3_description");
    this.prototype.iconUrl = RSX.speech_portrait_abyssian.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_abyssian.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.beginner_abyss_3_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.beginner_abyss_3_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 0;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 6;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction4.General},
      {id: Cards.Spell.WraithlingSwarm},
      {id: Cards.Spell.DaemonicLure},
      {id: Cards.Artifact.HornOfTheForsaken},
      {id: Cards.Spell.AbyssianStrength}
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
    general1.setPosition({x: 1, y: 2});
    general1.maxHP = 25;
    general1.setDamage(18);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 7, y: 2});
    general2.maxHP = 25;
    general2.setDamage(25-14);

    this.applyCardToBoard({id: Cards.Faction4.Wraithling}, 2, 3, myPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.GloomChaser}, 2, 1, myPlayerId);
    const blackSolus = this.applyCardToBoard({id: Cards.Faction4.BlackSolus}, 4, 2, myPlayerId);
    const buffSolusModifier = blackSolus.getModifierByType(ModifierSummonWatchByEntityBuffSelf.type);
    buffSolusModifier.applyManagedModifiersFromModifiersContextObjects(buffSolusModifier.modifiersContextObjects, blackSolus);

    const goreHorn = this.applyCardToBoard({id: Cards.Faction2.GoreHorn},5,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Spell.MistDragonSeal},5,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction2.KaidoAssassin},6,2,opponentPlayerId);
    return this.applyCardToBoard(goreHorn.getCurrentFollowupCard(),5,2,opponentPlayerId);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.beginner_abyss_3_taunt"),
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
BeginnerAbyssianChallenge3.initClass();


module.exports = BeginnerAbyssianChallenge3;
