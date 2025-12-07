/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SDKObject = require('app/sdk/object');
const Logger = require('app/common/logger');
const CONFIG = require('app/common/config');
const EVENTS = require('app/common/event_types');
const ActionStateRecord = require('app/common/actionStateRecord');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const UtilsJavascript = require('app/common/utils/utils_javascript');

const Cards = require('./cardsLookupComplete');
const CardType = require('./cardType');
const CardLocation = require('./cardLocation');
const CardSet = require('./cardSetLookup');
const CardSetFactory = require('./cardSetFactory');

const FactionFactory = require('./factionFactory');
const Factions = require('./factionsLookup');
const Races = require('./racesLookup');
const Rarity = require('./rarityLookup');

const RemoveAction = require('app/sdk/actions/removeAction');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

const Modifier =       require('app/sdk/modifiers/modifier');
const ModifierSilence =   require('app/sdk/modifiers/modifierSilence');
const ModifierBelongsToAllRaces = require('app/sdk/modifiers/modifierBelongsToAllRaces');
const ModifierFate = require('app/sdk/modifiers/modifierFate');
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');
const Stringifiers = require('app/sdk/helpers/stringifiers');

const i18next = require('i18next');

const _ = require('underscore');
const moment = require('moment');

class Card extends SDKObject {
  static initClass() {
  
    this.prototype.type = CardType.Card; // this should always remain the same for major card types (i.e. don't change this per unit/spell/etc)
    this.type = CardType.Card; // this should always remain the same for major card types (i.e. don't change this per unit/spell/etc)
    this.prototype.name = "Card"; // this should be unique to each individual type of unit/spell/etc
  
    this.prototype.appliedToDeckByActionIndex = -1; // unique index of action that applied this card to the deck, where -1 is during game setup
    this.prototype.appliedToHandByActionIndex = -1; // unique index of action that applied this card to the hand, where -1 is during game setup
    this.prototype.appliedToBoardByActionIndex = -1; // unique index of action that applied this card to the board, where -1 is during game setup
    this.prototype.appliedToSignatureCardsByActionIndex = -1; // unique index of action that applied this card to the signature cards, where -1 is during game setup
    this.prototype.canBeAppliedAnywhere = false; // whether card can be applied anywhere on board when played
    this.prototype.factionId = Factions.Neutral;
    this.prototype.hideAsCardId = null; // card id of the card this card should be hidden as during scrubbing
    this.prototype.id = null; // this should be unique to each individual type of unit/spell/etc
    this.prototype.index = null; // unique index of this card, set automatically by game session
    this.prototype.isPlayed = false; // whether card has been played
    this.prototype.isRemoved = false; // whether card has been removed (not the same as location, as a card can be removed but still located on board until fully cleaned up)
    this.prototype.location = CardLocation.Void; // where card is located: deck, hand, board, or void
    this.prototype.manaCost = 0;
    this.prototype.modifierIndices = null;
    this.prototype.modifiersAppliedFromContextObjects = false; // whether modifiers have been applied from modifiers context objects
    this.prototype.modifiersContextObjects = null; // array of context objects describing the inherent modifiers of this card
    this.prototype.ownerId = null; // set to player id that owns card, when null the card is owned by the game session
    this.prototype.parentCardIndex =null; // index of card that caused this card to be played, null if played by player
    this.prototype.position = null; // position of the card on the board
    this.prototype.raceId = Races.Neutral;
    this.prototype.rarityId = Rarity.Fixed;
    this.prototype.removedFromDeckByActionIndex = -1; // unique index of action that removed this card from deck, where -1 is during game setup
    this.prototype.removedFromHandByActionIndex = -1; // unique index of action that removed this card from hand, where -1 is during game setup
    this.prototype.removedFromBoardByActionIndex = -1; // unique index of action that removed this card from the board, where -1 is during game setup
    this.prototype.removedFromSignatureCardsByActionIndex = -1; // unique index of action that removed this card from signature cards, where -1 is during game setup
    this.prototype.subCardIndices = null;
  
    this.prototype.isNotOwnedByPlayer = this.prototype.isOwnedByGameSession;
  
    this.prototype.getDoesOwnerHaveEnoughManaToAct = this.prototype.getDoesOwnerHaveEnoughManaToPlay;
  
    // for now cleanse/dispel is just an alias for silence
    this.prototype.cleanse = this.prototype.silence;
    this.prototype.dispel = this.prototype.silence;
     // indices of cards that were played by this card
  }

  constructor(gameSession) {
    super(gameSession);

    // define public properties here that must be always be serialized
    // do not define properties here that should only serialize if different from the default
    this.modifierIndices = [];
    this.modifiersContextObjects = [];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    // card set
    p.cardSetId = CardSet.Core;

    // makes reference to another card
    p.referencedCardData = null;

    // action state record
    p.actionStateRecord = null;
    p.actionStateRecordNeedsSetup = true;

    // cache
    p.cachedBaseAttributes = {};
    p.cachedBuffedAttributes = {};
    p.cachedBuffedAttributesWithoutAuras = {};
    p.cachedContextObjectForModifierClass = {};
    p.cachedDescription = null;
    p.cachedDescriptionOptions = null;
    p.cachedKeywordClasses = null;
    p.cachedKeywordClassesFromContextObjects = null; // array of keywords of modifiers applied by modifiers context objects
    p.cachedIsAreaOfEffectOnBoard = {};
    p.cachedIsSilenced = null;
    p.cachedIsValidTargetPosition = {};
    p.cachedModifierByClass = {};
    p.cachedModifiersByClass = {};
    p.cachedModifiersByStackType = {};
    p.cachedVisibleModifierStacks = null;
    p.cachedValidTargetPositions = null;

    // followups
    p.followupCard = null; // current followup
    p.followupConditions = null; // array of validation methods that return a single truthy or falsy value, used to determine whether a followup is allowed
    p.followupSourcePosition = null; // source position when this card is a followup
    p.followupSourcePattern = null; // overrides the pattern of a spawn/spell source modifier, to allow for followups with custom playable patterns
    p.followups = []; // options for actions, in order of execution, that are allowed to followup
    p.followupName = null;
    p.followupDescription = null;

    // resources and options for external systems
    p.animResource = null; // currently active animation resource
    p.announcerFirstResource = null; // sound resource for announcing this card first
    p.announcerSecondResource = null; // sound resource for announcing this card second
    p.baseAnimResource = null; // original animation map
    p.baseSoundResource = null; // original sound resources
    p.cardOptions = {}; // options for sprite display in card node, i.e. when is showing in hand
    p.conceptResource = null; // optional resource object to use when this card is shown as concept art
    p.description = null; // Used for manually entered descriptions
    p.fxResource = []; // array of strings that map to fx data, ex: ["Cards.Spells.GenericSpell"]
    p.mergedFXResource = null; // base fx resource merged with faction fx resource
    p.nodeOptions = {}; // options for node display on game board ex: layerName, z order, auto z order
    p.portraitResource = null; // optional resource to show when this card is shown in a portrait
    p.portraitHexResource = null; // optional image to show when this card is shown in a portrait
    p.soundResource = null; // paths to various sounds
    p.speechResource = null; // optional resource to show when this card is talking
    p.spriteOptions = {}; // options for sprite display in game board node ex: occludes or castsShadows

    // misc
    p.availableAt = 0; // timestamp for when a card becomes available, where 0 is always available and -1 is never available
    p.affectPattern = null; // where card affects board if not directly where it is played, relative to where it is played
    p.bossBattleDescription = null;
    p.bossBattleBattleMapIndex = null;
    p.isUnlockableBasic = false;
    p.isLegacy = false;
    p.isUnlockableWithAchievement = false;
    p.isHiddenInCollection = false;
    p.keywordClassesToInclude = []; // manually added keywords this card will need to define
    p.lastManaCost = this.manaCost;
    p.listeningToEvents = false;
    p.modifiers = null;
    p.targetsSpace = false; // some cards need to target a space, rather than an card on the space
    p.waitingForTerminate = false;

    // gauntlet card choice modifiers
    p.modifiedGauntletRarities = null;
    p.modifiedGauntletFactions = null;
    p.modifiedGauntletCardTypes = null;
    p.modifiedGauntletOwnFactionFilter = false;

    return p;
  }

  // region EVENTS

  /**
   * SDK event handler. Do not call this method manually.
   */
  onEvent(event) {
    if (this._private.listeningToEvents) {
      const eventType = event.type;
      if ((eventType === EVENTS.terminate) || (eventType === EVENTS.before_deserialize)) {
        this._onTerminate(event);
      } else if (eventType === EVENTS.cleanup_action) {
        this._onCleanupAction(event);
      } else if (eventType === EVENTS.update_cache_action) {
        this._onUpdateCacheAction(event);
      } else if (eventType === EVENTS.update_cache_step) {
        this._onUpdateCacheStep(event);
      }

      // send to modifiers
      return Array.from(this.getModifiers()).map((modifier) =>
        modifier.onEvent(event));
    }
  }
        //if @getGameSession().getIsBufferingEvents() and event.isBufferable then break

  // endregion EVENTS

  // region LOCATIONS

  onApplyToDeck(deck, sourceAction) {
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Card.onApplyToDeck -> #{@getLogName()}")
    this._stopWaitingForTerminate();
    this.setAppliedToDeckByAction(sourceAction);
    this.setIsRemoved(false);
    this.setLocation(CardLocation.Deck);
    this.onApplyModifiersForApplyToNewLocation();
    this.updateCachedState();
    return this.startListeningToEvents();
  }

  onRemoveFromDeck(deck, sourceAction) {
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Card.onRemoveFromDeck -> #{@getLogName()}")
    this.setRemovedFromDeckByAction(sourceAction);
    this.setIsRemoved(true);
    this.updateCachedState();
    // terminate immediately when card was not removed by an action
    if (this.getRemovedFromDeckByActionIndex() === -1) { return this._onTerminate(); } else { return this._startWaitingForTerminate(); }
  }

  onApplyToHand(deck, sourceAction) {
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Card.onApplyToHand -> #{@getLogName()}")
    this._stopWaitingForTerminate();
    this.setAppliedToHandByAction(sourceAction);
    this.setIsRemoved(false);
    this.setLocation(CardLocation.Hand);
    this.onApplyModifiersForApplyToNewLocation();
    this.updateCachedState();
    return this.startListeningToEvents();
  }

  onRemoveFromHand(deck, sourceAction) {
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Card.onRemoveFromHand -> #{@getLogName()}")
    this.setRemovedFromHandByAction(sourceAction);
    this.setIsRemoved(true);
    this.updateCachedState();
    // terminate immediately when card was not removed by an action
    if (this.getRemovedFromHandByActionIndex() === -1) { return this._onTerminate(); } else { return this._startWaitingForTerminate(); }
  }

  onApplyToSignatureCards(sourceAction) {
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Card.onApplyToSignatureCards -> #{@getLogName()}")
    this._stopWaitingForTerminate();
    this.setAppliedToSignatureCardsByAction(sourceAction);
    this.setIsRemoved(false);
    this.setLocation(CardLocation.SignatureCards);
    this.onApplyModifiersForApplyToNewLocation();
    this.updateCachedState();
    return this.startListeningToEvents();
  }

  onRemoveFromSignatureCards(sourceAction) {
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Card.onRemoveFromSignatureCards -> #{@getLogName()}")
    this.setRemovedFromSignatureCardsByAction(sourceAction);
    this.setIsRemoved(true);
    this.updateCachedState();
    // terminate immediately when card was not removed by an action
    if (this.getRemovedFromSignatureCardsByActionIndex() === -1) { return this._onTerminate(); } else { return this._startWaitingForTerminate(); }
  }

  onApplyToBoard(board, x, y, sourceAction) {
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Card.onApplyToBoard -> #{@getLogName()} at (#{x},#{y})")
    this._stopWaitingForTerminate();
    this.setIsRemoved(false);
    this.setLocation(CardLocation.Board);
    this.setPosition({x, y});
    this.setIsPlayed(true);
    this.onApplyModifiersForApplyToNewLocation();
    this.updateCachedState();
    this.getOwner().addEventReceivingCardOnBoard(this);
    return this.startListeningToEvents();
  }

  onRemoveFromBoard(board, x, y, sourceAction) {
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Card.onRemoveFromBoard -> #{@getLogName()} at (#{x},#{y})")
    this.setRemovedFromBoardByAction(sourceAction);
    this.setIsRemoved(true);
    this.updateCachedState();
    // terminate immediately when card was not removed by an action
    if (this.getRemovedFromBoardByActionIndex() === -1) { return this._onTerminate(); } else { return this._startWaitingForTerminate(); }
  }

  // endregion LOCATIONS

  // region TERMINATE

  _startWaitingForTerminate() {
    // wait until the cleanup phase to terminate this card
    // so it can continue to react until the cleanup phase as needed
    return this._private.waitingForTerminate = true;
  }

  _stopWaitingForTerminate() {
    return this._private.waitingForTerminate = false;
  }

  _onCleanupAction(event) {
    if (this._private.waitingForTerminate) {
      let removedByActionIndex;
      const {
        action
      } = event;
      const actionIndex = action.getIndex();

      if (this.getIsPlayed()) {
        removedByActionIndex = this.getRemovedFromBoardByActionIndex();
      } else {
        removedByActionIndex = Math.max(this.getRemovedFromDeckByActionIndex(), this.getRemovedFromHandByActionIndex());
      }

      if (actionIndex >= removedByActionIndex) {
        return this._onTerminate();
      }
    }
  }

  _onTerminate() {
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Card._onTerminate -> #{@getLogName()} / in deck? #{@getIsLocatedInDeck()} / in hand? #{@getIsLocatedInHand()} / on board? #{@getIsPlayed()} / removed? #{@getIsRemoved()}")
    // this method is automatically called when this object will never be used again
    this._stopWaitingForTerminate();

    // ensure flagged as removed
    this.setIsRemoved(true);

    // move to void
    this.setLocation(CardLocation.Void);

    // stop sending events to this card
    this.getOwner().removeEventReceivingCardOnBoard(this);

    // destroy event stream
    this.stopListeningToEvents();
    this.terminateActionStateRecord();

    // remove all modifiers
    const iterable = this.getModifiers();
    for (let i = iterable.length - 1; i >= 0; i--) {
      var modifier = iterable[i];
      this.getGameSession().removeModifier(modifier);
    }
    return this.modifierIndices = [];
  }

  // endregion TERMINATE

  // region CACHE

  /**
   * Syncs this card to the latest game state.
   */
  syncState() {
    this.updateCachedState();
    this.flushCachedAttributes();
    this.setupActionStateRecord();
    return __guard__(this.getActionStateRecord(), x => x.recordStateAtLastActionRecorded());
  }

  /**
   * Updates all values that should be cached between update cache events.
   */
  updateCachedState() {
    // flush/update all values that should be cached when requested
    this._private.animResource = null;
    this._private.soundResource = null;
    return this.flushCachedValidTargetPositions();
  }

  _onUpdateCacheAction(event) {
    return this.updateCachedState();
  }

  _onUpdateCacheStep(event) {
    return this.updateCachedState();
  }

  /**
   * Flushes all cached data for this card.
  */
  flushAllCachedData() {
    this.flushCachedDescription();
    this.flushCachedKeywordClasses();
    this.flushCachedAttributes();
    return this.flushCachedModifiers();
  }

  /**
   * Flushes the cached modifiers so that the next call to get modifiers will regenerate list.
  */
  flushCachedModifiers() {
    this._private.modifiers = null;
    this._private.cachedIsSilenced = null;
    this._private.cachedModifierByClass = {};
    this._private.cachedModifiersByClass = {};
    this._private.cachedModifiersByStackType = {};
    return this.flushCachedVisibleModifierStacks();
  }

  /**
   * Flushes the cached list of visible modifier stacks.
  */
  flushCachedVisibleModifierStacks() {
    return this._private.cachedVisibleModifierStacks = null;
  }

  /**
   * Flushes the cached attribute values so that the next call to get attributes will regenerate values.
  */
  flushCachedAttributes() {
    this._private.cachedBuffedAttributes = {};
    this._private.cachedBuffedAttributesWithoutAuras = {};
    return this._private.cachedBaseAttributes = {};
  }

  /**
   * Flushes a cached attribute value by buff key so that the next call to get attribute will regenerate value.
  */
  flushCachedAttribute(buffKey) {
    delete this._private.cachedBuffedAttributes[buffKey];
    delete this._private.cachedBuffedAttributesWithoutAuras[buffKey];
    return delete this._private.cachedBaseAttributes[buffKey];
  }

  /**
   * Flushes the cached description so that the next call to get description will regenerate description.
  */
  flushCachedDescription() {
    return this._private.cachedDescription = null;
  }

  /**
   * Flushes the cached keywords so that the next call to get keyword classes will regenerate keywords.
  */
  flushCachedKeywordClasses() {
    return this._private.cachedKeywordClasses = null;
  }

  // endregion CACHE

  /* PROPERTIES */

  setIndex(index) {
    if ((this.index != null) && (this.index !== index)) {
      Logger.module("SDK").error(`[G:${this.getGameSession().getGameId()}] Card ${this.getLogName()} attempting to set index ${index} when has ${this.index}`);
    }

    return this.index = index;
  }

  getIndex() {
    return this.index;
  }

  /**
   * Creates new card data of an existing card.
   * @returns {Object} cardData
  */
  createNewCardData() {
    const cardData = {};

    // make sure that following properties don't get serialized
    Object.defineProperty(cardData, '_hasBeenApplied', {
      enumerable: false,
      writable: true
    });

    cardData.id = this.id;

    // clone all additional inherent modifiers to ensure correct modifiers for card created from data
    // normally, inherent modifiers are added to a card when created via the card factory
    // however, additional inherent modifiers are added dynamically at runtime, so we need to do this to preserve them
    // NOTE: this will not and should not copy non-inherent modifiers (ex external buffs)
    const additionalInherentModifiersContextObjects = [];
    for (var modifier of Array.from(this.getModifiers())) {
      if ((modifier != null) && modifier.getIsAdditionalInherent() && modifier.getIsCloneable()) {
        additionalInherentModifiersContextObjects.push(modifier.createContextObjectForClone());
      }
    }
    if (additionalInherentModifiersContextObjects.length > 0) {
      cardData.additionalInherentModifiersContextObjects = additionalInherentModifiersContextObjects;
    }

    return cardData;
  }

  /**
   * Returns a list of keys of properties that should be copied from this card when creating a card data object to copy this card.
   * @returns {Array} keys
  */
  getCardDataKeysForCopy() {
    return [
      "index",
      "ownerId",
      "parentCardIndex",
      "location",
      "position",
      "appliedToDeckByActionIndex",
      "appliedToHandByActionIndex",
      "appliedToBoardByActionIndex",
      "appliedToSignatureCardsByActionIndex",
      "removedFromDeckByActionIndex",
      "removedFromHandByActionIndex",
      "removedFromBoardByActionIndex",
      "removedFromSignatureCardsByActionIndex",
      "subCardIndices"
    ];
  }

  /**
   * Creates card data from this card to exactly replicate/index this card, optionally from existing card data.
   * @param {Object} existingCardData
   * @returns {Object} cardData
  */
  createCardData(existingCardData) {

    const cardData = this.createNewCardData();

    if ((existingCardData != null) && _.isObject(existingCardData)) {
      UtilsJavascript.fastExtend(cardData, existingCardData);
    }

    // copy properties from card
    for (var key of Array.from(this.getCardDataKeysForCopy())) {
      // only set certain properties on card data if they differ from the prototype, i.e. they are not DEFAULTS
      // this is done by checking if this object has it's won property (different than prototype) or is using the prototype
      if (this.hasOwnProperty(key)) {
        var val = this[key];
        if (_.isArray(val)) {
          cardData[key] = val.slice(0);
        } else if (_.isObject(val)) {
          cardData[key] = UtilsJavascript.fastExtend({}, val);
        } else {
          cardData[key] = val;
        }
      }
    }

    // record modifiers applied to card
    const modifiers = this.getModifiers();
    if ((modifiers != null) && (modifiers.length > 0)) {
      cardData.modifierIndices = this.modifierIndices.slice(0);
      cardData.appliedModifiersContextObjects = [];
      for (var modifier of Array.from(modifiers)) {
        if (modifier != null) {
          cardData.appliedModifiersContextObjects.push(modifier.createContextObject());
        }
      }
    }

    return cardData;
  }

  /**
   * Creates card data to replicate card in the case that this game session needs to be re-setup.
   * @returns {Object} cardData
  */
  createGameSetupCardData() {
    const cardData = this.createCardData();

    this.updateCardDataPostApply(cardData);
    cardData.position = this.getPosition();

    return cardData;
  }

  /**
   * Creates card data to snapshot card for cloning or transform reversion.
   * @returns {Object} cardData
  */
  createCloneCardData() {
    const cardData = this.createNewCardData();

    cardData.modifiersContextObjects = [];
    for (var modifier of Array.from(this.getModifiers())) {
      if ((modifier != null) && !modifier.getIsAdditionalInherent() && modifier.getIsCloneable()) {
        cardData.modifiersContextObjects.push(modifier.createContextObjectForClone());
      }
    }

    return cardData;
  }

  /**
   * Updates card data from this card after being applied to deck/hand/board.
   * @param {Object} cardData
   * @returns {Object} cardData
  */
  updateCardDataPostApply(cardData) {
    if (cardData != null) {
      cardData.index = this.index;
      cardData.id = this.id;
    }

    return cardData;
  }

  /**
   * Copies card data into this card.
   * @param {Object} cardData
  */
  applyCardData(cardData) {
    if ((cardData != null) && _.isObject(cardData)) {
      // for redundancy sake, make sure that following properties don't get serialized
      Object.defineProperty(cardData, '_hasBeenApplied', {
        enumerable: false,
        writable: true
      });

      if (!cardData._hasBeenApplied) {
        // copy properties into card
        let contextObject;
        const keys = Object.keys(cardData);
        for (var key of Array.from(keys)) {
          var property = cardData[key];
          // only overwrite attributes on this object from cardData when the value is different than what's already there
          // this is important so that we don't define an 'own' property that gets serialized when it is same as proto val
          if (this[key] !== property) {
            // shallow copy so we don't modify anything in the cardData unintentionally
            if (_.isArray(property)) {
              this[key] = property.slice(0);
            } else if (_.isObject(property)) {
              this[key] = UtilsJavascript.fastExtend({}, property);
            } else {
              this[key] = property;
            }
          }
        }

        // flag data as having been applied so we never apply more than once
        cardData._hasBeenApplied = true;

        // delete properties that shouldn't be retained on this card
        delete this.appliedModifiersContextObjects;
        delete this.additionalModifiersContextObjects;
        delete this.additionalInherentModifiersContextObjects;

        if (!this.modifiersAppliedFromContextObjects) {
          if (cardData.additionalInherentModifiersContextObjects != null) {
            // merge all additional inherent modifier context objects
            for (contextObject of Array.from(cardData.additionalInherentModifiersContextObjects)) {
              if ((contextObject.index == null)) {
                // flag additional context object as additional
                contextObject.isAdditionalInherent = true;
                // flag addition context object as inherent
                if (contextObject.isInherent || __guard__(this.getGameSession().getOrCreateModifierFromContextObjectOrIndex(contextObject), x => x.getIsInherent())) { contextObject.isInherent = true; }
                this.modifiersContextObjects.push(contextObject);
              }
            }
          }

          if (cardData.additionalModifiersContextObjects != null) {
            // merge all additional modifier context objects
            for (contextObject of Array.from(cardData.additionalModifiersContextObjects)) {
              if ((contextObject.index == null)) {
                this.modifiersContextObjects.push(contextObject);
              }
            }
          }
        }

        // regenerate modifiers as needed
        const modifierIndices = this.getModifierIndices();
        if (modifierIndices.length > 0) {
          return (() => {
            const result = [];
            for (var modifierIndex of Array.from(modifierIndices.slice(0))) {
              var modifier = this.getGameSession().getModifierByIndex(modifierIndex);
              if ((modifier == null)) {
                // modifier index present but no modifier found
                result.push((() => {
                  const result1 = [];
                  for (contextObject of Array.from(cardData.appliedModifiersContextObjects)) {
                  // use context object with matching index to regenerate modifier
                    if ((contextObject.index != null) && (contextObject.index === modifierIndex)) {
                      // merge all additional modifier context objects
                      if (contextObject.isAdditionalInherent) { this.modifiersContextObjects.push(contextObject); }
                      // regenerate modifier
                      result1.push(this.getGameSession().applyModifierContextObject(contextObject, this));
                    } else {
                      result1.push(undefined);
                    }
                  }
                  return result1;
                })());
              } else {
                result.push(undefined);
              }
            }
            return result;
          })();
        }
      }
    }
  }

  getType() {
    return this.type;
  }

  setId(id) {
    return this.id = id;
  }

  getId() {
    return this.id;
  }

  getBaseCardId() {
    return Cards.getBaseCardId(this.getId());
  }

  getName() {
    let name;
    if (this.name != null) {
      name = i18next.exists(this.name) ? i18next.t(this.name) : this.name;
    }
    return name || ("" + this.getId());
  }

  getLogName(){
    return `${this.getName().replace(' ','_')}_${this.getBaseCardId()}_SKN${Cards.getCardSkinNum(this.getId())}${(Cards.getIsPrismaticCardId(this.getId()) ? "(PRSM)" : "")}[${this.getIndex()}]`;
  }

  getFactionId() {
    return this.factionId;
  }

  addKeywordClassToInclude(keywordClass) {
    // add a keyword class to keywords needed to explain this card
    if (!_.contains(this._private.keywordClassesToInclude, keywordClass)) {
      return this._private.keywordClassesToInclude.push(keywordClass);
    }
  }

  getRaceId() {
    return this.raceId;
  }

  // normally a card belongs to a tribe if its race id matches exactly to that tribe
  // there can also be special modifiers that allow a card to belong to multiple tribes
  getBelongsToTribe(tribe) {
    return (this.getRaceId() === tribe) || this.hasModifierClass(ModifierBelongsToAllRaces);
  }

  getRarityId() {
    return this.rarityId;
  }

  setCardSetId(val) {
    return this._private.cardSetId = val;
  }

  getCardSetId() {
    return this._private.cardSetId;
  }

  /**
   * Sets whether this is a card that needs to be unlocked later as part of a basic set.
   * @public
   * @param  {Boolean}
   */
  setIsUnlockableBasic(val) {
    return this._private.isUnlockableBasic = val;
  }

  /**
   * Returns whether this is a card that needs to be unlocked later as part of a basic set.
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsUnlockableBasic() {
    return this._private.isUnlockableBasic && !Cards.getIsSkinnedCardId(this.getId());
  }

  /**
   * Returns whether this is a prismatic card that can be unlocked.
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsUnlockablePrismaticBasic() {
    return (this.getRarityId() === Rarity.Fixed) && Cards.getIsPrismaticCardId(this.getId()) && !Cards.getIsSkinnedCardId(this.getId());
  }
//    return @getRarityId() == Rarity.Fixed and Cards.getIsPrismaticCardId(@getBaseCardId()) and Cards.getIsPrismaticCardId(@getId()) and !Cards.getIsSkinnedCardId(@getId())

  /**
   * Returns whether this is a card that can be unlocked through progression.
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsUnlockableThroughProgression() {
    return this.getIsUnlockableBasic() || this.getIsUnlockablePrismaticBasic();
  }

  /**
   * @public
   * @param  {Boolean}
   */
  setIsUnlockableWithAchievement(val) {
    return this._private.isUnlockableWithAchievement = val;
  }

  /**
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsUnlockableWithAchievement() {
    return this._private.isUnlockableWithAchievement;
  }

  /**
   * @public
   * @param  {Boolean}
   */
  setIsUnlockedWithAchievementId(val) {
    return this._private.isUnlockedWithAchievementId = val;
  }

  /**
   * @public
   * @return  {String}  Achievement id
   */
  getIsUnlockedWithAchievementId() {
    return this._private.isUnlockedWithAchievementId;
  }

  /**
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsUnlockablePrismaticWithAchievement() {
    return this.getIsUnlockableWithAchievement() && Cards.getIsPrismaticCardId(this.getId()) && !Cards.getIsSkinnedCardId(this.getId());
  }

  /**
   * Returns whether this is a card that can be unlocked only through spirit orbs
   * Prismatic versions of these cards are only craftable once the base card is owned
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsUnlockableThroughSpiritOrbs() {
    const cardSetData = CardSetFactory.cardSetForIdentifier(this.getCardSetId());
    return cardSetData.isUnlockableThroughOrbs || false;
  }

  /**
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsUnlockablePrismaticWithSpiritOrbs() {
    return this.getIsUnlockableThroughSpiritOrbs() && Cards.getIsPrismaticCardId(this.getId()) && !Cards.getIsSkinnedCardId(this.getId());
  }

  /**
   * Returns whether card is unlockable.
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsUnlockable() {
    return !this.getIsHiddenInCollection() &&
        (this.getIsUnlockableThroughProgression() ||
          this.getIsUnlockableWithAchievement() ||
          this.getIsUnlockablePrismaticWithAchievement() ||
          this.getIsUnlockableThroughSpiritOrbs() ||
          Cards.getIsSkinnedCardId(this.getId()));
  }

  /**
   * @public
   * How is this card unlocked
   */
  setUnlockDescription(val){
    return this._private.unlockDescription = val;
  }

  /**
   * @public
   * How is this card unlocked?
   * @return  {String}
   */
  getUnlockDescription(){
    return this._private.unlockDescription;
  }

  /**
   * Returns whether card is collectible.
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsCollectible() {
    return !this.getIsHiddenInCollection() &&
        ((this.getRarityId() === Rarity.Common) ||
          (this.getRarityId() === Rarity.Rare) ||
          (this.getRarityId() === Rarity.Epic) ||
          (this.getRarityId() === Rarity.Legendary) ||
          (this.getRarityId() === Rarity.Mythron));
  }

  /**
   * Sets whether this is a card that is now legacy (won't come from sets or be playable if playing in a format game mode)
   * @public
   * @param  {Boolean}
   */
  setIsLegacy(val) {
    return this._private.isLegacy = val;
  }

  /**
   * Returns whether this is a card that is now legacy (won't come from sets or be playable if playing in a format game mode)
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsLegacy() {
    return false; // disregard concept of legacy cards
  }

  /**
   * Returns whether this is a signature card.
   * NOTE: a card is only a signature card while it is in the signature slot!
   * @public
   * @return  {BOOL}  True/false.
   */
  isSignatureCard() {
    if (this.isOwnedByGameSession()) { return false;
    } else { return __guard__(this.getOwner(), x => x.getCurrentSignatureCardIndex()) === this.getIndex(); }
  }

  setLocation(val) {
    return this.location = val;
  }

  getLocation() {
    return this.location;
  }

  getIsLocatedInDeck() {
    return this.location === CardLocation.Deck;
  }

  getIsLocatedInHand() {
    return this.location === CardLocation.Hand;
  }

  getIsLocatedInSignatureCards() {
    return this.location === CardLocation.SignatureCards;
  }

  getIsLocatedOnBoard() {
    return this.location === CardLocation.Board;
  }

  getIsLocatedInVoid() {
    return this.location === CardLocation.Void;
  }

  setIsRemoved(val) {
    return this.isRemoved = val;
  }

  getIsRemoved() {
    return this.isRemoved;
  }

  setIsPlayed(val) {
    return this.isPlayed = val;
  }

  getIsPlayed() {
    return this.isPlayed;
  }

  setAppliedToDeckByAction(action) {
    if (action != null) {
      return this.appliedToDeckByActionIndex = action.getIndex();
    }
  }

  getAppliedToDeckByActionIndex() {
    return this.appliedToDeckByActionIndex;
  }

  getAppliedToDeckByAction() {
    if (this.appliedToDeckByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.appliedToDeckByActionIndex);
    }
  }

  setAppliedToHandByAction(action) {
    if (action != null) {
      return this.appliedToHandByActionIndex = action.getIndex();
    }
  }

  getAppliedToHandByActionIndex() {
    return this.appliedToHandByActionIndex;
  }

  getAppliedToHandByAction() {
    if (this.appliedToHandByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.appliedToHandByActionIndex);
    }
  }

  setAppliedToBoardByAction(action) {
    if (action != null) {
      return this.appliedToBoardByActionIndex = action.getIndex();
    }
  }

  getAppliedToBoardByActionIndex() {
    return this.appliedToBoardByActionIndex;
  }

  getAppliedToBoardByAction() {
    if (this.appliedToBoardByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.appliedToBoardByActionIndex);
    }
  }

  setAppliedToSignatureCardsByAction(action) {
    if (action != null) {
      return this.appliedToSignatureCardsByActionIndex = action.getIndex();
    }
  }

  getAppliedToSignatureCardsByActionIndex() {
    return this.appliedToSignatureCardsByActionIndex;
  }

  getAppliedToSignatureCardsByAction() {
    if (this.appliedToSignatureCardsByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.appliedToSignatureCardsByActionIndex);
    }
  }

  setRemovedFromDeckByAction(action) {
    if (action != null) {
      return this.removedFromDeckByActionIndex = action.getIndex();
    }
  }

  getRemovedFromDeckByActionIndex() {
    return this.removedFromDeckByActionIndex;
  }

  getRemovedFromDeckByAction() {
    if (this.removedFromDeckByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.removedFromDeckByActionIndex);
    }
  }

  setRemovedFromHandByAction(action) {
    if (action != null) {
      return this.removedFromHandByActionIndex = action.getIndex();
    }
  }

  getRemovedFromHandByActionIndex() {
    return this.removedFromHandByActionIndex;
  }

  getRemovedFromHandByAction() {
    if (this.removedFromHandByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.removedFromHandByActionIndex);
    }
  }

  setRemovedFromSignatureCardsByAction(action) {
    if (action != null) {
      return this.removedFromSignatureCardsByActionIndex = action.getIndex();
    }
  }

  getRemovedFromSignatureCardsByActionIndex() {
    return this.removedFromSignatureCardsByActionIndex;
  }

  getRemovedFromSignatureCardsByAction() {
    if (this.removedFromSignatureCardsByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.removedFromSignatureCardsByActionIndex);
    }
  }

  setRemovedFromBoardByAction(action) {
    if (action != null) {
      return this.removedFromBoardByActionIndex = action.getIndex();
    }
  }

  getRemovedFromBoardByActionIndex() {
    return this.removedFromBoardByActionIndex;
  }

  getRemovedFromBoardByAction() {
    if (this.removedFromBoardByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.removedFromBoardByActionIndex);
    }
  }

  getIsActive() {
    return this.getIsPlayed() && !this.getIsRemoved();
  }

  getManaCost() {
    return this.getBuffedAttribute(this.manaCost, "manaCost");
  }

  setBaseManaCost(manaCost) {
    if (this.manaCost !== manaCost) {
      this._private.lastManaCost = this.manaCost;
      return this.manaCost = manaCost;
    }
  }

  getBaseManaCost() {
    return this.manaCost;
  }

  getLastBaseManaCost() {
    return this._private.lastManaCost;
  }

  getManaCostChange() {
    return this.getManaCost() - this.getBaseManaCost();
  }

  setPosition(position) {
    return this.position = position;
  }

  getPositionX() {
    if (this.position != null) { return this.position.x; } else { return -1; }
  }

  getPositionY() {
    if (this.position != null) { return this.position.y; } else { return -1; }
  }

  getPosition() {
    if (this.position != null) { return {x: this.position.x, y: this.position.y}; } else { return {x: -1, y: -1}; }
  }

  /**
   * Sets whether this card is hidden in the collection.
   * @public
   * @param  {Boolean}
   */
  setIsHiddenInCollection(val) {
    return this._private.isHiddenInCollection = val;
  }

  /**
   * Returns whether this card is hidden in the collection.
   * @public
   * @return  {BOOL}  True/false.
   */
  getIsHiddenInCollection() {
    return this._private.isHiddenInCollection ||
        (this.getFactionId() === Factions.Tutorial) ||
        (this.getFactionId() === Factions.Boss);
  }

  /**
   * Sets the UTC timestamp for when this card is available at.
   * @public
   * @param {Number} timestamp in UTC
   */
  setAvailableAt(val) {
    return this._private.availableAt = val;
  }

  /**
   * Returns the UTC timestamp for when this card is available at.
   * @public
   * @returns {Number} timestamp in UTC
   */
  getAvailableAt() {
    return this._private.availableAt;
  }


  /**
   * Returns whether this card is available to players.
   * @public
   * @param  {Moment}  [systemTime=moment().utc()]  System time input parameter. Useful for unit testing.
   * @param  {Boolean}  [forceValidation=false]  Force validation regardless of ENV. Useful for unit tests.
   * @return  {BOOL}  True/false.
   */
  getIsAvailable(systemTime, forceValidation) {
    let MOMENT_NOW_UTC;
    if (systemTime != null) {
      MOMENT_NOW_UTC = moment(systemTime);
    } else {
      MOMENT_NOW_UTC = moment().utc();
    }

    // we cast this env ALL_CARDS_AVAILABLE var to a string because of some server/client differences
    // client side ENVIFY will replace this with the boolan true/false
    // but server side it will use the process.env system that always stores data as strings
    // so the safest approach is to cast it to a string and compare
    if (!forceValidation && ((process.env.ALL_CARDS_AVAILABLE != null ? process.env.ALL_CARDS_AVAILABLE.toString() : undefined) === "true")) {
      // when in environment with all cards available, ignore timestamp
      return true;
    } else if (this._private.availableAt <= -1) {
      // when available at -1, card is currently never available
      return false;
    } else {
      // otherwise, card is available when current time plus 1 hour is after timestamp
      return MOMENT_NOW_UTC.add(1, 'hours').isAfter(moment(this._private.availableAt));
    }
  }

  setPortraitResource(val) {
    return this._private.portraitResource = val;
  }

  getPortraitResource() {
    return this._private.portraitResource;
  }

  setPortraitHexResource(val) {
    return this._private.portraitHexResource = val;
  }

  getPortraitHexResource() {
    return this._private.portraitHexResource;
  }

  setSpeechResource(val) {
    return this._private.speechResource = val;
  }

  getSpeechResource() {
    return this._private.speechResource;
  }

  setConceptResource(val) {
    return this._private.conceptResource = val;
  }

  getConceptResource() {
    return this._private.conceptResource;
  }

  setAnnouncerFirstResource(val) {
    return this._private.announcerFirstResource = val;
  }

  getAnnouncerFirstResource() {
    return this._private.announcerFirstResource;
  }

  setAnnouncerSecondResource(val) {
    return this._private.announcerSecondResource = val;
  }

  getAnnouncerSecondResource() {
    return this._private.announcerSecondResource;
  }

  setOwnerId(ownerId) {
    if (this.ownerId !== ownerId) {
      this.ownerId = ownerId;
      return this.getOwner().flushCachedEventReceivingCards();
    }
  }

  getOwnerId() {
    return this.ownerId;
  }

  setBossBattleDescription(val) {
    return this._private.bossBattleDescription = val;
  }

  getBossBattleDescription(val) {
    return this._private.bossBattleDescription;
  }

  setBossBattleBattleMapIndex(val) {
    return this._private.bossBattleBattleMapIndex = val;
  }

  getBossBattleBattleMapIndex(val) {
    return this._private.bossBattleBattleMapIndex;
  }

  setOwner(player) {
    return this.setOwnerId(player.getPlayerId());
  }

  getOwner() {
    const gameSession = this.getGameSession();
    if (this.isOwnedByGameSession()) {
      return gameSession;
    } else {
      return gameSession.getPlayerById(this.ownerId);
    }
  }

  getIsSameTeamAs(otherCard) {
    return this.ownerId === (otherCard != null ? otherCard.ownerId : undefined);
  }

  // For non player owned cards, e.g. mana tiles
  isOwnedByGameSession() {
    return (this.ownerId == null);
  }

  isOwnedBy(player) {
    return this.ownerId === (player != null ? player.getPlayerId() : undefined);
  }

  isOwnedByPlayer1() {
    return this.isOwnedBy(__guard__(this.getGameSession(), x => x.getPlayer1()));
  }

  isOwnedByPlayer2() {
    return this.isOwnedBy(__guard__(this.getGameSession(), x => x.getPlayer2()));
  }

  isOwnedByCurrentPlayer() {
    return this.isOwnedBy(__guard__(this.getGameSession(), x => x.getCurrentPlayer()));
  }

  isOwnedByMyPlayer() {
    return this.isOwnedBy(__guard__(this.getGameSession(), x => x.getMyPlayer()));
  }

  isOwnedByOpponentPlayer() {
    return this.isOwnedBy(__guard__(this.getGameSession(), x => x.getOpponentPlayer()));
  }

  isOwnersTurn() {
    return __guard__(this.getGameSession(), x => x.getCurrentPlayer().getPlayerId()) === this.ownerId;
  }

  getDoesOwnerHaveEnoughManaToPlay() {
    return this.isOwnedByGameSession() || (this.getManaCost() <= this.getOwner().getRemainingMana());
  }

  getIsAllowedToBePlayed() {
    let getIsAllowedToBePlayed = true;
    const fateMod = this.getModifierByClass(ModifierFate);
    if (fateMod != null) {
      getIsAllowedToBePlayed = fateMod.fateConditionFulfilled() && getIsAllowedToBePlayed;
    }
    return getIsAllowedToBePlayed;
  }

  setDescription(val) {
    return this._private.description = val;
  }

  getDescription(options) {
    if (((this._private.cachedDescription == null)) || (this._private.cachedDescriptionOptions !== options)) {
      let boldEnd, boldStart, entryDelimiter, modifierName;
      let description = "";

      // options object can include wrapper text elements to wrap certain card elements
      this._private.cachedDescriptionOptions = options;
      if (options != null) {
        ({
          boldStart
        } = options);
        ({
          boldEnd
        } = options);
        ({
          entryDelimiter
        } = options);
      }

      if ((entryDelimiter == null)) {
        entryDelimiter = "\n";
      }

      if (this._private.description) { // pre-defined descrption (most cards will use this)
        // format hard line breaks for plain text or HTML
        if (entryDelimiter !== "\n") {
          this._private.description = this._private.description.replace(/\n/g, "<br/>");
        }
        // add the manually entered followup description if there is one
        description += this._private.description;
      } else {
        // generate description from modifiers
        const filteredContextObjects = _.filter(this.modifiersContextObjects, contextObject => {
          return (contextObject.isInherent || contextObject.isAdditionalInherent) && !contextObject.isHiddenToUI && !this.getGameSession().getModifierClassForType(contextObject.type).isHiddenToUI;
        });

        // sort the context objects for display alphanumerically
        const sortedContextObjects = _.sortBy(filteredContextObjects, contextObject => {
          let sortValue = "z";
          const modifierClass = this.getGameSession().getModifierClassForType(contextObject.type);
          if (modifierClass.modifierName) { sortValue = modifierClass.modifierName; }
          // descriptions come after those with only names
          if (modifierClass.description != null) { sortValue = "z" + sortValue; }
          // keyworded come before all others
          if (modifierClass.getIsKeyworded()) { sortValue = "0" + sortValue; }

          return sortValue;
        });

        // gather the descriptions from sorted context objects
        for (let i = 0; i < sortedContextObjects.length; i++) {
          let contextObject = sortedContextObjects[i];
          var modifierClass = this.getGameSession().getModifierClassForType(contextObject.type);
          modifierName = modifierClass.getIsKeyworded() ? modifierClass.getName(contextObject) : undefined;
          var modifierDescription = modifierClass.getDescription(contextObject, this.getGameSession().getModifierFactory());
          var modifierString = Stringifiers.stringifyNameAndOrDescription(modifierName, modifierDescription, options);
          description += modifierString;

          // insert delimeter between each modifier context object
          if (i !== (sortedContextObjects.length-1)) {
            // check if this isn't the last keyword
            var nextSortedContextObject = sortedContextObjects[i+1];
            var nextModifierClass = this.getGameSession().getModifierClassForType(nextSortedContextObject.type);
            var nextModifierDescription = nextModifierClass.getDescription(nextSortedContextObject, this.getGameSession().getModifierFactory());
            if (!modifierDescription && !nextModifierDescription) {
              // separate two 'name only' modifiers by comma
              description += ", ";
            } else {
              description += entryDelimiter;
            }
          }
        }
      }

      // add the followup description
      if ((this._private.followupName != null) && (this._private.followupDescription != null)) {
        // add separator between flavor text and followup
        if (description !== "") {
          description += entryDelimiter || ".  ";
        }

        const followupString = Stringifiers.stringifyNameAndOrDescription(this._private.followupName, this._private.followupDescription, options);

        // add followup description to return
        description += followupString;
      }

      // search for keywords from manually added keywords
      if (boldStart != null) {
        for (var keywordClass of Array.from(this.getKeywordClasses())) {
          if (!(keywordClass.type === "ModifierBattlePet")) { // special case, don't bold "Battle Pet" text in card descriptions
            description = description.replace(new RegExp(keywordClass.modifierName + "\(\?\!" + boldEnd + "\)", "g"), boldStart + keywordClass.modifierName + boldEnd);
          }
        }
      }

      // cache final description
      this._private.cachedDescription = description;
    }

    return this._private.cachedDescription;
  }

  setFollowupNameAndDescription(followupName, followupDescription) {
    this._private.followupName = followupName;
    return this._private.followupDescription = followupDescription;
  }

  setNodeOptions(val) {
    return this._private.nodeOptions = val;
  }

  getNodeOptions() {
    return this._private.nodeOptions;
  }

  setSpriteOptions(val) {
    return this._private.spriteOptions = val;
  }

  getSpriteOptions() {
    return this._private.spriteOptions;
  }

  setCardOptions(val) {
    return this._private.cardOptions = val;
  }

  getCardOptions() {
    return this._private.cardOptions;
  }

  //===== / ======

  /* ANIMATION */

  setBaseAnimResource(animResource) {
    // store the original resource, set when the card is first made
    // so no matter how many changes it undergoes, it always has the original
    return this._private.baseAnimResource = animResource;
  }

  getBaseAnimResource() {
    return this._private.baseAnimResource;
  }

  // Duplicated below.
  /*
  getAnimResource: () ->
    * override to return a value other than the base resource
    return @_private.baseAnimResource
  */

  getAnimResource() {
    // search modifiers for any with resource
    if ((this._private.animResource == null)) {
      let resource;
      const modifiers = this.getModifiers();
      if (modifiers.length > 0) {
        for (let i = modifiers.length - 1; i >= 0; i--) {
          var modifier = modifiers[i];
          if ((modifier != null) && modifier.getIsActive()) {
            var modifierResource = modifier.getAnimResource();
            if (modifierResource != null) {
              if (modifier.getIsManagedByAura()) {
                resource = modifierResource;
                break;
              } else if ((resource == null)) {
                resource = modifierResource;
              }
            }
          }
        }
      }

      // cache resource
      this._private.animResource = resource || this._private.baseAnimResource;
    }

    return this._private.animResource;
  }

  //===== / ======

  /* SOUND */

  // Duplicated below.
  /*
  getSoundResource: () ->
    * search modifiers for any with resource
    if !@_private.soundResource?
      modifiers = @getModifiers()
      if modifiers.length > 0
        for modifier in modifiers by -1
          if modifier? and modifier.getIsActive()
            modifierResource = modifier.getSoundResource()
            if modifierResource?
              if modifier.getIsManagedByAura()
                resource = modifierResource
                break
              else if !resource?
                resource = modifierResource

      * cache resource
      @_private.soundResource = resource || @_private.baseSoundResource

    return @_private.soundResource
  */

  setBaseSoundResource(soundResource) {
    // store the original resource, set when the card is first made
    // so no matter how many changes it undergoes, it always has the original
    return this._private.baseSoundResource = soundResource;
  }

  getBaseSoundResource() {
    return this._private.baseSoundResource;
  }

  getSoundResource() {
    // override to return a value other than the base resource
    return this._private.baseSoundResource;
  }

  //===== / ======

  /* FX */

  setFXResource(fxResource) {
    return this._private.fxResource = fxResource;
  }

  getFXResource() {
    if ((this._private.mergedFXResource == null)) {
      this._private.mergedFXResource = this._private.fxResource;
      // prepend faction's fx resource
      const factionId = this.getFactionId();
      if (factionId != null) {
        const faction = FactionFactory.factionForIdentifier(factionId);
        const factionFXResource = faction != null ? faction.fxResource : undefined;
        if (factionFXResource != null) {
          this._private.mergedFXResource = _.uniq(_.union(factionFXResource, this._private.fxResource));
        }
      }
    }
    return this._private.mergedFXResource;
  }

  addFXResource(fxResource) {
    return this._private.mergedFXResource = _.uniq(_.union(this.getFXResource(), fxResource));
  }

  removeFXResource(fxResource) {
    return this._private.mergedFXResource = _.difference(this.getFXResource(), fxResource);
  }

  //===== / ======

  /* VALID POSITIONS */

  getValidTargetPositions() {
    if ((this._private.cachedValidTargetPositions == null)) {
      // valid positions where card can be played on board
      // defaults to every space on the board
      this._private.cachedValidTargetPositions = this.getGameSession().getBoard().getPositions() || [];
    }
    return this._private.cachedValidTargetPositions;
  }

  getIsPositionValidTarget(targetPosition) {
    // index must be string and cannot be map index as position may be outside board space
    // map indices can conflict when generated for positions outside the board
    const index = targetPosition.x + "_" + targetPosition.y;
    let res = this._private.cachedIsValidTargetPosition[index];
    if ((res == null)) {
      res = (this._private.cachedIsValidTargetPosition[index] = UtilsPosition.getIsPositionInPositions(this.getValidTargetPositions(), targetPosition) && this.isAreaOfEffectOnBoard(targetPosition));
    }
    return res;
  }

  flushCachedValidTargetPositions() {
    this._private.cachedValidTargetPositions = null;
    return this._private.cachedIsValidTargetPosition = {};
  }

  getCanBeAppliedAnywhere() {
    return this.canBeAppliedAnywhere;
  }

  setAffectPattern(val) {
    this._private.affectPattern = val;
    return this.flushCachedIsAreaOfEffectOnBoard();
  }

  getAffectPattern() {
    return this._private.affectPattern;
  }

  getAffectPositionsFromPattern(targetPosition) {
    return UtilsGameSession.getValidBoardPositionsFromPattern(this.getGameSession().getBoard(), targetPosition, this.getAffectPattern());
  }

  isAreaOfEffectOnBoard(targetPosition) {
    const board = this.getGameSession().getBoard();
    const isOnBoard = board.isOnBoard(targetPosition);
    const affectPattern = this.getAffectPattern();
    if (isOnBoard && (affectPattern != null) && (affectPattern.length > 0)) {
      // if we've already tested this position, return previous result
      const index = UtilsPosition.getMapIndexFromPosition(board.getColumnCount(), targetPosition.x, targetPosition.y);
      let res = this._private.cachedIsAreaOfEffectOnBoard[index];
      if ((res == null)) {
        // number of affect positions must match length of affect pattern
        res = (this._private.cachedIsAreaOfEffectOnBoard[index] = (this.getAffectPositionsFromPattern(targetPosition).length === affectPattern.length));
      }
      return res;
    } else {
      // no area of effect or not on board
      return isOnBoard;
    }
  }

  flushCachedIsAreaOfEffectOnBoard() {
    return this._private.cachedIsAreaOfEffectOnBoard = {};
  }

  setTargetsSpace(val) {
    return this._private.targetsSpace = val;
  }

  getTargetsSpace() {
    return this._private.targetsSpace;
  }

  //===== / ======

  //region ### MODIFIERS ###

  setModifiersContextObjects(modifiersContextObjects) {
    this.modifiersContextObjects = modifiersContextObjects;
    return this.flushCachedModifiersContextObjects();
  }

  getModifiersContextObjects() {
    return this.modifiersContextObjects;
  }

  setInherentModifiersContextObjects(modifiersContextObjects) {
    // merge context objects
    for (var modifierContextObject of Array.from(modifiersContextObjects)) {
      // flag all context objects as inherent
      modifierContextObject.isInherent = true;
      this.modifiersContextObjects.push(modifierContextObject);
    }
    return this.flushCachedModifiersContextObjects();
  }

  getInherentModifiersContextObjects() {
    const modifiersContextObjects = [];

    if (this.modifiersContextObjects != null) {
      for (var modifierContextObject of Array.from(this.modifiersContextObjects)) {
        if (modifierContextObject.isInherent) { modifiersContextObjects.push(modifierContextObject); }
      }
    }

    return modifiersContextObjects;
  }

  flushCachedModifiersContextObjects() {
    return this._private.cachedContextObjectForModifierClass = {};
  }

  /**
   * Returns list of modifiers applied to this card.
   * @returns {Array}
   */
  getModifiers() {
    if (this._private.modifiers == null) { this._private.modifiers = this.getGameSession().getModifiersByIndices(this.modifierIndices); }
    return this._private.modifiers;
  }

  /**
   * Returns list of modifiers applied to this card, filtered by whether visible, sorted by stack type, and in the order they should be applied.
   * @returns {Array}
   */
  getVisibleModifierStacks() {
    if (this._private.cachedVisibleModifierStacks != null) {
      // use cached list
      return this._private.cachedVisibleModifierStacks;
    } else {
      let modifierStack, statsForStackType;
      const modifierStacksByStackSortKey = {};
      const statsByStackType = {};
      const modifierStacks = [];
      const managedModifierStacks = [];
      let stackSortKeyBreak = "";

      for (var modifier of Array.from(this.getModifiers())) {
        if (modifier != null) {
          if (!modifier.getIsHiddenToUI()) {
            // uncomment line below to filter out aura sub-modifiers on the same card
            //if !modifier.getIsHiddenToUI() and (!modifier.getIsManagedByAuraModifier() or (modifier.getParentModifier() != null and modifier.getCardAffected() != modifier.getParentModifier().getCardAffected()))
            // create stack as needed
            var modifierIsActive = modifier.getIsActive();
            var modifierAppliedName = modifier.getAppliedName();
            var modifierStackType = modifier.getStackType();
            var modifierIsManaged = modifier.getIsManagedByAura();
            var modifierStackSortKey = modifierAppliedName + modifierStackType;
            if (!modifierIsManaged) {
              // only break stacks of non-managed modifiers
              modifierStackSortKey += stackSortKeyBreak;
            }
            modifierStack = modifierStacksByStackSortKey[modifierStackSortKey];
            if ((modifierStack == null)) {
              modifierStack = (modifierStacksByStackSortKey[modifierStackSortKey] = {
                modifiers: [],
                stackType: modifierStackType,
                numInherent: 0,
                numManaged: 0
              });
            }
            statsForStackType = statsByStackType[modifierStackType];
            if ((statsForStackType == null)) {
              statsForStackType = (statsByStackType[modifierStackType] = {
                numActive: 0
              });
            }

            // add modifier to stack
            modifierStack.modifiers.push(modifier);
            if (modifier.getIsInherent()) { modifierStack.numInherent++; }
            if (modifierIsManaged) { modifierStack.numManaged++; }
            if (modifierIsActive) { statsForStackType.numActive++; }

            // when this modifier buffs attributes by setting absolute or fixed values
            // no modifiers beyond this modifier should stack with modifiers that came before this modifier
            if (modifierIsActive && (modifier.getBuffsAttributesAbsolutely() || modifier.getAreAttributesFixed())) {
              stackSortKeyBreak += "_stackbreak";
            }
          }
        }
      }

      const stackSortKeys = Object.keys(modifierStacksByStackSortKey);
      for (var stackSortKey of Array.from(stackSortKeys)) {
        modifierStack = modifierStacksByStackSortKey[stackSortKey];

        // merge stats from stack type
        statsForStackType = statsByStackType[modifierStack.stackType];
        modifierStack.numActive = statsForStackType.numActive;

        // sort stacks by whether all in stack are managed
        if (modifierStack.numManaged === modifierStack.modifiers.length) { managedModifierStacks.push(modifierStack); } else { modifierStacks.push(modifierStack); }
      }

      // cache list
      this._private.cachedVisibleModifierStacks = modifierStacks.concat(managedModifierStacks);
      return this._private.cachedVisibleModifierStacks;
    }
  }

  getAttributeModifiers(buffKey) {
    const attributeModifiers = [];
    for (var modifier of Array.from(this.getModifiers())) {
      if ((modifier != null) && modifier.getIsActive() && modifier.getBuffsAttribute(buffKey)) {
        attributeModifiers.push(modifier);
      }
    }
    return attributeModifiers;
  }

  getActiveAttributeModifiers(buffKey) {
    const attributeModifiers = [];
    for (var modifier of Array.from(this.getModifiers())) {
      if ((modifier != null) && modifier.getBuffsAttribute(buffKey)) {
        attributeModifiers.push(modifier);
      }
    }
    return attributeModifiers;
  }

  getInherentModifiers() {
    const modifiers = [];

    for (var modifier of Array.from(this.getModifiers())) {
      if (modifier.getIsInherent()) { modifiers.push(modifier); }
    }

    return modifiers;
  }

  getAdditionalInherentModifiers() {
    const modifiers = [];

    for (var modifier of Array.from(this.getModifiers())) {
      if (modifier.getIsAdditionalInherent()) { modifiers.push(modifier); }
    }

    return modifiers;
  }

  getInherentAndAdditionalInherentModifiers() {
    const modifiers = [];

    for (var modifier of Array.from(this.getModifiers())) {
      if (modifier.getIsInherent() || modifier.getIsAdditionalInherent()) { modifiers.push(modifier); }
    }

    return modifiers;
  }

  getModifierClassesFromContextObjects() {
    const modifierClasses = [];
    if (this.modifiersContextObjects != null) {
      for (var contextObject of Array.from(this.modifiersContextObjects)) {
        var modifierClass = this.getGameSession().getModifierClassForType(contextObject.type);
        if (modifierClass != null) {
          modifierClasses.push(modifierClass);
        }
      }
    }
    return modifierClasses;
  }

  getContextObjectForModifierClass(modifierClass) {
    let res = this._private.cachedContextObjectForModifierClass[modifierClass.type];
    if ((res == null)) {
      let matchingContextObject;
      for (var contextObject of Array.from(this.modifiersContextObjects)) {
        if (contextObject.type === modifierClass.type) {
          matchingContextObject = contextObject;
          break;
        }
      }
      res = (this._private.cachedContextObjectForModifierClass[modifierClass.type] = matchingContextObject);
    }
    return res;
  }

  hasModifierClassInContextObjects(modifierClass) {
    return (this.getContextObjectForModifierClass(modifierClass) != null);
  }

  getModifierIndices() {
    return this.modifierIndices || [];
  }

  onApplyModifiersForApplyToNewLocation() {
    // sync the state of all existing modifiers
    // newly applied modifiers will sync as they are applied
    for (var modifier of Array.from(this.getModifiers())) {
      if (modifier != null) {
        modifier.syncState();
      }
    }

    // apply modifiers from modifiers context objects
    if (!this.modifiersAppliedFromContextObjects) {
      this.modifiersAppliedFromContextObjects = true;

      if (this.getGameSession().getIsRunningAsAuthoritative()) {
        // generate and apply base modifiers
        if (this.modifiersContextObjects != null) {
          return Array.from(this.modifiersContextObjects).map((contextObject) =>
            this.getGameSession().applyModifierContextObject(contextObject, this));
        }
      }
    }
  }

  onAddModifier(modifier) {
    // when index is not present, dev made a mistake
    const modifierIndex = modifier.getIndex();
    if ((modifierIndex == null)) {
      Logger.module("SDK").error(this.getGameSession().gameId, `Entity.onAddModifier ${modifier.getType()} must be added through game session and not directly to unit!`);
    }

    // store modifier index
    if (_.indexOf(this.modifierIndices, modifierIndex, true) === -1) {
      this.modifierIndices.push(modifierIndex);
      this.modifierIndices = _.sortBy(this.modifierIndices);
    }

    // modifiers have changed
    this.flushCachedModifiers();

    // flush cached attributes if modifier affects attribute buffs
    const attributeBuffs = modifier.getAttributeBuffs();
    if (attributeBuffs != null) {
      for (var buffKey in attributeBuffs) {
        this.flushCachedAttribute(buffKey);
      }
    } else if (modifier.getBuffsAttributes()) { this.flushCachedAttributes(); }

    // flush cached description and keyword classes if modifier is inherent
    if (modifier.getIsInherent()) {
      this.flushCachedDescription();
      return this.flushCachedKeywordClasses();
    }
  }

  onRemoveModifier(modifier) {
    // remove from lists
    const index = _.indexOf(this.modifierIndices, modifier.getIndex(), true);
    if (index >= 0) {
      this.modifierIndices.splice(index, 1);
      this.modifierIndices = _.sortBy(this.modifierIndices);
    }

    // modifiers have changed
    this.flushCachedModifiers();

    // flush cached attributes if modifier affects attribute buffs
    const attributeBuffs = modifier.getAttributeBuffs();
    if (attributeBuffs != null) {
      for (var buffKey in attributeBuffs) {
        this.flushCachedAttribute(buffKey);
      }
    } else if (modifier.getBuffsAttributes()) { this.flushCachedAttributes(); }

    // flush cached description and keyword classes if modifier is inherent
    if (modifier.getIsInherent()) {
      this.flushCachedDescription();
      return this.flushCachedKeywordClasses();
    }
  }

  getNumActiveModifiers() {
    let count = 0;
    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && m.getIsActive()) {
        count++;
      }
    }

    return count;
  }

  getActiveModifiers() {
    const modifiers = [];

    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && m.getIsActive()) { modifiers.push(m); }
    }

    return modifiers;
  }

  /**
   * Returns a list of all keywords needed to explain this card.
   * @returns {Array}
  */
  getKeywordClasses() {
    const keywordClasses = this.getCachedKeywordClasses().slice(0);

    // keyword classes from applied modifiers
    for (var modifier of Array.from(this.getModifiers())) {
      if (modifier != null) {
        var modifierClass = modifier.constructor;
        if (modifierClass.isKeyworded && !_.contains(keywordClasses, modifierClass)) {
          keywordClasses.push(modifierClass);
        }
      }
    }

    return keywordClasses;
  }

  /**
   * Returns a list of all cached keywords from keywords to include and modifiers context objects.
   * @returns {Array}
  */
  getCachedKeywordClasses() {
    if ((this._private.cachedKeywordClasses == null)) {
      let modifierClass;
      const keywordClasses = (this._private.cachedKeywordClasses = []);
      const silenced = this.getIsSilenced();

      // manually included keyword classes
      for (modifierClass of Array.from(this._private.keywordClassesToInclude)) {
        if (((this.getIndex() == null) || !silenced || !modifierClass.prototype.isRemovable) && !_.contains(keywordClasses, modifierClass)) {
          keywordClasses.push(modifierClass);
        }
      }

      // reconstruct keyword classes from context objects
      if ((this._private.cachedKeywordClassesFromContextObjects == null)) {
        this._private.cachedKeywordClassesFromContextObjects = [];
        for (var contextObject of Array.from(this.modifiersContextObjects)) {
          if ((contextObject != null) && !contextObject.isHiddenToUI) {
            modifierClass = this.getGameSession().getModifierClassForType(contextObject.type);
            if (modifierClass.isKeyworded) {
              this._private.cachedKeywordClassesFromContextObjects.push(modifierClass);
            }
          }
        }
      }

      // keyword classes from context objects
      for (modifierClass of Array.from(this._private.cachedKeywordClassesFromContextObjects)) {
        if (((this.getIndex() == null) || ((!silenced || !modifierClass.prototype.isRemovable) && this.hasModifierType(modifierClass.type))) && !_.contains(keywordClasses, modifierClass)) {
          keywordClasses.push(modifierClass);
        }
      }
    }

    return this._private.cachedKeywordClasses;
  }

  hasModifierIndex(index) {
    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getIndex() === index)) { return true; }
    }
    return false;
  }

  hasModifierType(type) {
    return (this.getModifierByType(type) != null);
  }

  getModifierByType(type) {
    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getType() === type)) { return m; }
    }
  }

  hasActiveModifierType(type) {
    return (this.getActiveModifierByType(type) != null);
  }

  getActiveModifierByType(type) {
    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getType() === type) && m.getIsActive()) { return m; }
    }
  }

  getActiveModifiersByType(type) {
    const modifiers = [];

    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getType() === type) && m.getIsActive()) { modifiers.push(m); }
    }

    return modifiers;
  }

  getModifiersByType(type) {
    const modifiers = [];
    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getType() === type)) { modifiers.push(m); }
    }
    return modifiers;
  }

  getNumModifiersOfType(type) {
    let modifiers = 0;

    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getType() === type)) {
        modifiers++;
      }
    }

    return modifiers;
  }

  hasModifierStackType(type) {
    return (this.getModifierByStackType(type) != null);
  }

  getModifierByStackType(type) {
    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getStackType() === type)) { return m; }
    }
  }

  getActiveModifierByStackType(type) {
    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getStackType() === type) && m.getIsActive()) { return m; }
    }
  }

  getActiveModifiersByStackType(type) {
    const modifiers = [];

    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getStackType() === type) && m.getIsActive()) { modifiers.push(m); }
    }

    return modifiers;
  }

  getModifiersByStackType(type) {
    let res = this._private.cachedModifiersByStackType[type];
    if ((res == null)) {
      const matchingModifiers = [];
      for (var m of Array.from(this.getModifiers())) {
        if ((m != null) && (m.getStackType() === type)) {
          matchingModifiers.push(m);
        }
      }
      res = (this._private.cachedModifiersByStackType[type] = matchingModifiers);
    }
    return res;
  }

  getNumModifiersOfStackType(type) {
    return this.getModifiersByStackType(type).length;
  }

  getNumActiveModifiersOfStackType(type) {
    let stacks = 0;

    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && m.getIsActive() && (m.getStackType() === type)) {
        stacks++;
      }
    }

    return stacks;
  }

  getNumModifiersOfArtifactStackType(type) {
    let stacks = 0;

    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && (m.getArtifactStackType() === type)) {
        stacks++;
      }
    }

    return stacks;
  }

  getNumActiveModifiersOfArtifactStackType(type) {
    let stacks = 0;

    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && m.getIsActive() && (m.getArtifactStackType() === type)) {
        stacks++;
      }
    }

    return stacks;
  }

  hasModifierClass(modifierClass) {
    if (this.getIndex() != null) {
      return (this.getModifierByClass(modifierClass) != null);
    } else {
      return this.hasModifierClassInContextObjects(modifierClass);
    }
  }

  getModifierByClass(modifierClass) {
    let res = this._private.cachedModifierByClass[modifierClass.type];
    if ((res == null)) {
      let matchingModifier;
      for (var m of Array.from(this.getModifiers())) {
        if (m instanceof modifierClass) {
          matchingModifier = m;
          break;
        }
      }
      res = (this._private.cachedModifierByClass[modifierClass.type] = matchingModifier);
    }
    return res;
  }

  hasActiveModifierClass(modifierClass) {
    return (this.getActiveModifierByClass(modifierClass) != null);
  }

  getActiveModifierByClass(modifierClass) {
    for (var m of Array.from(this.getModifiers())) {
      if (m instanceof modifierClass && m.getIsActive()) { return m; }
    }
  }

  getActiveModifiersByClass(modifierClass) {
    const modifiers = [];

    for (var m of Array.from(this.getModifiers())) {
      if (m instanceof modifierClass && m.getIsActive()) { modifiers.push(m); }
    }

    return modifiers;
  }

  getModifiersByClass(modifierClass) {
    let res = this._private.cachedModifiersByClass[modifierClass.type];
    if ((res == null)) {
      const matchingModifiers = [];
      for (var m of Array.from(this.getModifiers())) {
        if (m instanceof modifierClass) {
          matchingModifiers.push(m);
        }
      }
      res = (this._private.cachedModifiersByClass[modifierClass.type] = matchingModifiers);
    }
    return res;
  }

  getNumModifiersOfClass(modifierClass) {
    return this.getModifiersByClass(modifierClass).length;
  }

  getArtifactModifiers() {
    const modifiers = [];
    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && m.getIsFromArtifact()) { modifiers.push(m); }
    }
    return modifiers;
  }

  getArtifactModifiersGroupedByArtifactCard() {
    return UtilsGameSession.groupModifiersBySourceCard(this.getArtifactModifiers());
  }

  getHasActiveArtifact() {
    for (var m of Array.from(this.getModifiers())) {
      if ((m != null) && m.getIsActive() && m.getIsFromArtifact()) {
        return true;
      }
    }
    return false;
  }

  getHasModifiers() {
    return this.getModifiers().length > 0;
  }

  getHasRemovableModifiers() {
    if (this.getHasModifiers()) {
      for (var modifier of Array.from(this.getModifiers())) {
        if ((modifier != null) && modifier.getIsRemovable()) { return true; }
      }
    }

    return false;
  }

  silence() {
    // remove all removable modifiers
    const iterable = this.getModifiers();
    for (let i = iterable.length - 1; i >= 0; i--) {
      var modifier = iterable[i];
      if ((modifier != null) && modifier.getIsRemovable()) {
        this.getGameSession().removeModifier(modifier);
      }
    }

    // flush keywords for keyword classes to include
    return this.flushCachedKeywordClasses();
  }

  getIsSilenced() {
    if (this._private.cachedIsSilenced == null) { this._private.cachedIsSilenced = this.hasModifierClass(ModifierSilence); }
    return this._private.cachedIsSilenced;
  }

  //endregion ### MODIFIERS ###

  //region ### GAUNTLET MODIFIERS ###

  setModifiedGauntletRarities(rarityIds) {
    return this._private.modifiedGauntletRarities = rarityIds;
  }

  getModifiedGauntletRarities() {
    return this._private.modifiedGauntletRarities;
  }

  setModifiedGauntletFactions(factionIds) {
    return this._private.modifiedGauntletFactions = factionIds;
  }

  getModifiedGauntletFactions() {
    return this._private.modifiedGauntletFactions;
  }

  setModifiedGauntletCardTypes(cardTypes) {
    return this._private.modifiedGauntletCardTypes = cardTypes;
  }

  getModifiedGauntletCardTypes() {
    return this._private.modifiedGauntletCardTypes;
  }

  // Restricts the next card choices to be the non neutral chosen gauntlet faction
  setModifiedGauntletOwnFactionFilter(ownFactionFilter) {
    return this._private.modifiedGauntletOwnFactionFilter = ownFactionFilter;
  }

  getModifiedGauntletOwnFactionFilter() {
    return this._private.modifiedGauntletOwnFactionFilter;
  }


  //endregion ### GAUNTLET MODIFIERS ###

  // region ### STATS ###

  _getBuffedAttributeFromModifiers(attributeValue, buffKey, modifiers, withAuras, stopAtBase, forAuras, stopAtNonAuraModifier=null) {
    // separate modifiers into groups for order of application: rebasing, normal, auras
    let modifier, stopAtModifier;
    if (withAuras == null) { withAuras = true; }
    if (stopAtBase == null) { stopAtBase = false; }
    if (forAuras == null) { forAuras = false; }
    const rebasing = [];
    const normal = [];
    const auras = [];
    for (modifier of Array.from(modifiers)) {
      if (!forAuras && modifier.getIsManagedByAura()) {
        if (withAuras) {
          auras.push(modifier);
        }
      } else {
        var rebases = modifier.getRebasesAttribute(buffKey);
        if (rebases) {
          rebasing.push(modifier);
        } else {
          normal.push(modifier);
        }

        if (!stopAtModifier && modifier.getIsAttributeFixed(buffKey)) {
          // FIRST fixed modifier blocks anything further
          stopAtModifier = modifier;
        } else if (stopAtBase && (rebases || modifier.getBuffsAttributeAbsolutely(buffKey))) {
          // last rebasing or absolute modifier is the new base
          stopAtModifier = modifier;
        }
      }
    }

    if ((stopAtBase && (stopAtModifier == null) && (auras.length === 0)) || (forAuras && (stopAtNonAuraModifier != null) && (stopAtModifier == null))) {
      // base is default value when not stopping at a modifier or
      // non aura modifier is stopping point when not stopping at an aura modifier
      return attributeValue;
    } else if (!stopAtBase || (stopAtModifier != null)) {
      // rebased stats only uses latest
      if (rebasing.length > 0) {
        const rebasingModifier = rebasing[rebasing.length - 1];
        attributeValue = rebasingModifier.getBuffedAttribute(attributeValue, buffKey);
        if (stopAtBase && (rebasingModifier === stopAtModifier) && (auras.length === 0)) {
          // base is rebased value
          return attributeValue;
        }
      }

      // apply normal modifiers
      for (modifier of Array.from(normal)) {
        attributeValue = modifier.getBuffedAttribute(attributeValue, buffKey);
        if (modifier === stopAtModifier) {
          return attributeValue;
        }
      }
    }

    // apply auras modifiers recursively
    if (auras.length > 0) {
      attributeValue = this._getBuffedAttributeFromModifiers(attributeValue, buffKey, auras, (withAuras=false), stopAtBase, (forAuras=true), stopAtModifier);
    }

    return attributeValue;
  }

  getBuffedAttribute(attributeValue, buffKey, withAuras, clamped) {
    let cachedValue;
    if (withAuras == null) { withAuras = true; }
    if (clamped == null) { clamped = true; }
    if (withAuras) {
      cachedValue = this._private.cachedBuffedAttributes[buffKey];
    } else {
      cachedValue = this._private.cachedBuffedAttributesWithoutAuras[buffKey];
    }
    if (cachedValue != null) {
      // always use cached value
      attributeValue = cachedValue;
    } else {
      // get buffed attribute from active modifiers
      attributeValue = this._getBuffedAttributeFromModifiers(attributeValue, buffKey, this.getActiveModifiers(), withAuras);

      // cache value
      if (withAuras) {
        this._private.cachedBuffedAttributes[buffKey] = attributeValue;
      } else {
        this._private.cachedBuffedAttributesWithoutAuras[buffKey] = attributeValue;
      }
    }

    // normally we don't want attributes to show as negative
    // so clamp them to 0 after applying all buffs / debuffs
    if (clamped) {
      attributeValue = Math.max(0, attributeValue);
    }

    return attributeValue;
  }

  getBaseAttribute(attributeValue, buffKey, withAuras, clamped) {
    if (withAuras == null) { withAuras = true; }
    if (clamped == null) { clamped = true; }
    const cachedValue = this._private.cachedBaseAttributes[buffKey];
    if (cachedValue != null) {
      // always use cached value
      attributeValue = cachedValue;
    } else {
      // get buffed attribute from active modifiers excluding auras and stopping at base
      let stopAtBase;
      attributeValue = this._getBuffedAttributeFromModifiers(attributeValue, buffKey, this.getActiveModifiers(), withAuras, (stopAtBase=true));

      // cache value
      this._private.cachedBaseAttributes[buffKey] = attributeValue;
    }

    // normally we don't want attributes to show as negative
    // so clamp them to 0 after applying all buffs / debuffs
    if (clamped) {
      attributeValue = Math.max(0, attributeValue);
    }

    return attributeValue;
  }

  // endregion ### STATS ###

  // region ### FOLLOWUP ACTIONS ###

  setFollowups(val) {
    return this._private.followups = val;
  }

  getFollowups(val) {
    return this._private.followups;
  }

  clearFollowups() {
    this._private.followups = [];
    return this._private.followupCard = null;
  }

  removeCurrentFollowup() {
    this._private.followups.shift();
    return this._private.followupCard = null;
  }

  getHasFollowups() {
    return this._private.followups.length > 0;
  }

  getNumFollowups() {
    return this._private.followups.length;
  }

  getIsFollowup() {
    return (this.getParentCard() != null);
  }

  getPositionForFollowupSourcePosition() {
    return this.getPosition();
  }

  setFollowupSourcePosition(followupSourcePosition) {
    return this._private.followupSourcePosition = followupSourcePosition;
  }

  getFollowupSourcePosition() {
    return this._private.followupSourcePosition;
  }

  setFollowupSourcePattern(val) {
    return this._private.followupSourcePattern = val;
  }

  getFollowupSourcePattern() {
    return this._private.followupSourcePattern;
  }

  setFollowupConditions(val) {
    return this._private.followupConditions = val;
  }

  getFollowupConditions() {
    return this._private.followupConditions;
  }

  getFollowupByIndex(followupIndex) {
    if (this.getHasFollowups()) {
      return this._private.followups[followupIndex];
    }
  }

  getCurrentFollowup() {
    if (this.getHasFollowups()) {
      return this.getFollowupByIndex(0);
    }
  }

  getCurrentFollowupCard() {
    if ((this._private.followupCard == null)) {
      const followup = this.getCurrentFollowup();
      if (followup != null) {
        // NOTE: this card is not actually played to board
        // this card is used for reference while the actual followup action's card will be played to board
        this._private.followupCard = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(followup);
        this.injectFollowupPropertiesIntoCard(this._private.followupCard);
      }
    }

    return this._private.followupCard;
  }

  injectFollowupPropertiesIntoCard(followupCard, followupIndex) {
    if (followupIndex == null) { followupIndex = 0; }
    if (followupCard instanceof Card) {
      // set followup properties of action card by copying followup data into card
      let currentFollowupData = this.getFollowupByIndex(followupIndex);
      const currentFollowupPrivateData = currentFollowupData._private;
      if (currentFollowupPrivateData != null) {
        currentFollowupData = UtilsJavascript.fastExtend({}, currentFollowupData);
        delete currentFollowupData._private;
        UtilsJavascript.fastExtend(followupCard._private, currentFollowupPrivateData);
      }
      UtilsJavascript.fastExtend(followupCard, currentFollowupData);
      followupCard.setOwnerId(this.getOwnerId());
      followupCard.setParentCard(this);
      followupCard.setBaseManaCost(0);
      followupCard.setFollowupSourcePosition(this.getPositionForFollowupSourcePosition());
    }
    return followupCard;
  }

  cleanFollowupPropertiesFromCard(followupCard) {
    if (followupCard instanceof Card && followupCard.getIsFollowup()) {
      followupCard.setOwnerId(null);
      followupCard.setParentCard(null);
      followupCard.setBaseManaCost(this.getLastBaseManaCost());
      followupCard.setFollowupSourcePosition(null);
    }
    return followupCard;
  }

  getPassesConditionsForCurrentFollowup() {
    const followupCard = this.getCurrentFollowupCard();
    if (followupCard != null) {
      // check that the followup card has any valid play positions
      if (followupCard.getValidTargetPositions().length === 0) { return false; }

      // a followup condition should be a function that returns a single truthy or falsy value
      // this card and its followup are passed as arguments to each condition function
      let followupConditions = followupCard.getFollowupConditions();
      if (followupConditions != null) {
        if (!_.isArray(followupConditions)) { followupConditions = [followupConditions]; }

        for (var condition of Array.from(followupConditions)) {
          if (!condition(this, followupCard)) { return false; }
        }
      }

      // nothing failed, looks like followup is valid
      return true;
    }

    return false;
  }

  setParentCard(parentCard) {
    return this.parentCardIndex = parentCard != null ? parentCard.getIndex() : undefined;
  }

  getParentCardIndex() {
    return this.parentCardIndex;
  }

  getParentCard() {
    if (this.getParentCardIndex() != null) {
      return this.getGameSession().getCardByIndex(this.getParentCardIndex());
    } else {
      return null;
    }
  }

  addSubCard(card) {
    if (card != null) {
      // add card index to list of sub cards
      if (this.subCardIndices == null) { this.subCardIndices = []; }
      this.subCardIndices.push(card.getIndex());

      // ensure parent is set correctly
      return card.setParentCard(this);
    }
  }

  getSubCardIndices() {
    return this.subCardIndices || [];
  }

  getSubCards(recursive) {
    return this.getGameSession().getCardsByIndices(this.subCardIndices);
  }

  /**
   * Returns the card played to the board that caused this card to play.
   * NOTE: Can be this card!
   * @returns {Card}
   */
  getRootCard() {
    let currentCard = this;
    while (currentCard.getParentCard() != null) {
      currentCard = currentCard.getParentCard();
    }
    return currentCard;
  }

  /**
   * Returns the first card, from this card to root card, matching type played to the board that caused this card to play.
   * NOTE: Can be this card!
   * @returns {Card|null}
   */
  getAncestorCardOfType(cardType) {
    let currentCard = this;
    while ((currentCard != null) && !CardType.getAreCardTypesEqual(cardType, currentCard.getType())) {
      currentCard = currentCard.getParentCard();
    }
    return currentCard;
  }

  getIsActionForCurrentFollowup(action) {
    // to be the action for the current followup of this card, an action must be:
    // - a play card action
    // - the played card's id must match the id of the next followup
    if ((action != null) && action instanceof PlayCardAction && (__guard__(action.getCard(), x => x.getBaseCardId()) === __guard__(this.getCurrentFollowup(), x1 => x1.id))) {
      return true;
    }

    return false;
  }

  // endregion ### FOLLOWUP ACTIONS ###

  // region ACTION STATE RECORD

  getActionStateRecord() {
    if ((this._private.actionStateRecord == null) && this.getGameSession().getIsRunningOnClient()) {
      this._private.actionStateRecord = new ActionStateRecord();
    }
    return this._private.actionStateRecord;
  }

  setupActionStateRecord() {
    const actionStateRecord = this.getActionStateRecord();
    if ((actionStateRecord != null) && this._private.actionStateRecordNeedsSetup) {
      this._private.actionStateRecordNeedsSetup = false;
      // get properties to record for action
      const actionPropertiesToRecord = this.actionPropertiesForActionStateRecord();
      const needsActionRecord = (actionPropertiesToRecord != null) && (Object.keys(actionPropertiesToRecord).length > 0);
      if (needsActionRecord) {
        actionStateRecord.setupToRecordStateOnEvent(EVENTS.update_cache_action, actionPropertiesToRecord);
      }

      // get properties to record for resolve
      const resolvePropertiesToRecord = this.resolvePropertiesForActionStateRecord();
      const needsResolveRecord = (resolvePropertiesToRecord != null) && (Object.keys(resolvePropertiesToRecord).length > 0);
      if (needsResolveRecord) {
        return actionStateRecord.setupToRecordStateOnEvent(EVENTS.update_cache_step, resolvePropertiesToRecord);
      }
    }
  }

  pauseOrResumeActionStateRecordByLocation() {
    const actionStateRecord = this.getActionStateRecord();
    if (actionStateRecord != null) {
      // card should only record state while in hand, in signature cards, or active on board
      if (this.getIsLocatedInHand() || this.getIsLocatedInSignatureCards() || this.getIsActive()) {
        // start listening to game session deferred event stream
        if (!actionStateRecord.getIsListeningToEvents()) {
          return actionStateRecord.startListeningToEvents(this.getGameSession().getEventBus());
        }
      } else if (actionStateRecord.getIsListeningToEvents()) {
        return actionStateRecord.stopListeningToEvents();
      }
    }
  }

  stopActionStateRecord() {
    const actionStateRecord = this.getActionStateRecord();
    if ((actionStateRecord != null) && actionStateRecord.getIsListeningToEvents()) {
      return actionStateRecord.stopListeningToEvents();
    }
  }

  terminateActionStateRecord() {
    const actionStateRecord = this.getActionStateRecord();
    if ((actionStateRecord != null) && !this._private.actionStateRecordNeedsSetup) {
      this._private.actionStateRecordNeedsSetup = true;
      return actionStateRecord.teardownRecordingStateOnAllEvents();
    }
  }

  actionPropertiesForActionStateRecord() {
    // return map of property names to functions
    // where each function returns a value for the property name
    return {
      manaCost: this.getManaCost.bind(this),
      isSilenced: this.getIsSilenced.bind(this),
      modifierStacks: this.getVisibleModifierStacks.bind(this),
      keywordClasses: this.getKeywordClasses.bind(this)
    };
  }

  resolvePropertiesForActionStateRecord() {
    // return map of property names to functions
    // where each function returns a value for the property name
    return {
      manaCost: this.getManaCost.bind(this),
      isSilenced: this.getIsSilenced.bind(this),
      modifierStacks: this.getVisibleModifierStacks.bind(this),
      keywordClasses: this.getKeywordClasses.bind(this)
    };
  }

  // endregion ACTION STATE RECORD

  // region ### EVENT STREAM ###

  getIsListeningToEvents() {
    return (this._private.listeningToEvents != null);
  }

  startListeningToEvents() {
    this._private.listeningToEvents = true;

    // flush event receiving cards
    // this ensures that cards react in order of play
    this.getOwner().flushCachedEventReceivingCards();

    // setup action state record
    this.setupActionStateRecord();

    // ensure card isn't always recording state
    return this.pauseOrResumeActionStateRecordByLocation();
  }

  stopListeningToEvents() {
    this._private.listeningToEvents = false;

    // flush event receiving cards
    // this ensures that cards react in order of play
    this.getOwner().flushCachedEventReceivingCards();

    // stop recording action state
    return this.stopActionStateRecord();
  }

  // endregion ### EVENT STREAM ###

  // region ### SERIALIZATION ###

  deserialize(data) {
    return UtilsJavascript.fastExtend(this,data);
  }

  postDeserialize() {
    // flush any cached values
    this.flushAllCachedData();

    // it is not possible for an active card to have followups
    if (this.getIsActive()) {
      this.clearFollowups();
    }

    if (!this.getIsRemoved()) {
      // update cached state
      this.updateCachedState();

      // plug into events
      return this.startListeningToEvents();
    }
  }

  /**
   * Returns whether this card is scrubbable based on a perspective of the game.
   * @public
   * @param {String} scrubFromPerspectiveOfPlayerId
   * @param {Boolean} forSpectator
   * @return  {BOOL}  True/false.
   */
  isScrubbable(scrubFromPerspectiveOfPlayerId, forSpectator) {
    if (this.getIsPlayed()) {
      // if it's a previously played card NO need to scrub
      return false;
    } else if (this.isSignatureCard()) {
      // if it's a signature card NO need to scrub
      return false;
    } else if (this.ownerId === scrubFromPerspectiveOfPlayerId) {
      if (forSpectator && !this.getIsLocatedInHand()) {
        // if it's a for a player we're spectating but not located in the player's hand, scrub it
        return true;
      } else {
        // if it's a for a player we're allowed to see, no need to scrub
        return false;
      }
    } else {
      // otherwise scrub it
      return true;
    }
  }

  /**
   * Sets the id of the card this should be hidden as for scrubbing.
   * @public
   * @param {Number} cardId
   */
  setHideAsCardId(cardId) {
    return this.hideAsCardId = cardId;
  }

  /**
   * Returns the id of the card this should be hidden as for scrubbing.
   * @public
   * @returns {Number} cardId
   */
  getHideAsCardId() {
    return this.hideAsCardId;
  }

  /**
   * Returns whether this card is hideable.
   * @public
   * @return  {Boolean}
   */
  isHideable(scrubFromPerspectiveOfPlayerId, forSpectator) {
    return this.getIsPlayed() && (this.hideAsCardId != null) && (this.ownerId !== scrubFromPerspectiveOfPlayerId);
  }

  /**
   * Hides the card during scrubbing as another card.
   * @public
   * @return  {Card}
   */
  createCardToHideAs() {
    // retain prismatic state
    let {
      hideAsCardId
    } = this;
    if (Cards.getIsPrismaticCardId(this.getId())) {
      hideAsCardId = Cards.getPrismaticCardId(hideAsCardId);
    }

    // create card that will hide this card
    const hiddenCard = this.getGameSession().createCardForIdentifier(hideAsCardId);

    // copy required properties
    hiddenCard.setIndex(this.index);
    hiddenCard.setOwnerId(this.ownerId);
    hiddenCard.setLocation(this.location);

    // notify card it was created to hide this card
    hiddenCard.onCreatedToHide(this);

    return hiddenCard;
  }

  /**
   * Method called automatically when this was created to hide a card.
   * @public
   * @param {Card} source
   */
  onCreatedToHide(source) {}
    // override in sub class to implement custom behavior

  setReferencedCardData(cardData) {
    return this._private.referencedCardData = cardData;
  }

  getReferencedCardData() {
    return this._private.referencedCardData;
  }
}
Card.initClass();

  // endregion ### SERIALIZATION ###

module.exports = Card;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}