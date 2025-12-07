/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const GameSessionModifier = require('./gameSessionModifier');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const ModifierCollectableCard = require('app/sdk/modifiers/modifierCollectableCard');

class GameSessionModifierFestiveSpirit extends GameSessionModifier {
  static initClass() {
  
    this.prototype.type ="GameSessionModifierFestiveSpirit";
    this.type ="GameSessionModifierFestiveSpirit";
  
    this.isHiddenToUI = true;
  
    this.prototype.helperMinions = [Cards.Boss.FrostfireSnowchaser, Cards.Boss.FrostfireTiger, Cards.Boss.FrostfireImp];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.player1ChestsAhead = 0;
    p.player2ChestsAhead = 0;

    return p;
  }

  onActivate() {
    return this.spawnFrostfireChest(true);
  }

  spawnFrostfireChest(isAutomatic) {
    const card = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData({id: Cards.Tile.FrostfireChest});
    // not on top of a unit already on the board
    const wholeBoardPattern = [];
    for (var boardPos of Array.from(CONFIG.ALL_BOARD_POSITIONS)) {
      wholeBoardPattern.push(boardPos);
    }
    const unitPositions = [];
    for (var unit of Array.from(this.getGameSession().getBoard().getUnits())) {
      UtilsPosition.removePositionFromPositions(unit.getPosition(), wholeBoardPattern);
    }
    const spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, wholeBoardPattern, card, this.getCard(), 1);
    if (spawnLocations.length > 0) {
      const a = new ApplyCardToBoardAction(this.getGameSession(), this.getOwnerId(), spawnLocations[0].x, spawnLocations[0].y, card.createNewCardData(), true);
      if (isAutomatic) {
        a.setIsAutomatic(true); // ignore explicit action rules
      }
      return this.getGameSession().executeAction(a);
    }
  }

  onStartTurn(action) {
    super.onStartTurn(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      if (Math.random() < .33) {
        return this.spawnFrostfireChest();
      }
    }
  }

  onAction(actionEvent) {
    super.onAction(actionEvent);
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let card, cardId, spawnLocations;
      let a = actionEvent.action;
      // watch for player getting a frostfire chest reward card
      if (a instanceof PutCardInHandAction && (__guard__(a.getCard(), x => x.getBaseCardId()) === Cards.BossSpell.HolidayGift) && a.getTriggeringModifier() instanceof ModifierCollectableCard) {
        if (a.getOwnerId() === this.getGameSession().getPlayer1().getPlayerId()) {
          this._private.player1ChestsAhead++;
        } else if (a.getOwnerId() === this.getGameSession().getPlayer2().getPlayerId()) {
          this._private.player2ChestsAhead++;
        }
      }

      if ((this._private.player1ChestsAhead - this._private.player2ChestsAhead) >= 2) {
        // spawn a helper for player 2
        cardId = this.helperMinions[this.getGameSession().getRandomIntegerForExecution(this.helperMinions.length)];
        card = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData({id: cardId});
        const player2 = this.getGameSession().getPlayer2();
        spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), this.getGameSession().getGeneralForPlayerId(player2.getPlayerId()).getPosition(), CONFIG.PATTERN_3x3, card, this.getCard(), 1);
        if (spawnLocations.length > 0) {
          a = new PlayCardSilentlyAction(this.getGameSession(), player2.getPlayerId(), spawnLocations[0].x, spawnLocations[0].y, card.createNewCardData());
          this.getGameSession().executeAction(a);
        }
        // reset chests ahead counter
        this._private.player1ChestsAhead = 0;
        return this._private.player2ChestsAhead = 0;

      } else if ((this._private.player2ChestsAhead - this._private.player1ChestsAhead) >= 2) {
        // spawn a helper for player 1
        cardId = this.helperMinions[this.getGameSession().getRandomIntegerForExecution(this.helperMinions.length)];
        card = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData({id: cardId});
        const player1 = this.getGameSession().getPlayer1();
        spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), this.getGameSession().getGeneralForPlayerId(player1.getPlayerId()).getPosition(), CONFIG.PATTERN_3x3, card, this.getCard(), 1);
        if (spawnLocations.length > 0) {
          a = new PlayCardSilentlyAction(this.getGameSession(), player1.getPlayerId(), spawnLocations[0].x, spawnLocations[0].y, card.createNewCardData());
          this.getGameSession().executeAction(a);
        }
        // reset chests ahead counter
        this._private.player1ChestsAhead = 0;
        return this._private.player2ChestsAhead = 0;
      }
    }
  }
}
GameSessionModifierFestiveSpirit.initClass();

module.exports = GameSessionModifierFestiveSpirit;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}