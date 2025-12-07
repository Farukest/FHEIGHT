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

// http://forums.fheight.com/t/wishful-thinking-gate-6-slot-5/12701

class AdvancedVetruvianChallenge2 extends Challenge {
  static initClass() {
  
    this.type = "AdvancedVetruvianChallenge2";
    this.prototype.type = "AdvancedVetruvianChallenge2";
    this.prototype.categoryType = ChallengeCategory.vault1.type;
  
  
    this.prototype.name = i18next.t("challenges.advanced_vetruvian_2_title");
    this.prototype.description =i18next.t("challenges.advanced_vetruvian_2_description");
    this.prototype.iconUrl = RSX.speech_portrait_vetruvian.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_vetruv.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.advanced_vetruvian_2_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.advanced_vetruvian_2_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 6;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = 9;
    this.prototype.startingHandSizePlayer = 2;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction3.General},
      {id: Cards.Spell.AstralPhasing},
      {id: Cards.Faction3.MirrorMaster},
      {id: Cards.Spell.ScionsSecondWish},
      {id: Cards.Spell.SiphonEnergy},
      {id: Cards.Spell.ScionsFirstWish}
    ];
  }

  getOpponentPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction4.General},
      {id: Cards.TutorialSpell.TutorialFrozenFinisher}
    ];
  }

  setupBoard(gameSession) {
    super.setupBoard(gameSession);

    const myPlayerId = gameSession.getMyPlayerId();
    const opponentPlayerId = gameSession.getOpponentPlayerId();

    const general1 = gameSession.getGeneralForPlayerId(myPlayerId);
    general1.setPosition({x: 3, y: 2});
    general1.maxHP = 25;
    general1.setDamage(25-15);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 8, y: 0});
    general2.maxHP = 25;
    general2.setDamage(25-8);

    const scarab = this.applyCardToBoard({id: Cards.Faction3.StarfireScarab}, 0, 4, myPlayerId);
    scarab.setDamage(1);

    this.applyCardToBoard({id: Cards.Neutral.SaberspineTiger},3,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.WhistlingBlade},4,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.RockPulverizer},6,0,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Neutral.WhistlingBlade},7,2,opponentPlayerId);

    // mana orbs
    return this.applyCardToBoard({id: Cards.Tile.BonusMana},5,2);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    // Due to time maelstrom we don't know which turn the enemy general gets to finally act,
    // this will go away when we switch to resetting the otk on failure rather than ending turn and having a finisher
    return (() => {
      const result = [];
      for (let i = 0; i <= 5; i++) {
        this._opponentAgent.addActionForTurn(i,AgentActions.createAgentSoftActionShowInstructionLabels([{
          label:i18next.t("challenges.advanced_vetruvian_2_taunt"),
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
AdvancedVetruvianChallenge2.initClass();


module.exports = AdvancedVetruvianChallenge2;
