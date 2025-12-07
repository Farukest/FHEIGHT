/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
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
const ModifierOpeningGambitApplyPlayerModifiers = require('app/sdk/modifiers/modifierOpeningGambitApplyPlayerModifiers');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const i18next = require('i18next');

// http://forums.fheight.com/t/starter-challenge-vanar/7519

class AdvancedVanarChallenge1 extends Challenge {
  static initClass() {
  
    this.type = "AdvancedVanarChallenge1";
    this.prototype.type = "AdvancedVanarChallenge1";
    this.prototype.categoryType = ChallengeCategory.contest2.type;
  
    this.prototype.name = i18next.t("challenges.advanced_vanar_1_title");
    this.prototype.description =i18next.t("challenges.advanced_vanar_1_description");
    this.prototype.iconUrl = RSX.speech_portrait_vanar.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_vanar.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.advanced_vanar_1_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.advanced_vanar_1_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 3;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 6;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction6.General},
      {id: Cards.Spell.AspectOfTheWolf},
      {id: Cards.Spell.IceCage},
      {id: Cards.Spell.RitualOfTheWind},
      {id: Cards.Spell.IceCage},
      {id: Cards.Spell.RitualOfTheWind},
      {id: Cards.Neutral.ZenRui}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction2.General},
      {id: Cards.TutorialSpell.TutorialFireOrb}
    ];
  }

  setupBoard(gameSession) {
    let modifierContextObject;
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 7, y:0});
    general1.maxHP = 25;
    general1.setDamage(25-1);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 1, y: 4});
    general2.maxHP = 25;
    general2.setDamage(25-7);

    this.applyCardToBoard({id: Cards.Neutral.Manaforger}, 5, 1, myPlayerId);
    // buff mana forger
    this.applyCardToBoard({id: Cards.Spell.PermafrostShield},5,1,myPlayerId);

    this.applyCardToBoard({id: Cards.Faction6.HearthSister}, 8, 3, myPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.Manaforger}, 8, 1, myPlayerId);
    //@applyCardToBoard({id: Cards.Neutral.Manaforger}, 8, 2, myPlayerId)
    this.applyCardToBoard({id: Cards.Faction6.ArcticRhyno}, 8, 0, myPlayerId);


    const ladyLocke = this.applyCardToBoard({id: Cards.Neutral.LadyLocke},2,4,opponentPlayerId);
    const chakri1 = this.applyCardToBoard({id: Cards.Faction2.ChakriAvatar},1,2,opponentPlayerId);
    const manaForger = this.applyCardToBoard({id: Cards.Neutral.Manaforger},2,3,opponentPlayerId);
    const owlbeast = this.applyCardToBoard({id: Cards.Neutral.OwlbeastSage},2,2,opponentPlayerId);
    const chakri2 = this.applyCardToBoard({id: Cards.Faction2.ChakriAvatar},3,2,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.LadyLocke},2,1,opponentPlayerId);

    // give lady lockes buffs to enemy manaforger, owlbeast, and both chakris
    const lockPlayerModifier = ladyLocke.getModifierByType(ModifierOpeningGambitApplyPlayerModifiers.type);
    for (modifierContextObject of Array.from(lockPlayerModifier.modifiersContextObjects[0].modifiersContextObjects)) {
      gameSession.applyModifierContextObject(modifierContextObject, chakri1);
    }
    for (modifierContextObject of Array.from(lockPlayerModifier.modifiersContextObjects[0].modifiersContextObjects)) {
      gameSession.applyModifierContextObject(modifierContextObject, manaForger);
    }
    for (modifierContextObject of Array.from(lockPlayerModifier.modifiersContextObjects[0].modifiersContextObjects)) {
      gameSession.applyModifierContextObject(modifierContextObject, owlbeast);
    }
    for (modifierContextObject of Array.from(lockPlayerModifier.modifiersContextObjects[0].modifiersContextObjects)) {
      gameSession.applyModifierContextObject(modifierContextObject, chakri2);
    }

    // mana orbs
    return this.applyCardToBoard({id: Cards.Tile.BonusMana},4,0);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.advanced_vanar_1_taunt"),
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
AdvancedVanarChallenge1.initClass();


module.exports = AdvancedVanarChallenge1;
