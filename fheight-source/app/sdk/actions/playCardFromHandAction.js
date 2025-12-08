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
const PlayCardAction =     require('./playCardAction');
const CardType = require('app/sdk/cards/cardType');

class PlayCardFromHandAction extends PlayCardAction {
  static initClass() {
  
    this.type ="PlayCardFromHandAction";
    this.prototype.indexOfCardInHand = null; // index of card in player hand
    this.prototype.overrideCardData = false; // flag set when card data is overriden to be another card (ex - sentinels play themselves to board as a generic sentinel card)
    // if we override the card data, we need to retain any mana cost change for the original card being played from hand
    // only used when overrideCardData is true
    this.prototype.overridenManaCost = null;
  }

  constructor(gameSession, ownerId, x, y, handIndex) {
    super(gameSession, ownerId, x, y);
    this.type = PlayCardFromHandAction.type;

    this.indexOfCardInHand = handIndex;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.originalCard = null;

    return p;
  }

  /**
  * Explicitly sets the card to be played.
  * This can be used to swap a card being played from hand with another arbritrary card at execution time
  */
  overrideCard(card) {
    this._private.originalCard = this.getCard();
    this.overridenManaCost = this.getCard().getManaCost(); // store original mana cost of this card
    this.setCard(card);
    return this.overrideCardData = true; // card to be played to board is NOT card being played from hand
  }

  getLogName(){
    let logName = super.getLogName();
    logName += `_i[${this.indexOfCardInHand}]`;
    return logName;
  }

  getManaCost() {
    if (this.overrideCardData) {
      return this.overridenManaCost;
    } else {
      const card = this.getCard();
      if (card != null) { return card.getManaCost(); } else { return super.getManaCost(); }
    }
  }

  /**
   * Returns index location in hand that this card was placed.
   */
  getIndexOfCardInHand() {
    return this.indexOfCardInHand;
  }

  getCard() {
    if ((this._private.cachedCard == null)) {
      if (this.getGameSession().getIsRunningAsAuthoritative()) {
        // playing a card from hand should never use existing card data
        this.cardDataOrIndex = this.getOwner().getDeck().getCardIndexInHandAtIndex(this.indexOfCardInHand);
      } else if ((this.getOwnerId() === this.getGameSession().getMyPlayerId()) && (this.cardDataOrIndex == null)) {
        // when my action, try to grab card from hand unless we have card data provided by server
        this._private.cachedCard = this.getOwner().getDeck().getCardInHandAtIndex(this.indexOfCardInHand);
      }
    }

    return super.getCard();
  }

  _execute() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      if (!this.overrideCardData) {
        // playing a card from hand should never use existing card data (unless explicitly being overridden)
        this.cardDataOrIndex = this.getOwner().getDeck().getCardIndexInHandAtIndex(this.indexOfCardInHand);
      }
    }

    if (this.overrideCardData) { // explicitly changing the card as it is played, so remove the old card from hand - not only when running as authoritative, must happen on client as well
      this.getGameSession()._removeCardFromCurrentLocation(this.getOwner().getDeck().getCardInHandAtIndex(this.indexOfCardInHand), this.getOwner().getDeck().getCardIndexInHandAtIndex(this.indexOfCardInHand), this);
    }
    // prototype method will handle applying the card to the board
    super._execute();

    // stat tracking for cards played
    const card = this.getCard();
    if (card != null) {
      const cardType = card.getType();
      if (CardType.getIsUnitCardType(cardType)) {
        return this.getGameSession().getPlayerById(this.getOwnerId()).totalMinionsPlayedFromHand++;
      } else if (CardType.getIsSpellCardType(cardType)) {
        return this.getGameSession().getPlayerById(this.getOwnerId()).totalSpellsPlayedFromHand++;
      }
    }
  }
}
PlayCardFromHandAction.initClass();

module.exports = PlayCardFromHandAction;
