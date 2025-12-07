/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
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
const ModifierDeathWatchBuffSelf = require('app/sdk/modifiers/modifierDeathWatchBuffSelf');
const i18next = require('i18next');

// http://forums.fheight.com/t/patience-otk-1/11413

class AdvancedVetruvianChallenge1 extends Challenge {
  static initClass() {
  
    this.type = "AdvancedVetruvianChallenge1";
    this.prototype.type = "AdvancedVetruvianChallenge1";
    this.prototype.categoryType = ChallengeCategory.contest1.type;
  
  
    this.prototype.name = i18next.t("challenges.advanced_vetruvian_1_title");
    this.prototype.description =i18next.t("challenges.advanced_vetruvian_1_description");
    this.prototype.iconUrl = RSX.speech_portrait_vetruvian.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_vetruv.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.advanced_vetruvian_1_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.advanced_vetruvian_1_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 6;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = 9;
    this.prototype.startingHandSizePlayer = 4;
    this.prototype.usesResetTurn = false;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction3.General},
      {id: Cards.Neutral.PrimusFist},
      {id: Cards.Neutral.LadyLocke},
      {id: Cards.Spell.ScionsSecondWish},
      {id: Cards.Faction3.BrazierGoldenFlame},
      {id: Cards.Artifact.AnkhFireNova},
      {id: Cards.Artifact.StaffOfYKir},
      {id: Cards.Spell.Maelstrom},
      {id: Cards.Spell.ScionsThirdWish},
      {id: Cards.Neutral.Manaforger},
      {id: Cards.Spell.StarsFury},
      {id: Cards.Spell.Enslave},
      {id: Cards.Spell.Maelstrom}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction4.General},
      {id: Cards.TutorialSpell.TutorialFireOrb}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 0, y: 4});
    general1.maxHP = 25;
    general1.setDamage(25-2);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 5, y: 2});
    general2.maxHP = 25;

    this.applyCardToBoard({id: Cards.Faction3.Oserix}, 8, 0, myPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.Manaforger},5,0,myPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.Manaforger},7,2,myPlayerId);

    this.applyCardToBoard({id: Cards.Faction4.SharianShadowdancer},1,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.Manaforger},2,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.NightsorrowAssassin},3,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.SharianShadowdancer},5,4,opponentPlayerId);

    // equip grimwar to lilith
    const grimwar = this.applyCardToBoard({id: Cards.Artifact.SoulGrimwar},5,2,opponentPlayerId);
    // buff lilithe from grimwar
    const grimwarModifier = general2.getModifierByType(ModifierDeathWatchBuffSelf.type);
    grimwarModifier.applyManagedModifiersFromModifiersContextObjects(grimwarModifier.modifiersContextObjects, general2);
    return grimwarModifier.applyManagedModifiersFromModifiersContextObjects(grimwarModifier.modifiersContextObjects, general2);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    // Due to time maelstrom we don't know which turn the enemy general gets to finally act,
    // this will go away when we switch to resetting the otk on failure rather than ending turn and having a finisher
    return (() => {
      const result = [];
      for (let i = 0; i <= 5; i++) {
        this._opponentAgent.addActionForTurn(i,AgentActions.createAgentSoftActionShowInstructionLabels([{
          label:i18next.t("challenges.advanced_vetruvian_1_taunt"),
          isSpeech:true,
          yPosition:.7,
          isPersistent: true,
          isOpponent: true
        }
        ]));
        result.push(this._opponentAgent.addActionForTurn(i,AgentActions.createAgentActionPlayCardFindPosition(0,() => {
          return [GameSession.getInstance().getGeneralForPlayer1().getPosition()];
        })));
      }
      return result;
    })();
  }
}
AdvancedVetruvianChallenge1.initClass();


module.exports = AdvancedVetruvianChallenge1;
