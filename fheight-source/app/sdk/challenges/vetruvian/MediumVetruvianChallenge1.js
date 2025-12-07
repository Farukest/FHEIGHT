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

// http://forums.fheight.com/t/vetruvia-test-of-knowledge/11390

class MediumVetruvianChallenge1 extends Challenge {
  static initClass() {
  
    this.type = "MediumVetruvianChallenge1";
    this.prototype.type = "MediumVetruvianChallenge1";
    this.prototype.categoryType = ChallengeCategory.vault2.type;
  
  
    this.prototype.name = i18next.t("challenges.medium_vetruvian_1_title");
    this.prototype.description =i18next.t("challenges.medium_vetruvian_1_description");
    this.prototype.iconUrl = RSX.speech_portrait_vetruvian.img;
  
    this.prototype._musicOverride = RSX.music_battlemap_vetruv.audio;
  
    this.prototype.otkChallengeStartMessage = i18next.t("challenges.medium_vetruvian_1_start");
    this.prototype.otkChallengeFailureMessages = [
      i18next.t("challenges.medium_vetruvian_1_fail")
    ];
  
    this.prototype.battleMapTemplateIndex = 6;
    this.prototype.snapShotOnPlayerTurn = 0;
    this.prototype.startingManaPlayer = 9;
    this.prototype.startingHandSizePlayer = 4;
  }

  getMyPlayerDeckData(gameSession){
    return [
      {id: Cards.Faction3.General},
      {id: Cards.Faction3.Dunecaster},
      {id: Cards.Spell.ScionsFirstWish},
      {id: Cards.Neutral.BloodtearAlchemist},
      {id: Cards.Neutral.Manaforger},
      {id: Cards.Spell.ScionsSecondWish},
      {id: Cards.Spell.StarsFury},
      {id: Cards.Spell.SiphonEnergy}
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
    general1.setPosition({x: 2, y: 2});
    general1.maxHP = 25;
    general1.setDamage(25-2);
    const general2 = gameSession.getGeneralForPlayerId(opponentPlayerId);
    general2.setPosition({x: 6, y: 2});
    general2.maxHP = 25;

    this.applyCardToBoard({id: Cards.Faction3.PortalGuardian}, 3, 3, myPlayerId);

    this.applyCardToBoard({id: Cards.Faction4.ShadowWatcher},5,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling},4,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling},4,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling},5,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling},5,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling},6,4,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling},6,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling},7,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling},8,3,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.Wraithling},8,1,opponentPlayerId);
    this.applyCardToBoard({id: Cards.Faction4.SharianShadowdancer},8,0,opponentPlayerId);

    // mana orbs
    this.applyCardToBoard({id: Cards.Tile.BonusMana},4,0);
    return this.applyCardToBoard({id: Cards.Tile.BonusMana},5,2);
  }

  setupOpponentAgent(gameSession) {
    super.setupOpponentAgent(gameSession);

    this._opponentAgent.addActionForTurn(0,AgentActions.createAgentSoftActionShowInstructionLabels([{
      label:i18next.t("challenges.medium_vetruvian_1_taunt"),
      isSpeech:true,
      isPersistent:true,
      yPosition:.7,
      isOpponent: true
    }
    ]));
    return this._opponentAgent.addActionForTurn(0,AgentActions.createAgentActionPlayCardFindPosition(0,() => {
      return [GameSession.getInstance().getGeneralForPlayer1().getPosition()];
    }));
  }
}
MediumVetruvianChallenge1.initClass();


module.exports = MediumVetruvianChallenge1;
