/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Logger =     require('app/common/logger');
const UtilsJavascript =     require('app/common/utils/utils_javascript');
const Action =     require('./action');
const _ = require("underscore");

class PutCardInHandAction extends Action {
  static initClass() {
  
    this.type ="PutCardInHandAction";
    this.prototype.cardDataOrIndex = null; // card data or index for new card
    this.prototype.indexOfCardInHand = null; // optional index in hand to place card, if none provided will use first empty slot
    this.prototype.burnCard = false;
  
    // target should always be the card we've put in hand, so we'll alias getCard
    this.prototype.getTarget = this.prototype.getCard;
     // if true, card will always be burned even if there is room left in hand
  }

  constructor(gameSession, ownerId, cardDataOrIndex, indexOfCardInHand=null) {
    if (this.type == null) { this.type = PutCardInHandAction.type; }
    if (cardDataOrIndex != null) {
      // copy data so we don't modify anything unintentionally
      if (_.isObject(cardDataOrIndex)) {
        this.cardDataOrIndex = UtilsJavascript.fastExtend({}, cardDataOrIndex);
      } else {
        this.cardDataOrIndex = cardDataOrIndex;
      }
    }

    this.indexOfCardInHand = indexOfCardInHand;

    super(gameSession);

    // has to be done after super()
    this.ownerId = ownerId + "";
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.cachedCard = null;

    return p;
  }

  isRemovableDuringScrubbing() {
    return false;
  }

  /**
   * Returns the card data or index used to create card that will be applied.
   */
  getCardDataOrIndex() {
    return this.cardDataOrIndex;
  }

  /**
   * Returns the card.
   * NOTE: This card may or may not be indexed if this method is called before this action is executed.
   */
  getCard() {
    if ((this._private.cachedCard == null)) {
      this._private.cachedCard = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(this.cardDataOrIndex);
      if (this._private.cachedCard != null) { this._private.cachedCard.setOwnerId(this.getOwnerId()); }
    }
    return this._private.cachedCard;
  }

  /**
   * Explicitly sets the card.
   * NOTE: This card reference is not serialized and will not be preserved through deserialize/rollback.
   */
  setCard(card) {
    return this._private.cachedCard = card;
  }

  /**
   * Returns index location in hand that this card was placed.
   * NOTE: this will only return reliable values POST EXECUTION
   */
  getIndexOfCardInHand() {
    return this.indexOfCardInHand;
  }

  /**
   * Returns true if this card ended up being burned, false if card was put into hand
   * NOTE: this will only return reliable values POST EXECUTION
   */
  getIsBurnedCard() {
    return (this.cardDataOrIndex != null) && (this.indexOfCardInHand == null);
  }

  _execute() {
    super._execute();

    if (this.cardDataOrIndex != null) {
      //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "PutCardInHandAction::execute"
      const card = this.getCard();
      const deck = this.getGameSession().getPlayerById(this.getOwnerId()).getDeck();

      // regenerate card data so we transmit the correct values to the clients
      if (this.getGameSession().getIsRunningAsAuthoritative()) {
        if (card.getIsFollowup()) {
          // followups should ignore incoming card data
          this.cardDataOrIndex = card.createCardData();
        } else {
          // apply incoming card data before regenerating
          card.applyCardData(this.cardDataOrIndex);
          this.cardDataOrIndex = card.createCardData(this.cardDataOrIndex);
        }

        // flag card data as applied locally so that we don't reapply regenerated data for clients
        this.cardDataOrIndex._hasBeenApplied = true;
      }

      if (this.burnCard) {
        // apply and immediagtely burn the card through the game session
        this.indexOfCardInHand = this.getGameSession().applyCardToHand(deck, this.cardDataOrIndex, card, this.indexOfCardInHand, this, true);
      } else {
        // apply the card through the game session
        this.indexOfCardInHand = this.getGameSession().applyCardToHand(deck, this.cardDataOrIndex, card, this.indexOfCardInHand, this);
      }

      // get post apply card data
      if (this.getGameSession().getIsRunningAsAuthoritative()) { return this.cardDataOrIndex = card.updateCardDataPostApply(this.cardDataOrIndex); }
    }
  }

  scrubSensitiveData(actionData,scrubFromPerspectiveOfPlayerId, forSpectator) {
    if (actionData.ownerId !== scrubFromPerspectiveOfPlayerId) {
      if ((actionData.cardDataOrIndex != null) && (actionData.indexOfCardInHand != null) && _.isObject(actionData.cardDataOrIndex)) {
        // scrub the card id and only retain the card index
        // unless burned card (no index in hand), then don't scrub and reveal to both players
        actionData.cardDataOrIndex = {id:-1, index: actionData.cardDataOrIndex.index};
      }
    }
    return actionData;
  }
}
PutCardInHandAction.initClass();

module.exports = PutCardInHandAction;
