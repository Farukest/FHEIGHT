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
const AgentActions = require('app/sdk/agents/agentActions');
const GameSession       = require('app/sdk/gameSession');
const CONFIG = require('app/common/config');
const RSX = require('app/data/resources');
const ChallengeCategory = require('app/sdk/challenges/challengeCategory');
const Modifier = require('app/sdk/modifiers/modifier');
const _ = require('underscore');
const i18next = require('i18next');


// http://forums.fheight.com/t/malediction-otk-1/11423

class AdvancedAbyssianChallenge1 extends Challenge {
  static initClass() {
  
    this.type = "AdvancedAbyssianChallenge1";
    this.prototype.type = "AdvancedAbyssianChallenge1";
    this.prototype.categoryType = ChallengeCategory.contest2.type;
  
    this.prototype.name = i18next.t("challenges.advanced_abyss_1_title");
    this.prototype.description =i18next.t("challenges.advanced_abyss_1_description");
    this.prototype.iconUrl = RSX.speech_portrait_abyssian.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_abyssian.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.advanced_abyss_1_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.advanced_abyss_1_fail")
    ];
  
    this.prototype.startingManaPlayer = CONFIG.MAX_MANA;
    this.prototype.startingHandSizePlayer = 6;
    this.prototype.battleMapTemplateIndex = 0;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.usesResetTurn = false;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction4.General},
      {id: Cards.Spell.ConsumingRebirth},
      {id: Cards.Spell.DaemonicLure},
      {id: Cards.Faction4.AbyssalCrawler},
      {id: Cards.Spell.CurseOfAgony},
      {id: Cards.Neutral.RepulsionBeast}
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
    general1.setPosition({x: 2, y: 3});
    general1.maxHP = 25;
    general1.setDamage(25-5);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 8, y: 4});
    general2.maxHP = 25;
    general2.setDamage(25-3);

    this.applyCardToBoard({id: Cards.Faction4.NightsorrowAssassin}, 1, 0, myPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.SaberspineTiger}, 4, 0, myPlayerId);
    this.applyCardToBoard({id: Cards.Tile.Shadow}, 4, 2, myPlayerId);

    const rockPulverizer1 = this.applyCardToBoard({id: Cards.Neutral.RockPulverizer},4,3,opponentPlayerId);
    const rockPulverizer2 = this.applyCardToBoard({id: Cards.Neutral.RockPulverizer},5,2,opponentPlayerId);
    const swampEntangler = this.applyCardToBoard({id: Cards.Neutral.VineEntangler},7,3,opponentPlayerId);
    const silverguardKnight = this.applyCardToBoard({id: Cards.Faction1.SilverguardKnight},7,4,opponentPlayerId);
    const primusShieldmaster1 = this.applyCardToBoard({id: Cards.Neutral.PrimusShieldmaster},6,1,opponentPlayerId);
    const primusShieldmaster2 = this.applyCardToBoard({id: Cards.Neutral.PrimusShieldmaster},7,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Spell.WarSurge},4,2,opponentPlayerId);

    const hailStoneHowler = this.applyCardToBoard({id: Cards.Neutral.HailstoneHowler},5,3,opponentPlayerId);
    // Every enemy unit above here has 2 azure horn shaman buffs

    // ironcliffe only has one azure horn shaman buff
    const ironcliffeGuardian = this.applyCardToBoard({id: Cards.Faction1.IroncliffeGuardian},8,3,opponentPlayerId);

    // add first shaman buffs
    let unitsToReceiveBuff = [rockPulverizer1,rockPulverizer2,swampEntangler,silverguardKnight,hailStoneHowler,primusShieldmaster1,primusShieldmaster2,ironcliffeGuardian];
    _.each(unitsToReceiveBuff, function(unit) {
      const shamanContextObject = Modifier.createContextObjectWithAttributeBuffs(0,4);
      shamanContextObject.appliedName = i18next.t("modifiers.neutral_azure_horn_shaman_modifier");
      return gameSession.applyModifierContextObject(shamanContextObject, unit);
    });
    // remove primus and do it again
    unitsToReceiveBuff = _.without(unitsToReceiveBuff,ironcliffeGuardian);
    _.each(unitsToReceiveBuff, function(unit) {
      const shamanContextObject = Modifier.createContextObjectWithAttributeBuffs(0,4);
      shamanContextObject.appliedName = i18next.t("modifiers.neutral_azure_horn_shaman_modifier");
      return gameSession.applyModifierContextObject(shamanContextObject, unit);
    });

    return swampEntangler.setDamage(1);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.advanced_abyss_1_taunt"),
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
AdvancedAbyssianChallenge1.initClass();


module.exports = AdvancedAbyssianChallenge1;
