/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
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

class GenerateSignatureCardAction extends Action {
  static initClass() {
  
    this.type ="GenerateSignatureCardAction";
    this.prototype.cardDataOrIndex = null;
     // card data or index for new card
  }

  constructor(gameSession, ownerId, cardDataOrIndex) {
    super(gameSession);

    if (this.type == null) { this.type = GenerateSignatureCardAction.type; }
    if (cardDataOrIndex != null) {
      // copy data so we don't modify anything unintentionally
      if (_.isObject(cardDataOrIndex)) {
        this.cardDataOrIndex = UtilsJavascript.fastExtend({}, cardDataOrIndex);
      } else {
        this.cardDataOrIndex = cardDataOrIndex;
      }
    }

    this.ownerId = ownerId + "";
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.cachedCard = null;

    return p;
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

  isRemovableDuringScrubbing() {
    return false;
  }

  _execute() {
    super._execute();

    if (this.cardDataOrIndex != null) {
      //Logger.module("SDK").debug "[G:#{@.getGameSession().gameId}]", "GenerateSignatureCardAction::execute"
      const card = this.getCard();

      // remove all previous signature cards
      const owner = card.getOwner();
      for (var existingCard of Array.from(owner.getSignatureCards())) {
        this.getGameSession().removeCardFromSignatureCards(existingCard, this);
      }

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

      // apply the card through the game session
      this.getGameSession().applyCardToSignatureCards(card, this.cardDataOrIndex, this);

      // get post apply card data
      if (this.getGameSession().getIsRunningAsAuthoritative()) { return this.cardDataOrIndex = card.updateCardDataPostApply(this.cardDataOrIndex); }
    }
  }
}
GenerateSignatureCardAction.initClass();

module.exports = GenerateSignatureCardAction;
