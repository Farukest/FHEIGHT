/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SDKObject = require('app/sdk/object');
const Logger = require('app/common/logger');
const CONFIG = require('app/common/config');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const PutCardInDeckAction = require('app/sdk/actions/putCardInDeckAction');
const DrawCardAction = require('app/sdk/actions/drawCardAction');
const PlayerModifierCardDrawModifier = require('app/sdk/playerModifiers/playerModifierCardDrawModifier');
const PlayerModifierReplaceCardModifier = require('app/sdk/playerModifiers/playerModifierReplaceCardModifier');
const PlayerModifierCannotReplace = require('app/sdk/playerModifiers/playerModifierCannotReplace');
const _ = require('underscore');

class Deck extends SDKObject {
  static initClass() {
  
    this.prototype.numCardsReplacedThisTurn = 0; // counter of card replacements player has made, reset each turn
    this.prototype.drawPile = null; // record of card indices still available to draw
    this.prototype.hand = null; // record of card indices in hand
    this.prototype.ownerId = null;
  }

  constructor(gameSession, ownerId) {
    super(gameSession);

    // define public properties here that must be always be serialized
    // do not define properties here that should only serialize if different from the default
    this.drawPile = [];
    this.hand = [];
    this.hand.length = CONFIG.MAX_HAND_SIZE;
    this.setOwnerId(ownerId);
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.cachedCards = null;
    p.cachedCardsExcludingMissing = null;
    p.cachedCardsInHand = null;
    p.cachedCardsInHandExcludingMissing = null;
    return p;
  }

  // region GETTERS / SETTERS

  setOwnerId(val) {
    return this.ownerId = val;
  }

  getOwnerId() {
    return this.ownerId;
  }

  getOwner() {
    return this.getGameSession().getPlayerById(this.ownerId);
  }

  setDrawPile(val) {
    return this.drawPile = val;
  }

  /**
   * Returns list of card indices remaining in deck, i.e. cards that can still be drawn.
   * @returns {Array}
   */
  getDrawPile() {
    return this.drawPile;
  }

  /**
   * Returns list of card indices remaining in deck, i.e. cards that can still be drawn, excluding missing cards.
   * @returns {Array}
   */
  getDrawPileExcludingMissing() {
    const drawPile = [];
    for (var cardIndex of Array.from(this.drawPile)) {
      if ((cardIndex != null) && (this.getGameSession().getCardByIndex(cardIndex) != null)) {
        drawPile.push(cardIndex);
      }
    }
    return drawPile;
  }

  /**
   * Returns list of cards remaining in deck, i.e. cards that can still be drawn.
   * @returns {Array}
   */
  getCardsInDrawPile() {
    if (this._private.cachedCards == null) { this._private.cachedCards = this.getGameSession().getCardsByIndices(this.drawPile); }
    return this._private.cachedCards;
  }

  /**
   * Returns list of cards remaining in deck, i.e. cards that can still be drawn, excluding missing cards.
   * @returns {Array}
   */
  getCardsInDrawPileExcludingMissing() {
    if ((this._private.cachedCardsExcludingMissing == null)) {
      const cards = (this._private.cachedCardsExcludingMissing = []);
      for (var cardIndex of Array.from(this.drawPile)) {
        if (cardIndex != null) {
          var card = this.getGameSession().getCardByIndex(cardIndex);
          if (card != null) {
            cards.push(card);
          }
        }
      }
    }
    return this._private.cachedCardsExcludingMissing;
  }

  getNumCardsInDrawPile() {
    return this.drawPile.length;
  }

  flushCachedCards() {
    this._private.cachedCards = null;
    this._private.cachedCardsExcludingMissing = null;
    return __guard__(this.getOwner(), x => x.flushCachedEventReceivingCards());
  }

  /**
   * Returns list of card indices in hand.
   * NOTE: may contain null values for empty slots!
   * @returns {Array}
   */
  getHand() {
    return this.hand;
  }

  /**
   * Returns list of card indices in hand, excluding empty slots.
   * NOTE: does not retain hand index ordering!
   * @returns {Array}
   */
  getHandExcludingMissing() {
    const hand = [];
    for (var cardIndex of Array.from(this.hand)) {
      if (cardIndex != null) {
        hand.push(cardIndex);
      }
    }
    return hand;
  }

  /**
   * Returns list of cards in hand.
   * NOTE: may contain null values for empty slots!
   * @returns {Array}
   */
  getCardsInHand() {
    if (this._private.cachedCardsInHand == null) { this._private.cachedCardsInHand = this.getGameSession().getCardsByIndices(this.hand); }
    return this._private.cachedCardsInHand;
  }

  /**
   * Returns list of cards in hand, excluding empty slots or missing cards.
   * NOTE: does not retain hand index ordering!
   * @returns {Array}
   */
  getCardsInHandExcludingMissing() {
    if ((this._private.cachedCardsInHandExcludingMissing == null)) {
      const cards = (this._private.cachedCardsInHandExcludingMissing = []);
      for (var cardIndex of Array.from(this.hand)) {
        if (cardIndex != null) {
          var card = this.getGameSession().getCardByIndex(cardIndex);
          if (card != null) {
            cards.push(card);
          }
        }
      }
    }
    return this._private.cachedCardsInHandExcludingMissing;
  }

  flushCachedCardsInHand() {
    this._private.cachedCardsInHand = null;
    this._private.cachedCardsInHandExcludingMissing = null;
    return __guard__(this.getOwner(), x => x.flushCachedEventReceivingCards());
  }

  /**
   * Returns a card index at an index in hand.
   * NOTE: may contain null values for empty slots!
   * @returns {Number|String}
   */
  getCardIndexInHandAtIndex(i) {
    return this.hand[i];
  }

  /**
   * Returns a card at an index in hand.
   * NOTE: may contain null values for empty slots!
   * @returns {Card}
   */
  getCardInHandAtIndex(i) {
    return this.getGameSession().getCardByIndex(this.getCardIndexInHandAtIndex(i));
  }

  /**
   * Returns the index of the first empty slot in hand.
   * @returns {Number}
   */
  getFirstEmptySpaceInHand() {
    for (let i = 0, end = CONFIG.MAX_HAND_SIZE, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      if ((this.hand[i] == null)) { return i; }
    }
    return null; // if no emtpy space in hand, return null
  }

  /**
   * Returns the number of cards in hand.
   * @returns {Number}
   */
  getNumCardsInHand() {
    let numCards = 0;
    for (let i = 0, end = CONFIG.MAX_HAND_SIZE, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      if (this.hand[i] != null) { numCards++; }
    }
    return numCards;
  }

  // endregion GETTERS / SETTERS

  // region ACTIONS

  // actions that modify state
  actionDrawCard(optionalCardIndex=null){
    const action = this.getGameSession().createActionForType(DrawCardAction.type);
    action.setOwnerId(this.getOwnerId());
    if (optionalCardIndex) { // set when a specific card should be drawn
      action.setCardIndexFromDeck(optionalCardIndex);
    }
    return action;
  }

  actionsDrawCardsToRefillHand(){
    const actions = [];
    // return enough actions to refill hand
    for (let i = 0, end = CONFIG.MAX_HAND_SIZE, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      // only return an action at hand space if space is empty
      if ((this.hand[i] == null)) { actions.push(this.actionDrawCard()); }
    }
    return actions;
  }

  // returns a number of draw card actions needed for end turn card draw
  actionsDrawNewCards(){
    const actions = [];
    // number of card draw actions we need to create (default set by config value)
    let numRemainingActions = CONFIG.CARD_DRAW_PER_TURN;
    // check player modifiers that change number of cards drawn at end of turn
    let cardDrawChange = 0;
    for (var cardDrawModifier of Array.from(this.getOwner().getPlayerModifiersByClass(PlayerModifierCardDrawModifier))) {
      cardDrawChange += cardDrawModifier.getCardDrawChange();
    }
    numRemainingActions += cardDrawChange; // final number of actions to create after modifiers

    // first try to re-fill empty slots in action bar with cards
    for (let i = 0, end = CONFIG.MAX_HAND_SIZE, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      if (numRemainingActions === 0) { // stop producing draw card actions when per turn limit is reached
        break;
      }
      // only return an action at hand space if space is empty
      if ((this.hand[i] == null)) {
        actions.push(this.actionDrawCard());
        numRemainingActions--;
      }
    }

    // if action bar is already full but we haven't drawn enough cards yet
    // then burn cards from deck (draw and immediately discard without playing)
    while ((numRemainingActions > 0) && !this.getGameSession().getIsDeveloperMode()) {
      actions.push(this.actionDrawCard());
      numRemainingActions--;
    }

    return actions;
  }

  actionPutCardInDeck(cardDataOrIndex){
    const ownerId = this.getOwnerId();
    const action = new PutCardInDeckAction(this.getGameSession(), ownerId, cardDataOrIndex);
    action.setOwnerId(ownerId);
    return action;
  }

  // endregion ACTIONS

  // region ADD

  /**
   * Puts card index into the deck.
   * NOTE: use GameSession.applyCardToDeck instead of calling this directly.
   * @param {Number|String} cardIndex
   */
  putCardIndexIntoDeck(cardIndex) {
    if ((cardIndex != null) && !_.includes(this.drawPile, cardIndex)) {
      this.drawPile.push(cardIndex);
      return this.flushCachedCards();
    }
  }

  /**
   * Puts card index into the hand at the first open slot.
   * NOTE: use GameSession.applyCardToHand instead of calling this directly.
   * @param {Number|String} cardIndex
   */
  putCardIndexInHand(cardIndex) {
    let indexOfCardInHand = null;

    if (cardIndex != null) {
      // find first empty place in hand, and insert card there
      for (let i = 0, end = CONFIG.MAX_HAND_SIZE, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        if ((this.hand[i] == null)) {
          this.hand[i] = cardIndex;
          indexOfCardInHand = i;
          this.flushCachedCardsInHand();
          break;
        }
      }
    }

    return indexOfCardInHand;
  }

  /**
   * Puts card index into the hand at a specified index.
   * NOTE: use GameSession.applyCardToHand instead of calling this directly.
   * @param {Number|String} cardIndex
   * @param {Number} indexOfCard
   */
  putCardIndexInHandAtIndex(cardIndex, indexOfCard) {
    if ((cardIndex != null) && (indexOfCard != null)) {
      this.hand[indexOfCard] = cardIndex;
      return this.flushCachedCardsInHand();
    }
  }

  // endregion ADD

  // region REMOVE

  /**
   * Removes card index from the deck.
   * NOTE: use GameSession.removeCardByIndexFromDeck instead of calling this directly.
   * @param {Number|String} cardIndex
   */
  removeCardIndexFromDeck(cardIndex) {
    let indexOfCard = null;

    if (cardIndex != null) {
      // find card data by index match
      for (let i = 0; i < this.drawPile.length; i++) {
        var existingCardIndex = this.drawPile[i];
        if ((existingCardIndex != null) && (existingCardIndex === cardIndex)) {
          indexOfCard = i;
          this.drawPile.splice(i, 1);
          this.flushCachedCards();
          break;
        }
      }
    }

    return indexOfCard;
  }

  /**
   * Removes card index from the hand.
   * NOTE: use GameSession.removeCardByIndexFromHand instead of calling this directly.
   * @param {Number|String} cardIndex
   */
  removeCardIndexFromHand(cardIndex) {
    let indexOfCard = null;

    if (cardIndex != null) {
      // find card data by index match
      for (let i = 0; i < this.hand.length; i++) {
        var existingCardIndex = this.hand[i];
        if ((existingCardIndex != null) && (existingCardIndex === cardIndex)) {
          indexOfCard = i;
          this.hand[i] = null;
          this.flushCachedCardsInHand();
          break;
        }
      }
    }

    return indexOfCard;
  }

  // endregion REMOVE

  // region REPLACE

  setNumCardsReplacedThisTurn(numCardsReplacedThisTurn) {
    return this.numCardsReplacedThisTurn = numCardsReplacedThisTurn;
  }

  getNumCardsReplacedThisTurn() {
    return this.numCardsReplacedThisTurn;
  }

  getCanReplaceCardThisTurn() {
    if (this.getOwner().getPlayerModifiersByClass(PlayerModifierCannotReplace).length > 0) {
      return false;
    } else {
      let replacesAllowedThisTurn = CONFIG.MAX_REPLACE_PER_TURN;
      let replaceCardChange = 0;
      for (var replaceCardModifier of Array.from(this.getOwner().getPlayerModifiersByClass(PlayerModifierReplaceCardModifier))) {
        replaceCardChange += replaceCardModifier.getReplaceCardChange();
      }
      replacesAllowedThisTurn += replaceCardChange; // final number of cards allowed to be replaced
      return (this.numCardsReplacedThisTurn < replacesAllowedThisTurn) && (this.drawPile.length > 0);
    }
  }

  // endregion REPLACE

  // region SERIALIZATION

  deserialize(data) {
    UtilsJavascript.fastExtend(this, data);

    // ensure hand is correct length
    return this.hand.length = CONFIG.MAX_HAND_SIZE;
  }
}
Deck.initClass();

  // endregion SERIALIZATION

module.exports = Deck;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}