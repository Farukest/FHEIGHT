/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
AnalyticsTracker - Parses through events passed to it to track analytics
  - This is not meant to listen to events directly,
  - these events should be called from other UI managers to reduce listener spaghetti
*/

const Analytics = require('app/common/analytics');
const SDK =       require('app/sdk');
const Logger =     require('app/common/logger');
const moment =     require('moment');
const CONFIG =    require('app/common/config');

class AnalyticsTracker {

  // Sends the analytics pulled from the end of game
  static submitGameOverAnalytics(gameSession,gameOverData) {
    if (!this._sendAnalyticsForCurrentGameSession()) {
      return;
    }

    const myPlayerId = gameSession.getMyPlayerId();

    if (!gameSession.isOver()) {
      return;
    }

    // general analytics data
    const playerSetupData = gameSession.getPlayerSetupDataForPlayerId(myPlayerId);
    const {
      factionId
    } = playerSetupData;
    const factionName = SDK.FactionFactory.factionForIdentifier(factionId).name;
    const opponentSetupData = gameSession.getPlayerSetupDataForPlayerId(gameSession.getOpponentPlayerId());
    const opponentFactionId = opponentSetupData.factionId;
    const opponentFactionName = SDK.FactionFactory.factionForIdentifier(opponentFactionId).name;

    const myPlayer = gameSession.getMyPlayer();
    const opponentPlayer = gameSession.getOpponentPlayer();
    const wasVictory = myPlayer.getIsWinner();
    const wasDraw = !(myPlayer.getIsWinner() || opponentPlayer.getIsWinner());

    // Prep of transmitted data
    const isFirstMover = (myPlayer.playerId === gameSession.getPlayer1().playerId) ? 1 : 0;
    const gameOutcome = (wasDraw) ? 0 : wasVictory ? 1 : -1;
    const isScored = (gameOverData.get("is_scored")) ? 1 : 0;
    const didConcede = myPlayer.hasResigned  ? 1 : 0;
    const generalId = SDK.Cards.getBaseCardId(playerSetupData.generalId);
    const opponentGeneralId = SDK.Cards.getBaseCardId(opponentSetupData.generalId);

      // Game duration stats
    const now = moment();
    const lastActionInGame = new moment(gameSession.lastActionTimestamp);
    const since = moment(gameSession.createdAt);
    const duration = moment.duration(lastActionInGame.diff(since));
    const deckSpiritCost = _.reduce(playerSetupData.deck, function(memo, card) {
      card = SDK.CardFactory.cardForIdentifier(card.id,gameSession);
      const cardRarityId = card.getRarityId();
      const rarityData = SDK.RarityFactory.rarityForIdentifier(cardRarityId);
      return memo + rarityData.spiritCost;
    }
    ,0);

    Analytics.setGroupPriority(Analytics.EventPriority.Optional);

    Analytics.track("played game", {
      category:Analytics.EventCategory.Game,
      duration:Math.floor(duration.asSeconds()),
      turn_count:gameSession.getNumberOfTurns(),
      game_type:gameSession.gameType,
      game_id: gameSession.getGameId(),
      game_outcome: gameOutcome,
      is_first_mover: isFirstMover,
      is_scored: isScored,
      did_concede: didConcede,
      deck_spirit_cost: deckSpiritCost,
      faction_id: factionId,
      general_id: generalId,
      opponent_faction_id:opponentFactionId,
      opponent_general_id:opponentGeneralId
    },{
      nonInteraction:1
    });

    return Analytics.clearGroupPriority();
  }



  static sendAnalyticsForExplicitAction(action) {
    let card;
    if (!this._sendAnalyticsForCurrentGameSession()) {
      return;
    }

    const gameSession = SDK.GameSession.current();

    Analytics.setGroupPriority(Analytics.EventPriority.Optional);
    if ((action.getType() === SDK.PlayCardFromHandAction.type) && (action.getOwnerId() === gameSession.getMyPlayerId())) {
      card = action.getCard();
      const cardType = card.getType();
      Analytics.track("played card", {
        category: Analytics.EventCategory.Game,
        game_id: gameSession.getGameId(),
        card_id: card.getBaseCardId(),
        turn_index: gameSession.getNumberOfTurns()
      });
    } else if (action instanceof SDK.ReplaceCardFromHandAction && (action.getOwnerId() === gameSession.getMyPlayerId())) {
      // track analytics for valid replace when coming from my player
      const replacedCard = action.getCard();
      if (replacedCard) {
        Analytics.track("replace card", {
          category: Analytics.EventCategory.Game,
          game_id: gameSession.getGameId(),
          card_id: replacedCard.getBaseCardId(),
          turn_index: gameSession.getNumberOfTurns()
        });
      }
    } else if (action instanceof SDK.DrawStartingHandAction && (action.getOwnerId() === gameSession.getMyPlayerId())) {
      const mulliganedCardData = action.mulliganedHandCardsData;
      if (mulliganedCardData != null) {
        for (var cardData of Array.from(mulliganedCardData)) {
          card = SDK.GameSession.getCardCaches().getCardById(cardData.id);
          Analytics.track("mulliganed card", {
            category: Analytics.EventCategory.Game,
            game_id: gameSession.getGameId(),
            card_id: card.getBaseCardId()
          });
        }
      }
    }

    return Analytics.clearGroupPriority();
  }

  static sendAnalyticsForCompletedTurn(turn) {
    if (!this._sendAnalyticsForCurrentGameSession()) {
      return;
    }

    const gameSession = SDK.GameSession.current();
    const playerForTurn = gameSession.getPlayerById(turn.playerId);

    Analytics.setGroupPriority(Analytics.EventPriority.Optional);

    // Not tracking anything yet

    return Analytics.clearGroupPriority();
  }


  static _sendAnalyticsForCurrentGameSession(gameSession) {
    // Check for conditions where we don't want to send game over analytics
    if ((gameSession == null)) {
      gameSession = SDK.GameSession.getInstance();
    }

    if (gameSession.getIsSpectateMode()) {
      return false;
    } else {
      return gameSession.isRanked() || gameSession.isGauntlet() || gameSession.isSinglePlayer() || gameSession.isCasual() || gameSession.isBossBattle() || gameSession.isRift();
    }
  }
}

// region inventory transaction tracking

module.exports = AnalyticsTracker;
