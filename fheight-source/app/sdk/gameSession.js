/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
why is code organized int his weird fashion? check: https://coderwall.com/p/myzvmg
*/


class GameSession {
  static initClass() {
  
    // region INSTANCE
  
    this.instance = null;
  
    // endregion INSTANCE
  
    // region CACHES
  
    this._cardsCachedAt = null; // When the card caches were last built.
    this._cardCaches = null;
  
    /**
    * Map of keys to cache cards by. All keys will have own caches and then will cross cache in all possible combinations.
    * NOTE: keys must not conflict with each other or any of the utility method names!
    * @example
    *  {
    *    key: "keyName" # string name of key, where getter method is "getKeyName"
    *    getGroupKey: (card) -> return card.getCardSetId() # method that returns a string, number, or boolean as a key to group card by
    *    getGroupKeys: () -> return ["groupKey1", ..., "groupKeyN"] # method that returns an array of strings, numbers, or booleans that contains all possible group keys
    *  }
    * @see getCardCaches
    */
    this._cacheCardsBy = [
      {
        key: "cardSet",
        getGroupKey(card) { return card.getCardSetId(); },
        getGroupKeys() { return _.map(_.filter(Object.keys(CardSet), key => !_.isObject(CardSet[key]) && !_.isFunction(CardSet[key])), key => CardSet[key]); }
      },
      {
        key: "faction",
        getGroupKey(card) { return card.getFactionId(); },
        getGroupKeys() { return _.map(_.filter(Object.keys(Factions), key => !_.isObject(Factions[key]) && !_.isFunction(Factions[key])), key => Factions[key]); }
      },
      {
        key: "rarity",
        getGroupKey(card) { return card.getRarityId(); },
        getGroupKeys() { return _.map(_.filter(Object.keys(Rarity), key => !_.isObject(Rarity[key]) && !_.isFunction(Rarity[key])), key => Rarity[key]); }
      },
      {
        key: "race",
        getGroupKey(card) { return card.getRaceId(); },
        getGroupKeys() { return _.map(_.filter(Object.keys(Races), key => !_.isObject(Races[key]) && !_.isFunction(Races[key])), key => Races[key]); }
      },
      {
        key: "isToken",
        getGroupKey(card) { return card.getRarityId() === Rarity.TokenUnit; },
        getGroupKeys() { return [true, false]; }
      },
      {
        key: "type",
        getGroupKey(card) { return card.getType(); },
        getGroupKeys() { return _.map(_.filter(Object.keys(CardType), key => !_.isObject(CardType[key]) && !_.isFunction(CardType[key])), key => CardType[key]); }
      },
      {
        key: "isGeneral",
        getGroupKey(card) { return card instanceof Entity && card.getIsGeneral(); },
        getGroupKeys() { return [true, false]; }
      },
      {
        key: "isCollectible",
        getGroupKey(card) { return card.getIsCollectible(); },
        getGroupKeys() { return [true, false]; }
      },
      {
        key: "isUnlockable",
        getGroupKey(card) { return card.getIsUnlockable(); },
        getGroupKeys() { return [true, false]; }
      },
      {
        key: "isHiddenInCollection",
        getGroupKey(card) { return card.getIsHiddenInCollection(); },
        getGroupKeys() { return [true, false]; }
      },
      {
        key: "isPrismatic",
        getGroupKey(card) { return Cards.getIsPrismaticCardId(card.getId()); },
        getGroupKeys() { return [true, false]; }
      },
      {
        key: "isSkinned",
        getGroupKey(card) { return Cards.getIsSkinnedCardId(card.getId()); },
        getGroupKeys() { return [true, false]; }
      },
      {
        key: "isLegacy",
        getGroupKey(card) { return card.getIsLegacy() || (CardSetFactory.cardSetForIdentifier(card.getCardSetId()).isLegacy != null); },
        getGroupKeys() { return [true, false]; }
      }
    ];
  }

  static create() {
    return new _GameSession();
  }

  static getInstance() {
    //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.getInstance"
    if (this.instance == null) { this.instance = new _GameSession(); }
    return this.instance;
  }

  // alias of "getInstance"
  static current() {
    if (this.instance == null) { this.instance = new _GameSession(); }
    return this.instance;
  }

  static reset() {
    if (this.instance != null) {
      this.instance.terminate();
      return this.instance = null; // caches of all cards
    }
  }

  /**
  * Returns all card caches.
  * NOTE: getCardCaches() will lazily create all cards and all further chained methods will lazily group those cards
  * @param {moment} systemTime
  * @public
  * @example
  * # getCardCaches returns an object with getter methods
  * # each part of the cache chain also returns a similar object
  * GameSession.getCardCaches().getCards() # returns array of cards
  * GameSession.getCardCaches().getCardIds() # returns array of card ids
  * GameSession.getCardCaches().getCardsData() # returns array of {id: cardId} objects
  *
  * # the cache chain is created for each key in GameSession._cacheCardsBy
  * # where each key value is mapped to a getter method
  * # such as the getter method "getCardSet" for the key "cardSet"
  * GameSession.getCardCaches().getCardSet(cardSetId).getCards()
  * GameSession.getCardCaches().getFaction(factionId).getCardIds()
  * GameSession.getCardCaches().getRarity(rarityId).getCardsData()
  * ...etc
  *
  * # the cache chain can be traversed in any order
  * # but it is recommended that traversal be done in order from general to specific
  * # to prevent unnecessary caches from being created
  * GameSession.getCardCaches().getCardSet(cardSetId).getFaction(factionId).getCards()
  * GameSession.getCardCaches().getFaction(factionId).getCardSet(cardSetId).getCards()
  * GameSession.getCardCaches().getCardSet(cardSetId).getRarity(rarityId).getFaction(factionId).getCardIds()
  * GameSession.getCardCaches().getRarity(rarityId).getFaction(factionId).getCardSet(cardSetId).getCardIds()
  * ...etc
  */
  static getCardCaches(systemTime) {
    this._buildCachesIfNeeded(systemTime);
    return this._cardCaches;
  }

  /**
  * Builds caches of sdk card objects and cardIds
  * @param {moment} systemTime
  * @private
  */
  static _buildCachesIfNeeded(systemTime){
    const MOMENT_NOW_UTC = systemTime || moment().utc();

    // we don't have a cached array or if the month has changed since last cache
    // we need to check month because monthly content cards are invisible until month rolls over
    if ((GameSession._cardsCachedAt == null) || (MOMENT_NOW_UTC.month() !== GameSession._cardsCachedAt.month())) {
      GameSession._cardsCachedAt = moment(MOMENT_NOW_UTC);
      Logger.module("GameSession").debug("_buildCachesIfNeeded() -> building card cache.".yellow);

      // get a list of factions indexed by ID
      // so we can check if a faction is in development when filtering cards
      const factionsHash = {};
      for (var faction of Array.from(FactionFactory.getAllFactions())) {
        factionsHash[faction.id] = faction;
      }

      // create all cards
      const gameSession = GameSession.create();
      let allCards = CardFactory.getAllCards(gameSession);

      // reject cards that are:
      // - unreleased / in development
      // - hidden to users
      // - not in an enabled faction
      allCards = _.filter(allCards, card => card.getIsAvailable(MOMENT_NOW_UTC) &&
          (factionsHash[card.getFactionId()] != null) &&
          (factionsHash[card.getFactionId()].isInDevelopment !== true));

      // create recursive caching methods
      const cacheRecursive = function(cacheInto, cacheByMasterKey, cardsToCache, cacheByRemaining) {
        // cache cards
        if (cardsToCache == null) { cardsToCache = []; }

        var cache = (cacheInto[cacheByMasterKey] = {
          cards: cardsToCache,
          getCards() { return this.cards; },

          cardsById: null,
          getCardById(cardId) {
            // lazy create map of all cards by id for easy lookup
            const cardsById = {};
            for (var card of Array.from(this.cards)) {
              cardsById[card.getId()] = card;
            }
            cache.cardsById = cardsById;
            cache.getCardById = function(cardId) { return this.cardsById[cardId]; };
            return cardsById[cardId];
          },

          cardIds: null,
          getCardIds() {
            // lazy map cards to ids
            const cardIdsToCache = _.map(cardsToCache, card => card.getId());
            cache.cardIds = cardIdsToCache;
            // replace lazy getter method
            cache.getCardIds = function() { return this.cardIds; };
            return cardIdsToCache;
          },

          cardsData: null,
          getCardsData() {
            // lazy map cards to data objects
            const cardsDataToCache = _.map(cardsToCache, card => ({
              id: card.getId()
            }));
            cache.cardsData = cardsDataToCache;
            // replace lazy getter method
            cache.getCardsData = function() { return this.cardsData; };
            return cardsDataToCache;
          }
        });

        // create methods to lazy cache all sub keys when called
        return Array.from(cacheByRemaining).map((cacheByData) =>
          createLazySubCache(cache, cacheByData, cardsToCache, cacheByRemaining));
      };

      var createLazySubCache = function(cache, cacheByData, cardsToCache, cacheByRemaining) {
        // create getter method to lazy init sub cache
        // (this method gets replaced when sub cache is created)
        const cacheByKey = cacheByData.key;
        return cache["get" + cacheByKey.slice(0, 1).toLocaleUpperCase() + cacheByKey.slice(1)] = function(key) {
          createSubCache(cache, cacheByData, cardsToCache, cacheByRemaining);
          return cache[cacheByKey][key];
        };
      };

      var createSubCache = function(cache, cacheByData, cardsToCache, cacheByRemaining) {
        let groupKey;
        const cacheByKey = cacheByData.key;
        const groupMethod = cacheByData.getGroupKey;
        const cacheByGroupKeys = cacheByData.getGroupKeys();
        const cardsGrouped = {};

        // create groups
        for (groupKey of Array.from(cacheByGroupKeys)) {
          cardsGrouped[groupKey] = [];
        }

        // group cards
        for (var card of Array.from(cardsToCache)) {
          cardsGrouped[groupMethod(card)].push(card);
        }

        // create sub cache for sub key
        const subCache = (cache[cacheByKey] = {});

        // create getter method for sub cache card groups
        cache["get" + cacheByKey.slice(0, 1).toLocaleUpperCase() + cacheByKey.slice(1)] = key => subCache[key];

        // remove sub key from remaining
        const subCacheByRemaining = [];
        for (var subCacheByData of Array.from(cacheByRemaining)) {
          var subCacheByKey = subCacheByData.key;
          if (subCacheByKey !== cacheByKey) {
            subCacheByRemaining.push(subCacheByData);
          }
        }

        // cache each group of cards
        return (() => {
          const result = [];
          for (groupKey of Array.from(cacheByGroupKeys)) {
            result.push(cacheRecursive(subCache, groupKey, cardsGrouped[groupKey], subCacheByRemaining));
          }
          return result;
        })();
      };

      // create caches starting with all cards
      return cacheRecursive(GameSession, "_cardCaches", allCards, GameSession._cacheCardsBy);
    }
  }
}
GameSession.initClass();

  // endregion CACHES

module.exports = GameSession;

var moment = require('moment');
var _ = require('underscore');
var Logger = require('app/common/logger');

Logger.module('SDK').log('Loading cards...'); // Takes 10-15 seconds.
const Card = require('./cards/card');
var CardFactory = require('./cards/cardFactory');
var CardSet = require('app/sdk/cards/cardSetLookup');
var CardSetFactory = require('app/sdk/cards/cardSetFactory');
var CardType = require('./cards/cardType');
var Cards = require('app/sdk/cards/cardsLookupComplete');
var FactionFactory = require('app/sdk/cards/factionFactory');
var Factions = require('app/sdk/cards/factionsLookup');
var Races = require('app/sdk/cards/racesLookup');
var Rarity = require('app/sdk/cards/rarityLookup');

Logger.module('SDK').log('Finishing SDK initialization...');
const SDKObject = require('./object');
const CONFIG = require('app/common/config');
const EventBus = require('app/common/eventbus');
const EVENTS = require('app/common/event_types');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const GameType = require('./gameType');
const GameFormat = require('./gameFormat');
const Player = require('./player');
const BattleMapTemplate = require('./battleMapTemplate');
const Board = require('./board');
var Entity = require('./entities/entity');
const Unit = require('./entities/unit');
const Spell = require('./spells/spell');
const Artifact = require('./artifacts/artifact');
const GameTurn = require('./gameTurn');
const ActionFactory = require('./actions/actionFactory');
const Modifier = require('./modifiers/modifier');
const PlayerModifier = require('./playerModifiers/playerModifier');
const ModifierFactory = require('./modifiers/modifierFactory');
const GameStatus = require('./gameStatus');
const Step = require('./step');
const NetworkManager = require('./networkManager');
const ChallengeCategory = require('./challenges/challengeCategory');
const CosmeticsFactory = require('./cosmetics/cosmeticsFactory');
const ModifierCustomSpawn = require('./modifiers/modifierCustomSpawn');

const Action = require('./actions/action');
const ResignAction = require('./actions/resignAction');
const StartTurnAction = require('./actions/startTurnAction');
const EndTurnAction = require('./actions/endTurnAction');
const RevealHiddenCardAction = require('./actions/revealHiddenCardAction');
const StopBufferingEventsAction = require('./actions/stopBufferingEventsAction');
const RemoveAction = require('./actions/removeAction');
const DieAction = require('./actions/dieAction');
const KillAction = require('./actions/killAction');
const DrawCardAction = require('./actions/drawCardAction');
const PutCardInHandAction = require('./actions/putCardInHandAction');
const PutCardInDeckAction = require('./actions/putCardInDeckAction');
const ApplyCardToBoardAction = require('./actions/applyCardToBoardAction');
const GenerateSignatureCardAction = require('./actions/generateSignatureCardAction');
const PlayCardAction = require('./actions/playCardAction');
const RollbackToSnapshotAction = require('./actions/rollbackToSnapshotAction');
const ApplyModifierAction = require('./actions/applyModifierAction');
const RemoveModifierAction = require('./actions/removeModifierAction');
const PlayCardFromHandAction = require('./actions/playCardFromHandAction');

const ValidatorExecuteExplicitAction = require('./validators/validatorExecuteExplicitAction');
const ValidatorPlayCard = require('./validators/validatorPlayCard');
const ValidatorApplyCardToBoard = require('./validators/validatorApplyCardToBoard');
const ValidatorEntityAction = require('./validators/validatorEntityAction');
const ValidatorFollowup = require('./validators/validatorFollowup');
const ValidatorReplaceCardFromHand = require('./validators/validatorReplaceCardFromHand');
const ValidatorScheduledForRemoval = require('./validators/validatorScheduledForRemoval');

class _GameSession extends SDKObject {
  static initClass() {
  
    this.prototype.aiDifficulty = null;
    this.prototype.aiPlayerId =null;
    this.prototype.board = null;
    this.prototype.cardsByIndex =null; // master map of cards in this game
    this.prototype.createdAt =null;
    this.prototype.currentTurn =null; // the currently active turn
    this.prototype.battleMapTemplate = null; // properties determining the battle map environment this game is payed in (map, weather, etc)
    this.prototype.gameId = "N/A";
    this.prototype.gameType = null; // see GameType lookup
    this.prototype.gameFormat = null; // see GameType lookup
    this.prototype.index = 0;
    this.prototype.lastActionTimestamp =null;
    this.prototype.modifiersByIndex =null; // master map of modifiers played in this game
    this.prototype.players =null; // master list of players in this game
    this.prototype.gameSetupData = null; // sparse snapshot of player state after game was first setup, usually used for replays
    this.prototype.status =null; // status of game (i.e. whether new, active, or over)
    this.prototype.swapPlayersOnNewTurn =true; // normally true, but can be set false by certain effects (take another turn after this one)
    this.prototype.turns =null; // master list of turns in this game, where each turn contains a list of steps played during its time
    this.prototype.updatedAt =null;
  
    this.prototype.getLocalPlayer = this.prototype.getMyPlayer;
  }

  constructor() {
    super(null); // Cant pass this before super
    this.setGameSession(this); // Set gameSession after super

    // define public properties here that must be always be serialized
    // do not define properties here that should only serialize if different from the default
    this.gameSetupData = {players: []};
    this.status = GameStatus.new;
    this.cardsByIndex = {};
    this.modifiersByIndex = {};

    this.createdAt = Date.now();
    this.updatedAt = Date.now();

    this.turns = [];
    this.currentTurn = new GameTurn(this);

    this.players = [];
    const player1 = new Player(this, "1", "player1");
    player1.setStartingMana(CONFIG.STARTING_MANA);
    this.players.push(player1);
    const player2 = new Player(this, "2", "player2");
    player2.setStartingMana(CONFIG.STARTING_MANA + 1);
    this.players.push(player2);
    this.getPlayer1().setIsCurrentPlayer(true);

    this.battleMapTemplate = new BattleMapTemplate(this);

    this.board = new Board(this, CONFIG.BOARDCOL, CONFIG.BOARDROW );
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    // caches
    p.cachedGeneralsByPlayerId = {};
    p.cachedEventReceivingCards = null;

    // events
    p.eventBus = EventBus.create();
    p.eventBuffer = [];
    p.eventReceivingCardsOnBoard = [];

    // action queue
    p.action = null; // currently executing action
    p.actionExecutionEventType = null;
    p.actionExecutionEventTypeStack = [];
    p.actionsToResolve = []; // actions that have been executed and need resolution during step resolve phase
    p.actionsByIndex = {}; // map of actions by index, reconstructed from all steps in all turns
    p.actionQueue = null;
    p.blockActionExecution = false;
    p.cardStack = []; // stack of cards actively applying to board during action execution loop (top is most recent)
    p.depthFirstActions = []; // list of depth first actions that have been executed for the currently executing action
    p.gameOverRequested = false;
    p.hasDrawnCardsForTurn = false;
    p.hasActivatedSignatureCardForTurn = false;
    p.lastStep = null;
    p.modifierStack = []; // stack of modifiers that are triggering during action execution loop (top is most recent)
    p.nonDepthFirstAction = null; // currently executing non depth first action
    p.parentAction = null; // current parent action
    p.resolveAction = null; // current resolve action
    p.updatedElapsedEndTurn = false; // whether end turn duration elapsed has updated
    p.updatedElapsedStartTurn = false; // whether start turn duration elapsed has updated
    p.startTurnAction = null; // current start turn action if turns are changing
    p.step = null; // currently executing step
    p.stepsByIndex = {}; // map of steps by index
    p.stepQueue = []; // current queue of steps to be executed
    p.submittedExplicitAction = null; // action submitted for execution by an authoritative source

    // followups
    p.followupActive = false; // whether followups are being played (valid for server, player, and opponent)
    p.isBufferingEvents = false; // whether events should be buffered (valid for server, player, and opponent)
    p.rollbackSnapshotData = null; // current rollback snapshot if followups are being played (only valid for server and player)
    p.rollbackSnapshotDataDiscardRequested = false;
    p.rollbackToSnapshotRequested = false;

    // misc
    p.challenge = null;
    p.isDeveloperMode = false; // whether game is a developer game
    p.isRunningAsAuthoritative = false; // whether game is authoritative
    p.isSpectateMode = false; // whether game is a spectate game
    p.isReplay = false; // whether a game is a replay
    p.isSignatureCardAlwaysReady = false; // override signature card to be ready every turn instead of based on timer
    p.turnTimeRemaining = CONFIG.TURN_DURATION + CONFIG.TURN_DURATION_LATENCY_BUFFER; // remaining turn time
    p.userId = ""; // id of user this game is the client for

    // master list of validators (anti-cheat) for this game
    p.validators = [];
    p.validators.push(new ValidatorScheduledForRemoval(this));
    p.validators.push(new ValidatorExecuteExplicitAction(this));
    p.validators.push(new ValidatorPlayCard(this));
    p.validators.push(new ValidatorReplaceCardFromHand(this));
    p.validators.push(new ValidatorApplyCardToBoard(this));
    p.validators.push(new ValidatorEntityAction(this));
    p.validatorFollowup = new ValidatorFollowup(this);
    p.validators.push(p.validatorFollowup);

    return p;
  }

  /**
   * Terminates and cleans up this game session instance. No more events or actions are allowed.
   */
  terminate() {
    Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS.terminate");
    this.pushEvent({type: EVENTS.terminate, gameSession: this}, {blockActionExecution: true});
    this._private.eventBuffer = [];
    return __guard__(this.getEventBus(), x => x.off());
  }

  // region getters / setters

  generateIndex() {
    return this.index = (this.index + 1 + (Math.random() * 100.0)) | 0;
  }

  getGameId() {
    return this.gameId;
  }

  getGameSetupData() {
    return this.gameSetupData;
  }

  getPlayer1SetupData() {
    return this.gameSetupData.players[0];
  }

  getPlayer2SetupData() {
    return this.gameSetupData.players[1];
  }

  getMyPlayerSetupData() {
    if (this.getPlayer1Id() === this.getMyPlayerId()) {
      return this.getPlayer1SetupData();
    } else {
      return this.getPlayer2SetupData();
    }
  }

  getOpponentPlayerSetupData() {
    if (this.getPlayer1Id() === this.getOpponentPlayerId()) {
      return this.getPlayer1SetupData();
    } else {
      return this.getPlayer2SetupData();
    }
  }

  getPlayerSetupDataForPlayerId(playerId) {
    if (this.getPlayer1Id() === playerId) {
      return this.getPlayer1SetupData();
    } else {
      return this.getPlayer2SetupData();
    }
  }

  setValidators(val) {
    return this._private.validators = val;
  }

  getValidators() {
    return this._private.validators;
  }

  getValidatorFollowup() {
    return this._private.validatorFollowup;
  }

  getBoard() {
    return this.board;
  }

  getBattleMapTemplate() {
    return this.battleMapTemplate;
  }

  setBattleMapTemplate(battleMapTemplate) {
    return this.battleMapTemplate = battleMapTemplate;
  }

  /**
  * Get how many MS there are remaining in the turn. For now, this is a value that is set on the game session by an outside controller based on server or local client timer. This value can be used to bind to periodically bind UI or to check against.
  * @return {int} Turn milliseconds remaining.
  */
  getTurnTimeRemaining() {
    return this._private.turnTimeRemaining;
  }

  /**
  * Set remaining turn time info.
  * @param {int}    Turn milliseconds remaining.
  */
  setTurnTimeRemaining(value) {
    this._private.turnTimeRemaining = value;
    return this.pushEvent({type: EVENTS.turn_time, time:value, gameSession: this});
  }

  // endregion getters

  // region event streams

  /**
   * Returns the event bus where all events are piped through.
    */
  getEventBus() {
    return this._private.eventBus;
  }

  /**
   * Push an event directly, ignoring followup buffering.
   * @param {Object} event event object
   * @param {Object} [options=null] optional flags and properties to control how the event is pushed to the stream
   * @example
   * event = {type: "event_type", eventProperty: "property_value", ...}
   * GameSession.getInstance().pushEvent(event, {
   *  blockActionExecution: true, # whether to automatically block any actions created in response to this event
   *  action: null # force the parent action of this event to a specific action
   *  resolveAction: null # force the resolve parent action of this event to a specific action (useful for resolve events)
   * })
   */
  pushEvent(event, options) {
    const eventType = event.type;
    this.pushEventTypeToStack(eventType);

    if ((options == null)) {
      // push, no options
      this._private.blockActionExecution = false;

      // push event to session, players, cards, modifiers
      this._pushEventToSession(event, options);

      // push event to bus
      this.getEventBus().trigger(eventType, event);
    } else {
      let lastAction, lastResolveAction;
      if (options.blockActionExecution) {
        this._private.blockActionExecution = true;
      }

      // forced actions
      const {
        action
      } = options;
      const {
        resolveAction
      } = options;
      if (action != null) {
        lastAction = this.getExecutingAction();
        this.setExecutingAction(action);
      }
      if (resolveAction != null) {
        lastResolveAction = this.getExecutingResolveAction();
        this.setExecutingResolveAction(resolveAction);
      }

      // push event to session, players, cards, modifiers
      this._pushEventToSession(event, options);

      // push event to bus
      this.getEventBus().trigger(eventType, event);

      // reset forced actions
      if (action != null) {
        this.setExecutingAction(lastAction);
      }
      if (resolveAction != null) {
        this.setExecutingResolveAction(lastResolveAction);
      }
    }

    // execute any authoritative sub actions for the event's action that occurred during this event
    const parentAction = this.getExecutingParentAction();
    if (event.executeAuthoritativeSubActions && (parentAction != null)) {
      parentAction.executeNextOfEventTypeFromAuthoritativeSubActionQueue(eventType);
    }

    // reset
    this._private.blockActionExecution = false;
    return this.popEventTypeFromStack();
  }


  /**
   * Pushes an event to the session. Do not call this method directly, use pushEvent instead. Order of events is:
   * - validators
   * - challenge
   * - players
   * - player cards
   * - player card's modifiers
   * - game session cards
   */
  _pushEventToSession(event, options) {
    const {
      isBufferable
    } = event;

    // push event to validators
    for (var validator of Array.from(this.getValidators())) {
      validator.onEvent(event);
    }

    // push event to challenge
    if (this._private.challenge != null) {
      this._private.challenge.onEvent(event);
    }

    // push event to players and their cards
    this.getCurrentPlayer().onEvent(event);
    this.getNonCurrentPlayer().onEvent(event);

    // push event to game session cards
    for (var card of Array.from(this.getEventReceivingCards())) {
      card.onEvent(event);
      if (this.getIsBufferingEvents() && isBufferable) { break; }
    }

    // if buffering began while processing bufferable event
    // return event to event buffer
    if (isBufferable && this.getIsBufferingEvents()) {
      return this._private.eventBuffer.push({
        event,
        options
      });
    }
  }

  pushEventTypeToStack(eventType) {
    this.getActionExecutionEventTypeStack().push(eventType);
    return this.setActionExecutionEventType(eventType);
  }

  popEventTypeFromStack() {
    const eventTypeStack = this.getActionExecutionEventTypeStack();
    eventTypeStack.pop();
    return this.setActionExecutionEventType(eventTypeStack[eventTypeStack.length - 1]);
  }

  getCurrentEventType() {
    const eventTypeStack = this.getActionExecutionEventTypeStack();
    return eventTypeStack[eventTypeStack.length - 1];
  }

  /**
   * Buffer an event as needed, otherwise push directly.
   * @param {Object} event event object
   * @param {Object} [options=null] optional event options
   * @see pushEvent
   */
  pushBufferableEvent(event, options) {
    event.isBufferable = true;
    if (this.getIsBufferingEvents()) {
      return this._private.eventBuffer.push({
        event,
        options
      });
    } else {
      return this.pushEvent(event, options);
    }
  }

  // endregion event streams

  // region event buffering

  getIsBufferingEvents() {
    return this._private.isBufferingEvents;
  }

  /**
   * SDK (package) level method that may be called to start buffering action events.
   */
  p_startBufferingEvents() {
    Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS.p_startBufferingEvents");
    return this._private.isBufferingEvents = true;
  }

  /**
   * SDK (package) level method that may be called to end buffering, end followup, discard rollback snapshot, and flush the buffered events.
   */
  p_stopBufferingEvents() {
    Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS.p_stopBufferingEvents");
    // retain buffer in case we were buffering before discard
    const bufferedEvents = this._private.eventBuffer;
    this._discardRollbackSnapshot();

    if (!this.isOver()) {
      // validate game over request
      if (this._private.gameOverRequested) {
        this._validateGameOverRequest();
      }

      // flush buffered events
      if (bufferedEvents && (bufferedEvents.length > 0)) {
        Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS._flushBufferedEvents");
        // push all previously buffered events to main event stream
        return (() => {
          const result = [];
          for (let i = 0; i < bufferedEvents.length; i++) {
          //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS._flushBufferedEvents -> type #{eventData.event?.type} action? #{eventData.event?.action?.getLogName()}"
            var eventData = bufferedEvents[i];
            this.pushEvent(eventData.event, eventData.options, true);

            // if events started buffering again during flush
            // stop flush and move remaining buffered events back into event buffer
            if (this.getIsBufferingEvents() && (bufferedEvents.length > (i + 1))) {
              //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS._flushBufferedEvents -> buffering started mid-flush, moving #{bufferedEvents.length - (i + 1)} events back into buffer"
              this._private.eventBuffer = this._private.eventBuffer.concat(bufferedEvents.slice(i + 1));
              break;
            } else {
              result.push(undefined);
            }
          }
          return result;
        })();
      }
    }
  }

  /**
   * Helper method to generate a stop buffering events action.
   */
  actionStopBufferingEvents() {
    const endBufferingAction = this.createActionForType(StopBufferingEventsAction.type);
    endBufferingAction.setOwnerId(this.getCurrentPlayerId());
    return endBufferingAction;
  }

  // endregion event buffering

  // region followups

  getIsFollowupActive() {
    return this._private.followupActive;
  }

  getIsMyFollowupActive() {
    return this.isMyTurn() && this.getIsFollowupActive();
  }

  getIsMyFollowupActiveAndCancellable() {
    // allow active followups to be cancelled when not in a tutorial
    return this.getIsMyFollowupActive() && !this.isTutorial();
  }

  _startFollowup() {
    if (!this._private.followupActive) {
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS._startFollowup"
      this._private.followupActive = true;
      this.p_startBufferingEvents();

      // rollback snapshots are only allowed for the player playing the followup or the server
      if (this.isMyTurn() || this.getIsRunningAsAuthoritative()) {
        this._private.rollbackSnapshotData = this.generateGameSessionSnapshot();
        return this.pushEvent({type: EVENTS.rollback_to_snapshot_recorded, gameSession: this}, {blockActionExecution: true});
      }
    }
  }

  // endregion followups

  // region snapshots

  /**
   * Helper method to generate a rollback to snapshot action.
   */
  actionRollbackSnapshot() {
    const action = this.createActionForType(RollbackToSnapshotAction.type);
    action.setOwnerId(this.getCurrentPlayerId());
    return action;
  }

  /**
   * SDK (package) level method that may be called to force all sdk objects with cached state to immediately sync to the latest game state.
   * NOTE: only use this when setting up a game in a non-standard way. Normally all sdk objects update cached state in response to events.
   */
  syncState() {
    //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.syncState"
    const modifierIndices = Object.keys(this.modifiersByIndex);
    for (var modifierIndex of Array.from(modifierIndices)) {
      var modifier = this.modifiersByIndex[modifierIndex];
      modifier.syncState();
    }

    const cardIndices = Object.keys(this.cardsByIndex);
    for (var cardIndex of Array.from(cardIndices)) {
      var card = this.cardsByIndex[cardIndex];
      card.syncState();
    }

    return Array.from(this.players).map((player) =>
      player.syncState());
  }

  /**
   * SDK (package) level method that may be called to request a rollback.
   * NOTE: only use this during the action execution loop.
   */
  p_requestRollbackToSnapshot() {
    //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.p_requestRollbackToSnapshot"
    this._private.rollbackToSnapshotRequested = true;
    return this.pushEvent({type: EVENTS.rollback_to_snapshot_requested, gameSession: this}, {blockActionExecution: true});
  }

  /**
   * SDK (package) level method that may be called to request a discard of rollback data.
   * NOTE: only use this during the action execution loop.
   */
  p_requestRollbackSnapshotDiscard() {
    //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.p_requestRollbackSnapshotDiscard"
    return this._private.rollbackSnapshotDataDiscardRequested = true;
  }

  generateGameSessionSnapshot() {
    return this.serializeToJSON(this);
  }

  getRollbackSnapshotData() {
    return this._private.rollbackSnapshotData;
  }

  _rollbackToSnapshot(snapshotData) {
    if (!snapshotData) {
      snapshotData = this._private.rollbackSnapshotData;
      this._discardRollbackSnapshot();
    }

    // rollback snapshots are only allowed for the player playing the followup or the server
    if ((this.isMyTurn() || this.getIsRunningAsAuthoritative()) && (snapshotData != null)) {
      Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS._rollbackToSnapshot");

      // rollback by deserializing the snapshot data
      this.pushEvent({type: EVENTS.before_rollback_to_snapshot, gameSession: this}, {blockActionExecution: true});
      this.deserializeSessionFromFirebase(JSON.parse(snapshotData));
      return this.pushEvent({type: EVENTS.rollback_to_snapshot, gameSession: this}, {blockActionExecution: true});
    }
  }


  _discardRollbackSnapshot() {
    this._private.followupActive = false;
    this._private.isBufferingEvents = false;
    this._private.rollbackToSnapshotRequested = false;
    this._private.rollbackSnapshotDataDiscardRequested = false;
    this._private.rollbackSnapshotData = null;
    return this._private.eventBuffer = [];
  }

  // endregion snapshots

  // region status

  setIsRunningAsAuthoritative(isRunningAsAuthoritative) {
    return this._private.isRunningAsAuthoritative = isRunningAsAuthoritative;
  }

  getIsRunningAsAuthoritative() {
    return this._private.isRunningAsAuthoritative;
  }

  getIsRunningOnClient() {
    return !this.getIsRunningAsAuthoritative() || GameType.isLocalGameType(this.getGameType());
  }

  getStatus() {
    return this.status;
  }

  setStatus(s) {
    Logger.module("SDK").debug(`[G:${this.gameId}]`, `GS.setStatus - from ${this.status} to ${s}`);
    if (this.status !== s) {
      const prevStatus = this.status;
      this.status = s;
      return this.pushEvent({type: EVENTS.status, status:s, from:prevStatus, to:s, gameSession: this}, {blockActionExecution: true});
    }
  }

  isNew() {
    return this.status === GameStatus.new;
  }

  isActive() {
    return this.status === GameStatus.active;
  }

  isOver() {
    return this.status === GameStatus.over;
  }

  setGameType(val) {
    return this.gameType = val;
  }

  getGameType() {
    return this.gameType;
  }

  setGameFormat(val) {
    return this.gameFormat = val;
  }

  getGameFormat() {
    return this.gameFormat;
  }

  isRanked() {
    return this.gameType === GameType.Ranked;
  }

  isRift() {
    return this.gameType === GameType.Rift;
  }

  isCasual() {
    return this.gameType === GameType.Casual;
  }

  isGauntlet() {
    return this.gameType === GameType.Gauntlet;
  }

  isFriendly() {
    return this.gameType === GameType.Friendly;
  }

  isSandbox() {
    return this.gameType === GameType.Sandbox;
  }

  isChallenge() {
    return this.gameType === GameType.Challenge;
  }

  isDailyChallenge() {
    return this.isChallenge() && __guard__(this.getChallenge(), x => x.isDaily);
  }

  isSinglePlayer() {
    return this.gameType === GameType.SinglePlayer;
  }

  isBossBattle() {
    return this.gameType === GameType.BossBattle;
  }

  isTutorial() {
    return this.isChallenge() && (__guard__(this.getChallenge(), x => x.categoryType) === ChallengeCategory.tutorial.type);
  }

  getAreDecksRandomized() {
    return !this.isChallenge() && !this.getIsDeveloperMode();
  }

  getChallenge(){
    return this._private.challenge;
  }

  setChallenge(val){
    return this._private.challenge = val;
  }

  setAiDifficulty(val) {
    return this.aiDifficulty = val;
  }

  getAiDifficulty() {
    return this.aiDifficulty;
  }

  /**
   * SDK (package) level method that may be called to request a check for whether game is over.
   * NOTE: only use this during the action execution loop.
   */
  p_requestGameOver() {
    //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.p_requestGameOver"
    return this._private.gameOverRequested = true;
  }

  _validateGameOverRequest() {
    // don't bother validating unless game is not yet over and events are not being buffered
    if (!this.isOver() && !this.getIsBufferingEvents()) {
      let player;
      this._private.gameOverRequested = false;

      // emit event that game over state should be validated
      // this gives modifiers a chance to swap general or otherwise prevent general death
      if (!(this.getExecutingAction().getRootAction() instanceof ResignAction)) { this.pushEvent({type: EVENTS.validate_game_over, action: this.getExecutingAction(), executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), gameSession: this}, {resolveAction: this.getExecutingAction()}); }

      // check for dead generals
      const deadGenerals = [];
      for (player of Array.from(this.players)) {
        var general = this.getGeneralForPlayerId(player.getPlayerId());

        // find last general if player currently has no general
        if ((general == null)) {
          var maxRemovedByActionIndex = -1;
          var cardIndices = Object.keys(this.cardsByIndex);
          for (var index of Array.from(cardIndices)) {
            var card = this.cardsByIndex[index];
            if (card instanceof Entity && card.isOwnedBy(player) && card.getWasGeneral()) {
              var removedByActionIndex = card.getRemovedFromBoardByActionIndex();
              if (removedByActionIndex > maxRemovedByActionIndex) {
                general = card;
                break;
              }
            }
          }
        }

        if ((general != null) && general.getIsRemoved()) {
          deadGenerals.push(general);
        }
      }

      // at least one dead general
      if (deadGenerals.length > 0) {
        // when number of generals is greater than 1, we've got a draw
        // otherwise, find player that is winner
        let winningPlayerId;
        if (deadGenerals.length === 1) {
          const deadGeneral = deadGenerals[0];
          for (player of Array.from(this.players)) {
            if (deadGeneral.getOwnerId() !== player.getPlayerId()) {
              winningPlayerId = player.getPlayerId();
            }
          }
        }

        // stop buffering events
        if (this.getIsBufferingEvents()) {
          this.executeAction(this.actionStopBufferingEvents());
        }

        // set winning player if any
        if (winningPlayerId != null) {
          this.getPlayerById(winningPlayerId).setIsWinner(true);
        }

        // set game as over
        this.setStatus(GameStatus.over);

        // emit game over
        this.pushEvent({type: EVENTS.game_over, winner: this.getWinner(), gameSession: this}, {blockActionExecution: true});
        return Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS._validateGameOverRequest -> GAME OVER.".red);
      }
    }
  }

  // endregion status

  // region players

  getPlayerId() {
    return "GameSession";
  }

  setUserId(userId) {
    return this._private.userId = userId;
  }

  getUserId() {
    return this._private.userId;
  }

  isMyTurn() {
    return this.getMyPlayerId() === this.getCurrentPlayer().getPlayerId();
  }

  isMyTurnEnding() {
    return (this.getMyPlayerId() === this.getCurrentPlayer().getPlayerId()) && this.getCurrentTurn().getEnded();
  }

  /**
   * Returns all players.
   * @returns {Array}
   */
  getPlayers() {
    return this.players;
  }

  /**
   * Returns the player for a player id.
   * @param {String} playerId
   */
  getPlayerById(playerId) {
    if (playerId != null) {
      for (var player of Array.from(this.players)) {
        if (player.getPlayerId() === playerId) {
          return player;
        }
      }

      // a player should ALWAYS be found when a player id is defined
      return Logger.module("SDK").error(`[G:${this.gameId}].getPlayerById -> No player found with playerId: `, playerId);
    } else if (this.getUserId() != null) {
      // a player id should always be passed in if we have at least the user id defined
      return Logger.module("SDK").error(`[G:${this.gameId}].getPlayerById -> Cannot get player by NULL playerId!`);
    }
  }

  getMyPlayerId() {
    return this.getUserId();
  }

  getMyPlayer() {
    return this.getPlayerById(this.getMyPlayerId());
  }

  setAiPlayerId(val) {
    return this.aiPlayerId = val;
  }

  getAiPlayerId(){
    return this.aiPlayerId || CONFIG.AI_PLAYER_ID;
  }

  getOpponentPlayerId() {
    const opponentPlayer = this.getOpponentPlayer();
    if (opponentPlayer != null) {
      return opponentPlayer.getPlayerId();
    }
  }

  getOpponentPlayer() {
    return this.getOpponentPlayerOfPlayerId(this.getMyPlayerId());
  }

  getOpponentPlayerIdOfPlayerId(playerId) {
    if (playerId === this.getPlayer1Id()) {
      return this.getPlayer2Id();
    } else {
      return this.getPlayer1Id();
    }
  }

  /**
   * Returns the opponent player for a player id.
   * @param {String} playerId
   */
  getOpponentPlayerOfPlayerId(playerId) {
    if (playerId != null) {
      for (var player of Array.from(this.players)) {
        if (player.getPlayerId() !== playerId) {
          return player;
        }
      }

      // a player should ALWAYS be found when a player id is defined
      return Logger.module("SDK").error(`[G:${this.gameId}].getPlayerById -> No opponent player found to playerId: `, playerId);
    } else if (this.getUserId() != null) {
      // a player id should always be passed in if we have at least the user id defined
      return Logger.module("SDK").error(`[G:${this.gameId}].getPlayerById -> Cannot get opponent player of NULL playerId!`);
    }
  }

  getCurrentPlayer() {
    for (var player of Array.from(this.players)) {
      if (player.getIsCurrentPlayer()) {
        return player;
      }
    }
  }

  getCurrentPlayerId() {
    return this.getCurrentPlayer().getPlayerId();
  }

  getNonCurrentPlayer() {
    for (var player of Array.from(this.players)) {
      if (!player.getIsCurrentPlayer()) {
        return player;
      }
    }
  }

  getNonCurrentPlayerId() {
    return this.getNonCurrentPlayer().getPlayerId();
  }

  getPlayer1() {
    return this.players[0];
  }

  getPlayer1Id() {
    return this.getPlayer1().getPlayerId();
  }

  getPlayer2() {
    return this.players[1];
  }

  getPlayer2Id() {
    return this.getPlayer2().getPlayerId();
  }

  /**
   * Returns the general unit for a player id.
   * @param {String} playerId
   */
  getGeneralForPlayerId(playerId) {
    if (playerId != null) {
      let general = this._private.cachedGeneralsByPlayerId[playerId];

      if ((general == null)) {
        const cardIndices = Object.keys(this.cardsByIndex);
        for (var cardIndex of Array.from(cardIndices)) {
          var card = this.cardsByIndex[cardIndex];
          if (card instanceof Unit && card.getIsGeneral() && (card.getOwnerId() === playerId)) {
            this._private.cachedGeneralsByPlayerId[playerId] = card;
            general = card;
          }
        }
      }

      return general;
    } else if (this.getUserId() != null) {
      // a player id should always be passed in if we have at least the user id defined
      return Logger.module("SDK").error(`[G:${this.gameId}].getGeneralForPlayerId -> Cannot get general of NULL playerId!`);
    }
  }

  getGeneralForPlayer(player) {
    return this.getGeneralForPlayerId(player != null ? player.getPlayerId() : undefined);
  }

  getGeneralForOpponentOfPlayerId(playerId) {
    return this.getGeneralForPlayerId(this.getOpponentPlayerIdOfPlayerId(playerId));
  }

  getGeneralForPlayer1() {
    return this.getGeneralForPlayerId(this.getPlayer1Id());
  }

  getGeneralForPlayer2() {
    return this.getGeneralForPlayerId(this.getPlayer2Id());
  }

  getGeneralForMyPlayer() {
    return this.getGeneralForPlayerId(this.getMyPlayerId());
  }

  getGeneralForOpponentPlayer() {
    return this.getGeneralForPlayerId(this.getOpponentPlayerId());
  }

  /**
   * Flushes the cached found generals by player id. Use this when a general changes during the game.
   */
  flushCachedGeneralsByPlayerId() {
    return this._private.cachedGeneralsByPlayerId = {};
  }

  /**
   * Flushes the cached found general for a player id. Use this when a general changes during the game.
   */
  flushCachedGeneralForPlayerId(playerId) {
    if (playerId != null) {
      return delete this._private.cachedGeneralsByPlayerId[playerId];
    } else {
      return this.flushCachedGeneralsByPlayerId();
    }
  }

  flushCachedGeneralForPlayer(player) {
    return this.flushCachedGeneralForPlayerId(player != null ? player.getPlayerId() : undefined);
  }

  setEntityAsNewGeneral(entity) {
    if (entity instanceof Entity) {
      const owner = entity.getOwner();

      // disable previous general
      const currentGeneral = this.getGeneralForPlayer(owner);
      if (currentGeneral != null) {
        currentGeneral.setIsGeneral(false);
      }

      // enable new general
      entity.setIsGeneral(true);

      // move entity to front of event receiving cards for owner
      owner.moveEventReceivingCardToFront(entity);

      // flush caches
      this.flushCachedGeneralForPlayer(owner);
      return owner.flushCachedEventReceivingCards();
    }
  }

  setEntityAsNotGeneral(entity) {
    if (entity instanceof Entity) {
      const owner = entity.getOwner();

      // remove all player modifiers from old general
      const iterable = entity.getModifiers();
      for (let i = iterable.length - 1; i >= 0; i--) {
        var modifier = iterable[i];
        if (modifier instanceof PlayerModifier) {
          this.getGameSession().removeModifier(modifier);
        }
      }

      // disable entity as general
      entity.setIsGeneral(false);

      // move entity to end of event receiving cards for owner
      owner.removeEventReceivingCardOnBoard(entity);
      owner.addEventReceivingCardOnBoard(entity);

      // flush caches
      this.flushCachedGeneralForPlayer(owner);
      return owner.flushCachedEventReceivingCards();
    }
  }

  /**
   * Returns the event receiving cards for the game session. Does not include player's event receiving cards.
   */
  getEventReceivingCards() {
    // this has to be its own array so that it cannot be modified mid event loop
    if (this._private.cachedEventReceivingCards == null) { this._private.cachedEventReceivingCards = [].concat(
      this.getEventReceivingCardsOnBoard()
    ); }
    return this._private.cachedEventReceivingCards;
  }

  /**
   * Flushes all cached cards.
   */
  flushAllCachedCards() {
    return this.flushCachedEventReceivingCards();
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

  getWinner() {
    for (var player of Array.from(this.players)) {
      if (player.getIsWinner()) {
        return player;
      }
    }
  }

  getWinnerId() {
    return __guard__(this.getWinner(), x => x.getPlayerId());
  }

  getLoser() {
    for (var player of Array.from(this.players)) {
      if (!player.getIsWinner()) {
        return player;
      }
    }
  }

  getLoserId() {
    return __guard__(this.getLoser(), x => x.getPlayerId());
  }

  willSwapCurrentPlayerNextTurn() {
    return this.swapPlayersOnNewTurn;
  }

  skipSwapCurrentPlayerNextTurn() {
    return this.swapPlayersOnNewTurn = false;
  }

  getIsDeveloperMode(){
    return this._private.isDeveloperMode;
  }

  setIsDeveloperMode(val){
    return this._private.isDeveloperMode = val || false;
  }

  setIsSpectateMode(val){
    return this._private.isSpectateMode = val;
  }

  getIsSpectateMode(val){
    return this._private.isSpectateMode;
  }

  setIsReplay(val){
    return this._private.isReplay = val;
  }

  getIsReplay(val){
    return this._private.isReplay;
  }

  setIsSignatureCardAlwaysReady(val){
    return this._private.isSignatureCardAlwaysReady = val;
  }

  getIsSignatureCardAlwaysReady(val){
    return this._private.isSignatureCardAlwaysReady;
  }

  getIsSignatureCardAlwaysReadyForPlayer(player){
    return player.getIsSignatureCardAlwaysReady();
  }

  // endregion players

  // region turns

  /**
   * Returns the master array of turns. Do not modify this array.
   * @returns {Array}
   */
  getTurns() {
    return this.turns;
  }

  getCurrentTurn() {
    return this.currentTurn;
  }

  /**
   * Helper method to generate an end turn action.
   */
  actionEndTurn() {
    const endTurnAction = this.createActionForType(EndTurnAction.type);
    endTurnAction.setOwnerId(this.getCurrentPlayerId());
    return endTurnAction;
  }

  /**
   * SDK (package) level method that may be called to end the current turn.
   * NOTE: only use this during the action execution loop.
   */
  p_endTurn() {
    if (this.isActive() && !this.getCurrentTurn().getEnded()) {
      Logger.module("SDK").debug(`[G:${this.gameId}]`, `GS.p_endTurn -> turn count: ${this.getNumberOfTurns()}`);
      const currentPlayer = this.getCurrentPlayer();

      // set current turn as ended
      this.currentTurn.setEnded(true);

      // make sure ended turn is tagged with player id
      this.currentTurn.setPlayerId(currentPlayer.getPlayerId());

      // add ended turn to turn stack
      this.turns.push(this.currentTurn);

      return this.pushEvent({type: EVENTS.end_turn, action: this.getExecutingAction(), executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), turn: this.currentTurn, gameSession: this});
    }
  }

  /**
   * SDK (package) level method that may be called to start a new turn.
   * NOTE: only use this during the action execution loop.
   */
  p_startTurn() {
    if (this.isActive()) {
      let player;
      let allowUntargetable;
      Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS._startNextTurn");

      // usually active player will swap on new turn
      if (this.swapPlayersOnNewTurn) {
        // update players
        for (player of Array.from(this.players)) {
          // set current player
          if (player.getIsCurrentPlayer()) {
            player.setIsCurrentPlayer(false);
          } else {
            player.setIsCurrentPlayer(true);
          }
        }
      } else {
        // but some spells can suppress player swap on new turn (take another turn)
        // if we didn't swap players this turn, make sure we will swap again next end turn
        this.swapPlayersOnNewTurn = true;
      }

      // make sure new turn is tagged with player id
      this.currentTurn.setPlayerId(this.getCurrentPlayer().getPlayerId());

      // update entities
      for (var entity of Array.from(this.board.getEntities(allowUntargetable=true))) {
        entity.refreshExhaustion();
      }

      for (player of Array.from(this.players)) {
        // retain last mana
        player.lastMaximumMana = player.getMaximumMana();
        player.lastRemainingMana = player.getRemainingMana();

        // update mana for players
        if (player.getIsCurrentPlayer()) {
          // player 2 starts out with one more mana than player 1, so don't increment on first turn change
          // otherwise, give player +1 max mana (up to 9) at each new turn start when they are current player
          if ((player.maximumMana < CONFIG.MAX_MANA) && (this.getNumberOfTurns() > 1)) {
            player.maximumMana++;
          }
          player.remainingMana = player.maximumMana;

        } else {
          player.remainingMana = Math.min(player.lastRemainingMana, player.maximumMana);
        }
      }

      return this.pushEvent({type: EVENTS.start_turn, action: this.getExecutingAction(), executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), turn: this.currentTurn, gameSession: this});
    }
  }

  getNumberOfTurns() {
    return this.turns.length;
  }

  _getNumberOfTurnsUntilPlayerActivatesSignatureCard(player, fromTurnNumber) {
    if (this.getIsSignatureCardAlwaysReady()) {
      return 0;
    } else if (this.getIsSignatureCardAlwaysReadyForPlayer(player)) {
      return 0;
    } else {
      if (fromTurnNumber == null) { fromTurnNumber = this.getNumberOfTurns(); }
      if (fromTurnNumber >= 12) {
        if (player === this.getCurrentPlayer()) { return 0; } else { return 1; }
      } else if (player === this.getPlayer2()) {
        // player 2 gets signature cards on game turn 5 and 9 or player turn 3 and 5
        if (fromTurnNumber <= 5) { return 5 - fromTurnNumber; }
        if (fromTurnNumber <= 9) { return 9 - fromTurnNumber; }
        return 13 - fromTurnNumber;
      } else {
        // player 1 gets signature cards on game turn 4 and 8 or player turn 3 and 5
        if (fromTurnNumber <= 4) { return 4 - fromTurnNumber; }
        if (fromTurnNumber <= 8) { return 8 - fromTurnNumber; }
        return 12 - fromTurnNumber;
      }
    }
  }

  getNumberOfPlayerTurnsUntilPlayerActivatesSignatureCard(player, ignoreHasSignatureCard, fromTurnNumber) {
    if (ignoreHasSignatureCard == null) { ignoreHasSignatureCard = false; }
    if (fromTurnNumber == null) { fromTurnNumber = this.getNumberOfTurns(); }
    const hasSignatureCard = !ignoreHasSignatureCard && player.getIsSignatureCardActive();
    if (hasSignatureCard) {
      return 0;
    } else {
      let numPlayerTurns;
      if (fromTurnNumber >= 12) {
        if (player === this.getCurrentPlayer()) { numPlayerTurns = 0; } else { numPlayerTurns = 1; }
      } else if (player === this.getPlayer2()) {
        numPlayerTurns = Math.ceil((4 - (Math.max(0, fromTurnNumber - 1) % 4)) * 0.5);
      } else {
        numPlayerTurns = Math.ceil((4 - (fromTurnNumber % 4)) * 0.5);
      }

      if ((numPlayerTurns === 0) && (player === this.getCurrentPlayer()) && !hasSignatureCard) {
        if (fromTurnNumber >= 12) { return 1; } else { return 2; }
      } else {
        return numPlayerTurns;
      }
    }
  }

  getProgressUntilPlayerActivatesSignatureCard(player, fromTurnNumber) {
    const hasSignatureCard = player.getIsSignatureCardActive();
    if (hasSignatureCard) {
      return 1.0;
    } else {
      if (fromTurnNumber == null) { fromTurnNumber = this.getNumberOfTurns(); }
      if (player === this.getPlayer2()) {
        if (fromTurnNumber >= 13) {
          if ((player === this.getCurrentPlayer()) && hasSignatureCard) { return 1; } else { return 0; }
        } else {
          return 1.0 - (Math.ceil((4 - (Math.max(0, fromTurnNumber - 1) % 4)) * 0.5) / 2.0);
        }
      } else {
        if (fromTurnNumber >= 12) {
          if ((player === this.getCurrentPlayer()) && hasSignatureCard) { return 1; } else { return 0; }
        } else {
          return 1.0 - (Math.ceil((4 - (fromTurnNumber % 4)) * 0.5) / 2.0);
        }
      }
    }
  }

  // endregion turns

  // region steps and actions

  /**
   * Submit an explicit action for execution by an authoritative source such as the server.
   * NOTE: this should only be called on a NON authoritative source.
   * @param {Action} action
   * @returns {Boolean} whether action is valid and was submitted
   */
  submitExplicitAction(action) {
    // attempt to submit action and return true if submitted, otherwise false
    // ignore attempts to submit actions if we're spectating
    if (!this.getIsSpectateMode() && (this._private.submittedExplicitAction == null) && (action != null) && !action.getIsImplicit() && action.isFirstTime()) {
      // validate action before submitting
      this.validateAction(action);
      if (action.getIsValid()) {
        if (this.getIsRunningAsAuthoritative()) {
          // when in authoritative mode, just go ahead and execute the action
          this.executeAction(action);
        } else {
          // store this action as the current explicit action
          this._private.submittedExplicitAction = action;

          // create an unsigned step for the action
          const step = new Step(this, action.getOwnerId());
          step.setAction(action);

          // send the step over the network
          NetworkManager.getInstance().broadcastGameEvent({type:EVENTS.step, step});
        }

        return true;
      }
    }

    return false;
  }

  /**
   * Returns whether game session is waiting for a submitted explicit action to be returned from an authoritative source such as the server.
   * @returns {Boolean} whether waiting for a submitted action
   */
  getIsWaitingForSubmittedExplicitAction() {
    return (this._private.submittedExplicitAction != null);
  }

  /**
   * Execute a step provided by an authoritative source such as the server to advance and sync this game session.
   * NOTE: this should only be called on a NON authoritative source.
   * @param {Step} step previously executed step
   */
  executeAuthoritativeStep(step) {
    // don't allow non-steps
    if (!(step instanceof Step)) {
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.executeAuthoritativeStep -> cannot execute non-step"
      return;
    }

    // don't allow non-actions
    const action = step.getAction();
    if (!(action instanceof Action)) {
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.executeAuthoritativeStep -> cannot execute non-action"
      return;
    }

    // don't allow any steps if the game is over
    if (this.status === GameStatus.over) {
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.executeAuthoritativeStep -> cannot execute steps when game is over"
      return;
    }

    // reset submitted explicit action as soon as we've received a step
    this._private.submittedExplicitAction = null;

    // non-authoritative source must start followup or rollback before starting step
    // because starting a step writes to the current turn and modifies the game session
    this._updateStateAfterActionValidated(action);

    // queue up authoritative step
    this._queueStep(step);

    // execute first action to execute step
    return this.executeAction(action);
  }

  /**
   * Execute an action to advance this game session.
   * NOTE: this should only be called on an authoritative source.
   * @param {Action} action
   */
  executeAction(action) {
    /* ERROR SIMULATOR below
    if @getIsRunningAsAuthoritative()
      null.tryMethod()
    */

    // don't allow non-actions
    if (!(action instanceof Action)) {
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.executeAction -> cannot execute null action"
      return;
    }

    // don't allow any actions if the game is over
    if (this.status === GameStatus.over) {
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.executeAction -> cannot execute actions when game is over"
      return;
    }

    // don't allow any actions unless event allows new actions
    if (this._private.blockActionExecution) {
      //Logger.module("SDK").debug "[G:#{@gameId}]", "GameSession.executeAction -> cannot execute #{action.getType()} because #{@getActionExecutionEventType()} event does not allow new actions"
      return;
    }

    if (this.getIsRunningAsAuthoritative()) {
      // set parent action of action before validation as some validators test implicit state
      action.setParentAction(this.getExecutingParentAction());
    } else if (action.isFirstTime()) {
      // we don't want to execute any actions created by non-authoritative sources such as the client
      // when an action is sent from an authoritative source such as the server it will be signed (!isFirstTime)
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.executeAction -> cannot execute non-authoritative actions"
      return;
    }

    if ((action.getType() === RollbackToSnapshotAction.type) && !(this.getIsRunningAsAuthoritative() || this.isMyTurn())) {
      // we can safely ignore steps with a RollbackToSnapshotAction if we're not running on the server and it's not our turn
      // otherwise we can get in a situation (in net games) where there is no recorded snapshot and this step gets added to the queue and our total step index is lower than the other person's IF they cancel their followup
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.executeAction -> ignoring RollbackToSnapshotAction that is not intended for my player"
      return;
    }

    // validate the action before modifying any game state
    this.validateAction(action);

    // don't allow invalid actions
    if (!action.getIsValid()) {
      return;
    }

    if (this.getIsRunningAsAuthoritative()) {
      // authoritative source must start followup or rollback as soon as an action is validated for execution
      // because this will always occur on authoritative source before game state is modified
      this._updateStateAfterActionValidated(action);
    }

    // send an event that an action has been validated and we are going to add it to the queue
    this.pushEvent({type: EVENTS.before_added_action_to_queue, action, gameSession: this});

    if (this.getIsRunningAsAuthoritative()) {
      // set action as sub action of parent
      const parentAction = this.getExecutingParentAction();
      if (parentAction != null) {
        parentAction.addSubAction(action);
      }

      // set resolution parent of action
      const resolveAction = this.getExecutingResolveAction();
      if (resolveAction != null) {
        action.setResolveParentAction(resolveAction);
      }

      // set currently executing modifier as parent of action
      // we can't set the action as a triggered action of the modifier yet
      // because the action has no index yet
      const triggeringModifier = this.getTriggeringModifier();
      action.setTriggeringModifier(triggeringModifier);

      // set action source if it doesn't exist and there is a triggering modifier or an active playing card
      if ((action.getSource() == null)) {
        if (triggeringModifier != null) {
          action.setSource(triggeringModifier.getCard());
        } else {
          const activeCard = this.getActiveCard();
          if (activeCard != null) {
            action.setSource(activeCard);
          }
        }
      }
    }

    // send an event that an action was just added to the queue
    this.pushEvent({type: EVENTS.added_action_to_queue, action, gameSession: this}, {blockActionExecution: true});

    if (this._private.actionQueue != null) {
      // queue is in progress
      if (action.getIsDepthFirst()) {
        // don't queue depth first actions
        return this._executeActionForStep(action, this._private.step);
      } else {
        // add action to the existing queue
        return this._private.actionQueue.push(action);
      }
    } else {
      if (this.getIsRunningAsAuthoritative()) {
        // create a new step
        const step = new Step(this, action.getOwnerId());

        // set step index
        const stepIndex = this.generateIndex();
        step.setIndex(stepIndex);

        // sign step before its actions
        step.addSignature();

        // set step action
        step.setAction(action);

        // queue new step
        this._queueStep(step);
      }

      // try to start next step
      return this._startNextStep();
    }
  }

  _queueStep(step) {
    if (step != null) {
      //Logger.module("SDK").group("STEP #{step.index}")
      Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS._queueStep -> ", step.getIndex());
      // link step to parent step as needed
      const executingStep = this._private.step;
      if (executingStep != null) {
        step.setParentStep(executingStep);
        executingStep.setChildStep(step);
      }

      // store the current step
      return this._private.stepQueue.push(step);
    }
  }

  _startNextStep() {
    if ((this._private.step == null) && (this._private.stepQueue.length > 0)) {
      // get step and action
      const step = this._private.stepQueue.shift();
      const action = step.getAction();
      Logger.module("SDK").debug(`[G:${this.gameId}]`, `GS._startNextStep -> ${step.getIndex()} w/ action ${action.getType()}`);

      // start step
      this._startStep(step);

      // execute new queue for step with action
      return this._executeStepQueue([action]);
    }
  }

  _startStep(step) {
    if (step != null) {
      //Logger.module("SDK").group("STEP #{step.index}")
      // store the current step
      const stepIndex = step.getIndex();
      Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS._startStep -> ", stepIndex);
      this._private.step = step;
      this._private.stepsByIndex[stepIndex] = step;

      // record the step in the current turn
      this.currentTurn.addStep(step);

      // emit event that step is starting
      // note: actions are not allowed in response to this event
      return this.pushEvent({type: EVENTS.start_step, step, gameSession: this}, {blockActionExecution: true});
    }
  }

  _executeStepQueue(actionQueue) {
    if ((this._private.step != null) && (this._private.actionQueue == null) && (actionQueue != null)) {
      // store the new queue
      this._private.actionQueue = actionQueue;

      // execute queue
      while (actionQueue.length > 0) {
        // Logger.module("SDK").debug "[G:#{@.gameId}]", "GS._executeStepActionQueue - queue length:#{actionQueue.length}"
        var actionToExecute = actionQueue[0];

        // execute action
        this._executeActionForStep(actionToExecute, this._private.step);

        // remove the action we just executed from the queue
        actionQueue.shift();
      }

      // when the queue is done executing
      // end the step and broadcast events
      return this._endStep(this._private.step);
    }
  }

  _executeActionForStep(actionToExecute, step) {
    // get action properties
    let manaCost, resolveAction;
    const depthFirst = actionToExecute.getIsDepthFirst();
    const actionIsFirstTime = actionToExecute.isFirstTime();

    // record depth first actions
    if (depthFirst) {
      this._private.depthFirstActions.push(actionToExecute);
    }

    // update executing action
    const lastAction = this.getExecutingAction();
    this.setExecutingAction(actionToExecute);

    // update parent action
    const lastParentAction = this.getExecutingParentAction();
    this.setExecutingParentAction(actionToExecute);
    const lastResolveAction = this.getExecutingResolveAction();
    this.setExecutingResolveAction(actionToExecute);

    // set action index as needed
    let actionIndex = actionToExecute.getIndex();
    if ((actionIndex == null)) {
      actionIndex = this.generateIndex();
      actionToExecute.setIndex(actionIndex);
    }
    Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS._executeActionForStep -> ", actionToExecute.type, actionToExecute.index);

    //Logger.module("SDK").group("ACTION #{actionToExecute.getLogName()}")

    // record the action
    this._private.actionsByIndex[actionIndex] = actionToExecute;

    // add the action to the list of actions we still need to resolve for this step
    this._private.actionsToResolve.push(actionToExecute);

    if (actionIsFirstTime) {
      // set action as resolve sub action of resolution parent
      resolveAction = actionToExecute.getResolveParentAction();
      if (resolveAction != null) { resolveAction.addResolveSubAction(actionToExecute); }
    }

    // set the action's as a triggered action of its triggering modifier now that it has an index
    const triggeringModifier = actionToExecute.getTriggeringModifier();
    if (triggeringModifier != null) { triggeringModifier.onTriggeredAction(actionToExecute); }

    // allow the action to modify itself for execution
    // but don't allow sub actions to be created
    this._private.blockActionExecution = true;
    actionToExecute._modifyForExecution();
    this._private.blockActionExecution = false;

    // send an event that an action can be modified for execution
    this.pushEvent({type: EVENTS.modify_action_for_execution, action: actionToExecute, step, gameSession: this}, {blockActionExecution: true});

    // set the action's as a trigger changed action of its triggering modifier now that it has an index
    const changedByModifiers = actionToExecute.getChangedByModifiers();
    for (var modifier of Array.from(changedByModifiers)) {
      modifier.onTriggerChangedAction(actionToExecute);
    }

    // revealing a hidden card signals start of overwatch
    // in which case events must be buffered until overwatch finishes
    if (actionToExecute instanceof RevealHiddenCardAction) {
      this.p_startBufferingEvents();
    }

    // send an event that an action is about to execute and overwatches should trigger
    // note: actions are allowed in response to this event
    this.pushBufferableEvent({type: EVENTS.overwatch, action: actionToExecute, executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), step, gameSession: this}, {resolveAction: actionToExecute});

    // send an event that an action is about to execute
    // note: actions are allowed in response to this event
    this.pushBufferableEvent({type: EVENTS.before_action, action: actionToExecute, executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), step, gameSession: this}, {resolveAction: actionToExecute});

    // apply mana cost to remaining player mana
    // in case of authoritative, we know how much action will cost before it executes
    // because we have all the information
    if (this.getIsRunningAsAuthoritative()) {
      manaCost = actionToExecute.getManaCost();
      if (manaCost > 0) {
        actionToExecute.getOwner().remainingMana -= manaCost;
      }
    }

    // start pseudo event: execute
    this.pushEventTypeToStack("execute");

    // execute the action
    actionToExecute._execute();

    // execute any authoritative sub actions that occurred during execute event
    if (!this.getIsRunningAsAuthoritative()) { actionToExecute.executeNextOfEventTypeFromAuthoritativeSubActionQueue("execute"); }

    // stop pseudo event: execute
    this.popEventTypeFromStack();

    // apply mana cost to remaining player mana
    // in case of non authoritative, we only know how much action costed after it executes
    if (!this.getIsRunningAsAuthoritative()) {
      manaCost = actionToExecute.getManaCost();
      if (manaCost > 0) {
        actionToExecute.getOwner().remainingMana -= manaCost;
      }
    }

    // update the current turn
    this.currentTurn.updatedAt = Date.now();

    // emit an event that an action has just executed but not yet been signed (most places should listen to this)
    // note: actions are allowed in response to this event
    this.pushBufferableEvent({type: EVENTS.action, action: actionToExecute, executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), step, gameSession: this}, {resolveAction: actionToExecute});

    // sign action with current timestamp after it's been executed (this is later used to replay/not generate implicit actions)
    actionToExecute.addSignature();
    this.lastActionTimestamp = actionToExecute.timestamp;

    // send an event that an action is done executing and signed
    // note: actions are allowed in response to this event
    this.pushBufferableEvent({type: EVENTS.after_action, action: actionToExecute, executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), step, gameSession: this}, {resolveAction: actionToExecute});

    if (!depthFirst &&
      (actionToExecute instanceof DieAction ||
      (!this.getIsBufferingEvents() &&
        !(actionToExecute instanceof ApplyCardToBoardAction ||
          actionToExecute instanceof PutCardInDeckAction ||
          actionToExecute instanceof PutCardInHandAction ||
          actionToExecute instanceof GenerateSignatureCardAction)))) {
      // send an event that all cached elements should update/flush
      // note: actions are not allowed in response to this event
      this.pushBufferableEvent({type: EVENTS.update_cache_action, action: actionToExecute, step, gameSession: this}, {resolveAction: actionToExecute, blockActionExecution: true});
    }

    // Logger.module("SDK").groupEnd("ACTION")
    if (this._getIsActionQueueEmpty() && !depthFirst) {
      let action;
      if (this.getIsRunningAsAuthoritative()) {
        // start pseduo event: empty_queue
        this.pushEventTypeToStack("empty_queue");

        // the queue is empty so it is safe to execute step resolution
        this.p_resolveStep();

        if (this._getIsActionQueueEmpty()) {
          // the queue is empty and we just resolved the step
          if (this.getIsBufferingEvents() && !(this._private.step.getAction() instanceof RollbackToSnapshotAction)) {
            if (this.getIsFollowupActive()) {
              // when we're at the end of the step and we're retaining rollback data as a result of a followup
              // check if this step's first action has a valid followup
              // if not, create and execute an end followup action
              const card = this.getValidatorFollowup().getCardWaitingForFollowups();
              if ((card == null) || (card.getCurrentFollowup() == null) || !card.getPassesConditionsForCurrentFollowup()) {
                this.executeAction(this.getCurrentPlayer().actionEndFollowup());
              }
            } else {
              // stop buffering events as soon as queue is empty
              this.executeAction(this.actionStopBufferingEvents());
            }
          } else if (this.getCurrentTurn().getEnded()) {
            // draw cards when turn has ended and queue is empty
            // immediately before starting next turn, draw hand for player whose turn just ended (i.e. current player)
            // this is done before starting next turn so that end turn actions for previous player can act on hand before new cards are drawn
            if (!this._private.hasDrawnCardsForTurn) {
              this._private.hasDrawnCardsForTurn = true;
              let drawCardActionsForTurn = this.getCurrentPlayer().getDeck().actionsDrawNewCards();
              if ((drawCardActionsForTurn != null) && (drawCardActionsForTurn.length > 0)) {
                const drawCardActionsToExecute = drawCardActionsForTurn;
                drawCardActionsForTurn = null;
                for (action of Array.from(drawCardActionsToExecute)) {
                  this.executeAction(action);
                }
              }
            }

            // update end turn duration when turn is ended and queue is empty
            // this must always be the last thing in the end turn phase
            if (!this._private.updatedElapsedEndTurn && this._getIsActionQueueEmpty()) {
              this._private.updatedElapsedEndTurn = true;
              // end turn duration change phase: update end turn duration of all modifiers
              // note: actions are allowed in response to this event
              this.pushBufferableEvent({type: EVENTS.modifier_end_turn_duration_change, action: actionToExecute, executeAuthoritativeSubActions: false, step, gameSession: this}, {resolveAction: actionToExecute});
            }

          } else if (this._private.startTurnAction != null) {
            // after a new turn has been started, activate the current player's signature card as needed
            // this is done after starting next turn so that end/start turn actions for both players can act on signature cards before activation
            if (!this._private.hasActivatedSignatureCardForTurn) {
              this._private.hasActivatedSignatureCardForTurn = true;
              const currentPlayer = this.getCurrentPlayer();
              if (!currentPlayer.getIsSignatureCardActive() && (this._getNumberOfTurnsUntilPlayerActivatesSignatureCard(currentPlayer) <= 0)) {
                const activateSignatureCardAction = this.getCurrentPlayer().actionActivateSignatureCard();
                if (activateSignatureCardAction != null) {
                  this.executeAction(activateSignatureCardAction);
                }
              }
            }

            // update start turn duration when new turn is started and queue is empty
            // this must always be the last thing in the start turn phase
            if (!this._private.updatedElapsedStartTurn && this._getIsActionQueueEmpty()) {
              this._private.updatedElapsedStartTurn = true;
              // start turn duration change phase: update start turn duration of all modifiers
              // note: actions are allowed in response to this event
              this.pushBufferableEvent({type: EVENTS.modifier_start_turn_duration_change, action: actionToExecute, executeAuthoritativeSubActions: false, step, gameSession: this}, {resolveAction: actionToExecute});
            }
          }
        }

        // end pseudo event: empty_queue
        this.popEventTypeFromStack();
      } else {
        // the queue is empty so it is safe to execute step resolution
        this.p_resolveStep();

        if (this._getIsActionQueueEmpty()) {
          // execute any authoritative sub actions that occurred during empty queue
          actionToExecute.executeNextOfEventTypeFromAuthoritativeSubActionQueue("empty_queue");

          // update end turn duration when turn is ended and queue is empty
          if (this.getCurrentTurn().getEnded() && !this._private.updatedElapsedEndTurn && this._getIsActionQueueEmpty()) {
            this._private.updatedElapsedEndTurn = true;
            // end turn duration change phase: update end turn duration of all modifiers
            // note: actions are allowed in response to this event
            this.pushBufferableEvent({type: EVENTS.modifier_end_turn_duration_change, action: actionToExecute, executeAuthoritativeSubActions: true, step, gameSession: this}, {resolveAction: actionToExecute});
          } else if ((this._private.startTurnAction != null) && !this._private.updatedElapsedStartTurn && this._getIsActionQueueEmpty()) {
            // update start turn duration when new turn is started and queue is empty
            this._private.updatedElapsedStartTurn = true;
            // start turn duration change phase: update start turn duration of all modifiers
            // note: actions are allowed in response to this event
            this.pushBufferableEvent({type: EVENTS.modifier_start_turn_duration_change, action: actionToExecute, executeAuthoritativeSubActions: true, step, gameSession: this}, {resolveAction: actionToExecute});
          }
        }
      }
    }

    // restore actions
    if (depthFirst) {
      this.setExecutingAction(lastAction);
      this.setExecutingParentAction(lastParentAction);
      this.setExecutingResolveAction(lastResolveAction);
    } else {
      this._private.depthFirstActions.length = 0;
    }

    if (!this.getIsRunningAsAuthoritative() && (actionToExecute.getSubActionsQueue() != null) && (actionToExecute.getSubActionsQueue().length > 0)) {
      return Logger.module("SDK").error(`[G:${this.gameId}]`, `GS._executeActionForStep -> authoritative action ${actionToExecute.getLogName()} did not execute all sub actions:`, actionToExecute.getSubActionsQueue().slice(0));
    }
  }

    //Logger.module("SDK").groupEnd("ACTION #{actionToExecute.getLogName()}")

  _resetActionQueue() {
    this.setExecutingAction(null);
    this.setExecutingParentAction(null);
    this.setExecutingResolveAction(null);
    this._private.depthFirstActions.length = 0;
    this._private.updatedElapsedEndTurn = false;
    this._private.updatedElapsedStartTurn = false;
    this._private.hasActivatedSignatureCardForTurn = false;
    return this._private.actionQueue = null;
  }

  _executeActionWithForcedParentAction(action, parentAction) {
    // retain current parent
    const lastAction = this.getExecutingAction();
    const lastResolveAction = this.getExecutingResolveAction();

    // set forced parent
    this.setExecutingAction(parentAction);
    this.setExecutingResolveAction(parentAction);

    // execute
    this.executeAction(action);

    // restore last actions
    this.setExecutingAction(lastAction);
    return this.setExecutingResolveAction(lastResolveAction);
  }

  _getIsActionQueueEmpty() {
    // when action queue has 1 left in the queue, because we may want to add more to the queue
    // but we don't want to start a new loop, i.e. if queue is at 0 length when we add more actions
    // do not call this from outside action queue execution
    return (this._private.actionQueue == null) || (this._private.actionQueue.length === 1);
  }

  /**
   * Validate an action for anti-cheat to determine whether it is safe to execute.
   * @param {Action} action
   * @param {Boolean} [emitEventWhenInvalid=true] emits EVENTS.invalid_action if action is invalid
   */
  validateAction(action, emitEventWhenInvalid) {
    // Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.validateAction: #{action.getType()}"
    // emit modify action
    // this event allows cards to check an action and modify it before anything else happens
    // for example, followups must be modified before the primary validation event
    // because the card that has the followup is also the one that copies the followup properties into the followup itself
    // as nothing is sent across the net for followups except the id of the followup card, which is done to prevent cheating using followups
    // however, followups should not be validated by their source cards here, because normal validators should get a chance to validate first
    if (emitEventWhenInvalid == null) { emitEventWhenInvalid = true; }
    this.pushEvent({type: EVENTS.modify_action_for_validation, action, gameSession: this}, {blockActionExecution: true});

    // emit validate action
    // this event allows objects across the game session to subscribe and validate that this action can be executed.
    // FOR EXAMPLE: Provoke/Taunt Trait should invalidate any attack actions by units that are nearby to a provoke unit.
    // NOTE: only actions executed by an authoritative source or that have not been executed will be validated
    if (this.getIsRunningAsAuthoritative() || action.isFirstTime()) {
      this.pushEvent({type: EVENTS.validate_action, action, gameSession: this}, {blockActionExecution: true});
    }

    if (!action.getIsValid() && emitEventWhenInvalid) {
      // emit invalid action event
      return this.onInvalidAction(action, action.getValidatorType(), action.getValidationMessage(), action.getValidationMessagePosition());
    }
  }

  _updateStateAfterActionValidated(action) {
    if (action instanceof ResignAction || action instanceof EndTurnAction) {
      // automatic rollback when resign or end turn lands
      return this._rollbackToSnapshot();
    } else {
      // index any cards that will be created
      // this guarantees that even if the card is not applied to a location
      // the game session can operate on the card and its state will be correct
      if (action instanceof ApplyCardToBoardAction || action instanceof PutCardInDeckAction || action instanceof PutCardInHandAction || action instanceof GenerateSignatureCardAction) {
        const card = action.getCard();
        if (card != null) {
          this._indexCardAsNeeded(card, action.getCardDataOrIndex());
        }
      }

      // start followup when action is non-implicit, playing card with followup
      if (action instanceof PlayCardAction && !action.getIsImplicit() && (__guard__(action.getCard(), x => x.getCurrentFollowup()) != null)) {
        return this._startFollowup();
      }
    }
  }

  /**
   * Handle an invalid action provided by an authoritative source such as the server.
   * NOTE: this should only be called on a NON authoritative source.
   * @param {Object} event
   */
  onAuthoritativeInvalidAction(event) {
    const action = this.deserializeActionFromFirebase(event != null ? event.action : undefined);
    if (action != null) {
      // reset submitted explicit action now that we know it is invalid
      this._private.submittedExplicitAction = null;

      // emit invalid action event
      return this.onInvalidAction(action, event.validatorType, event.validationMessage, event.validationMessagePosition);
    }
  }

  /**
   * Handle an invalid action.
   * NOTE: this should only be called on a NON authoritative source.
   * @param {Object} event
   */
  onInvalidAction(action, validatorType, validationMessage, validationMessagePosition) {
    if (action != null) {
      Logger.module("SDK").log(`[G:${this.gameId}]`, `GS.validateAction INVALID ACTION: ${action.getLogName()} / VALIDATED BY: ${validatorType} / MESSAGE: ${validationMessage}`);
      return this.pushEvent({
        type: EVENTS.invalid_action,
        action,
        validatorType,
        validationMessage,
        validationMessagePosition,
        gameSession: this
      }, {blockActionExecution: true});
    }
  }

  /**
   * SDK (package) level method that may be called to resolve the current step.
   * NOTE: only use this during the action execution loop.
   */
  p_resolveStep() {
    const {
      actionsToResolve
    } = this._private;
    if (actionsToResolve.length > 0) {
      Logger.module("SDK").debug(`[G:${this.gameId}]`,"GameSession.p_resolveStep");
      // note: these events may be emitted multiple times for a step if actions are continually added during this phase
      const {
        step
      } = this._private;
      const executingAction = this.getExecutingAction();
      this._private.actionsToResolve = [];

      // validate game over request if no followup is active
      // game over will be validated before event buffer is flushed
      if (this._private.gameOverRequested) {
        this._validateGameOverRequest();
      }

      // remove actions that may not need to be resolved themselves
      // but because of their execution may need a game session resolve
      const firstActionToResolve = actionsToResolve[0];
      if (firstActionToResolve instanceof EndTurnAction || firstActionToResolve instanceof StartTurnAction) {
        actionsToResolve.shift();
      }

      if (actionsToResolve.length > 0) {
        // cleanup phase: trigger cleanup so that removed cards can terminate themselves safely
        // note: actions are not allowed in response to this event
        let action;
        for (action of Array.from(actionsToResolve)) {
          this.pushBufferableEvent({type: EVENTS.cleanup_action, action, gameSession: this}, {resolveAction: action});
        }
        // push one pseudo-event for this phase to execute any authoritative sub actions that occurred during cleanup
        if (!this.getIsRunningAsAuthoritative()) {
          this.pushBufferableEvent({type: EVENTS.cleanup_action, action: executingAction, executeAuthoritativeSubActions: true, gameSession: this}, {resolveAction: executingAction});
        }

        // after cleanup phase: trigger after cleanup for each action for any reactions that should only trigger if the entity is still active
        // note: actions are allowed in response to this event
        for (action of Array.from(actionsToResolve)) {
          this.pushBufferableEvent({type: EVENTS.after_cleanup_action, action, gameSession: this}, {resolveAction: action});
        }
        // push one pseudo-event for this phase to execute any authoritative sub actions that occurred during after cleanup
        if (!this.getIsRunningAsAuthoritative()) {
          this.pushBufferableEvent({type: EVENTS.after_cleanup_action, action: executingAction, executeAuthoritativeSubActions: true, gameSession: this}, {resolveAction: executingAction});
        }

        // activate state change phase: change active state of all modifiers
        // note: actions are allowed in response to this event
        this.pushBufferableEvent({type: EVENTS.modifier_active_change, action: executingAction, executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), step, gameSession: this}, {resolveAction: executingAction});

        // remove aura phase: remove auras as needed
        // note: actions are allowed in response to this event
        this.pushBufferableEvent({type: EVENTS.modifier_remove_aura, action: executingAction, executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), step, gameSession: this}, {resolveAction: executingAction});

        // add aura phase: add auras as needed
        // note: actions are allowed in response to this event
        this.pushBufferableEvent({type: EVENTS.modifier_add_aura, action: executingAction, executeAuthoritativeSubActions: !this.getIsRunningAsAuthoritative(), step, gameSession: this}, {resolveAction: executingAction});
      }

      // check that both players have drawn their starting hands, and if so, update the game status to active
      if (this.isNew() && this._getIsActionQueueEmpty()) {
        let shouldBecomeActive = true;
        for (var p of Array.from(this.players)) {
          if (!p.getHasStartingHand()) {
            shouldBecomeActive = false;
          }
        }

        if (shouldBecomeActive) {
          this.setStatus(GameStatus.active);

          // sync state in case there were any changes as a result of the game swapping to active
          return this.syncState();
        }
      }
    }
  }

  _endStep(step) {
    // ensure step is valid
    const action = step != null ? step.action : undefined;
    if ((action != null) && !action.isFirstTime() && action.getIsValid()) {
      Logger.module("SDK").debug(`[G:${this.gameId}]`, "GS._endStep", step.index);
      //Logger.module("SDK").groupEnd("STEP #{step.index}")
      const lastNonDepthFirstAction = this.getExecutingNonDepthFirstAction();

      // reset action queue now that we're done
      this._resetActionQueue();

      // send an event that all cached elements should update/flush
      // note: actions are not allowed in response to this event
      if (!this.getIsBufferingEvents()) {
        this.pushEvent({type: EVENTS.update_cache_step, action: lastNonDepthFirstAction, step, gameSession: this}, {resolveAction: lastNonDepthFirstAction, blockActionExecution: true});
      }

      // rollback to snapshot was requested during step
      if (this._private.rollbackToSnapshotRequested) {
        this._rollbackToSnapshot();
      } else {
        // discard snapshot was requested during step
        if (this._private.rollbackSnapshotDataDiscardRequested) {
          this._discardRollbackSnapshot();
        }
      }

      if (!this.isOver()) {
        // start new turn as needed
        if (action instanceof EndTurnAction) {
          if ((this._private.startTurnAction == null)) {
            // start new turn
            this.currentTurn = new GameTurn(this);

            // store start turn action so that it isn't created more than once
            // we know that the start turn action won't be added to the queue until after resolving end turn
            // so we can use start turn action as a reference to know that a new turn is starting
            // and update modifier start turn durations accordingly
            this._private.startTurnAction = this.createActionForType(StartTurnAction.type);
            this._private.startTurnAction.setIsAutomatic(true);
            if (this.swapPlayersOnNewTurn) {
              this._private.startTurnAction.setOwnerId(this.getNonCurrentPlayerId());
            } else {
              this._private.startTurnAction.setOwnerId(this.getCurrentPlayerId());
            }
            this.executeAction(this._private.startTurnAction);
          }
        } else if (action instanceof StartTurnAction) {
          // reset stored turn values
          this._private.startTurnAction = null;
          this._private.hasDrawnCardsForTurn = false;
        }
      }

      // emit after_step after everything has had a chance to react to step
      // this way, external listeners can create new steps safely in reaction to steps
      this.pushEvent({type: EVENTS.after_step, action, step, gameSession: this});

      // reset step queue now that we're done
      this._private.lastStep = this._private.step;
      this._private.step = null;

      // emit step after changing any statuses
      // this way, external listeners know the state of the game as they react
      this.pushEvent({type: EVENTS.step, step, gameSession: this}, {blockActionExecution: true});

      // terminate game session when game is over
      // otherwise try to start the next step
      if (this.isOver()) {
        return this.terminate();
      } else {
        return this._startNextStep();
      }
    }
  }

  /**
   * Returns whether there are any steps remaining in queue to be executed.
   * @returns {Boolean}
   */
  hasStepsInQueue() {
    return this._private.stepQueue.length > 0;
  }

  /**
   * Returns whether there are any actions remaining in queue to be executed.
   * @returns {Boolean}
   */
  hasActionsInQueue() {
    return (this._private.actionQueue != null) && (this._private.actionQueue.length > 0);
  }

  /**
   * Returns a list of actions in queue to be executed that match the parameters.
   * @param {Class} actionClass class of action to match
   * @param {Vec2|Object} targetPosition target position of the actions
   * @returns {Array}
   */
  getActionsOfClassInQueue(actionClass, targetPosition) {
    const actions = [];
    const {
      actionQueue
    } = this._private;
    if (actionQueue != null) {
      for (var action of Array.from(actionQueue)) {
        if ((action !== this.getExecutingAction()) && action instanceof actionClass && (!targetPosition || UtilsPosition.getPositionsAreEqual(targetPosition, action.getTargetPosition()))) {
          actions.push(action);
        }
      }
    }

    return actions;
  }

  /**
   * Returns a list of removal actions in queue to be executed that match the parameters.
   * @param {Vec2|Object} targetPosition target position of the card to be removed
   * @param {String} targetType target type of the card to be removed
   * @returns {Array}
   */
  getRemovalActionsInQueue(targetPosition, targetType) {
    const actions = [];
    const {
      actionQueue
    } = this._private;
    if (actionQueue != null) {
      for (var action of Array.from(actionQueue)) {
        if ((action !== this.getExecutingAction()) && (action instanceof RemoveAction || action instanceof KillAction)) {
          var target = action.getTarget();
          if ((target != null) && (!targetPosition || UtilsPosition.getPositionsAreEqual(targetPosition, target.getPosition())) && (!targetType || (target.getType() === CardType.Entity) || (target.getType() === targetType))) {
            actions.push(action);
          }
        }
      }
    }

    return actions;
  }

  /**
   * Returns whether a card can be scheduled for removal.
   * @param {Card} card
   * @param {Boolean} [includeExecutingAction=false]
   * @returns {Boolean}
   */
  getCanCardBeScheduledForRemoval(card, includeExecutingAction) {
    if (includeExecutingAction == null) { includeExecutingAction = false; }
    if (card != null) {
      if (!card.getIsActive()) {
        // card has not yet been played or is already removed
        return false;
      } else {
        // card is being removed by the currently executing action
        const executingAction = this.getExecutingAction();
        if (includeExecutingAction && (executingAction instanceof RemoveAction || executingAction instanceof KillAction) && (card === executingAction.getTarget())) {
          return false;
        }

        // card may be removed by an action in the queue
        if (this._private.actionQueue != null) {
          const {
            actionQueue
          } = this._private;
          for (var action of Array.from(actionQueue)) {
            if ((action !== executingAction) && (action instanceof RemoveAction || action instanceof KillAction) && (card === action.getTarget())) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  /**
   * Returns whether an action was executed during a specific turn.
   * @param {Action} action
   * @param {GameTurn} turn
   * @returns {Boolean}
   */
  wasActionExecutedDuringTurn(action, turn) {
    if ((action != null) && (turn != null)) {
      const rootAction = action.getRootAction();
      for (var step of Array.from(turn.getSteps())) {
        if (__guard__(step.getAction(), x => x.getIndex()) === rootAction.getIndex()) {
          // action is sub action of step executed during turn
          return true;
        }
      }
    }

    // not found in turn
    return false;
  }

  /**
   * Returns the currently executing action.
   * @returns {Action}
   */
  getExecutingAction() {
    return this._private.action;
  }

  setExecutingAction(val) {
    this._private.action = val;
    if ((val == null) || !val.getIsDepthFirst()) {
      return this.setExecutingNonDepthFirstAction(val);
    }
  }

  /**
   * Returns the currently executing non-depth first action.
   * @returns {Action}
   */
  getExecutingNonDepthFirstAction() {
    return this._private.nonDepthFirstAction;
  }

  setExecutingNonDepthFirstAction(val) {
    return this._private.nonDepthFirstAction = val;
  }

  /**
   * Returns the currently executing resolve action.
   * @returns {Action}
   */
  getExecutingResolveAction() {
    return this._private.resolveAction;
  }

  setExecutingResolveAction(val) {
    return this._private.resolveAction = val;
  }

  /**
   * Returns the currently executing parent action.
   * @returns {Action}
   */
  getExecutingParentAction() {
    return this._private.parentAction;
  }

  setExecutingParentAction(val) {
    return this._private.parentAction = val;
  }

  getActionExecutionEventType() {
    return this._private.actionExecutionEventType || "execute";
  }

  setActionExecutionEventType(val) {
    return this._private.actionExecutionEventType = val;
  }

  getActionExecutionEventTypeStack() {
    return this._private.actionExecutionEventTypeStack;
  }

  /**
   * Returns an action by index.
   * @param {Number} index
   * @returns {Action}
   */
  getActionByIndex(index) {
    if (index != null) {
      return this._private.actionsByIndex[index];
    }
  }

  /**
   * Returns an array copy of the master map of actions.
   * @returns {Array}
   */
  getActions() {
    const actions = [];
    const actionIndices = Object.keys(this._private.actionsByIndex);
    for (var index of Array.from(actionIndices)) {
      var action = this._private.actionsByIndex[index];
      if (action != null) {
        actions.push(action);
      }
    }
    return actions;
  }

  /**
   * Returns an array of all actions in the master map of actions that pass a filter method.
   * NOTE: filter method is passed the action and must return true or false.
   * @returns {Array}
   */
  filterActions(byMethod) {
    const actions = [];
    const actionIndices = Object.keys(this._private.actionsByIndex);
    for (var index of Array.from(actionIndices)) {
      var action = this._private.actionsByIndex[index];
      if ((action != null) && byMethod(action)) {
        actions.push(action);
      }
    }
    return actions;
  }

  /**
   * Returns the first action in the master map of actions that passes a find method.
   * NOTE: find method is passed the action and must return true or false.
   * @returns {Array}
   */
  findAction(byMethod) {
    const actionIndices = Object.keys(this._private.actionsByIndex);
    for (var index of Array.from(actionIndices)) {
      var action = this._private.actionsByIndex[index];
      if ((action != null) && byMethod(action)) {
        return action;
      }
    }
  }

  /**
   * Returns an array of actions that match an array of indices.
   * @param {Array} indices
   * @returns {Array}
   */
  getActionsByIndices(indices) {
    const actions = [];

    if (indices != null) {
      for (var index of Array.from(indices)) {
        var action = this.getActionByIndex(index);
        if (action != null) { actions.push(action); }
      }
    }

    return actions;
  }

  /**
   * Returns the current step executing.
   * @returns {Step}
   */
  getExecutingStep() {
    return this._private.step;
  }

  /**
   * Returns a step by index.
   * @param {Number} index
   * @returns {Step}
   */
  getStepByIndex(index) {
    if (index != null) {
      return this._private.stepsByIndex[index];
    }
  }

  /**
   * Returns an array copy of the master map of steps.
   * @returns {Array}
   */
  getSteps() {
    const steps = [];
    const stepIndices = Object.keys(this._private.stepsByIndex);
    for (var index of Array.from(stepIndices)) {
      var step = this._private.stepsByIndex[index];
      if (step != null) {
        steps.push(step);
      }
    }
    return steps;
  }

  /**
   * Total step count.
   * @returns {Number}
   */
  getStepCount() {
    return Object.keys(this._private.stepsByIndex).length;
  }

  /**
   * Returns an array of steps that match an array of indices.
   * @param {Array} indices
   * @returns {Array}
   */
  getStepsByIndices(indices) {
    const steps = [];

    if (indices != null) {
      for (var index of Array.from(indices)) {
        var step = this.getStepByIndex(index);
        if (step != null) { steps.push(step); }
      }
    }

    return steps;
  }

  /**
   * Returns the currently executing root action.
   * @returns {Action}
   */
  getExecutingRootAction() {
    return (this._private.step != null ? this._private.step.getAction() : undefined);
  }

  /**
   * Returns the last step executed.
   * @returns {Step}
   */
  getLastStep() {
    return this._private.lastStep;
  }

  /**
   * Returns the step that ended the game.
   * @returns {Step}
   */
  getGameEndingStep() {
    if (this.isOver()) {
      if (this._private.step != null) {
        return this._private.step;
      } else if (this._private.lastStep != null) {
        return this._private.lastStep;
      }
    }
  }

  /**
   * Returns a random integer from a range action execution and flags the currently executing action and step as including randomness.
   * @param {Number} [max=1]
   * @param {Number} [min=0]
   * @returns {Number}
   */
  getRandomIntegerForExecution(max, min) {
    if (max == null) { max = 1.0; }
    if (min == null) { min = 0.0; }
    const randomNumber = min + Math.floor(Math.random() * (max - min));
    __guard__(this.getExecutingAction(), x => x.setIncludedRandomness(true));
    __guard__(this.getExecutingStep(), x1 => x1.setIncludedRandomness(true));
    return randomNumber;
  }

  // endregion steps and actions

  // region factory methods

  createActionForType(actionType) {
    return ActionFactory.actionForType(actionType, this);
  }

  createCardForIdentifier(identifier) {
    return CardFactory.cardForIdentifier(identifier, this);
  }

  /**
   * Returns an existing card matching an index, or a cached card from card data by id.
   * NOTE: this method never creates a new card. All cards returned from this method are either indexed or cached.
   * @param {Object|Number|String} cardDataOrIndex plain object of card data with at least an "id" property or a card index
   * @returns {Card}
   */
  getExistingCardFromIndexOrCachedCardFromData(cardDataOrIndex) {
    if (cardDataOrIndex != null) {
      let card;
      if (_.isObject(cardDataOrIndex)) {
        // attempt to find indexed card
        const {
          index
        } = cardDataOrIndex;
        if (index != null) {
          card = this.getCardByIndex(index);
        }

        // get cached card
        if ((card == null) && (cardDataOrIndex.id != null) && (cardDataOrIndex.id !== -1)) {
          card = this.getCardCaches().getCardById(cardDataOrIndex.id);
        }
      } else {
        // attempt to find indexed card
        card = this.getCardByIndex(cardDataOrIndex);
      }

      return card;
    }
  }

  /**
   * Returns an existing card matching an index, or creating a new card from card data by id.
   * @param {Object|Number|String} cardDataOrIndex plain object of card data with at least an "id" property or a card index
   * @returns {Card}
   */
  getExistingCardFromIndexOrCreateCardFromData(cardDataOrIndex) {
    if (cardDataOrIndex != null) {
      let card;
      if (_.isObject(cardDataOrIndex)) {
        // attempt to find indexed card
        const {
          index
        } = cardDataOrIndex;
        if (index != null) {
          card = this.getCardByIndex(index);
        }

        // create new card
        if ((card == null) && (cardDataOrIndex.id != null) && (cardDataOrIndex.id !== -1)) {
          card = this.createCardForIdentifier(cardDataOrIndex.id);
        }
      } else {
        // attempt to find indexed card
        card = this.getCardByIndex(cardDataOrIndex);
      }

      return card;
    }
  }

  /**
   * Indexes a card using a provided index or generates a new index as needed.
   * NOTE: do not call this method directly, instead use applyCardToDeck, applyCardToHand, or applyCardToBoard.
   * @param {Card} [card=null] card may be null in case of non-authoritative session
   * @param {Object|Number|String} [cardDataOrIndex=null]
   * @returns {Number|String} index
   * @private
   */
  _indexCardAsNeeded(card, cardDataOrIndex) {
    let index;
    if (card != null) {
      index = card.getIndex();
    }

    if ((index == null)) {
      if (cardDataOrIndex != null) {
        if (_.isObject(cardDataOrIndex)) { ({
          index
        } = cardDataOrIndex); } else { index = cardDataOrIndex; }
      }
    }

    if (index == null) { index = this.generateIndex(); }

    if ((card != null) && (this.cardsByIndex[index] == null)) {
      // record card
      this.cardsByIndex[index] = card;
      card.setIndex(index);

      // flush card caches
      card.getOwner().flushAllCachedCards();
    }

    return index;
  }

  /**
   * Injects a card with prismatic and skin properties if needed based on the source action that created it.
   * NOTE: do not call this method directly, instead use applyCardToDeck, applyCardToHand, or applyCardToBoard.
   * @param {Card} card
   * @param {Action} sourceAction
   * @private
   */
  _injectSkinAndPrismaticPropertiesIntoCard(card, sourceAction) {
    if ((card != null) && (sourceAction != null) && !(sourceAction instanceof DrawCardAction)) {
      // get card current id
      let refCard;
      let cardId = card.getId();

      // triggering modifier
      const triggeringModifier = sourceAction.getTriggeringModifier();
      if (triggeringModifier != null) {
        if (triggeringModifier.getCanConvertCardToPrismatic()) {
          refCard = triggeringModifier.getIsInherent() ? triggeringModifier.getCardAffected() : triggeringModifier.getSourceCard();
          if ((refCard != null) && Cards.getIsPrismaticCardId(refCard.getId())) {
            cardId = Cards.getPrismaticCardId(cardId);
          }
        }

        if (triggeringModifier.getCanConvertCardToSkinned()) {
          refCard = triggeringModifier.getSourceCard();
          if (refCard != null) {
            const refCardId = refCard.getId();
            if ((Cards.getBaseCardId(refCardId) === Cards.getBaseCardId(cardId)) && Cards.getIsSkinnedCardId(refCardId)) {
              const skinNum = Cards.getCardSkinNum(refCardId);
              cardId = Cards.getSkinnedCardId(cardId, skinNum);
              CosmeticsFactory.injectSkinPropertiesIntoCard(card, Cards.getCardSkinIdForCardId(cardId));
            }
          }
        }
      }

      // root card
      const rootAction = sourceAction.getRootAction();
      if ((rootAction !== sourceAction) && (rootAction.getCard != null)) {
        const rootPlayedCard = rootAction.getCard();
        if ((rootPlayedCard != null) && (rootPlayedCard.getType() === CardType.Spell) && rootPlayedCard.getCanConvertCardToPrismatic()) {
          refCard = rootPlayedCard.getIsFollowup() ? rootPlayedCard.getRootCard() : rootPlayedCard;
          if ((refCard != null) && Cards.getIsPrismaticCardId(refCard.getId())) {
            cardId = Cards.getPrismaticCardId(cardId);
          }
        }
      }

      // set preserved card id
      if (cardId !== card.getId()) {
        return card.setId(cardId);
      }
    }
  }

  getCardFactory() {
    // method used internally to avoid circular dependencies
    return CardFactory;
  }

  getCardCaches(systemTime) {
    // method used internally to avoid circular dependencies
    return GameSession.getCardCaches(systemTime);
  }

  createModifierForType(modifierType) {
    return ModifierFactory.modifierForType(modifierType, this);
  }

  getModifierClassForType(modifierType) {
    return ModifierFactory.modifierClassForType(modifierType);
  }

  getModifierFactory() {
    // method used internally to avoid circular dependencies
    return ModifierFactory;
  }

  /**
   * Returns a modifier from context object or index, creating a new modifier whenever necessary.
   * @param {Object|Number|String} contextObjectOrIndex context object with at least a "type" property or a modifier index
   * @returns {Modifier}
   */
  getOrCreateModifierFromContextObjectOrIndex(contextObjectOrIndex) {
    if (contextObjectOrIndex != null) {
      let modifier;
      if (_.isObject(contextObjectOrIndex)) {
        // attempt to find indexed modifier
        const {
          index
        } = contextObjectOrIndex;
        if (index != null) {
          modifier = this.getModifierByIndex(index);
        }

        // create modifier
        if ((modifier == null) && (contextObjectOrIndex.type != null)) {
          modifier = this.createModifierForType(contextObjectOrIndex.type);
        }
      } else {
        // attempt to find indexed modifier
        modifier = this.getModifierByIndex(contextObjectOrIndex);
      }

      return modifier;
    }
  }

  /**
   * Returns a modifier from context object or index, creating a new modifier whenever necessary and applying the context object.
   * @param {Object|Number|String} contextObjectOrIndex context object with at least a "type" property or a modifier index
   * @returns {Modifier}
   */
  getOrCreateModifierFromContextObjectOrIndexAndApplyContextObject(contextObjectOrIndex) {
    if (contextObjectOrIndex != null) {
      let modifier;
      if (_.isObject(contextObjectOrIndex)) {
        // attempt to find indexed modifier
        const {
          index
        } = contextObjectOrIndex;
        if (index != null) {
          modifier = this.getModifierByIndex(index);
        }

        // create modifier
        if ((modifier == null) && (contextObjectOrIndex.type != null)) {
          modifier = this.createModifierForType(contextObjectOrIndex.type);
          // copy data so we don't modify anything unintentionally
          const modifierContextObject = UtilsJavascript.fastExtend({}, contextObjectOrIndex);
          modifier.applyContextObject(modifierContextObject);
        }
      } else {
        // attempt to find indexed modifier
        modifier = this.getModifierByIndex(contextObjectOrIndex);
      }

      return modifier;
    }
  }

  /**
   * Indexes a modifier using a provided index or generates a new index as needed.
   * NOTE: do not call this method directly, instead use applyModifierContextObject.
   * @param {Modifier} modifier
   * @param {Object|Number|String} [contextObjectOrIndex=null]
   * @returns {Number|String} index
   * @private
   */
  _indexModifierAsNeeded(modifier, contextObjectOrIndex) {
    let index;
    if (modifier != null) {
      index = modifier.getIndex();
    }

    if ((index == null)) {
      if (contextObjectOrIndex != null) {
        if (_.isObject(contextObjectOrIndex)) { ({
          index
        } = contextObjectOrIndex); } else { index = contextObjectOrIndex; }
      }
    }

    if (index == null) { index = this.generateIndex(); }

    if ((modifier != null) && (this.modifiersByIndex[index] == null)) {
      // record modifier
      this.modifiersByIndex[index] = modifier;
      modifier.setIndex(index);

      // flush card modifier caches
      __guard__(modifier.getCard(), x => x.flushCachedModifiers());
    }

    return index;
  }

  // endregion factory methods

  // region cards

  _removeCardFromCurrentLocation(card, cardIndex, sourceAction) {
    let indexRemoved;
    if ((card == null) && (cardIndex != null)) {
      card = this.getCardByIndex(card);
    }

    if (card != null) {
      const owner = card.getOwner();
      if (card.getIsLocatedInDeck()) {
        indexRemoved = this.removeCardByIndexFromDeck(owner.getDeck(), cardIndex, card, sourceAction);
        if (indexRemoved != null) { return indexRemoved;
        } else { return this.removeCardByIndexFromDeck(this.getOpponentPlayerOfPlayerId(owner.getPlayerId()).getDeck(), cardIndex, card, sourceAction); }
      } else if (card.getIsLocatedInHand()) {
        indexRemoved = this.removeCardByIndexFromHand(owner.getDeck(), cardIndex, card, sourceAction);
        if (indexRemoved != null) { return indexRemoved;
        } else { return this.removeCardByIndexFromHand(this.getOpponentPlayerOfPlayerId(owner.getPlayerId()).getDeck(), cardIndex, card, sourceAction); }
      } else if (card.getIsLocatedInSignatureCards()) {
        return this.removeCardFromSignatureCards(card, sourceAction);
      } else if (card.getIsLocatedOnBoard()) {
        const position = card.getPosition();
        return this.removeCardFromBoard(card, position.x, position.y, sourceAction);
      }
    } else {
      // no card in this game session means the card can only be in hand or deck
      const player1 = this.getPlayer1();
      const player1Deck = player1.getDeck();
      indexRemoved = this.removeCardByIndexFromDeck(player1Deck, cardIndex, card, sourceAction);
      if (indexRemoved != null) { return indexRemoved; }
      indexRemoved = this.removeCardByIndexFromHand(player1Deck, cardIndex, card, sourceAction);
      if (indexRemoved != null) { return indexRemoved; }

      const player2 = this.getPlayer2();
      const player2Deck = player2.getDeck();
      indexRemoved = this.removeCardByIndexFromDeck(player2Deck, cardIndex, card, sourceAction);
      if (indexRemoved != null) { return indexRemoved; }
      indexRemoved = this.removeCardByIndexFromHand(player2Deck, cardIndex, card, sourceAction);
      if (indexRemoved != null) { return indexRemoved; }
    }
  }

  /**
   * Applies a card by index to a deck.
   * @param {Deck} deck
   * @param {Object|Number|String} [cardDataOrIndex=null]
   * @param {Card} [card=null] card may be null in case of non-authoritative session
   * @param {Action} [sourceAction=null] action that applied the card
   */
  applyCardToDeck(deck, cardDataOrIndex, card, sourceAction) {
    if (deck != null) {
      if (card != null) {
        // apply card data received
        card.applyCardData(cardDataOrIndex);

        // attempt to retain prismatic and skinned states
        this._injectSkinAndPrismaticPropertiesIntoCard(card, sourceAction);
      }

      //Logger.module("SDK").debug("[G:#{@gameId}]","GS.applyCardToDeck ->", card?.getLogName(), "by action", sourceAction?.getLogName())

      // index card
      const cardIndex = this._indexCardAsNeeded(card, cardDataOrIndex);

      // remove card from current location
      this._removeCardFromCurrentLocation(card, cardIndex, sourceAction);

      // add card index to deck
      deck.putCardIndexIntoDeck(cardIndex);

      if (card != null) {
        // push card to stack and start pseudo event: apply_card_to_deck
        this.pushEventTypeToStack("apply_card_to_deck");
        this.pushCardToStack(card);

        // apply the card to the deck
        card.onApplyToDeck(deck, sourceAction);

        // execute any authoritative sub actions that occurred during apply_card_to_deck event
        if (!this.getIsRunningAsAuthoritative() && (this.getExecutingAction() != null)) { this.getExecutingAction().executeNextOfEventTypeFromAuthoritativeSubActionQueue("apply_card_to_deck"); }

        // stop pseudo event: apply_card_to_deck
        this.popCardFromStack(card);
        this.popEventTypeFromStack();

        // sync the game state if this change occurred via a non-action source
        // normally game state is cached and synced in response to action events
        // so if a non-action changes game state, then a manual sync is needed
        if ((sourceAction == null)) {
          return this.syncState();
        }
      }
    }
  }

  /**
   * Removes a card by index from a deck.
   * @param {Deck} deck
   * @param {Number|String} cardIndex
   * @param {Card} [card=null] card may be null in case of non-authoritative session
   * @param {Action} [sourceAction=null] action that removed the card
   * @returns {Number|null} index in deck card was removed from, or null if not removed
   */
  removeCardByIndexFromDeck(deck, cardIndex, card, sourceAction) {
    let indexOfCardInDeck = null;
    if ((cardIndex != null) && (deck != null)) {
      // attempt to remove the card index from the deck
      indexOfCardInDeck = deck.removeCardIndexFromDeck(cardIndex);
    }
    //Logger.module("SDK").debug("[G:#{@gameId}]","GS.removeCardByIndexFromDeck ->", card?.getLogName(), "at index", indexOfCardInDeck, "for deck", deck?, "by action", sourceAction?.getLogName())
    // if the card data was removed
    if ((indexOfCardInDeck != null) && (card != null)) {
      // remove the card from the deck
      card.onRemoveFromDeck(deck, sourceAction);

      // sync the game state if this change occurred via a non-action source
      // normally game state is cached and synced in response to action events
      // so if a non-action changes game state, then a manual sync is needed
      if ((sourceAction == null)) {
        this.syncState();
      }
    }

    return indexOfCardInDeck;
  }

  /**
   * Applies a card by index to a hand.
   * @param {Deck} deck
   * @param {Object|Number|String} [cardDataOrIndex=null]
   * @param {Card} [card=null] card may be null in case of non-authoritative session
   * @param {Boolean} [indexInHand=null] whether to put the card into a specific index of hand
   * @param {Action} [sourceAction=null] action that applied the card
   * @param {Boolean} [burnCard=false] if card should always be burned immediately regardless of space left in hand
   * @returns {Number|null} index in hand card was applied to, or null if not applied
   */
  applyCardToHand(deck, cardDataOrIndex, card, indexInHand, sourceAction, burnCard) {
    if (burnCard == null) { burnCard = false; }
    if (deck != null) {
      if (card != null) {
        // apply card data received
        card.applyCardData(cardDataOrIndex);

        // attempt to retain prismatic and skinned states
        this._injectSkinAndPrismaticPropertiesIntoCard(card, sourceAction);
      }

      // index card
      const cardIndex = this._indexCardAsNeeded(card, cardDataOrIndex);

      // remove card from current location
      this._removeCardFromCurrentLocation(card, cardIndex, sourceAction);

      if (burnCard) {
        indexInHand = null;
      } else {
        // add card data to hand
        if (indexInHand != null) {
          deck.putCardIndexInHandAtIndex(cardIndex, indexInHand);
        } else {
          indexInHand = deck.putCardIndexInHand(cardIndex);
        }
      }

      //Logger.module("SDK").debug("[G:#{@gameId}]","GS.applyCardToHand ->", card?.getLogName(), "by action", sourceAction?.getLogName(), "at index", indexInHand)
      if (card != null) {
        // push card to stack and start pseudo event: apply_card_to_hand
        this.pushEventTypeToStack("apply_card_to_hand");
        this.pushCardToStack(card);

        if ((indexInHand == null)) {
          // burned from hand
          card.onRemoveFromHand(deck, sourceAction);
        } else {
          // apply the card to the hand
          card.onApplyToHand(deck, sourceAction);
        }

        // execute any authoritative sub actions that occurred during apply_card_to_hand event
        if (!this.getIsRunningAsAuthoritative() && (this.getExecutingAction() != null)) { this.getExecutingAction().executeNextOfEventTypeFromAuthoritativeSubActionQueue("apply_card_to_hand"); }

        // stop pseudo event: apply_card_to_hand
        this.popCardFromStack(card);
        this.popEventTypeFromStack();

        // sync the game state if this change occurred via a non-action source
        // normally game state is cached and synced in response to action events
        // so if a non-action changes game state, then a manual sync is needed
        if ((sourceAction == null)) {
          this.syncState();
        } else {
          if (indexInHand != null) {
            // force record state for card just after applying
            card.setupActionStateRecord();
            __guard__(card.getActionStateRecord(), x => x.recordStateEvenIfNotChanged(sourceAction.getIndex()));
          }

          if (!this.getIsBufferingEvents()) {
            // send an event that all cached elements should update/flush
            // note: actions are not allowed in response to this event
            this.pushEvent({type: EVENTS.update_cache_action, action: sourceAction, step: this.getExecutingStep(), gameSession: this}, {resolveAction: sourceAction, blockActionExecution: true});
          }
        }
      }
    }

    return indexInHand;
  }

  /**
   * Removes a card by index from a deck.
   * @param {Deck} deck
   * @param {Number|String} cardIndex
   * @param {Card} [card=null] card may be null in case of non-authoritative session
   * @param {Action} [sourceAction=null] action that removed the card
   * @returns {Number|null} index in hand card was removed from, or null if not removed
   */
  removeCardByIndexFromHand(deck, cardIndex, card, sourceAction) {
    let indexOfCardInHand = null;
    if ((deck != null) && (cardIndex != null)) {
      //Logger.module("SDK").debug("[G:#{@gameId}]","GS.removeCardByIndexFromHand ->", card?.getLogName(), "by action", sourceAction?.getLogName())

      // attempt to remove the card data
      // in the case of opponent card actions
      // it is possible the card is null but the card data is defined
      indexOfCardInHand = deck.removeCardIndexFromHand(cardIndex);
    }

    // if the card data was removed
    if (indexOfCardInHand != null) {
      if (card != null) {
        // remove the card from the deck
        card.onRemoveFromHand(deck, sourceAction);

        // sync the game state if this change occurred via a non-action source
        // normally game state is cached and synced in response to action events
        // so if a non-action changes game state, then a manual sync is needed
        if ((sourceAction == null)) {
          this.syncState();
        }
      }
    }

    return indexOfCardInHand;
  }

  /**
   * Applies a card by index to signature cards.
   * @param {Card} [card=null] card may be null in case of non-authoritative session
   * @param {Object|Number|String} [cardDataOrIndex=null]
   * @param {Action} [sourceAction=null] action that applied the card
   */
  applyCardToSignatureCards(card, cardDataOrIndex, sourceAction) {
    if (card != null) {
      const owner = card.getOwner();
      if (!(owner instanceof Player)) {
        Logger.module("SDK").error(`[G:${this.gameId}]`, "GS.applyCardToSignatureCards -> cannot apply card without an owner to signature slot!");
      }

      // apply card data received
      card.applyCardData(cardDataOrIndex);

      // attempt to retain prismatic and skinned states
      this._injectSkinAndPrismaticPropertiesIntoCard(card, sourceAction);
      //Logger.module("SDK").debug("[G:#{@gameId}]","GS.applyCardToSignatureCards ->", card.getLogName(), "by action", sourceAction?.getLogName())

      // index card
      const cardIndex = this._indexCardAsNeeded(card, card.getIndex() || cardDataOrIndex);

      // push card to stack and start pseudo event: apply_card_to_signature_cards
      this.pushEventTypeToStack("apply_card_to_signature_cards");
      this.pushCardToStack(card);

      // remove card from current location
      this._removeCardFromCurrentLocation(card, cardIndex, sourceAction);

      // add card data to owner signature cards list
      owner.addSignatureCard(card);

      // apply the card to the signature cards
      card.onApplyToSignatureCards(sourceAction);

      // execute any authoritative sub actions that occurred during apply_card_to_signature_cards event
      if (!this.getIsRunningAsAuthoritative() && (this.getExecutingAction() != null)) { this.getExecutingAction().executeNextOfEventTypeFromAuthoritativeSubActionQueue("apply_card_to_signature_cards"); }

      // stop pseudo event: apply_card_to_signature_cards
      this.popCardFromStack(card);
      this.popEventTypeFromStack();

      // sync the game state if this change occurred via a non-action source
      // normally game state is cached and synced in response to action events
      // so if a non-action changes game state, then a manual sync is needed
      if ((sourceAction == null)) {
        return this.syncState();
      } else {
        // force record state for card just after applying
        card.setupActionStateRecord();
        __guard__(card.getActionStateRecord(), x => x.recordStateEvenIfNotChanged(sourceAction.getIndex()));

        if (!this.getIsBufferingEvents()) {
          // send an event that all cached elements should update/flush
          // note: actions are not allowed in response to this event
          return this.pushEvent({type: EVENTS.update_cache_action, action: sourceAction, step: this.getExecutingStep(), gameSession: this}, {resolveAction: sourceAction, blockActionExecution: true});
        }
      }
    }
  }

  /**
   * Removes a card from a player's signature slot.
   * @param {Card} card
   * @param {Action} [sourceAction=null] action that removed the card
   * @returns {Number|null} index in signature cards card was removed from, or null if not removed
   */
  removeCardFromSignatureCards(card, sourceAction) {
    let indexOfCardInSignatureCards = null;
    if (card != null) {
      const owner = card.getOwner();
      if (!(owner instanceof Player)) {
        Logger.module("SDK").error(`[G:${this.gameId}]`, "GS.removeCardFromSignatureCards -> cannot remove card without an owner from signature slot!");
      }

      // attempt to remove the card data
      indexOfCardInSignatureCards = owner.removeSignatureCard(card);
      Logger.module("SDK").debug(`[G:${this.gameId}]`,"GS.removeCardFromSignatureCards ->", card.getLogName(), "by action", sourceAction != null ? sourceAction.getLogName() : undefined, "from index", indexOfCardInSignatureCards);

      // remove the card from signature cards
      card.onRemoveFromSignatureCards(sourceAction);

      // sync the game state if this change occurred via a non-action source
      // normally game state is cached and synced in response to action events
      // so if a non-action changes game state, then a manual sync is needed
      if ((sourceAction == null)) {
        this.syncState();
      }
    }

    return indexOfCardInSignatureCards;
  }

  /**
   * Applies a card to the board at a given location.
   * @param {Card} card card to apply
   * @param {Number} x x position
   * @param {Number} y y position
   * @param {Object|Number|String} [cardDataOrIndex=null]
   * @param {Action} [sourceAction=null] action that applied the card
   */
  applyCardToBoard(card, x, y, cardDataOrIndex, sourceAction) {
    let isValidApplication = false;

    if ((card != null) && !card.getIsActive()) {
      // apply card data received
      card.applyCardData(cardDataOrIndex);

      // attempt to retain prismatic and skinned states
      this._injectSkinAndPrismaticPropertiesIntoCard(card, sourceAction);
      //Logger.module("SDK").debug("[G:#{@gameId}]","GS.applyCardToBoard ->", card?.getLogName(), "at (#{x}, #{y}) by action", sourceAction?.getLogName())

      // index data
      const cardIndex = this._indexCardAsNeeded(card, card.getIndex() || cardDataOrIndex);

      // check whether card application is valid
      const targetPosition = {x, y};
      isValidApplication = this.getBoard().isOnBoard(targetPosition) &&
          (!CardType.getIsEntityCardType(card.getType()) ||
            !this.getBoard().getObstructionAtPositionForEntity(targetPosition, card) ||
            (this.getExecutingAction() instanceof PlayCardFromHandAction && card.hasModifierClass(ModifierCustomSpawn)));

      if ((sourceAction != null) && isValidApplication) {
        // force record state for card just before applying
        card.setupActionStateRecord();
        __guard__(card.getActionStateRecord(), x1 => x1.recordStateEvenIfNotChanged(sourceAction.getIndex()));

        if (!this.getIsBufferingEvents()) {
          // send an event that all cached elements should update/flush
          // note: actions are not allowed in response to this event
          this.pushEvent({type: EVENTS.update_cache_action, action: sourceAction, step: this.getExecutingStep(), gameSession: this}, {resolveAction: sourceAction, blockActionExecution: true});
        }
      }

      // push card to stack and start pseudo event: apply_card_to_board
      this.pushEventTypeToStack("apply_card_to_board");
      this.pushCardToStack(card);

      // remove card from current location
      this._removeCardFromCurrentLocation(card, cardIndex, sourceAction);

      if (isValidApplication) {
        // store a reference to this action with the card that it applied
        card.setAppliedToBoardByAction(sourceAction);

        // set card as sub-card of parent card
        const parentCard = card.getParentCard();
        if (parentCard != null) {
          parentCard.addSubCard(card);
        }

        // handle state by card type before formally applying card
        // this is important for destroying previous cards
        if (card.getType() === CardType.Tile) {
          // check for existing tile at position and kill it
          // this works because the search always returns the first tile found
          const existingTile = this.board.getTileAtPosition(targetPosition, true);
          if (existingTile != null) {
            //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.playCard - kill existing tile #{existingTile.getName()} at grid(#{position.x}, #{position.y})"
            this.executeAction(existingTile.actionDie(card));
          }
        }

        // add card to board
        // must be done before setting card as applied
        // in case card triggers anything as a result
        this.board.addCard(card);

        // set card as applied to board
        card.onApplyToBoard(this.board, x, y, sourceAction);

        // check if card was an entity that died during apply
        if ((card.getType() === CardType.Entity) && (card.getHP() <= 0) && this.getCanCardBeScheduledForRemoval(card)) {
          this.executeAction(card.actionDie());
        }
      }

      // execute any authoritative sub actions that occurred during apply_card_to_board event
      if (!this.getIsRunningAsAuthoritative() && (this.getExecutingAction() != null)) { this.getExecutingAction().executeNextOfEventTypeFromAuthoritativeSubActionQueue("apply_card_to_board"); }

      // stop pseudo event: apply_card_to_board
      this.popCardFromStack(card);
      this.popEventTypeFromStack();

      // auto remove cards from the board that are:
      // - not valid applications
      // - not entities (ex: spells, artifacts)
      if (!isValidApplication || !(card instanceof Entity)) {
        this.removeCardFromBoard(card, x, y, sourceAction);
      } else if ((sourceAction == null)) {
        // sync the game state if this change occurred via a non-action source
        // normally game state is cached and synced in response to action events
        // so if a non-action changes game state, then a manual sync is needed
        this.syncState();
      }
    }

    return isValidApplication;
  }

  /**
   * Removes a card from the board at a given location.
   * @param {Card} card card to remove
   * @param {Number} x x position
   * @param {Number} y y position
   * @param {Action} [sourceAction=null] action that applied the card
   */
  removeCardFromBoard(card, x, y, sourceAction) {
    if ((card != null) && card.getIsActive()) {
      //Logger.module("SDK").debug("[G:#{@gameId}]","GS.removeCardFromBoard ->", card?.getLogName(), "at (#{x}, #{y}) by action", sourceAction?.getLogName())
      // remove the card from the board
      // must be done before setting card as removed
      // in case card triggers anything as a result
      this.board.removeCard(card);

      // set card as removed
      card.onRemoveFromBoard(this.board, x, y, sourceAction);

      // when removed by a die action
      if (sourceAction instanceof DieAction) {
        // record total minions killed so far by this player
        if (!card.getIsGeneral()) {
          const opponent = _.find(this.players,p => p.playerId !== card.getOwnerId());
          if (opponent != null) {
            opponent.totalMinionsKilled += 1;
          }
        }
      }

      // sync the game state if this change occurred via a non-action source
      // normally game state is cached and synced in response to action events
      // so if a non-action changes game state, then a manual sync is needed
      if ((sourceAction == null)) {
        return this.syncState();
      }
    }
  }

  getActiveCard() {
    return this._private.cardStack[this._private.cardStack.length - 1];
  }

  pushCardToStack(card) {
    return this._private.cardStack.push(card);
  }

  popCardFromStack() {
    return this._private.cardStack.pop();
  }

  /**
   * Returns an array copy of the master map of cards.
   * @returns {Array}
   */
  getCards() {
    const cards = [];
    const cardIndices = Object.keys(this.cardsByIndex);
    for (var index of Array.from(cardIndices)) {
      var card = this.cardsByIndex[index];
      if (card != null) {
        cards.push(card);
      }
    }
    return cards;
  }

  /**
   * Returns a card that matches the index.
   * @param {Number|String} index
   * @returns {Card|Null}
   */
  getCardByIndex(index) {
    if (index != null) {
      return this.cardsByIndex[index];
    }
  }

  /**
   * Returns an array of cards that match an array of indices.
   * NOTE: may contain null values if cards do not exist for indices.
   * @param {Array} indices
   * @returns {Array}
   */
  getCardsByIndices(indices) {
    const cards = [];

    if (indices != null) {
      for (var index of Array.from(indices)) {
        cards.push(this.getCardByIndex(index));
      }
    }

    return cards;
  }

  /**
   * Returns a list of cards played to board in order of play.
   * @param {String} [playerId=null] player that played the cards, or both if no playerId provided
   * @param {Class} [cardClass=Card] class of cards to get
   * @returns {Array}
   */
  getCardsPlayed(playerId, cardClass) {
    const cards = [];
    if (cardClass == null) { cardClass = Card; }
    const sortingMethod = card => card.getAppliedToBoardByActionIndex();

    // get all cards that have been played by a player
    // sort by played index
    for (var card of Array.from(this.getCards())) {
      if (card instanceof cardClass && (card.getOwnerId() != null) && ((playerId == null) || (card.getOwnerId() === playerId)) && card.getIsPlayed()) {
        UtilsJavascript.arraySortedInsertAscendingByScore(cards, card, sortingMethod);
      }
    }

    return cards;
  }

  /**
   * Returns a list of units played to board in order of play.
   * @see getCardsPlayed
   * @returns {Array}
   */
  getUnitsPlayed(playerId) {
    return this.getCardsPlayed(playerId, Unit);
  }

  /**
   * Returns a list of artifacts played to board in order of play.
   * @see getCardsPlayed
   * @returns {Array}
   */
  getArtifactsPlayed(playerId) {
    return this.getCardsPlayed(playerId, Artifact);
  }

  /**
   * Returns a list of spells played to board in order of play.
   * @see getCardsPlayed
   * @returns {Array}
   */
  getSpellsPlayed(playerId) {
    return this.getCardsPlayed(playerId, Spell);
  }

  /**
   * Returns a list of dead units in order death.
   * NOTE: this is an expensive method, so it is recommended that the return value be cached whenever possible!
   * @param {String} [playerId=null] player that played the cards, or both if no playerId provided
   * @param {String} [searchUntilLastTurnOfPlayerId=null] whether to search only until last turn of a player id
   * @returns {Array}
   */
  getDeadUnits(playerId, searchUntilLastTurnOfPlayerId) {
    const deadUnits = [];

    // find actions to check
    let actions = [];
    const currentTurn = this.getGameSession().getCurrentTurn();
    const turns = [].concat(this.getGameSession().getTurns(), currentTurn);
    for (let i = turns.length - 1; i >= 0; i--) {
      var turn = turns[i];
      if ((searchUntilLastTurnOfPlayerId != null) && (turn !== currentTurn) && (turn.getPlayerId() === searchUntilLastTurnOfPlayerId)) {
        break;
      } else {
        for (var step of Array.from(turn.getSteps())) {
          actions = actions.concat(step.getAction().getFlattenedActionTree());
        }
      }
    }

    for (var action of Array.from(actions)) {
      if (action instanceof DieAction) {
        var card = action.getTarget();
        if (card instanceof Unit && card.getIsRemoved() && ((playerId == null) || (card.getOwnerId() === playerId)) && !(card.getRarityId() === Rarity.TokenUnit) && !card.getWasGeneral()) {
          deadUnits.push(card);
        }
      }
    }

    return deadUnits;
  }

  // endregion cards

  // region modifiers

  /**
   * Applies a modifier context object to a card, attempting to apply via action whenever possible.
   * @param {Object} modifierContextObject context object for modifier to apply
   * @param {Card} card card to apply modifier to
   * @param {Modifier} [parentModifier=null] parentModifier that applied this modifier
   * @param {Number} [auraModifierId=null] identifier for which modifier in the parentModifier aura this is
   */
  applyModifierContextObject(modifierContextObject, card, parentModifier, auraModifierId) {
    if ((modifierContextObject != null) && card instanceof Card && (this.getIsRunningAsAuthoritative() || (modifierContextObject.index != null))) {
      if ((this._private.actionQueue != null) && (modifierContextObject.index == null)) {
        // non-indexed modifiers should apply via action when applied during action execution
        const applyModifierAction = new ApplyModifierAction(this, modifierContextObject, card, parentModifier, auraModifierId);
        return this.executeAction(applyModifierAction);
      } else {
        // modifiers can apply instantly when no actions executing
        // copy data so we don't modify anything unintentionally
        modifierContextObject = UtilsJavascript.fastExtend({}, modifierContextObject);
        const modifier = this.getOrCreateModifierFromContextObjectOrIndex(modifierContextObject);
        return this.p_applyModifier(modifier, card, parentModifier, modifierContextObject, auraModifierId);
      }
    }
  }

  /**
   * SDK (package) level method that applies a modifier to a card instantly.
   * NOTE: do not call this method directly, instead use applyModifierContextObject.
   * @see applyModifierContextObject
   */
  p_applyModifier(modifier, card, parentModifier, modifierContextObject, auraModifierId) {
    if (card instanceof Card && modifier instanceof Modifier && !card.getIsRemoved() && !modifier.getIsRemoved()) {
      // ensure player modifiers are valid
      let sourceCardIndex;
      if (modifier instanceof PlayerModifier && (!(card instanceof Entity) || !card.getIsGeneral())) {
        Logger.module("SDK").error(`[G:${this.gameId}]`, "GS.applyModifierContextObject -> cannot apply player modifier to non-general!");
      }

      // apply context object received
      modifier.applyContextObject(modifierContextObject);

      // index modifier
      this._indexModifierAsNeeded(modifier, modifierContextObject);
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.p_applyModifier -> #{modifier.getLogName()} to #{card.getLogName()}"

      // set parent/child relationship
      if (parentModifier == null) { parentModifier = modifier.getParentModifier(); }
      if (parentModifier instanceof Modifier) {
        parentModifier.addSubModifier(modifier);

        // source card is card that the parent modifier is applied to
        sourceCardIndex = parentModifier.getCardAffectedIndex();
      }

      // set triggering relationship
      const triggeringModifier = this.getTriggeringModifier();
      if (triggeringModifier instanceof Modifier) {
        triggeringModifier.onTriggerAppliedModifier(modifier, this.getExecutingAction(), this.getExecutingResolveAction());
      }

      // find source card index as needed
      if ((sourceCardIndex == null)) {
        const activeCard = this.getActiveCard();
        const executingAction = this.getExecutingAction();
        if (activeCard != null) {
          sourceCardIndex = activeCard.getIndex();
        } else if (executingAction != null) {
          let applyingAction;
          if (executingAction instanceof ApplyCardToBoardAction) {
            applyingAction = executingAction;
          } else {
            applyingAction = executingAction.getMatchingAncestorAction(ApplyCardToBoardAction);
          }
          if (applyingAction != null) {
            sourceCardIndex = __guard__(applyingAction.getCard(), x => x.getIndex());
          }
        } else {
          sourceCardIndex = card.getIndex();
        }
      }

      // set source card index
      modifier.setSourceCardIndex(sourceCardIndex);

      // set aura modifier id
      if (auraModifierId != null) { modifier.setAuraModifierId(auraModifierId); }

      // record the modifier with the card
      card.onAddModifier(modifier);

      // apply the modifier to the card
      return modifier.onApplyToCard(card);
    }
  }

  /**
   * Removes a modifier from a card, attempting to remove via action whenever possible
   * @param {Modifier} modifier modifier to remove
   */
  removeModifier(modifier) {
    if (this.getIsRunningAsAuthoritative() && modifier instanceof Modifier && (modifier.getCard() != null) && !modifier.getIsRemoved()) {
      if (this._private.actionQueue != null) {
        // modifiers should remove via action when removed during action execution
        const removeModifierAction = new RemoveModifierAction(this, modifier);
        return this.executeAction(removeModifierAction);
      } else {
        // modifiers can remove instantly when no actions executing
        return this.p_removeModifier(modifier);
      }
    }
  }

  /**
   * SDK (package) level method that removes a modifier from a card instantly.
   * NOTE: do not call this method directly, instead use removeModifier
   * @see removeModifier
   */
  p_removeModifier(modifier) {
    if (modifier instanceof Modifier && (modifier.getCard() != null) && !modifier.getIsRemoved()) {
      //Logger.module("SDK").debug "[G:#{@.gameId}]", "GS.p_removeModifier -> #{modifier.getLogName()} from #{modifier.getCard()?.getLogName()}"
      const card = modifier.getCard();

      // set triggering relationship
      const triggeringModifier = this.getTriggeringModifier();
      if (triggeringModifier instanceof Modifier) {
        triggeringModifier.onTriggerRemovedModifier(modifier, this.getExecutingAction(), this.getExecutingResolveAction());
      }

      // remove the modifier from the card's record
      card.onRemoveModifier(modifier);

      // unapply the modifier
      return modifier.onRemoveFromCard();
    }
  }

  moveModifierToCard(modifier, card) {
    if (this.getIsRunningAsAuthoritative() && card instanceof Card && modifier instanceof Modifier) {
      //Logger.module("SDK").debug("[G:#{@.gameId}]", "GS.moveModifierToCard -> MODIFIER: #{modifier.getType()} with index #{modifier.getIndex()} isRemoved? #{modifier.getIsActive()} CARD FROM: #{modifier.getCard()?.getName()} CARD TO: #{card?.getName()}")
      // copy modifier context object
      const modifierContextObject = modifier.createContextObjectForClone();
      const parentModifier = modifier.getParentModifier();

      // remove modifier from old card
      this.removeModifier(modifier);

      // apply copy of modifier to new card
      return this.applyModifierContextObject(modifierContextObject, card, parentModifier);
    }
  }

  removeModifierFromCardByType(type, card) {
    return this.removeModifier(card.getModifierByType(type));
  }

  removeModifierFromCardByStackType(type, card) {
    return this.removeModifier(card.getModifierByStackType(type));
  }

  removeModifierFromCardByClass(cls, card) {
    return this.removeModifier(card.getModifierByClass(cls));
  }

  /**
   * Returns a modifier that matches the index.
   * @param {Number|String} index
   * @returns {Modifier|Null}
   */
  getModifierByIndex(index) {
    if (index != null) {
      return this.modifiersByIndex[index];
    }
  }

  /**
   * Returns an array of modifiers that match an array of indices.
   * @param {Array} indices
   * @returns {Array}
   */
  getModifiersByIndices(indices) {
    const modifiers = [];

    if (indices != null) {
      for (var index of Array.from(indices)) {
        var modifier = this.getModifierByIndex(index);
        if (modifier != null) {
          modifiers.push(modifier);
        }
      }
    }

    return modifiers;
  }

  pushTriggeringModifierOntoStack(modifier) {
    return this._private.modifierStack.push(modifier);
  }

  popTriggeringModifierFromStack() {
    return this._private.modifierStack.pop();
  }

  getTriggeringModifier() {
    return this._private.modifierStack[this._private.modifierStack.length - 1];
  }

  /**
   * Returns all player modifiers.
   * @returns {Array}
   */
  getPlayerModifiers() {
    let modifiers = [];

    for (var player of Array.from(this.players)) {
      modifiers = modifiers.concat(player.getPlayerModifiers());
    }

    return modifiers;
  }

  // endregion modifiers

  // region serialization

  /**
   * Serialize object to JSON using SDK rules:
   * - keys starting with "_" will be ignored
   * - properties that are not different from the prototype will be ignored
   * @param {*} source object to serialize to JSON
   */
  serializeToJSON(source) {
    return JSON.stringify(source);
  }
    // return JSON.stringify(UtilsJavascript.deepCopy(
    //   source,
    //   ((key, value) ->
    //     return key[0] != "_"
    //   ),
    //   ((value, dst) ->
    //     if value instanceof Action or value instanceof Modifier
    //       # actions and modifiers need a type to be reconstructed
    //       dst.type = value.type
    //   )
    // ))

  /**
   * Deserializes game session data provided by an authoritative source such as the server.
   * @param {Object} sessionData game session data as a JSON object
   */
  deserializeSessionFromFirebase(sessionData) {
    //Logger.module("SDK").debug("[G:#{@.gameId}]", "GS.deserializeSessionFromFirebase")
    // emit event that we're deserializing
    // this allows any existing sdk objects to clean themselves up
    let action, actionIndex, card, cardIndices, index, modifier, modifierIndices, player, turn;
    this.pushEvent({type: EVENTS.before_deserialize, gameSession: this}, {blockActionExecution: true});

    // copy over all the data
    UtilsJavascript.fastExtend(this,sessionData);

    // re-initialize non-persistent properties
    this.flushCachedGeneralsByPlayerId();
    this.flushAllCachedCards();
    this._private.eventBuffer = [];
    this._private.actionsToResolve = [];
    this._private.actionsByIndex = {};
    this._private.stepsByIndex = {};
    this.players = [];
    this.players.push(new Player(this, "1", "player1"));
    this.players.push(new Player(this, "2", "player2"));
    this.cardsByIndex = {};
    this.battleMapTemplate = new BattleMapTemplate(this);
    this.board = new Board(this, CONFIG.BOARDCOL, CONFIG.BOARDROW);
    this.turns = [];
    this.modifiersByIndex = {};

    if (sessionData.players != null) {
      for (let i = 0; i < sessionData.players.length; i++) {
        var playerData = sessionData.players[i];
        player = this.players[i];
        player.deserialize(playerData);
      }
    }

    // deserialize
    if (sessionData.battleMapTemplate != null) {
      this.battleMapTemplate.deserialize(sessionData.battleMapTemplate);
    }

    if (sessionData.modifiersByIndex != null) {
      modifierIndices = Object.keys(sessionData.modifiersByIndex);
      for (index of Array.from(modifierIndices)) {
        var modifierData = sessionData.modifiersByIndex[index];
        if (modifierData != null) {
          modifier = this.deserializeModifierFromFirebase(modifierData);
          if (modifier != null) {
            // store modifier in master list
            this.modifiersByIndex[index] = modifier;

            if (!modifier.getIsRemoved()) {
              // because modifiers are in a flat array, we know sub modifiers will be deserialized
              // instead just add self as sub modifier of parent
              var parentModifier = modifier.getParentModifier();
              if (parentModifier) { parentModifier.addSubModifier(modifier); }
            }
          }
        }
      }
    }

    if (sessionData.cardsByIndex != null) {
      cardIndices = Object.keys(sessionData.cardsByIndex);
      for (index of Array.from(cardIndices)) {
        var cardData = sessionData.cardsByIndex[index];
        if (cardData != null) {
          card = this.deserializeCardFromFirebase(cardData);
          if (card != null) {
            this.cardsByIndex[index] = card;
          }
        }
      }
    }

    // deserialize all turns
    if (sessionData.currentTurn != null) {
      this.currentTurn = this.deserializeTurnFromFirebase(sessionData.currentTurn);
    }

    if (sessionData.turns != null) {
      for (var turnData of Array.from(sessionData.turns)) {
        turn = this.deserializeTurnFromFirebase(turnData);
        this.turns.push(turn);
      }
    }

    // keep track of last step
    const currentTurnSteps = this.currentTurn.getSteps();
    if (currentTurnSteps.length > 0) {
      this._private.lastStep = currentTurnSteps[currentTurnSteps.length - 1];
    } else if (this.turns.length > 0) {
      for (let j = this.turns.length - 1; j >= 0; j--) {
        turn = this.turns[j];
        var turnSteps = turn.getSteps();
        if (turnSteps.length > 0) {
          this._private.lastStep = turnSteps[turnSteps.length - 1];
          break;
        }
      }
    }

    // traverse turns (including current) and add each action to the master list
    // it is crucial that the action graph is read in breadth-first
    // because that is the execution order of the action loop
    const turns = [].concat(this.turns, [this.currentTurn]);
    for (turn of Array.from(turns)) {
      for (var step of Array.from(turn.getSteps())) {
        this._private.stepsByIndex[step.getIndex()] = step;
        action = step.getAction();
        var actionQueue = [action];
        while (actionQueue.length > 0) {
          var actionToRecord = actionQueue.shift();
          actionIndex = actionToRecord.getIndex();
          this._private.actionsByIndex[actionIndex] = actionToRecord;
          actionQueue = actionQueue.concat(actionToRecord.getSubActions());
        }
      }
    }

    // reconnect cards to the action that played them
    cardIndices = Object.keys(this.cardsByIndex);
    for (index of Array.from(cardIndices)) {
      card = this.cardsByIndex[index];
      if (card != null) {
        // actions cannot ever serialize references to cards for anti-cheat
        // so we have to request the index of the action from the card
        actionIndex = card.getAppliedToBoardByActionIndex();
        if ((actionIndex != null) && (actionIndex > -1)) {
          action = this.getActionByIndex(actionIndex);
          if (action != null) {
            action.setCard(card);
          }
        }
      }
    }

    // reconstruct board
    if (sessionData.board != null) {
      UtilsJavascript.fastExtend(this.board, sessionData.board);
    }

    // for each card on the board
    for (var cardIndex of Array.from(this.board.getCardIndices())) {
      card = this.getCardByIndex(cardIndex);
      // add the card back to the board
      this.board.addCard(card);

      // add the card back to its owner's event receiving cards list
      card.getOwner().addEventReceivingCardOnBoard(card);
    }

    // reattach modifiers to cards
    cardIndices = Object.keys(this.cardsByIndex);
    for (index of Array.from(cardIndices)) {
      card = this.cardsByIndex[index];
      if (card != null) {
        modifierIndices = card.getModifierIndices();
        for (index of Array.from(modifierIndices)) {
          modifier = this.getModifierByIndex(index);
          if (modifier != null) {
            // record the modifier with the card
            card.onAddModifier(modifier);

            // record card with modifier
            modifier.setCard(card);

            // post deserialize modifier
            modifier.postDeserialize();
          }
        }
      }
    }

    // post deserialize cards once all cards and modifiers are guaranteed
    cardIndices = Object.keys(this.cardsByIndex);
    for (index of Array.from(cardIndices)) {
      card = this.cardsByIndex[index];
      if (card != null) {
        card.postDeserialize();
      }
    }

    // post deserialize players once all cards and modifiers are guaranteed
    for (player of Array.from(this.players)) {
      player.postDeserialize();
    }

    return this.pushEvent({type: EVENTS.deserialize, gameSession: this}, {blockActionExecution: true});
  }

  deserializeCardFromFirebase(cardData) {
    if (cardData != null) {
      const card = this.createCardForIdentifier(cardData.id);
      card.deserialize(cardData);

      return card;
    }
  }

  deserializeTurnFromFirebase(turnData) {
    if (turnData != null) {
      const turn = new GameTurn(this);
      turn.deserialize(turnData);

      return turn;
    }
  }

  deserializeStepFromFirebase(stepData) {
    if (stepData != null) {
      // Logger.module("SDK").debug("[G:#{@.gameId}]", "GameSession::deserializeStepFromFirebase",stepData)

      const step = new Step(this);
      step.deserialize(stepData);
      step.setAction(this.deserializeActionFromFirebase(stepData.action));

      return step;
    }
  }

  deserializeActionFromFirebase(actionData) {
    if (actionData != null) {
      const action = this.createActionForType(actionData.type);
      action.deserialize(actionData);

      return action;
    }
  }

  deserializeModifierFromFirebase(modifierData) {
    if (modifierData != null) {
      const modifier = this.createModifierForType(modifierData.type);
      modifier.deserialize(modifierData);

      return modifier;
    }
  }
}
_GameSession.initClass();

  // endregion serialization

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}