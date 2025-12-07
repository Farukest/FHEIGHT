/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SDKObject = require('./object');
const Logger =           require('app/common/logger');
const CONFIG =          require('app/common/config');
const EVENTS =          require('app/common/event_types');
const UtilsJavascript =          require('app/common/utils/utils_javascript');
const ActionStateRecord =          require('app/common/actionStateRecord');
const Deck =             require('./cards/deck');
const CardType =             require('./cards/cardType');
const EndFollowupAction =         require('./actions/endFollowupAction');
const PlayCardAction =         require('./actions/playCardAction');
const PlayCardFromHandAction =         require('./actions/playCardFromHandAction');
const PlaySignatureCardAction =         require('./actions/playSignatureCardAction');
const ResignAction =         require('./actions/resignAction');
const DrawStartingHandAction =   require('./actions/drawStartingHandAction');
const ReplaceCardFromHandAction =   require('./actions/replaceCardFromHandAction');
const GenerateSignatureCardAction = require('./actions/generateSignatureCardAction');
const ActivateSignatureCardAction = require('./actions/activateSignatureCardAction');
const PlayerModifier = require('./playerModifiers/playerModifier');
const PlayerModifierManaModifier = require('./playerModifiers/playerModifierManaModifier');
const PlayerModifierSignatureCardAlwaysReady = require('./playerModifiers/playerModifierSignatureCardAlwaysReady');
const _ = require('underscore');

class Player extends SDKObject {
  static initClass() {
  
    this.prototype.deck = null;
    this.prototype.hasResigned = false;
    this.prototype.hasStartingHand = false;
    this.prototype.isCurrentPlayer = false;
    this.prototype.isRanked = false;
    this.prototype.rank = null;
    this.prototype.isWinner = false;
    this.prototype.lastMaximumMana = null;
    this.prototype.lastActionTakenAt = null; // used by server to account for turn timer
    this.prototype.lastRemainingMana = null;
    this.prototype.maximumMana = null;
    this.prototype.playerId = null;
    this.prototype.remainingMana = null;
    this.prototype.signatureCardIndices = null;
    this.prototype.signatureCardActive = false; // signature card can only be cast when it is active
    this.prototype.startingMana = null;
    this.prototype.totalDamageDealt = 0;
    this.prototype.totalDamageDealtToGeneral = 0;
    this.prototype.totalMinionsKilled = 0;
    this.prototype.totalSpellsCast = 0;
    this.prototype.totalSpellsPlayedFromHand = 0;
    this.prototype.totalMinionsPlayedFromHand = 0;
    this.prototype.totalMinionsSpawned = 0;
    this.prototype.username = null;
  }

  constructor(gameSession,playerId,username) {
    super(gameSession);

    // define public properties here that must be always be serialized
    // do not define properties here that should only serialize if different from the default
    this.setPlayerId(playerId);
    this.setUsername(username);
    this.setStartingMana(0);
    this.signatureCardIndices = [];

    // initialize stats counters
    this.totalDamageDealt = 0;
    this.totalDamageDealtToGeneral = 0;
    this.totalMinionsKilled = 0;
    this.totalMinionsPlayedFromHand = 0;
    this.totalMinionsSpawned = 0;
    this.totalSpellsCast = 0;
    this.totalSpellsPlayedFromHand = 0;

    // initialize deck
    this.deck = new Deck(this.getGameSession(), this.getPlayerId());
  }




  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.eventReceivingCardsOnBoard = [];
    p.actionStateRecord = null;
    p.cachedEventReceivingCards = null;
    p.cachedReferenceSignatureCard = null;

    return p;
  }

  /**
   * Flushes all cached data.
   */
  flushAllCachedData() {
    this.flushAllCachedCards();
    return this.flushCachedEventReceivingCards();
  }

  /**
   * Flushes all cached cards.
   */
  flushAllCachedCards() {
    this.deck.flushCachedCardsInHand();
    return this.deck.flushCachedCards();
  }

  // region EVENTS

  /**
   * SDK event handler. Do not call this method manually.
   */
  onEvent(event) {
    const eventType = event.type;
    if ((eventType === EVENTS.terminate) || (eventType === EVENTS.before_deserialize)) {
      this._onTerminate(event);
    } else if (eventType === EVENTS.end_turn) {
      this._onEndTurn(event);
    } else if ((eventType === EVENTS.update_cache_action) || (eventType === EVENTS.update_cache_step)) {
      __guard__(this.getActionStateRecord(), x => x.onStateRecordingActionEvent(event));
    }

    // send to my cards
    const cards = this.getEventReceivingCards();
    return Array.from(cards).map((card) =>
      card.onEvent(event));
  }
      //if @getGameSession().getIsBufferingEvents() and event.isBufferable then break

  /**
   * Returns the event receiving cards for a player.
   */
  getEventReceivingCards() {
    // this has to be its own array so that it cannot be modified mid event loop
    if ((this._private.cachedEventReceivingCards == null)) {
      this._private.cachedEventReceivingCards = [].concat(
        this.getEventReceivingCardsOnBoard(),
        this.getDeck().getCardsInHandExcludingMissing(),
        this.getDeck().getCardsInDrawPileExcludingMissing()
      );

      const currentSignatureCard = this.getCurrentSignatureCard();
      if (currentSignatureCard != null) {
        this._private.cachedEventReceivingCards.push(currentSignatureCard);
      }
    }

    return this._private.cachedEventReceivingCards;
  }

  /**
   * Flushes the cached event receiving cards.
   */
  flushCachedEventReceivingCards() {
    return this._private.cachedEventReceivingCards = null;
  }

  addEventReceivingCardOnBoard(card) {
    const index = _.indexOf(this._private.eventReceivingCardsOnBoard, card);
    if (index === -1) {
      this._private.eventReceivingCardsOnBoard.push(card);
      return this.flushCachedEventReceivingCards();
    }
  }

  removeEventReceivingCardOnBoard(card) {
    const index = _.indexOf(this._private.eventReceivingCardsOnBoard, card);
    if (index !== -1) {
      this._private.eventReceivingCardsOnBoard.splice(index, 1);
      return this.flushCachedEventReceivingCards();
    }
  }

  moveEventReceivingCardToFront(card) {
    const index = _.indexOf(this._private.eventReceivingCardsOnBoard, card);
    if (index !== -1) {
      this._private.eventReceivingCardsOnBoard.splice(index, 1);
      return this._private.eventReceivingCardsOnBoard.unshift(card);
    }
  }

  getEventReceivingCardsOnBoard() {
    return this._private.eventReceivingCardsOnBoard;
  }

  // endregion EVENTS

  // region GETTERS / SETTERS

  getLogName() {
    return this.getUsername() + "[" + this.getPlayerId() + "]";
  }

  setUsername(val) {
    return this.username = val;
  }

  getUsername() {
    return this.username;
  }

  setPlayerId(val) {
    this.playerId = val + "";
    if (this.deck != null) { return this.deck.setOwnerId(this.getPlayerId()); }
  }

  getPlayerId() {
    return this.playerId + "";
  }

  setDeck(val) {
    this.deck = val;
    if (this.deck != null) { return this.deck.setOwnerId(this.getPlayerId()); }
  }

  getDeck() {
    return this.deck;
  }

  setLastActionTakenAt(val) {
    return this.lastActionTakenAt = val;
  }

  getLastActionTakenAt() {
    return this.lastActionTakenAt;
  }

  setIsCurrentPlayer(isCurrentPlayer) {
    return this.isCurrentPlayer = isCurrentPlayer;
  }

  getIsCurrentPlayer() {
    return this.isCurrentPlayer;
  }

  setIsRanked(val) {
    return this.isRanked = val;
  }

  getIsRanked() {
    return this.isRanked;
  }

  setRank(val){
    return this.rank = val;
  }

  setIsWinner(val) {
    return this.isWinner = val;
  }

  getIsWinner() {
    return this.isWinner;
  }

  setHasStartingHand(hasStartingHand) {
    return this.hasStartingHand = hasStartingHand;
  }

  getHasStartingHand() {
    return this.hasStartingHand;
  }

  ownsCard(card) {
    return this.getPlayerId() === card.getOwnerId();
  }

  getStartingMana() {
    return this.startingMana;
  }

  setStartingMana(val) {
    return this.startingMana = (this.remainingMana = (this.maximumMana = (this.lastRemainingMana = (this.lastMaximumMana = val))));
  }

  getRemainingMana() {
    let mana = this.remainingMana;
    const iterable = this.getActivePlayerModifiersByClass(PlayerModifierManaModifier);
    for (let i = iterable.length - 1; i >= 0; i--) {
      var manaModifier = iterable[i];
      mana += manaModifier.bonusMana;
    }

    return Math.max(0, mana);
  }

  getBaseRemainingMana() {
    return this.remainingMana;
  }

  getLastRemainingMana() {
    return this.lastRemainingMana;
  }

  getMaximumMana() {
    let mana = this.maximumMana;
    const iterable = this.getActivePlayerModifiersByClass(PlayerModifierManaModifier);
    for (let i = iterable.length - 1; i >= 0; i--) {
      var manaModifier = iterable[i];
      mana += manaModifier.bonusMana;
    }

    // player can never have more than MAX_MANA cores
    if (mana > CONFIG.MAX_MANA) {
      mana = CONFIG.MAX_MANA;
    }

    return Math.max(0, mana);
  }

  getBaseMaximumMana() {
    return this.maximumMana;
  }

  getLastMaximumMana() {
    return this.lastMaximumMana;
  }

  getPlayerModifiers() {
    const playerModifiers = [];
    const general = this.getGameSession().getGeneralForPlayerId(this.playerId);
    const modifiers = general != null ? general.getModifiers() : undefined;
    if (modifiers != null) {
      for (var modifier of Array.from(modifiers)) {
        if (modifier instanceof PlayerModifier) {
          playerModifiers.push(modifier);
        }
      }
    }
    return playerModifiers;
  }

  getActivePlayerModifiers() {
    const playerModifiers = [];
    const general = this.getGameSession().getGeneralForPlayerId(this.playerId);
    const modifiers = general != null ? general.getModifiers() : undefined;
    if (modifiers != null) {
      for (var modifier of Array.from(modifiers)) {
        if (modifier instanceof PlayerModifier && modifier.getIsActive()) {
          playerModifiers.push(modifier);
        }
      }
    }
    return playerModifiers;
  }

  getPlayerModifiersByType(type) {
    const modifiers = [];
    for (var m of Array.from(this.getPlayerModifiers())) {
      if (m.getType() === type) { modifiers.push(m); }
    }
    return modifiers;
  }

  getActivePlayerModifiersByType(type) {
    const modifiers = [];
    for (var m of Array.from(this.getPlayerModifiers())) {
      if ((m.getType() === type) && m.getIsActive()) { modifiers.push(m); }
    }
    return modifiers;
  }

  getPlayerModifiersByClass(cls) {
    const modifiers = [];
    for (var m of Array.from(this.getPlayerModifiers())) {
      if (m instanceof cls) { modifiers.push(m); }
    }
    return modifiers;
  }

  getActivePlayerModifiersByClass(cls) {
    const modifiers = [];
    for (var m of Array.from(this.getPlayerModifiers())) {
      if (m instanceof cls && m.getIsActive()) { modifiers.push(m); }
    }
    return modifiers;
  }

  // endregion GETTERS / SETTERS

  // region SIGNATURE CARD

  /**
   * Get card data for signature from the player's General.
   * @returns {Object}
   */
  getSignatureCardData() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getPlayerId());
    return (general != null ? general.getSignatureCardData() : undefined);
  }

  /**
   * Get reference card for signature from the player's General.
   * NOTE: this card is never used in game and is only for reference!
   * @returns {Card}
   */
  getReferenceSignatureCard() {
    if ((this._private.cachedReferenceSignatureCard == null)) {
      this._private.cachedReferenceSignatureCard = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(this.getSignatureCardData());
      if (this._private.cachedReferenceSignatureCard != null) {
        this._private.cachedReferenceSignatureCard.setOwnerId(this.getPlayerId());
      }
    }
    return this._private.cachedReferenceSignatureCard;
  }

  getIsSignatureCardActive() {
    return this.signatureCardActive || this.getIsSignatureCardAlwaysReady();
  }

  setIsSignatureCardActive(isActive) {
    return this.signatureCardActive = isActive;
  }

  /**
   * Flushes the cached reference card for signature so that the next call will regenerate the card.
   */
  flushCachedReferenceSignatureCard() {
    return this._private.cachedReferenceSignatureCard = null;
  }

  /**
   * Add signature card to list of current signature cards.
   * @param {Card}
   */
  addSignatureCard(card) {
    const cardIndex = card.getIndex();
    if ((cardIndex == null)) {
      Logger.module("SDK").error(this.getGameSession().gameId, `Player.addSignatureCard ${card.getName()} must be added through game session and not directly to player!`);
    }

    // store card index
    if (_.indexOf(this.signatureCardIndices, cardIndex) === -1) {
      this.signatureCardIndices.push(cardIndex);
    }

    // flush reference card as needed
    const currentSignatureCard = this.getCurrentSignatureCard();
    const referenceSignatureCard = this.getReferenceSignatureCard();
    if ((currentSignatureCard != null) && (referenceSignatureCard != null) && (currentSignatureCard.getId() !== referenceSignatureCard.getId())) {
      return this.flushCachedReferenceSignatureCard();
    }
  }

  /**
   * Remove a signature card from the list of current signature cards.
   * @param {Card}
   * @returns {Number|null} index of card in list if removed, otherwise null
   */
  removeSignatureCard(card) {
    const cardIndex = card.getIndex();
    if ((cardIndex == null)) {
      Logger.module("SDK").error(this.getGameSession().gameId, `Player.removeSignatureCard ${card.getName()} must be removed through game session and not directly to player!`);
    }

    // store card index
    const index = _.indexOf(this.signatureCardIndices, cardIndex);
    if (index >= 0) {
      this.signatureCardIndices.splice(index, 1);
    }

    return index;
  }

  /**
   * Get indices of signature cards, if any exist.
   * @returns {Array}
   */
  getSignatureCardIndices() {
    return this.signatureCardIndices;
  }

  /**
   * Get current signature cards, if any exist.
   * @returns {Card|null}
   */
  getSignatureCards() {
    return this.getGameSession().getCardsByIndices(this.getSignatureCardIndices());
  }

  /**
   * Get index of current signature card, if any exists.
   * @returns {Number|null}
   */
  getCurrentSignatureCardIndex() {
    return this.signatureCardIndices[0];
  }

  /**
   * Get current signature card, if any exists.
   * @returns {Card|null}
   */
  getCurrentSignatureCard() {
    return this.getGameSession().getCardByIndex(this.getCurrentSignatureCardIndex());
  }

  /**
   * Determine if player's Signature Card should be ready every turn, regardless of current "timer"
   * @returns {Boolean}
   */
  getIsSignatureCardAlwaysReady() {
    return this.getGameSession().getIsSignatureCardAlwaysReady() || this.getGameSession().getGeneralForPlayerId(this.getPlayerId()).hasModifierClass(PlayerModifierSignatureCardAlwaysReady);
  }

  // end region SIGNATURE CARD

  // region ACTIONS

  actionDrawStartingHand(mulliganIndices) {
    const drawStartingHandAction = new DrawStartingHandAction(this.getGameSession(),this.getPlayerId(),mulliganIndices);
    return drawStartingHandAction;
  }

  actionPlayCardFromHand(indexOfCardInHand,tileX,tileY) {
    const playCardAction = new PlayCardFromHandAction(this.getGameSession(), this.getPlayerId(), tileX, tileY, indexOfCardInHand);
    return playCardAction;
  }

  actionPlaySignatureCard(tileX,tileY) {
    const signatureCard = this.getCurrentSignatureCard();
    if (signatureCard != null) {
      const playCardAction = new PlaySignatureCardAction(this.getGameSession(), this.getPlayerId(), tileX, tileY, signatureCard.getIndex());
      return playCardAction;
    }
  }

  actionPlayFollowup(followupCard, tileX, tileY) {
    const playCardAction = new PlayCardAction(this.getGameSession(), this.getPlayerId(), tileX, tileY, followupCard.createNewCardData());
    playCardAction.setSource(followupCard.getParentCard());
    playCardAction.setSourcePosition(followupCard.getFollowupSourcePosition());
    return playCardAction;
  }

  actionEndFollowup() {
    const endFollowupAction = new EndFollowupAction(this.getGameSession(), this.getPlayerId());
    return endFollowupAction;
  }

  actionReplaceCardFromHand(indexOfCardInHand) {
    const replaceCardAction = new ReplaceCardFromHandAction(this.getGameSession(), this.getPlayerId(), indexOfCardInHand);
    return replaceCardAction;
  }

  actionGenerateSignatureCard() {
    const signatureCardData = this.getSignatureCardData();
    if (signatureCardData != null) {
      const generateSignatureCardAction = new GenerateSignatureCardAction(this.getGameSession(), this.getPlayerId(), signatureCardData);
      return generateSignatureCardAction;
    }
  }

  actionActivateSignatureCard() {
    const signatureCardData = this.getSignatureCardData();
    if (signatureCardData != null) {
      const activateSignatureCardAction = new ActivateSignatureCardAction(this.getGameSession(), this.getPlayerId());
      return activateSignatureCardAction;
    }
  }

  actionResign() {
    const resignAction = new ResignAction(this.getGameSession());
    resignAction.setOwnerId(this.getPlayerId());
    const general = this.getGameSession().getGeneralForPlayerId(this.getPlayerId());
    resignAction.setSource(general);
    resignAction.setTarget(general);
    return resignAction;
  }

  // endregion ACTIONS

  // region ACTION STATE RECORD

  /**
   * Syncs this player to the latest game state.
   */
  syncState() {
    return __guard__(this.getActionStateRecord(), x => x.recordStateAtLastActionRecorded());
  }

  getActionStateRecord() {
    if ((this._private.actionStateRecord == null) && this.getGameSession().getIsRunningOnClient()) {
      this._private.actionStateRecord = new ActionStateRecord();
      this.startActionStateRecord();
    }
    return this._private.actionStateRecord;
  }

  startActionStateRecord() {
    const actionStateRecord = this.getActionStateRecord();
    if (actionStateRecord != null) {
      // get properties to record
      const propertiesToRecord = this.propertiesForActionStateRecord();
      if ((propertiesToRecord != null) && (Object.keys(propertiesToRecord).length > 0)) {
        // start recording if at least 1 property
        actionStateRecord.setupToRecordStateOnEvent(EVENTS.update_cache_action, propertiesToRecord);
        return actionStateRecord.setupToRecordStateOnEvent(EVENTS.update_cache_step, propertiesToRecord);
      }
    }
  }

  terminateActionStateRecord() {
    return __guard__(this.getActionStateRecord(), x => x.teardownRecordingStateOnAllEvents());
  }

  propertiesForActionStateRecord() {
    // return map of property names to functions
    // where each function returns a value for the property name
    return {
      numCards: () => { return this.getDeck().getNumCardsInDrawPile();  },
      numCardsInHand: () => { return this.getDeck().getNumCardsInHand();  },
      remainingMana: () => { return this.getRemainingMana();  },
      maximumMana: () => { return this.getMaximumMana();  }
    };
  }

  // endregion ACTION STATE RECORD

  // region EVENTS

  _onTerminate() {
    // this method is automatically called when this object will never be used again
    return this.terminateActionStateRecord();
  }

  _onEndTurn() {
    if (this.getIsCurrentPlayer()) {
      // reset replace counter
      return this.deck.setNumCardsReplacedThisTurn(0);
    }
  }

  // endregion EVENTS

  // region SERIALIZATION

  deserialize(data) {
    // Write the deserialized data
    UtilsJavascript.fastExtend(this,data);

    // deserialize deck
    this.deck = new Deck(this.getGameSession(), this.getPlayerId());
    return this.deck.deserialize(data.deck);
  }

  postDeserialize() {
    // flush all cached data
    return this.flushAllCachedData();
  }
}
Player.initClass();

  // endregion SERIALIZATION

module.exports = Player;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}