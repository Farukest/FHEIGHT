/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SDKObject = require('app/sdk/object');
const Logger =       require('app/common/logger');
const CONFIG =       require('app/common/config');
const EVENTS =       require('app/common/event_types');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const CardType = require('app/sdk/cards/cardType');
const DamageAction = require('app/sdk/actions/damageAction');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const DieAction = require('app/sdk/actions/dieAction');
const ApplyModifierAction = require('app/sdk/actions/applyModifierAction');
const RemoveModifierAction = require('app/sdk/actions/removeModifierAction');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const _ = require('underscore');

const i18next = require('i18next');

/*
  An modifier is a modular element that modifies a card, giving them auras, abilities, buffs, debuffs, etc.
*/
class Modifier extends SDKObject {
  static initClass() {
  
    this.prototype.type ="Modifier";
    this.type ="Modifier";
    this.description = undefined;
    this.isHiddenToUI = false; // whether or not this modifier is shown in the UI
    this.isKeyworded = false; // https://github.com/88dots/cleancoco/wiki/Glossary
    this.modifierName = undefined;
  
    this.prototype.activeInDeck = true; // whether this modifier is active while applied to a card in deck
    this.prototype.activeInHand = true; // whether this modifier is active while applied to a card in hand
    this.prototype.activeInSignatureCards = true; // whether this modifier is active while applied to a card in signature cards
    this.prototype.activeOnBoard = true; // whether this modifier is active while applied to a card on board
    this.prototype.appliedByActionIndex = -1; // index of action that applied this modifier, where -1 is during game setup
    this.prototype.appliedByModifierIndex = null; // index of modifier that applied this modifier, where -1 is during game setup
    this.prototype.attributeBuffs = null;
    this.prototype.attributeBuffsAbsolute = null; //names of attributeBuffs to be treated as absolute values (instead of +- values)
    this.prototype.attributeBuffsRebased = null; //names of attributeBuffs to be treated as new base stat values, applied before all other buffs
    this.prototype.attributeBuffsFixed = null; //names of attributeBuffs to be treated as overrides (ignores further attributeBuffs of that type in the stack)
    this.prototype.auraFilterByCardIds = null; // an array of cardIds to receive the aura
    this.prototype.auraFilterByCardType = CardType.Unit; // only cards of this type receive the aura
    this.prototype.auraFilterByRaceIds = null; // an array of raceIds to receive the aura
    this.prototype.auraFilterByModifierTypes = null; // array of modifier types. only cards with these modifier types will receive the aura
    this.prototype.auraIncludeAlly = true; // whether to include allied entities in aura
    this.prototype.auraIncludeBoard = true; // whether to include cards on board in aura
    this.prototype.auraIncludeEnemy = true; // whether to include enemy entities in aura
    this.prototype.auraIncludeGeneral = true; // whether a General can be in this aura
    this.prototype.auraIncludeHand = false; // whether to include cards in hand in aura
    this.prototype.auraIncludeSignatureCards = false; // whether to include cards in signature cards in aura
    this.prototype.auraIncludeSelf = true; // whether to include own card in aura
    this.prototype.auraRadius = 0; // radius around card to search for aura targets, when 0 will just return the card this is applied to
    this.prototype.auraModifierId = -1; // index used to determine whether aura modifier has been applied to a card
    this.prototype.cardAffectedIndex = null; // card that is/was affected by modifier, and is always present once the modifier has been applied
    this.prototype.cardFXResource = null; // fx resource that is added onto this modifier's card's fx resource, effectively overriding card's fx while this modifier is active on the card
    this.prototype.contextObject = null;
    this.prototype.durationEndTurn = 0; // how many end of turns can elapse before this modifier is removed
    this.prototype.durationStartTurn = 0; // how many start of turns can elapse before this modifier is removed
    this.prototype.durationRespectsBonusTurns = true; // whether duration will be extended with bonus turns
    this.prototype.durability = 0; // damage unit can take before this is destroyed
    this.prototype.numEndTurnsElapsed = 0; // how many end of turns have elapsed since this modifier was added
    this.prototype.numStartTurnsElapsed = 0; // how many start of turns have elapsed since this modifier was added
    this.prototype.fxResource = null; // array of strings that map to fx data, ex: ["Modifiers.Buff"]
    this.prototype.hideAsModifierType = null; // type of modifier to hide this modifier as during scrubbing
    this.prototype.index = null; // unique index of modifier, set automatically by game session
    this.prototype.isAura = false; // whether this may act like an aura
    this.prototype.isCloneable = true; // whether this modifier can be cloned
    this.prototype.isHiddenToUI = false; // whether or not this modifier is shown in the UI
    this.prototype.isInherent = false; // true for modifiers which are inherent to an card
    this.prototype.isAdditionalInherent = false; // true for modifiers which have been added as inherent modifiers from an external source
    this.prototype.isRemovable = true; // whether this can be removed via effects like dispel (any modifier with a few exceptions)
    this.prototype.isRemoved = false; // whether modifier has been removed
    this.prototype.isStacking = false; // whether is stacking and able to react to actions/events
    this.prototype.maxDurability = 0; // durability is assumed infinite unless max durability is > 0
    this.prototype.maxStacks = CONFIG.INFINITY; // maximum number of stacks possible, set to 1 for non stackable
    this.prototype.modifiersContextObjects = null; // context objects for modifiers to be added automatically when modifier is activated by an action or modifier applies aura
    this.prototype.parentModifierIndex = null; // index of parent modifier in game session's master list
    this.prototype.removedByActionIndex = -1; // index of action that removed this modifier, where -1 is during game setup
    this.prototype.removedByModifierIndex = -1; // index of modifier that removed this modifier, where -1 is during game setup
    this.prototype.resetsDamage = false; // whether this modifier resets damage done
    this.prototype.sourceCardIndex = null;
    this.prototype.subModifierIndices = null;
    this.prototype.triggeredByActionsData = null; // indices of all actions that triggered this modifier
    this.prototype.triggerActionsData = null; // list of action indices that were applied by this modifier triggering, with parent action indices and resolve parent action indices
    this.prototype.triggerAppliedModifiersData = null; // list of modifier indices that were applied by this modifier triggering, with action indices and resolve action indices
    this.prototype.triggerActivatedModifiersData = null; // list of modifier indices that were activated by this modifier triggering, with action indices and resolve action indices
    this.prototype.triggerDeactivatedModifiersData = null; // list of modifier indices that were deactivated by this modifier triggering, with action indices and resolve action indices
    this.prototype.triggerRemovedModifiersData = null;
     // list of modifier indices that were removed by this modifier triggering, with action indices and resolve action indices
  }

  constructor(gameSession) {
    super(gameSession);

    // define public properties here that must be always be serialized
    // do not define properties here that should only serialize if different from the default
    this.subModifierIndices = [];

    // copy prototype values down as needed
    if (this.auraFilterByCardIds != null) { this.auraFilterByCardIds = UtilsJavascript.fastExtend([], this.auraFilterByCardIds); }
    if (this.auraFilterByRaceIds != null) { this.auraFilterByRaceIds = UtilsJavascript.fastExtend([], this.auraFilterByRaceIds); }
    if (this.auraFilterByModifierTypes != null) { this.auraFilterByModifierTypes = UtilsJavascript.fastExtend([], this.auraFilterByModifierTypes); }
    if (this.attributeBuffs != null) { this.attributeBuffs = UtilsJavascript.fastExtend({}, this.attributeBuffs); }
    if (this.attributeBuffsAbsolute != null) { this.attributeBuffsAbsolute = UtilsJavascript.fastExtend([], this.attributeBuffsAbsolute); }
    if (this.attributeBuffsRebased != null) { this.attributeBuffsRebased = UtilsJavascript.fastExtend([], this.attributeBuffsRebased); }
    if (this.attributeBuffsFixed != null) { this.attributeBuffsFixed = UtilsJavascript.fastExtend([], this.attributeBuffsFixed); }
    if (this.modifiersContextObjects != null) { this.modifiersContextObjects = UtilsJavascript.fastExtend([], this.modifiersContextObjects); }
    if (this.fxResource != null) { this.fxResource = UtilsJavascript.fastExtend([], this.fxResource); }
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    // cache
    p.cachedAppliedName = null;
    p.cachedAppliedDescription = null;
    p.cachedCard = null; // active card affected by modifier, modified by game session as modifier is applied/removed
    p.cachedCardAffected = null; // card affected by modifier whether modifier has been removed or not
    p.cachedCardsInAura = [];
    p.cachedCardsLeavingAura = [];
    p.cardsInAuraDirty = false;
    p.cachedDescription = null;
    p.cachedIsActive = false;
    p.cachedIsActiveInDeck = false;
    p.cachedIsActiveInHand = false;
    p.cachedIsActiveInLocation = false;
    p.cachedWasActiveInLocation = false;
    p.cachedIsActiveInSignatureCards = false;
    p.cachedIsActiveOnBoard = false;
    p.cachedName = null;
    p.cachedSourceCard = null;
    p.cachedStackType = null;
    p.cachedSubModifiers = null; // modifiers created and managed by this modifier
    p.cachedWasActive = false;

    // resources and options for external systems
    p.animResource = null; // custom anim resource to use on unit while this modifier is applied
    p.mergedFXResource = null; // fx resource of modifier merged with source card's fx resource
    p.soundResource = null; // custom sound resource to use on unit while this modifier is applied

    // misc
    p.listeningToEvents = false;
    p.canConvertCardToPrismatic = true; // whether this modifier can convert cards played by it into prismatics
    p.canConvertCardToSkinned = true; // whether this modifier can convert cards played by it into skinned versions

    return p;
  }

  // region CONTEXT OBJECTS

  static createContextObject(options) {
    const contextObject = UtilsJavascript.fastExtend({},options);
    contextObject.type = this.type;
    return contextObject;
  }

  static createContextObjectOnBoard(options) {
    const contextObject = this.createContextObject(options);
    contextObject.activeInHand = false;
    contextObject.activeInDeck = false;
    contextObject.activeInSignatureCards = false;
    contextObject.activeOnBoard = true;
    return contextObject;
  }

  static createContextObjectInDeckHand(options) {
    const contextObject = this.createContextObject(options);
    contextObject.activeInHand = true;
    contextObject.activeInDeck = true;
    contextObject.activeInSignatureCards = false;
    contextObject.activeOnBoard = false;
    return contextObject;
  }

  static createAttributeBuffsObject(attackBuff,maxHPBuff) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    const attributeBuffs = {};
    if (attackBuff) {
      attributeBuffs.atk = attackBuff;
    }
    if (maxHPBuff) {
      attributeBuffs.maxHP = maxHPBuff;
    }
    return attributeBuffs;
  }

  // helper method to create a context object with attribute buffs
  // NOTE: only safe to use when setting a stat to non-zero (0s are ignored when creating the buff object)
  static createContextObjectWithAttributeBuffs(attack, maxHP, options) {
    if (attack == null) { attack = 0; }
    if (maxHP == null) { maxHP = 0; }
    const contextObject = this.createContextObject(options);
    contextObject.attributeBuffs = Modifier.createAttributeBuffsObject(attack,maxHP);
    return contextObject;
  }

  static createContextObjectWithAbsoluteAttributeBuffs(attack, maxHP, attackIsAbsolute, maxHPIsAbsolute, options) {
    if (attack == null) { attack = 0; }
    if (maxHP == null) { maxHP = 0; }
    if (attackIsAbsolute == null) { attackIsAbsolute = true; }
    if (maxHPIsAbsolute == null) { maxHPIsAbsolute = true; }
    const contextObject = this.createContextObject(options);
    contextObject.attributeBuffs = Modifier.createAttributeBuffsObject(attack,maxHP);
    contextObject.attributeBuffsAbsolute = [];
    if (attackIsAbsolute) { contextObject.attributeBuffsAbsolute.push("atk"); }
    if (maxHPIsAbsolute) { contextObject.attributeBuffsAbsolute.push("maxHP"); }
    return contextObject;
  }

  static createContextObjectWithRebasedAttributeBuffs(attack, maxHP, attackIsRebased, maxHPIsRebased, options) {
    if (attack == null) { attack = 0; }
    if (maxHP == null) { maxHP = 0; }
    if (attackIsRebased == null) { attackIsRebased = true; }
    if (maxHPIsRebased == null) { maxHPIsRebased = true; }
    const contextObject = this.createContextObject(options);
    contextObject.attributeBuffs = Modifier.createAttributeBuffsObject(attack,maxHP);
    contextObject.attributeBuffsRebased = [];
    if (attackIsRebased) { contextObject.attributeBuffsRebased.push("atk"); }
    if (maxHPIsRebased) { contextObject.attributeBuffsRebased.push("maxHP"); }
    return contextObject;
  }

  static createContextObjectWithAura(modifiersContextObjects, auraIncludeSelf, auraIncludeAlly, auraIncludeEnemy, auraIncludeGeneral, auraRadius, raceIds=null, cardIds=null, modifierTypes=null, description, options) {
    if (auraIncludeSelf == null) { auraIncludeSelf = true; }
    if (auraIncludeAlly == null) { auraIncludeAlly = true; }
    if (auraIncludeEnemy == null) { auraIncludeEnemy = true; }
    if (auraIncludeGeneral == null) { auraIncludeGeneral = true; }
    if (auraRadius == null) { auraRadius = 1; }
    const contextObject = this.createContextObjectOnBoard(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    contextObject.isAura = true;
    contextObject.auraIncludeSelf = auraIncludeSelf;
    contextObject.auraIncludeAlly = auraIncludeAlly;
    contextObject.auraIncludeEnemy = auraIncludeEnemy;
    contextObject.auraIncludeGeneral = auraIncludeGeneral;
    contextObject.auraRadius = auraRadius;
    contextObject.auraFilterByRaceIds = raceIds;
    contextObject.auraFilterByCardIds = cardIds;
    contextObject.auraFilterByModifierTypes = modifierTypes;
    contextObject.description = description;
    return contextObject;
  }

  static createContextObjectWithAuraForNearbyAllies(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, false, true, false, false, 1, raceIds, cardIds, modifierTypes, description, options);
  }

  static createContextObjectWithAuraForAllAllies(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, false, true, false, false, CONFIG.WHOLE_BOARD_RADIUS, raceIds, cardIds, modifierTypes, description, options);
  }

  static createContextObjectWithAuraForAllAlliesAndSelf(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, true, true, false, false, CONFIG.WHOLE_BOARD_RADIUS, raceIds, cardIds, modifierTypes, description, options);
  }

  static createContextObjectWithOnBoardAuraForAllAlliesAndSelf(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, true, true, false, false, CONFIG.WHOLE_BOARD_RADIUS, raceIds, cardIds, modifierTypes, description, options);
  }

  static createContextObjectWithAuraForAllAlliesAndSelfAndGeneral(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, true, true, false, true, CONFIG.WHOLE_BOARD_RADIUS, raceIds, cardIds, modifierTypes, description, options);
  }

  static createContextObjectWithOnBoardAuraForAllAlliesAndSelfAndGeneral(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, true, true, false, true, CONFIG.WHOLE_BOARD_RADIUS, raceIds, cardIds, modifierTypes, description, options);
  }

  static createContextObjectWithAuraForNearbyEnemies(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, false, false, true, false, 1, raceIds, cardIds, modifierTypes, description, options);
  }

  static createContextObjectWithOnBoardAuraForNearbyEnemies(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, false, false, true, false, 1, raceIds, cardIds, modifierTypes, description, options);
  }

  static createContextObjectWithAuraForAllEnemies(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, false, false, true, false, CONFIG.WHOLE_BOARD_RADIUS, raceIds, cardIds, modifierTypes, description, options);
  }

  static createContextObjectWithOnBoardAuraForAllEnemies(modifiersContextObjects, raceIds, cardIds, modifierTypes, description, options) {
    return this.createContextObjectWithAura(modifiersContextObjects, false, false, true, false, CONFIG.WHOLE_BOARD_RADIUS, raceIds, cardIds, modifierTypes, description, options);
  }

  // endregion CONTEXT OBJECTS

  // region EVENTS

  /**
   * SDK event handler. Do not call this method manually.
   */
  onEvent(event) {
    if (this._private.listeningToEvents) {
      const eventType = event.type;
      if ((eventType === EVENTS.terminate) || (eventType === EVENTS.before_deserialize)) {
        return this._onTerminate(event);
      } else if (eventType === EVENTS.modify_action_for_validation) {
        return this._onModifyActionForValidation(event);
      } else if (eventType === EVENTS.validate_action) {
        return this._onValidateAction(event);
      } else if (eventType === EVENTS.modify_action_for_execution) {
        return this._onModifyActionForExecution(event);
      } else if (eventType === EVENTS.before_action) {
        return this._onBeforeAction(event);
      } else if (eventType === EVENTS.action) {
        return this._onAction(event);
      } else if (eventType === EVENTS.after_action) {
        return this._onAfterAction(event);
      } else if (eventType === EVENTS.modifier_end_turn_duration_change) {
        return this._onEndTurnDurationChange(event);
      } else if (eventType === EVENTS.modifier_start_turn_duration_change) {
        return this._onStartTurnDurationChange(event);
      } else if (eventType === EVENTS.after_cleanup_action) {
        return this._onAfterCleanupAction(event);
      } else if (eventType === EVENTS.modifier_active_change) {
        return this._onActiveChange(event);
      } else if (eventType === EVENTS.modifier_remove_aura) {
        return this._onRemoveAura(event);
      } else if (eventType === EVENTS.modifier_add_aura) {
        return this._onAddAura(event);
      } else if (eventType === EVENTS.start_turn) {
        return this._onStartTurn(event);
      } else if (eventType === EVENTS.end_turn) {
        return this._onEndTurn(event);
      }
    }
  }

  // endregion EVENTS

  // region APPLY / REMOVE

  onApplyToCard(card) {
    this.setCard(card);
    this.startListeningToEvents();
    this.onApplyToCardBeforeSyncState();
    return this.syncState();
  }

  onApplyToCardBeforeSyncState() {}
    // override in sub class to do something on apply to card before syncing state

  onRemoveFromCard() {
    // set removed and sync
    this.setIsRemoved(true);
    this.onRemoveFromCardBeforeSyncState();
    this.syncState();

    // remove sub modifiers
    const subModifiers = this.getSubModifiers();
    if (subModifiers.length > 0) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      for (let i = subModifiers.length - 1; i >= 0; i--) {
        var modifier = subModifiers[i];
        if (modifier != null) {
          this.getGameSession().removeModifier(modifier);
        }
      }
      this.getGameSession().popTriggeringModifierFromStack();
    }

    // remove card after deactivate so that deactivate can continue to reference
    this.setCard(null);

    // remove self from parent
    this.removeFromParentModifier();

    // terminate self
    return this._onTerminate();
  }

  onRemoveFromCardBeforeSyncState() {}
    // override in sub class to do something on remove from card before syncing state

  onMoveToCard(card) {
    // simulate remove
    this.setIsRemoved(true);
    this.onRemoveFromCardBeforeSyncState();
    this.syncState();

    // simulate add
    this.setCard(card);
    this.onApplyToCardBeforeSyncState();
    return this.syncState();
  }

  onActivate() {
    // set triggering relationship
    const executingAction = this.getGameSession().getExecutingAction();
    const executingResolveAction = this.getGameSession().getExecutingResolveAction();
    if ((executingAction != null) && (executingResolveAction != null)) {
      const triggeringModifier = this.getGameSession().getTriggeringModifier();
      if (triggeringModifier instanceof Modifier && !(executingAction instanceof ApplyModifierAction) && (!(executingAction instanceof ApplyCardToBoardAction) || (executingAction.getCard() !== this.getCard()))) {
        triggeringModifier.onTriggerActivatedModifier(this, executingAction, executingResolveAction);
      } else {
        // set modifier as activated by this action
        executingAction.onActivatedModifier(this, executingResolveAction);
        executingResolveAction.onResolveActivatedModifier(this, executingAction);
      }
    }

    if (this.getResetsDamage()) {
      this.getCard().resetDamage();
    }

    // change for attribute buffs
    if ((this.attributeBuffs != null) && (this.getCard() != null) && CardType.getIsEntityCardType(this.getCard().getType())) {
      // update attributes
      return (() => {
        const result = [];
        for (var buffKey in this.attributeBuffs) {
        // flush cached attribute
          var buffValue = this.attributeBuffs[buffKey];
          this.getCard().flushCachedAttribute(buffKey);

          // handle specific attribute changes
          if (buffKey === "speed") {
            result.push(this.getCard().flushCachedMovementPattern());
          } else if (buffKey === "reach") {
            result.push(this.getCard().flushCachedAttackPattern());
          } else if ((buffKey === "maxHP") && this.getCard().getIsActive() && (this.getGameSession().getActiveCard() !== this.getCard()) && (this.getCard().getHP() <= 0) && this.getGameSession().getCanCardBeScheduledForRemoval(this.getCard())) {
            // when this buffs hp to 0, kill entity
            result.push(this.getGameSession().executeAction(this.getCard().actionDie()));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  onDeactivate() {
    // set triggering relationship
    const executingAction = this.getGameSession().getExecutingAction();
    const executingResolveAction = this.getGameSession().getExecutingResolveAction();
    if ((executingAction != null) && (executingResolveAction != null)) {
      const triggeringModifier = this.getGameSession().getTriggeringModifier();
      if (triggeringModifier instanceof Modifier && !(executingAction instanceof RemoveModifierAction) && (!(executingAction instanceof ApplyCardToBoardAction) || (executingAction.getCard() !== this.getCard()))) {
        triggeringModifier.onTriggerDeactivatedModifier(this, executingAction, executingResolveAction);
      } else {
        // set modifier as deactivated by this action
        executingAction.onDeactivatedModifier(this, executingResolveAction);
        executingResolveAction.onResolveDeactivatedModifier(this, executingAction);
      }
    }

    // change for attribute buffs
    if ((this.attributeBuffs != null) && (this.getCard() != null) && CardType.getIsEntityCardType(this.getCard().getType())) {
      return (() => {
        const result = [];
        for (var buffKey in this.attributeBuffs) {
        // flush cached attribute
          var buffValue = this.attributeBuffs[buffKey];
          this.getCard().flushCachedAttribute(buffKey);

          // handle specific attribute changes
          if (buffKey === "speed") {
            result.push(this.getCard().flushCachedMovementPattern());
          } else if (buffKey === "reach") {
            result.push(this.getCard().flushCachedAttackPattern());
          } else if ((buffKey === "maxHP") && this.getCard().getIsActive() && (this.getGameSession().getActiveCard() !== this.getCard()) && (this.getCard().getHP() <= 0) && this.getGameSession().getCanCardBeScheduledForRemoval(this.getCard())) {
            // when max hp buff is removed and entity is at 0 hp, kill it
            result.push(this.getGameSession().executeAction(this.getCard().actionDie()));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  onChangeOwner(fromOwnerId, toOwnerId) {
    // if this modifier's is controlling any non aura modifiers on a general, swap them to the new general
    // (ex: this entity was reducing the cost of opponent's spells by 1, now it reduces cost of my spells by 1)
    // (ex: this entity was buffing my old general, now it buffs my new general)
    return (() => {
      const result = [];
      for (var subModifier of Array.from(this.getSubModifiers())) {
        if (!subModifier.getIsManagedByAura()) {
          var card = subModifier.getCard();
          if ((card != null) && CardType.getIsEntityCardType(card.getType()) && card.getIsGeneral()) {
            var playerId = card.getOwnerId();
            if (playerId != null) {
              // the owner id we're changing to is the same as the card
              // we know we need to swap to the opponent player's general
              // otherwise we need to swap to this player's new general
              var newOwner;
              if (playerId === toOwnerId) {
                newOwner = this.getGameSession().getOpponentPlayerOfPlayerId(toOwnerId);
              } else {
                newOwner = this.getGameSession().getPlayerById(toOwnerId);
              }
              var newGeneral = this.getGameSession().getGeneralForPlayerId(newOwner.getPlayerId());
              result.push(this.getGameSession().moveModifierToCard(subModifier, newGeneral));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  // endregion APPLY / REMOVE

  // region GETTERS / SETTERS

  getCard() {
    return this._private.cachedCard;
  }

  setCard(card) {
    this._private.cachedCard = card;

    // when card changes to a valid value
    if (this.getCard() != null) {
      // card affected index should always be present once modifier has been applied
      // this way, even after modifier is removed, we always know what it was last applied to
      this.cardAffectedIndex = this.getCard().getIndex();
      this._private.cachedCardAffected = null;
      return this.flushCachedNamesAndDescriptions();
    }
  }

  getCardAffectedIndex() {
    return this.cardAffectedIndex;
  }

  getCardAffected() {
    if ((this._private.cachedCardAffected == null) && (this.cardAffectedIndex != null)) {
      this._private.cachedCardAffected = this.getGameSession().getCardByIndex(this.cardAffectedIndex);
    }
    return this._private.cachedCardAffected;
  }

  static getIsKeyworded() {
    return this.isKeyworded;
  }

  getIsKeyworded() {
    return this.constructor.isKeyworded;
  }

  getLogName() {
    return `${this.getType().replace(' ','_')}[${this.getIndex()}]`;
  }

  getIndex() {
    return this.index;
  }

  setIndex(index) {
    return this.index = index;
  }

  getOwner() {
    return __guard__(this.getCard(), x => x.getOwner());
  }

  getOwnerId() {
    return __guard__(this.getCard(), x => x.getOwnerId());
  }

  setModifiersContextObjects(val) {
    return this.modifiersContextObjects = val;
  }

  getModifiersContextObjects() {
    return this.modifiersContextObjects;
  }

  /*
  * Get all other modifiers that a modifier must coordinate with
  * these include all modifiers:
  * - applied to cards owned by the same player
  * - of the same class
  * - that are active
  * - applied after this modifier
  * @param {Modifier} [modifierClass=own class]
  * @returns {Array}
  */
  getModifiersToCoordinateWith(modifierClass) {
    const modifiers = [];
    const card = this.getCard();
    if (card != null) {
      let allowUntargetable;
      const board = this.getGameSession().getBoard();
      if (modifierClass == null) { modifierClass = this.constructor; }
      const ownerId = card.getOwnerId();
      const appliedByActionIndex = this.getAppliedByActionIndex();
      for (var c of Array.from(board.getCards(null, (allowUntargetable=true)))) {
        if (c.getOwnerId() === ownerId) {
          for (var m of Array.from(c.getModifiers())) {
            if (m instanceof modifierClass && m.getIsActive() && (m !== this)) {
              var modifierAppliedByActionIndex = m.getAppliedByActionIndex();
              if ((modifierAppliedByActionIndex > appliedByActionIndex) || ((appliedByActionIndex === -1) && (modifierAppliedByActionIndex === -1) && (m.getIndex() > this.getIndex()))) {
                modifiers.push(m);
              }
            }
          }
        }
      }
    }
    return modifiers;
  }

  /**
   * Creates a context object to make a new/fresh copy of an existing modifier.
   * @returns {Object} contextObject
  */
  createNewContextObject() {
    const contextObject = {};

    // copy properties from existing context object
    if (this.contextObject != null) {
      const keys = Object.keys(this.contextObject);
      for (var key of Array.from(keys)) {
        var property = this.contextObject[key];
        contextObject[key] = property;
      }
    }

    // make sure that following properties don't get serialized
    Object.defineProperty(contextObject, '_hasBeenApplied', {
      enumerable: false,
      writable: true
    });

    contextObject.type = this.type;

    return contextObject;
  }

  /**
   * Returns a list of keys of properties that should be copied from this modifier when creating a context object for copying this modifier.
   * @returns {Array} keys
  */
  getContextObjectKeysForCopy() {
    return [
      "index",
      "cardAffectedIndex",
      "parentModifierIndex",
      "sourceCardIndex",
      "isRemoved",
      "auraModifierId",
      "numEndTurnsElapsed",
      "numStartTurnsElapsed",
      "maxDurability",
      "durability"
    ];
  }

  /**
   * Creates a context object to exactly replicate this modifier, optionally from existing context object.
   * @param {Object} existingContextObject
   * @returns {Object} contextObject
  */
  createContextObject(existingContextObject) {
    const contextObject = this.createNewContextObject();

    if ((existingContextObject != null) && _.isObject(existingContextObject)) {
      UtilsJavascript.fastExtend(contextObject, existingContextObject);
    }

    // copy properties from modifier
    for (var key of Array.from(this.getContextObjectKeysForCopy())) {
      // only set certain properties on context object if they differ from the prototype, i.e. they are not DEFAULTS
      // this is done by checking if this object has it's won property (different than prototype) or is using the prototype
      if (this.hasOwnProperty(key)) {
        var val = this[key];
        if (_.isArray(val)) {
          contextObject[key] = val.slice(0);
        } else if (_.isObject(val)) {
          cardData[key] = UtilsJavascript.fastExtend({}, val);
        } else {
          contextObject[key] = val;
        }
      }
    }

    // add all sub modifier context objects
    const subModifiers = this.getSubModifiers();
    if ((subModifiers != null) && (subModifiers.length > 0)) {
      contextObject.subModifierIndices = this.subModifierIndices.slice(0);
      contextObject.subModifiersContextObjects = [];
      for (var modifier of Array.from(subModifiers)) {
        if (modifier != null) {
          contextObject.subModifiersContextObjects.push(modifier.createContextObject());
        }
      }
    }

    return contextObject;
  }

  /**
   * Updates context object from this modifier after being applied to deck/hand/board.
   * @param {Object} contextObject
   * @returns {Object} contextObject
  */
  updateContextObjectPostApply(contextObject) {
    if (contextObject != null) {
      contextObject.index = this.getIndex();
    }

    return contextObject;
  }

  /**
   * Returns a list of keys of properties that should be deleted from a context object created for a clone of this modifier.
   * @returns {Array} keys
  */
  getContextObjectKeysToDeleteForClone() {
    return [
      "index",
      "isRemoved",
      "cardAffectedIndex",
      "parentModifierIndex",
      "subModifierIndices",
      "subModifiersContextObjects",
      "auraModifierId"
    ];
  }

  /**
   * Creates a context object to clone an existing modifier.
   * @param {Object} [contextObject=null]
   * @returns {Object} contextObject
  */
  createContextObjectForClone(contextObject) {
    contextObject = this.createContextObject(contextObject);

    for (var key of Array.from(this.getContextObjectKeysToDeleteForClone())) {
      delete contextObject[key];
    }

    return contextObject;
  }

  /**
   * Copies context object into this modifier
   * @param {Object} contextObject
  */
  applyContextObject(contextObject) {
    if ((contextObject != null) && _.isObject(contextObject) && !contextObject._hasBeenApplied) {
      // copy properties from context object
      let key, subModifierIndices;
      const keys = Object.keys(contextObject);
      for (key of Array.from(keys)) {
        var property = contextObject[key];
        // only overwrite attributes on this object from contextObject data when the value is differen than what's already there
        // this is important so that we don't define an 'own' property on a JS object that will be serialized even though it
        // might be the same as the prototype value
        if (this[key] !== property) {
          this[key] = property;
        }
      }

      // make sure that following properties don't get serialized
      Object.defineProperty(contextObject, '_hasBeenApplied', {
        enumerable: false,
        writable: true
      });

      if (contextObject.type) {
        this.type = contextObject.type;
      }

      // flag data as having been applied so we never apply more than once
      contextObject._hasBeenApplied = true;

      // delete properties that shouldn't be retained on this modifier
      delete this.subModifiersContextObjects;

      // regenerate sub modifiers as needed
      if (contextObject.subModifiersContextObjects != null) {
        subModifierIndices = this.getSubModifierIndices();
        if (subModifierIndices.length > 0) {
          for (var subModifierIndex of Array.from(subModifierIndices.slice(0))) {
            var subModifier = this.getGameSession().getModifierByIndex(subModifierIndex);
            if ((subModifier == null)) {
              // sub modifier index present but no modifier found
              for (var subModifierContextObject of Array.from(contextObject.subModifiersContextObjects)) {
                // use context object with matching index to regenerate sub modifier
                if ((subModifierContextObject.index != null) && (subModifierContextObject.index === subModifierIndex)) {
                  var cardAffected = this.getGameSession().getCardByIndex(subModifierContextObject.cardAffectedIndex);
                  if (cardAffected != null) {
                    this.getGameSession().applyModifierContextObject(subModifierContextObject, cardAffected, this);
                  }
                }
              }
            }
          }
        }
      }

      // save copy of context object so we can generate new context object
      this.contextObject = UtilsJavascript.deepCopy(contextObject);

      // delete properties saved copy of context object should not retain
      for (key of Array.from(this.getContextObjectKeysForCopy())) {
        delete this.contextObject[key];
      }
      delete this.contextObject.subModifierIndices;
      delete this.contextObject.subModifiersContextObjects;
      delete this.contextObject._hasBeenApplied;

      return this.flushCachedNamesAndDescriptions();
    }
  }

  getIsInherent() {
    return this.isInherent;
  }

  getIsAdditionalInherent() {
    return this.isAdditionalInherent;
  }

  getIsHiddenToUI() {
    return this.constructor.isHiddenToUI || this.isHiddenToUI;
  }

  getIsRemovable() {
    // modifiers with parent modifiers are non-removable
    // removing their parent modifier will remove them
    return this.isRemovable && (this.getParentModifierIndex() == null);
  }

  getType() {
    return this.type;
  }

  getIsRemoved() {
    return this.isRemoved;
  }

  setIsRemoved(val) {
    return this.isRemoved = val;
  }

  setNumEndTurnsElapsed(val) {
    return this.numEndTurnsElapsed = val;
  }

  setNumStartTurnsElapsed(val) {
    return this.numStartTurnsElapsed = val;
  }

  /*
  * TODO: replace all name/description methods with consolidated methods
  getName: () ->
    if @appliedName
      return @appliedName
    else if @modifierName
      return @modifierName
    else
      sourceCard = @getSourceCard()
      if sourceCard?
        return sourceCard.getName()
      else
        return @getType()

  getDescription: () ->
    description = ""

    if @appliedDescription?
      description = @appliedDescription
    else if @description?
      description = @description
    else if @attributeBuffs?
      * TODO: account for manaCost and speed
      description = Stringifiers.stringifyAttackHealthBuff(@attributeBuffs.atk, @attributeBuffs.maxHP)
    else if @modifiersContextObjects?
      * return a description generated from the descriptions of all sub-context objects
      for contextObject in @modifiersContextObjects
        description += contextObject.getDescription() + ", "
      if description.length > 0 then description = description.substring(0, description.length - 2)
    else
      sourceCard = @getSourceCard()
      if sourceCard?
        description = sourceCard.getDescription()

    return description
  */

  static getName(contextObject) {
    if (contextObject && contextObject.modifierName) {
      if (i18next.exists(contextObject.modifierName)) { return i18next.t(contextObject.modifierName); } else { return contextObject.modifierName; }
    } else if (this.modifierName != null) {
      if (i18next.exists(this.modifierName)) { return i18next.t(this.modifierName); } else { return this.modifierName; }
    } else { return this.modifierName; }
  }
  //This either gives the modifier's name, or if that doesn't exist, the source played cards name
  //-this lets us use spell name/description for modifiers created by spells
  getName(contextObject) {
    // Much like getDescription, uses multiple possible sources for name in the following priority
    // 0. Any context object set name (using first the passed in context object, second this instance's context object)
    // 1. Class level name
    // 2. Source cards name (used for spell applied modifiers)
    if (contextObject == null) { ({
      contextObject
    } = this); }
    if ((this._private.cachedName == null) || (contextObject !== this.contextObject)) {
      this._private.cachedName = this.constructor.getName(contextObject) || __guard__(this.getSourceCard(), x => x.getName());
    }
    return this._private.cachedName;
  }

  getIsActive() {
    return this._private.cachedIsActive;
  }

  // override for special description behavior
  static getDescription(contextObject, ModifierFactory) {
    let description;
    if (contextObject) {
      if (contextObject.description != null) {
        if (i18next.exists(contextObject.description)) { return i18next.t(contextObject.description); } else { return contextObject.description; }
      } else if (contextObject.modifiersContextObjects != null) {
        // return a description generated from the descriptions of all sub-context objects
        description = "";
        for (contextObject of Array.from(contextObject.modifiersContextObjects)) {
          var modifierClass = ModifierFactory.modifierClassForType(contextObject.type);
          description += modifierClass.getDescription(contextObject, ModifierFactory) + ", ";
        }
        if (description.length > 0) { description = description.substring(0, description.length - 2); }
        return description;
      }
    }

    return this.description;
  }

  // don't override this, override static method instead
  getDescription(contextObject) {
    //This will create the description with the following priority:
    // 0. Any description manually set on context object (using first the passed in context object, second this instance's context object)
    // 1. Class level description
    // 2. Using the source cards description (used for spells atm)
    if (contextObject == null) { ({
      contextObject
    } = this); }
    if ((this._private.cachedDescription == null) || (contextObject !== this.contextObject)) {
      this._private.cachedDescription = this.constructor.getDescription(contextObject, this.getGameSession().getModifierFactory()) || __guard__(this.getSourceCard(), x => x.getDescription());
    }
    return this._private.cachedDescription;
  }

  // get the name shown for this modifier when it is applied to a unit
  static getAppliedName(contextObject) {
    let appliedName = undefined;
    if (contextObject && contextObject.appliedName) {
      appliedName = i18next.exists(contextObject.appliedName) ? i18next.t(contextObject.appliedName) : contextObject.appliedName;
    } else if (this.appliedName != null) {
      appliedName = i18next.exists(this.appliedName) ? i18next.t(this.appliedName) : this.appliedName;
    } else {
      ({
        appliedName
      } = this);
    }
    // if there is no applied name, default to modifierName
    if (appliedName) {
      return appliedName;
    } else {
      return this.getName(contextObject);
    }
  }

  // get the name shown for this modifier when it is applied to a unit
  getAppliedName(contextObject) {
    if (contextObject == null) { ({
      contextObject
    } = this); }
    if ((this._private.cachedAppliedName == null) || (contextObject !== this.contextObject)) {
      this._private.cachedAppliedName = this.constructor.getAppliedName(contextObject) || this.appliedName || this.getType();
    }
    return this._private.cachedAppliedName;
  }

  // get the description shown when this modifier is applied to a unit
  static getAppliedDescription(contextObject, ModifierFactory) {
    let appliedDescription = undefined;
    if (contextObject && contextObject.appliedDescription) {
      appliedDescription = i18next.exists(contextObject.appliedDescription) ? i18next.t(contextObject.appliedDescription) : contextObject.appliedDescription;
    } else if (this.appliedDescription != null) {
      appliedDescription = i18next.exists(this.appliedDescription) ? i18next.t(this.appliedDescription) : this.appliedDescription;
    } else {
      ({
        appliedDescription
      } = this);
    }

    // if there is no applied description and there is an attributes buff, assume it is a simple stat buff
    if ((appliedDescription == null) && contextObject && contextObject.attributeBuffs && ((contextObject.attributeBuffs.atk != null) || (contextObject.attributeBuffs.maxHP != null))) {
      return Stringifiers.stringifyAttackHealthBuff(contextObject.attributeBuffs.atk,contextObject.attributeBuffs.maxHP);
    }

    // default to modifier description if no applied description
    if (appliedDescription) {
      return appliedDescription;
    } else {
      return this.getDescription(contextObject, ModifierFactory);
    }
  }

  getAppliedDescription(contextObject) {
    if (contextObject == null) { ({
      contextObject
    } = this); }
    if ((this._private.cachedAppliedDescription == null) || (contextObject !== this.contextObject)) {
      this._private.cachedAppliedDescription = this.constructor.getAppliedDescription(contextObject, this.getGameSession().getModifierFactory()) || this.appliedDescription;
    }
    return this._private.cachedAppliedDescription;
  }

  static getKeywordDefinition() {
    return this.keywordDefinition;
  }

  getAnimResource() {
    return this._private.animResource;
  }

  getSoundResource() {
    return this._private.soundResource;
  }

  setFXResource(fxResource) {
    return this.fxResource = fxResource;
  }

  getFXResource() {
    if ((this._private.mergedFXResource == null)) {
      this._private.mergedFXResource = this.fxResource || [];

      // try to merge with source card's fx resource if this is not an inherent modifier
      if (!this.isInherent) {
        // this should not be a modifier applied by an action that was created by a triggering modifier
        const appliedByAction = this.getAppliedByAction();
        if (!appliedByAction || (appliedByAction.getTriggeringModifierIndex() == null)) {
          const sourceCard = this.getSourceCard();
          if (sourceCard != null) { this._private.mergedFXResource = _.union(sourceCard.getFXResource(), this._private.mergedFXResource); }
        }
      }
    }

    return this._private.mergedFXResource;
  }

  getCardFXResource() {
    return this.cardFXResource;
  }

  getNumOfType() {
    if (this.getCard() != null) {
      return this.getCard().getNumModifiersOfType(this.type);
    } else {
      return 0;
    }
  }

  getStacks() {
    if (this.getCard() != null) {
      return this.getCard().getNumModifiersOfStackType(this.getStackType());
    } else {
      return 0;
    }
  }

  getMaxStacks() {
    return this.maxStacks;
  }

  getIsStacking() {
    return this.isStacking;
  }

  _getNumStacksPreceding() {
    let stacks = 0;
    const stackType = this.getStackType();
    for (var modifier of Array.from(this.getCard().getActiveModifiers())) {
      if (modifier === this) {
        break;
      } else if (modifier.getIsStacking() && (modifier.getStackType() === stackType)) {
        stacks++;
      }
    }

    return stacks;
  }

  getStackType() {
    if ((this._private.cachedStackType == null)) {
      let stackType = this.getType();

      // get description for this modifier only from modifier class
      // get description from this modifier attempts to use source card
      // which is not always set or valid, and can cause stacking issues
      const description = this.constructor.getDescription(this.contextObject, this.getGameSession().getModifierFactory());
      if ((description != null) && (description.length > 0)) {
        stackType += description;
      } else if (this.attributeBuffs != null) {
        // get names of all attributes buffed
        let buffKey;
        const attributesBuffed = [];
        for (buffKey in this.attributeBuffs) {
          attributesBuffed.push(buffKey);
        }

        if (attributesBuffed.length > 0) {
          // sort alphabetically
          attributesBuffed.sort();

          // add each to stack type
          for (buffKey of Array.from(attributesBuffed)) {
            stackType += "_" + buffKey + this.attributeBuffs[buffKey];
          }
        }
      }

      this._private.cachedStackType = stackType;
    }
    return this._private.cachedStackType;
  }

  getArtifactStackType() {
    if (!this.getIsFromArtifact()) {
      return undefined;
    }

    // Stack type from artifact name for if we choose to do effect per artifact in future
//    return @getSourceCard.getName()

    // Generic stack type so all artifacts count as same type
    return "ArtifactStackType";
  }

  // endregion GETTERS / SETTERS

  //===== / ======

  /* CACHE */

  /**
   * Syncs this modifier to the latest game state.
   */
  syncState() {
    this._onActiveChange();
    this._onRemoveAura();
    return this._onAddAura();
  }

  /**
   * Updates all values that should be cached between modifier active change phases.
   */
  updateCachedState() {
    this.updateCachedStateBeforeActive();
    this._private.cachedWasActive = this._private.cachedIsActive;
    this._private.cachedIsActive = this.getIsActiveForCache();
    if ((this._private.cachedWasActive !== this._private.cachedIsActive) && (this.getCard() != null)) {
      this.getCard().flushCachedVisibleModifierStacks();
    }
    return this.updateCachedStateAfterActive();
  }

  updateCachedStateBeforeActive() {
    // override to update cached state before determining active state
    if (this.getCard() != null) {
      this.isStacking = this.getIsStackingForCache();
      this._private.cardsInAuraDirty = true;
      this._private.cachedWasActiveInLocation = this._private.cachedIsActiveInLocation;
      this._private.cachedIsActiveOnBoard = this.getIsOnBoardAndActiveForCache();
      this._private.cachedIsActiveInHand = this.getIsInHandAndActiveForCache();
      this._private.cachedIsActiveInDeck = this.getIsInDeckAndActiveForCache();
      this._private.cachedIsActiveInSignatureCards = this.getIsInSignatureCardsAndActiveForCache();
      return this._private.cachedIsActiveInLocation = this._private.cachedIsActiveOnBoard || this._private.cachedIsActiveInHand || this._private.cachedIsActiveInDeck || this._private.cachedIsActiveInSignatureCards;
    } else {
      return this.isStacking = (this._private.cardsInAuraDirty = (this._private.cachedIsActiveOnBoard = (this._private.cachedIsActiveInHand = (this._private.cachedIsActiveInDeck = (this._private.cachedIsActiveInLocation = false)))));
    }
  }

  updateCachedStateAfterActive() {}
    // override to update cached state after determining active state

  getIsStackingForCache() {
    // assume this modifier stacks
    const wasStacking = this.isStacking;
    let isStacking = true;

    // when this modifier has a max stack count
    // walk through modifiers on the same card that this modifier affects
    // only allow this modifier to become active if we haven't found max stacks worth of active modifiers
    const maxStacks = this.getMaxStacks();
    const numStacksPreceding = this._getNumStacksPreceding();
    if ((maxStacks !== CONFIG.INFINITY) && (numStacksPreceding >= maxStacks)) {
      isStacking = false;
    }

    return isStacking;
  }

  getIsActiveForCache() {
    return (this.getCard() != null) && this.getGameSession().isActive() && this.getIsAllowedToBeActiveForCache() && !this.getIsRemoved() && this._private.cachedIsActiveInLocation && this.getIsStacking();
  }

  getIsAllowedToBeActiveForCache() {
    // override in sub class to implement custom disable behavior
    const parentModifier = this.getParentModifier();
    if (parentModifier != null) {
      return parentModifier.getAreSubModifiersActiveForCache();
    } else {
      return true;
    }
  }

  getAreSubModifiersActiveForCache() {
    // override in sub class to force sub modifiers to be inactive
    return true;
  }

  getIsInHandAndActiveForCache() {
    return this.getCard().getIsLocatedInHand() && this.activeInHand;
  }

  getIsInDeckAndActiveForCache() {
    return this.getCard().getIsLocatedInDeck() && this.activeInDeck;
  }

  getIsInSignatureCardsAndActiveForCache() {
    return this.getCard().getIsLocatedInSignatureCards() && this.activeInSignatureCards;
  }

  getIsOnBoardAndActiveForCache() {
    return this.getCard().getIsLocatedOnBoard() && this.activeOnBoard;
  }

  flushAllCachedData() {
    return this.flushCachedNamesAndDescriptions();
  }

  flushCachedNamesAndDescriptions() {
    this._private.cachedName = null;
    this._private.cachedDescription = null;
    this._private.cachedAppliedName = null;
    this._private.cachedAppliedDescription = null;
    return this._private.cachedStackType = null;
  }

  //===== / ======

  /* SOURCE CARD */

  setSourceCardIndex(index) {
    // only ever set source card index once
    return this.sourceCardIndex != null ? this.sourceCardIndex : (this.sourceCardIndex = index);
  }

  getSourceCardIndex() {
    return this.sourceCardIndex;
  }

  getSourceCard() {
    if ((this._private.cachedSourceCard == null)) {
      const sourceCardIndex = this.getSourceCardIndex();
      if (sourceCardIndex != null) {
        this._private.cachedSourceCard = this.getGameSession().getCardByIndex(sourceCardIndex);
      }
    }
    return this._private.cachedSourceCard;
  }

  //===== / ======

  /* PARENT / SUB MODIFIERS */

  setParentModifier(modifier) {
    if (!this.isRemoved) {
      return this.parentModifierIndex = modifier != null ? modifier.getIndex() : undefined;
    }
  }

  getParentModifier() {
    if (this.parentModifierIndex != null) { return this.getGameSession().getModifierByIndex(this.parentModifierIndex); }
  }

  getParentModifierIndex() {
    return this.parentModifierIndex;
  }

  setAppliedByModifier(modifier) {
    return this.appliedByModifierIndex = modifier.getIndex();
  }

  getAppliedByModifier() {
    if (this.appliedByModifierIndex > -1) {
      return this.getGameSession().getModifierByIndex(this.appliedByModifierIndex);
    }
  }

  getAppliedByModifierIndex() {
    return this.appliedByModifierIndex;
  }

  setRemovedByModifier(modifier) {
    return this.removedByModifierIndex = modifier.getIndex();
  }

  getRemovedByModifier() {
    if (this.removedByModifierIndex > -1) {
      return this.getGameSession().getModifierByIndex(this.removedByModifierIndex);
    }
  }

  getRemovedByModifierIndex() {
    return this.removedByModifierIndex;
  }

  addSubModifier(modifier) {
    if (modifier != null) {
      // add modifier to list of sub modifiers
      const modifierIndex = modifier.getIndex();
      if (!_.includes(this.subModifierIndices, modifierIndex)) {
        this.subModifierIndices.push(modifierIndex);
        this.subModifierIndices = _.sortBy(this.subModifierIndices);
      }

      // ensure parent is set correctly
      modifier.setParentModifier(this);
      modifier.setAppliedByModifier(this);

      // reset cached sub modifiers
      return this._private.cachedSubModifiers = null;
    }
  }

  removeSubModifier(modifier) {
    if (modifier != null) {
      // remove modifier from list of sub modifiers
      const modifierIndex = modifier.getIndex();
      const index = _.indexOf(this.subModifierIndices, modifierIndex);
      if (index >= 0) {
        this.subModifierIndices.splice(index, 1);
        this.subModifierIndices = _.sortBy(this.subModifierIndices);
      }

      // ensure parent is cleared correctly
      modifier.setRemovedByModifier(this);
      modifier.setParentModifier(null);

      // reset cached sub modifiers
      return this._private.cachedSubModifiers = null;
    }
  }

  removeFromParentModifier() {
    if (this.parentModifierIndex != null) {
      const parentModifier = this.getParentModifier();
      if (parentModifier != null) {
        return parentModifier.removeSubModifier(this);
      } else {
        return this.setParentModifier(null);
      }
    }
  }

  getSubModifierIndices() {
    return this.subModifierIndices;
  }

  getSubModifiers() {
    if (this._private.cachedSubModifiers == null) { this._private.cachedSubModifiers = this.getGameSession().getModifiersByIndices(this.subModifierIndices); }
    return this._private.cachedSubModifiers;
  }

  setIsCloneable(val) {
    return this.isCloneable = val;
  }

  getIsCloneable() {
    return this.isCloneable && !this.getIsManagedByAura();
  }

  /**
   * Returns whether this class is a child of the provided keyword class
   * Does not enforce that provided class is a keyword itself
   * @param {Action} action
   */
  static belongsToKeywordClass(keywordClass){
    return (this === keywordClass) || (keywordClass.prototype.isPrototypeOf(this.prototype));
  }

  /**
   * Sets this modifier as applied by an action.
   * @param {Action} action
   */
  setAppliedByAction(action) {
    if (action != null) {
      return this.appliedByActionIndex = action.getIndex();
    }
  }

  /**
   * Returns the index of the action that applied this modifier.
   * @returns {Boolean}
   */
  getAppliedByActionIndex() {
    return this.appliedByActionIndex;
  }

  /**
   * Returns the index of the action that applied this modifier.
   * @returns {Boolean}
   */
  getAppliedByAction() {
    if (this.appliedByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.appliedByActionIndex);
    }
  }

  /**
   * Sets this modifier as removed by an action.
   * @param {Action} action
   */
  setRemovedByAction(action) {
    if (action != null) {
      return this.removedByActionIndex = action.getIndex();
    }
  }

  /**
   * Returns the index of the action that removed this modifier.
   * @returns {Boolean}
   */
  getRemovedByActionIndex() {
    return this.removedByActionIndex;
  }

  /**
   * Returns the action that removed this modifier.
   * @returns {Boolean}
   */
  getRemovedByAction() {
    if (this.removedByActionIndex > -1) {
      return this.getGameSession().getActionByIndex(this.removedByActionIndex);
    }
  }

  /**
   * Called automatically by game session to record this modifier as triggering in response to an action and creating a new action.
   * @param {Action} action
   */
  onTriggeredAction(action) {
    if (action != null) {
      const actionIndex = action.getIndex();
      const parentAction = action.getParentAction();
      const parentResolveAction = action.getResolveParentAction();
      if (parentAction != null) {
        const parentActionIndex = parentAction.getIndex();
        const resolveParentActionIndex = parentResolveAction.getIndex();

        // add action to list of triggered actions
        if (this.triggerActionsData == null) { this.triggerActionsData = []; }
        this.triggerActionsData.push({actionIndex, parentActionIndex, resolveParentActionIndex});

        // ensure triggering modifier is set correctly
        action.setTriggeringModifier(this);

        // always record action index that triggered this
        return this._setTriggeredByAction(parentAction, parentResolveAction);
      }
    }
  }

  /**
   * Called automatically by game session to record this modifier as triggering in response to an action and changing that action.
   * @param {Action} action
   */
  onTriggerChangedAction(action) {
    if (action != null) {
      // record modifier in action as having changed action
      action.setChangedByModifier(this);

      // always record action index that triggered this
      return this._setTriggeredByAction(action);
    }
  }

  /**
   * Called automatically by game session to record this modifier as triggering in response to an action and applying a modifier.
   * @param {Modifier} modifier
   * @param {Action} action
   * @param {Action} resolveAction
   */
  onTriggerAppliedModifier(modifier, action, resolveAction) {
    if ((modifier != null) && (action != null) && (resolveAction != null)) {
      const modifierIndex = modifier.getIndex();
      const actionIndex = action.getIndex();
      const resolveActionIndex = resolveAction.getIndex();

      // add modifier to list of triggered applied modifiers indices
      if (this.triggerAppliedModifiersData == null) { this.triggerAppliedModifiersData = []; }
      this.triggerAppliedModifiersData.push({modifierIndex, actionIndex, resolveActionIndex});

      // set modifier as applied by this modifier
      modifier.setAppliedByModifier(this);

      // record action index that triggered this as long as this triggering did not create the action
      if ((action.getTriggeringModifierIndex() !== this.getIndex()) && (resolveAction.getTriggeringModifierIndex() !== this.getIndex())) {
        return this._setTriggeredByAction(action, resolveAction);
      }
    }
  }

  /**
   * Called automatically by game session to record this modifier as triggering in response to an action and activating a modifier.
   * @param {Modifier} modifier
   * @param {Action} action
   * @param {Action} resolveAction
   */
  onTriggerActivatedModifier(modifier, action, resolveAction) {
    if ((modifier != null) && (action != null) && (resolveAction != null)) {
      const modifierIndex = modifier.getIndex();
      const actionIndex = action.getIndex();
      const resolveActionIndex = resolveAction.getIndex();

      // add modifier to list of triggered activated modifiers indices
      if (this.triggerActivatedModifiersData == null) { this.triggerActivatedModifiersData = []; }
      this.triggerActivatedModifiersData.push({modifierIndex, actionIndex, resolveActionIndex});

      // always record action index that triggered this
      return this._setTriggeredByAction(action, resolveAction);
    }
  }

  /**
   * Called automatically by game session to record this modifier as triggering in response to an action and deactivating a modifier.
   * @param {Modifier} modifier
   * @param {Action} action
   * @param {Action} resolveAction
   */
  onTriggerDeactivatedModifier(modifier, action, resolveAction) {
    if ((modifier != null) && (action != null) && (resolveAction != null)) {
      const modifierIndex = modifier.getIndex();
      const actionIndex = action.getIndex();
      const resolveActionIndex = resolveAction.getIndex();

      // add modifier to list of triggered deactivated modifiers indices
      if (this.triggerDeactivatedModifiersData == null) { this.triggerDeactivatedModifiersData = []; }
      this.triggerDeactivatedModifiersData.push({modifierIndex, actionIndex, resolveActionIndex});

      // always record action index that triggered this
      return this._setTriggeredByAction(action, resolveAction);
    }
  }

  /**
   * Called automatically by game session to record this modifier as triggering in response to an action and removing a modifier.
   * @param {Modifier} modifier
   * @param {Action} action
   */
  onTriggerRemovedModifier(modifier, action, resolveAction) {
    if ((modifier != null) && (action != null) && (resolveAction != null)) {
      const modifierIndex = modifier.getIndex();
      const actionIndex = action.getIndex();
      const resolveActionIndex = resolveAction.getIndex();

      // add modifier to list of triggered removed modifiers indices by action index
      if (this.triggerRemovedModifiersData == null) { this.triggerRemovedModifiersData = []; }
      this.triggerRemovedModifiersData.push({modifierIndex, actionIndex, resolveActionIndex});

      // set modifier as removed by this modifier
      modifier.setRemovedByModifier(this);

      // record action index that triggered this as long as this triggering did not create the action
      if ((action.getTriggeringModifierIndex() !== this.getIndex()) && (resolveAction.getTriggeringModifierIndex() !== this.getIndex())) {
        return this._setTriggeredByAction(action, resolveAction);
      }
    }
  }

  _setTriggeredByAction(action, resolveAction) {
    resolveAction || (resolveAction = action);

    // check for valid indices
    const actionIndex = action.getIndex();
    if ((actionIndex == null)) {
      Logger.module("SDK").error(`[G:${this.getGameSession().getGameId()}] _setTriggeredByAction for modifier ${this.getType()} but action ${action.getType()} has no index!`);
    }
    const resolveActionIndex = resolveAction.getIndex();
    if ((resolveActionIndex == null)) {
      Logger.module("SDK").error(`[G:${this.getGameSession().getGameId()}] _setTriggeredByAction for modifier ${this.getType()} but resolve action ${resolveAction.getType()} has no index!`);
    }

    // action
    action.onTriggeredModifier(this, resolveAction);
    resolveAction.onResolveTriggeredModifier(this, action);

    // store indices
    if (this.triggeredByActionsData == null) { this.triggeredByActionsData = []; }
    return this.triggeredByActionsData.push({actionIndex, resolveActionIndex});
  }

  /**
   * Returns whether a modifier was triggered by an action.
   * @param {Action} action
   * @returns {Boolean}
   */
  getTriggeredByAction(action) {
    if (this.triggeredByActionsData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggeredByActionsData)) {
        if (data.actionIndex === actionIndex) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Returns whether a modifier was triggered by a resolve action.
   * @param {Action} action
   * @returns {Boolean}
   */
  getTriggeredByResolveAction(action) {
    if (this.triggeredByActionsData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggeredByActionsData)) {
        if (data.resolveActionIndex === actionIndex) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Returns a list of data for actions that caused this modifier to trigger.
   * @returns {Array}
   */
  getTriggeredByActionsData() {
    return this.triggeredByActionsData || [];
  }

  /**
   * Returns a list of action indices for actions created by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerActionIndicesForActionIndex(actionIndex) {
    const actionIndices = [];
    if (this.triggerActionsData != null) {
      for (var data of Array.from(this.triggerActionsData)) {
        if (data.parentActionIndex === actionIndex) {
          actionIndices.push(data.actionIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of data for actions created by this modifier triggering.
   * @returns {Array}
   */
  getTriggerActionsData() {
    return this.triggerActionsData || [];
  }

  /**
   * Returns a list of actions created by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerActionsForAction(action) {
    return this.getGameSession().getActionsByIndices(this.getTriggerActionIndicesForActionIndex(action.getIndex()));
  }

  /**
   * Returns a list of action indices for actions created by this modifier when it triggered in response to a resolve action.
   * @returns {Array}
   */
  getTriggerActionIndicesForResolveActionIndex(actionIndex) {
    const actionIndices = [];
    if (this.triggerActionsData != null) {
      for (var data of Array.from(this.triggerActionsData)) {
        if (data.resolveParentActionIndex === actionIndex) {
          actionIndices.push(data.actionIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of actions created by this modifier when it triggered in response to a resolve action.
   * @returns {Array}
   */
  getTriggerActionsForResolveAction(action) {
    return this.getGameSession().getActionsByIndices(this.getTriggerActionIndicesForResolveActionIndex(action.getIndex()));
  }

  /**
   * Returns a list of action indices created by this modifier when it triggered in response to matching action and resolve action.
   * @returns {Array}
   */
  getTriggerActionIndicesForActionAndResolveActionIndices(actionIndex, resolveActionIndex) {
    const actionIndices = [];
    if (this.triggerActionsData != null) {
      for (var data of Array.from(this.triggerActionsData)) {
        if ((data.parentActionIndex === actionIndex) && (data.resolveParentActionIndex === resolveActionIndex)) {
          actionIndices.push(data.actionIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of actions created by this modifier when it triggered in response to matching action and resolve action.
   * @returns {Array}
   */
  getTriggerActionsForActionAndResolveActionIndices(actionIndex, resolveActionIndex) {
    return this.getGameSession().getActionsByIndices(this.getTriggerActionIndicesForActionAndResolveActionIndices(actionIndex, resolveActionIndex));
  }

  /**
   * Returns a list of actions created by this modifier when it triggered in response to matching action and resolve action.
   * @returns {Array}
   */
  getTriggerActionsForActionAndResolveAction(action, resolveAction) {
    return this.getTriggerActionsForActionAndResolveActionIndices(action.getIndex(), resolveAction.getIndex());
  }

  /**
   * Returns a list of modifier indices applied by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerAppliedModifierIndicesForAction(action) {
    const actionIndices = [];
    if (this.triggerAppliedModifiersData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggerAppliedModifiersData)) {
        if (data.actionIndex === actionIndex) {
          actionIndices.push(data.modifierIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of data for modifiers applied by this modifier triggering.
   * @returns {Array}
   */
  getTriggerAppliedModifiersData() {
    return this.triggerAppliedModifiersData || [];
  }

  /**
   * Returns a list of modifiers applied by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerAppliedModifiersForAction(action) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerAppliedModifierIndicesForAction(action));
  }

  /**
   * Returns a list of modifier indices applied by this modifier when it triggered in response to a resolve action.
   * @returns {Array}
   */
  getTriggerAppliedModifierIndicesForResolveAction(action) {
    const actionIndices = [];
    if (this.triggerAppliedModifiersData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggerAppliedModifiersData)) {
        if (data.resolveActionIndex === actionIndex) {
          actionIndices.push(data.modifierIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of modifiers applied by this modifier when it triggered in response to a resolve action.
   * @returns {Array}
   */
  getTriggerAppliedModifiersForResolveAction(action) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerAppliedModifierIndicesForResolveAction(action));
  }

  /**
   * Returns a list of modifier indices applied by this modifier when it triggered given a specific combination of action and resolve action.
   * @returns {Array}
   */
  getTriggerAppliedModifierIndicesForActionAndResolveAction(action, resolveAction) {
    const modifierIndices = [];
    if (this.triggerAppliedModifiersData != null) {
      const actionIndex = action.getIndex();
      const resolveActionIndex = resolveAction.getIndex();
      for (var data of Array.from(this.triggerAppliedModifiersData)) {
        var dataModifierIndex = data.modifierIndex;
        var dataActionIndex = data.actionIndex;
        var dataResolveActionIndex = data.resolveActionIndex;
        if ((dataActionIndex === actionIndex) && (dataResolveActionIndex === resolveActionIndex) && ((dataModifierIndex !== lastDataModifierIndex) || (lastDataActionIndex !== dataActionIndex) || (lastDataResolveActionIndex !== dataResolveActionIndex))) {
          modifierIndices.push(dataModifierIndex);
        }
        var lastDataModifierIndex = dataModifierIndex;
        var lastDataActionIndex = dataActionIndex;
        var lastDataResolveActionIndex = dataResolveActionIndex;
      }
    }
    return modifierIndices;
  }

  /**
   * Returns a list of modifiers applied by this modifier when it triggered in response to an action and resolve action.
   * @returns {Array}
   */
  getTriggerAppliedModifiersForActionAndResolveAction(action, resolveAction) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerAppliedModifierIndicesForActionAndResolveAction(action, resolveAction));
  }

  /**
   * Returns a list of modifier indices activated by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerActivatedModifierIndicesForAction(action) {
    const actionIndices = [];
    if (this.triggerActivatedModifiersData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggerActivatedModifiersData)) {
        if (data.actionIndex === actionIndex) {
          actionIndices.push(data.modifierIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of data for modifiers activated by this modifier triggering.
   * @returns {Array}
   */
  getTriggerActivatedModifiersData() {
    return this.triggerActivatedModifiersData || [];
  }

  /**
   * Returns a list of modifiers activated by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerActivatedModifiersForAction(action) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerActivatedModifierIndicesForAction(action));
  }

  /**
   * Returns a list of modifier indices activated by this modifier when it triggered in response to a resolve action.
   * @returns {Array}
   */
  getTriggerActivatedModifierIndicesForResolveAction(action) {
    const actionIndices = [];
    if (this.triggerActivatedModifiersData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggerActivatedModifiersData)) {
        if (data.resolveActionIndex === actionIndex) {
          actionIndices.push(data.modifierIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of modifiers activated by this modifier when it triggered in response to a resolve action.
   * @returns {Array}
   */
  getTriggerActivatedModifiersForResolveAction(action) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerActivatedModifierIndicesForResolveAction(action));
  }

  /**
   * Returns a list of modifier indices activated by this modifier when it triggered given a specific combination of action and resolve action.
   * @returns {Array}
   */
  getTriggerActivatedModifierIndicesForActionAndResolveAction(action, resolveAction) {
    const modifierIndices = [];
    if (this.triggerActivatedModifiersData != null) {
      const actionIndex = action.getIndex();
      const resolveActionIndex = resolveAction.getIndex();
      for (var data of Array.from(this.triggerActivatedModifiersData)) {
        var dataModifierIndex = data.modifierIndex;
        var dataActionIndex = data.actionIndex;
        var dataResolveActionIndex = data.resolveActionIndex;
        if ((dataActionIndex === actionIndex) && (dataResolveActionIndex === resolveActionIndex) && ((dataModifierIndex !== lastDataModifierIndex) || (lastDataActionIndex !== dataActionIndex) || (lastDataResolveActionIndex !== dataResolveActionIndex))) {
          modifierIndices.push(dataModifierIndex);
        }
        var lastDataModifierIndex = dataModifierIndex;
        var lastDataActionIndex = dataActionIndex;
        var lastDataResolveActionIndex = dataResolveActionIndex;
      }
    }
    return modifierIndices;
  }

  /**
   * Returns a list of modifiers activated by this modifier when it triggered in response to an action and resolve action.
   * @returns {Array}
   */
  getTriggerActivatedModifiersForActionAndResolveAction(action, resolveAction) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerActivatedModifierIndicesForActionAndResolveAction(action, resolveAction));
  }

  /**
   * Returns a list of modifier indices removed by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerRemovedModifierIndicesForAction(action) {
    const actionIndices = [];
    if (this.triggerRemovedModifiersData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggerRemovedModifiersData)) {
        if (data.actionIndex === actionIndex) {
          actionIndices.push(data.modifierIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of data for modifiers removed by this modifier triggering.
   * @returns {Array}
   */
  getTriggerRemovedModifiersData() {
    return this.triggerRemovedModifiersData || [];
  }

  /**
   * Returns a list of modifiers removed by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerRemovedModifiersForAction(action) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerRemovedModifierIndicesForAction(action));
  }

  /**
   * Returns a list of modifier indices removed by this modifier when it triggered in response to a resolve action.
   * @returns {Array}
   */
  getTriggerRemovedModifierIndicesForResolveAction(action) {
    const actionIndices = [];
    if (this.triggerRemovedModifiersData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggerRemovedModifiersData)) {
        if (data.resolveActionIndex === actionIndex) {
          actionIndices.push(data.modifierIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of modifiers removed by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerRemovedModifiersForResolveAction(action) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerRemovedModifierIndicesForResolveAction(action));
  }

  /**
   * Returns a list of modifier indices removed by this modifier when it triggered given a specific combination of action and resolve action.
   * @returns {Array}
   */
  getTriggerRemovedModifierIndicesForActionAndResolveAction(action, resolveAction) {
    const modifierIndices = [];
    if (this.triggerRemovedModifiersData != null) {
      const actionIndex = action.getIndex();
      const resolveActionIndex = resolveAction.getIndex();
      for (var data of Array.from(this.triggerRemovedModifiersData)) {
        var dataModifierIndex = data.modifierIndex;
        var dataActionIndex = data.actionIndex;
        var dataResolveActionIndex = data.resolveActionIndex;
        if ((dataActionIndex === actionIndex) && (dataResolveActionIndex === resolveActionIndex) && ((dataModifierIndex !== lastDataModifierIndex) || (lastDataActionIndex !== dataActionIndex) || (lastDataResolveActionIndex !== dataResolveActionIndex))) {
          modifierIndices.push(dataModifierIndex);
        }
        var lastDataModifierIndex = dataModifierIndex;
        var lastDataActionIndex = dataActionIndex;
        var lastDataResolveActionIndex = dataResolveActionIndex;
      }
    }
    return modifierIndices;
  }

  /**
   * Returns a list of modifiers removed by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerRemovedModifiersForActionAndResolveAction(action, resolveAction) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerRemovedModifierIndicesForActionAndResolveAction(action, resolveAction));
  }

  /**
   * Returns a list of modifier indices deactivated by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerDeactivatedModifierIndicesForAction(action) {
    const actionIndices = [];
    if (this.triggerDeactivatedModifiersData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggerDeactivatedModifiersData)) {
        if (data.actionIndex === actionIndex) {
          actionIndices.push(data.modifierIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of data for modifiers deactivated by this modifier triggering.
   * @returns {Array}
   */
  getTriggerDeactivatedModifiersData() {
    return this.triggerDeactivatedModifiersData || [];
  }

  /**
   * Returns a list of modifiers deactivated by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerDeactivatedModifiersForAction(action) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerDeactivatedModifierIndicesForAction(action));
  }

  /**
   * Returns a list of modifier indices deactivated by this modifier when it triggered in response to a resolve action.
   * @returns {Array}
   */
  getTriggerDeactivatedModifierIndicesForResolveAction(action) {
    const actionIndices = [];
    if (this.triggerDeactivatedModifiersData != null) {
      const actionIndex = action.getIndex();
      for (var data of Array.from(this.triggerDeactivatedModifiersData)) {
        if (data.resolveActionIndex === actionIndex) {
          actionIndices.push(data.modifierIndex);
        }
      }
    }
    return actionIndices;
  }

  /**
   * Returns a list of modifiers deactivated by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerDeactivatedModifiersForResolveAction(action) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerDeactivatedModifierIndicesForResolveAction(action));
  }

  /**
   * Returns a list of modifier indices deactivated by this modifier when it triggered given a specific combination of action and resolve action.
   * @returns {Array}
   */
  getTriggerDeactivatedModifierIndicesForActionAndResolveAction(action, resolveAction) {
    const modifierIndices = [];
    if (this.triggerDeactivatedModifiersData != null) {
      const actionIndex = action.getIndex();
      const resolveActionIndex = resolveAction.getIndex();
      for (var data of Array.from(this.triggerDeactivatedModifiersData)) {
        var dataModifierIndex = data.modifierIndex;
        var dataActionIndex = data.actionIndex;
        var dataResolveActionIndex = data.resolveActionIndex;
        if ((dataActionIndex === actionIndex) && (dataResolveActionIndex === resolveActionIndex) && ((dataModifierIndex !== lastDataModifierIndex) || (lastDataActionIndex !== dataActionIndex) || (lastDataResolveActionIndex !== dataResolveActionIndex))) {
          modifierIndices.push(dataModifierIndex);
        }
        var lastDataModifierIndex = dataModifierIndex;
        var lastDataActionIndex = dataActionIndex;
        var lastDataResolveActionIndex = dataResolveActionIndex;
      }
    }
    return modifierIndices;
  }

  /**
   * Returns a list of modifiers deactivated by this modifier when it triggered in response to an action.
   * @returns {Array}
   */
  getTriggerDeactivatedModifiersForActionAndResolveAction(action, resolveAction) {
    return this.getGameSession().getModifiersByIndices(this.getTriggerDeactivatedModifierIndicesForActionAndResolveAction(action, resolveAction));
  }

  /**
   * Returns whether a modifier is an ancestor for an action, i.e. it caused this action to be created.
   * @param {Action} action
   * @returns {Boolean}
   */
  getIsAncestorForAction(action) {
    if (action != null) {
      const triggeringModifier = action.getTriggeringModifier();
      if (this === triggeringModifier) {
        return true;
      } else {
        return this.getIsAncestorForAction(action.getResolveParentAction());
      }
    }
    return false;
  }

  /**
   * Returns whether a modifier can react to an action.
   * @param {Action} action
   * @returns {Boolean}
   */
  getCanReactToAction(action) {
    const appliedByAction = this.getAppliedByAction();
    if ((appliedByAction != null) && (appliedByAction.getTarget() !== this.getCard())) {
      return (appliedByAction.getIndex() < action.getIndex()) && !this.getIsAncestorForAction(action);
    } else {
      return !this.getIsAncestorForAction(action);
    }
  }

  /**
   * Helper method that creates and applies modifiers (specified in this modifier's modifiersContextObjects property) as submodifiers of this modifier.
   * @param {Array} modifiersContextObjects
   * @param {Card} card
   */
  applyManagedModifiersFromModifiersContextObjects(modifiersContextObjects, card) {
    if ((modifiersContextObjects != null) && (card != null)) {
      return Array.from(modifiersContextObjects).map((modifierContextObject) =>
        // NOTE: do not modify context object as it may be shared or reused to add future modifiers
        this.getGameSession().applyModifierContextObject(modifierContextObject, card, this));
    }
  }

  /**
   * Helper method that creates and applies modifiers from a list of modifiersContextObjects as submodifiers of this modifier, but ONLY if the target card does not yet have the modifiers.
   * @param {Array} modifiersContextObjects
   * @param {Card} card
   */
  applyManagedModifiersFromModifiersContextObjectsOnce(modifiersContextObjects, card) {
    if ((modifiersContextObjects != null) && (modifiersContextObjects.length > 0) && (card != null)) {
      // apply new sub modifiers

      return (() => {
        const result = [];
        for (let i = 0; i < modifiersContextObjects.length; i++) {
        // search through existing modifiers for a modifier that is managed by this modifier and has the same stack type
          var modifierContextObject = modifiersContextObjects[i];
          var hasModifier = false;
          for (var existingModifier of Array.from(card.getModifiers())) {
            if ((existingModifier != null) && (existingModifier.getParentModifierIndex() === this.getIndex())) {
              var auraModifierId = existingModifier.getAuraModifierId();
              if (auraModifierId === i) {
                hasModifier = true;
                break;
              }
            }
          }

          // card does not yet have this modifier
          if (!hasModifier) {
            // NOTE: do not modify context object as it may be shared or reused to add future modifiers
            result.push(this.getGameSession().applyModifierContextObject(modifierContextObject, card, this, i));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  /**
   * Helper method that removes all managed modifiers of this modifier from a list of cards.
   * @param {Array} cards
   */
  removeManagedModifiersFromCards(cards) {
    return Array.from(cards).map((card) =>
      this.removeManagedModifiersFromCard(card));
  }

  /**
   * Helper method that removes all managed modifiers of this modifier from a card.
   * @param {Card} card
   */
  removeManagedModifiersFromCard(card) {
    return (() => {
      const result = [];
      const iterable = this.getSubModifiers();
      for (let i = iterable.length - 1; i >= 0; i--) {
        var modifier = iterable[i];
        if ((modifier != null) && (modifier.getCard() === card)) {
          result.push(this.getGameSession().removeModifier(modifier));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  //===== / ======

  /* ATTRIBUTES */

  /*
  Some examples of how to use attribute buffs:

  Decrease a unit's max HP by 2
  modifier.attributeBuffs["maxHP"] = -2

  Increase a unit's attack by 8
  modifier.attributeBuffs["atk"] = 8

  Rebase a unit's maxHP to 1 before any other modifiers (can be changed by further modifiers on the unit)
  modifier.attributeBuffs["maxHP"] = 1
  modifier.attributeBuffsRebased = ["maxHP"]

  Set a unit's maxHP and attack to 1 in the order of application (can be changed by further modifiers on the unit)
  modifier.attributeBuffs["maxHP"] = 1
  modifier.attributesBuffs["atk"] = 1
  modifier.attributeBuffsAbsolute = ["maxHP", "atk"]

  Set a unit's speed to 0 (and it cannot be changed by further modifiers on the unit)
  modifier.attributeBuffs["speed"] = 0
  modifier.attributeBuffsAbsolute = ["speed"]
  modifier.attributeBuffsFixed = ["speed"]
  */

  getBuffedAttribute(attributeValue, buffKey) {
    if (this.attributeBuffs != null) {
      const buffValue = this.attributeBuffs[buffKey];
      if (buffValue != null) {
        if (this.getBuffsAttributeAbsolutely(buffKey) || this.getRebasesAttribute(buffKey)) {
          attributeValue = buffValue;
        } else {
          attributeValue = attributeValue + buffValue;
        }
      }
    }

    return attributeValue;
  }

  getAttributeBuffs() {
    return this.attributeBuffs;
  }

  getBuffsAttribute(buffKey) {
    return (this.attributeBuffs != null) && (this.attributeBuffs[buffKey] != null);
  }

  getBuffsAttributes() {
    return (this.attributeBuffs != null) && (Object.keys(this.attributeBuffs).length > 0);
  }

  getRebasesAttribute(buffKey) {
    return (this.attributeBuffsRebased != null) && Array.from(this.attributeBuffsRebased).includes(buffKey);
  }

  getRebasesAttributes() {
    return (this.attributeBuffsRebased != null) && (this.attributeBuffsRebased.length > 0);
  }

  getBuffsAttributeAbsolutely(buffKey) {
    return (this.attributeBuffsAbsolute != null) && Array.from(this.attributeBuffsAbsolute).includes(buffKey);
  }

  getBuffsAttributesAbsolutely() {
    return (this.attributeBuffsAbsolute != null) && (this.attributeBuffsAbsolute.length > 0);
  }

  getIsAttributeFixed(buffKey) {
    return (this.attributeBuffsFixed != null) && Array.from(this.attributeBuffsFixed).includes(buffKey);
  }

  getAreAttributesFixed() {
    return (this.attributeBuffsFixed != null) && (this.attributeBuffsFixed.length > 0);
  }

  setResetsDamage(val) {
    return this.resetsDamage = val;
  }

  getResetsDamage() {
    return this.resetsDamage || ((this.attributeBuffsRebased != null) && _.includes(this.attributeBuffsRebased, "maxHP"));
  }

  getCanConvertCardToPrismatic() {
    return this._private.canConvertCardToPrismatic;
  }

  getCanConvertCardToSkinned() {
    return this._private.canConvertCardToSkinned;
  }

  //===== / ======

  /* ARTIFACTS */

  getIsFromArtifact() {
    return this.getMaxDurability() > 0;
  }

  setDurability(durability) {
    return this.durability = Math.max(Math.min(durability, this.getMaxDurability()), 0.0);
  }

  getDurability() {
    return this.durability;
  }

  setMaxDurability(durability) {
    return this.maxDurability = durability;
  }

  getMaxDurability() {
    return this.maxDurability;
  }

  applyDamage(dmg) {
    if (dmg > 0) { // if damage amount was reduced to 0, do not reduce artifact durability
      //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "#{@getLogName()}.applyDamage -> durability #{@getDurability()} -> #{@getDurability()-1}")
      const durability = this.getDurability();
      this.setDurability(durability - 1); // we apply 1 dmg to modifier durability no matter what damage it takes
      return this.lastDmg = this.getDurability() - durability;
    }
  }

  getIsDestroyed() {
    return this.getIsFromArtifact() && (this.durability <= 0);
  }

  //===== / ======

  /* AURAS */

  _removeAura() {
    this._removeAuraFromCardsLeaving();

    // remove any sub modifiers that target card currently within aura's influence
    const cardsInAura = this._private.cachedCardsInAura;
    this._private.cachedCardsInAura = [];
    return this.removeManagedModifiersFromCards(cardsInAura);
  }

  _refreshAuraCardsAsNeeded() {
    // update entities in aura
    if (this._private.cardsInAuraDirty) {
      this._private.cardsInAuraDirty = false;
      const lastCardsInAura = this._private.cachedCardsInAura;
      this._private.cachedCardsInAura = this._findNewCardsInAura();
      return this._private.cachedCardsLeavingAura = _.difference(lastCardsInAura, this._private.cachedCardsInAura);
    }
  }

  _addAuraToCards() {
    // add any sub modifiers to cards in aura that don't already have aura modifiers
    return Array.from(this._private.cachedCardsInAura).map((card) =>
      this.applyManagedModifiersFromModifiersContextObjectsOnce(this.modifiersContextObjects, card));
  }

  _removeAuraFromCardsLeaving() {
    // remove any sub modifiers that target card that is now leaving aura's influence
    const cardsLeavingAura = this._private.cachedCardsLeavingAura;
    this._private.cachedCardsLeavingAura = [];
    return this.removeManagedModifiersFromCards(cardsLeavingAura);
  }

  _findNewCardsInAura() {
    const auraEntities = [];

    if (this.getCard() != null) {
      // get targets
      if (this.auraIncludeSelf && !this.auraIncludeAlly && !this.auraIncludeEnemy && (this.auraFilterByCardType == null) && !((this.auraFilterByCardIds != null) && (this.auraFilterByCardIds.length > 0)) && !((this.auraFilterByRaceIds != null) && (this.auraFilterByRaceIds.length > 0)) && !((this.auraFilterByModifierTypes != null) && (this.auraFilterByModifierTypes.length > 0))) {
        // special case: aura only affects self
        auraEntities.push(this.getCard());
      } else {
        const potentialCardsInAura = this._findPotentialCardsInAura();

        // always include self in potential targets
        potentialCardsInAura.push(this.getCard());

        // filter all targets
        const ownerId = this.getCard().getOwnerId();
        let seenSelf = false;
        for (var target of Array.from(potentialCardsInAura)) {
          if (target != null) {
            if ((this.auraIncludeBoard && target.getIsActive()) || (this.auraIncludeHand && target.getIsLocatedInHand()) || (this.auraIncludeSignatureCards && target.getIsLocatedInSignatureCards()) || (this.auraIncludeSelf && (target === this.getCard()))) {
              var targetOwnerId = target.getOwnerId();
              if (target === this.getCard()) {
                if (this.auraIncludeSelf && !seenSelf && (!target.getIsGeneral() || (this.auraIncludeGeneral && target.getIsGeneral())) && this._filterPotentialCardInAura(target)) {
                  auraEntities.push(target);
                }
                seenSelf = true;
              } else if ((this.auraIncludeAlly && (targetOwnerId === ownerId)) || (this.auraIncludeEnemy && (targetOwnerId !== ownerId))) {
                if (CardType.getIsEntityCardType(target.getType())) {
                  // if target is an entity, filter for General as needed based on aura properties
                  if ((!target.getIsGeneral() || (this.auraIncludeGeneral && target.getIsGeneral())) && this._filterPotentialCardInAura(target)) {
                    auraEntities.push(target);
                  }
                } else if (this._filterPotentialCardInAura(target)) {
                  // non entity target
                  auraEntities.push(target);
                }
              }
            }
          }
        }
      }
    }

    return auraEntities;
  }

  _findPotentialCardsInAura() {
    // find all targets that could be affected by action
    // override this for multi-target actions that don't use simple radius search
    let potentialCards = [];

    if (this.auraIncludeBoard) {
      let auraFilterByCardType;
      let allowUntargetable = false;
      if (auraFilterByCardType = CardType.Tile) { // when filtering for tiles, need to allow untargetable entities since tiles are always untargetable
        allowUntargetable = true;
      }
      potentialCards = potentialCards.concat(this.getGameSession().getBoard().getCardsWithinRadiusOfPosition(this.getCard().position, this.auraFilterByCardType, this.auraRadius, true, allowUntargetable, false));
    }

    if (this.auraIncludeHand) {
      potentialCards = potentialCards.concat(this.getGameSession().getPlayer1().getDeck().getCardsInHandExcludingMissing(), this.getGameSession().getPlayer2().getDeck().getCardsInHandExcludingMissing());
    }

    if (this.auraIncludeSignatureCards) {
      potentialCards = potentialCards.concat(this.getGameSession().getPlayer1().getCurrentSignatureCard(), this.getGameSession().getPlayer2().getCurrentSignatureCard());
    }

    return potentialCards;
  }

  _filterPotentialCardInAura(card) {
    let needle;
    if (this.auraFilterByCardType) {
      const cardType = card.getType();
      if (this.auraFilterByCardType === CardType.Entity) {
        if (!CardType.getIsEntityCardType(cardType)) {
          return false;
        }
      } else if (this.auraFilterByCardType === CardType.Unit) {
        if (!CardType.getIsUnitCardType(cardType)) {
          return false;
        }
      } else if (this.auraFilterByCardType === CardType.Tile) {
        if (!CardType.getIsTileCardType(cardType)) {
          return false;
        }
      } else if (this.auraFilterByCardType === CardType.Spell) {
        if (!CardType.getIsSpellCardType(cardType)) {
          return false;
        }
      } else if (this.auraFilterByCardType === CardType.Artifact) {
        if (!CardType.getIsArtifactCardType(cardType)) {
          return false;
        }
      }
    }

    if ((this.auraFilterByCardIds != null) && (this.auraFilterByCardIds.length > 0) && !((needle = card.getBaseCardId(), Array.from(this.auraFilterByCardIds).includes(needle)))) {
      return false;
    }

    if ((this.auraFilterByRaceIds != null) && (this.auraFilterByRaceIds.length > 0)) {
      let passesRaceFilter = false;
      for (var raceId of Array.from(this.auraFilterByRaceIds)) {
        if (card.getBelongsToTribe(raceId)) {
          passesRaceFilter = true;
          break;
        }
      }
      if (!passesRaceFilter) {
        return false;
      }
    }

    if ((this.auraFilterByModifierTypes != null) && (this.auraFilterByModifierTypes.length > 0)) {
      let passesModifierFilter = false;
      for (var modType of Array.from(this.auraFilterByModifierTypes)) {
        if (card.getActiveModifierByType(modType)) {
          passesModifierFilter = true;
          break;
        }
      }
      if (!passesModifierFilter) {
        return false;
      }
    }

    return true;
  }

  getEntitiesInAura() {
    return this._private.cachedCardsInAura;
  }

  getIsAura() {
    return this.isAura;
  }

  setAuraModifierId(val) {
    return this.auraModifierId = val;
  }

  getAuraModifierId() {
    return this.auraModifierId;
  }

  getIsManagedByAura() {
    const parentModifier = this.getParentModifier();
    return parentModifier && (parentModifier.getIsAura() || parentModifier.getIsManagedByAura());
  }

  //===== / ======

  /* EVENT CALLBACKS */

  getIsListeningToEvents() {
    return this._private.listeningToEvents;
  }

  startListeningToEvents() {
    return this._private.listeningToEvents = true;
  }

  stopListeningToEvents() {
    return this._private.listeningToEvents = false;
  }

  _onTerminate() {
    // this method is automatically called when this object will never be used again
    return this.stopListeningToEvents();
  }

  _onModifyActionForValidation(event) {
    if (this._private.cachedIsActive) {
      return this.onModifyActionForValidation(event);
    }
  }

  _onValidateAction(event) {
    // only validate the action if it is valid
    const {
      action
    } = event;
    if ((action != null ? action.getIsValid() : undefined) && this._private.cachedIsActive) {
      return this.onValidateAction(event);
    }
  }

  _onModifyActionForExecution(event) {
    if (this._private.cachedIsActive) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onModifyActionForExecution(event);
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  _onBeforeAction(event) {
    const {
      action
    } = event;
    if (this._private.cachedIsActive && this.getCanReactToAction(action)) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onBeforeAction(event);
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  _onAction(event) {
    const {
      action
    } = event;

    // take durability damage when our unit takes damage
    if ((this.maxDurability > 0) && action instanceof DamageAction && (action.getTarget() === this.getCard())) {
      this.applyDamage(action.getTotalDamageAmount());
    }
    //Logger.module("SDK").debug("[G:#{@.getGameSession().gameId}]", "Modifier._onAction -> #{@getLogName()} card #{@getCard()?.getLogName()}")
    if (this._private.cachedIsActive && this.getCanReactToAction(action)) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onAction(event);
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  _onAfterAction(event) {
    const {
      action
    } = event;
    if (this._private.cachedIsActive && this.getCanReactToAction(action)) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onAfterAction(event);
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  _onAfterCleanupAction(event) {
    const {
      action
    } = event;
    if (this._private.cachedIsActive && this.getCanReactToAction(action)) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onAfterCleanupAction(event);
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  _onEndTurnDurationChange(event) {
    if (!this._private.cachedIsActive && !this._private.cachedIsActiveInLocation) {
      // don't change duration for inactive modifiers while in non-active locations
      return;
    }

    // increase elapsed
    this.setNumEndTurnsElapsed(this.numEndTurnsElapsed + 1);

    if (this._private.cachedIsActive) { // if active, modifier can respond to this duration change
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onEndTurnDurationChange(event);
      if (this.durationEndTurn > 0) {
        this.durationEndTurn = this._getModifierDurationChangeInCaseOfBonusTurn(this.durationEndTurn);
        if (this.numEndTurnsElapsed >= this.durationEndTurn) {
          this.onExpire(event);
          this.getGameSession().removeModifier(this);
        }
      }
      return this.getGameSession().popTriggeringModifierFromStack();
    } else { // if inactive, modifier may still run out of duration but cannot respond
      if (this.durationEndTurn > 0) {
        this.durationEndTurn = this._getModifierDurationChangeInCaseOfBonusTurn(this.durationEndTurn);
        if (this.numEndTurnsElapsed >= this.durationEndTurn) {
          return this.getGameSession().removeModifier(this);
        }
      }
    }
  }

  _onStartTurnDurationChange(event) {
    if (!this._private.cachedIsActive && !this._private.cachedIsActiveInLocation) {
      // don't change duration for inactive modifiers while in non-active locations
      return;
    }

    // increase elapsed
    this.setNumStartTurnsElapsed(this.numStartTurnsElapsed + 1);

    if (this._private.cachedIsActive) { // if active, modifier can respond to this duration change
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onStartTurnDurationChange(event);
      if (this.durationStartTurn > 0) {
        this.durationStartTurn = this._getModifierDurationChangeInCaseOfBonusTurn(this.durationStartTurn);
        if (this.numStartTurnsElapsed >= this.durationStartTurn) {
          this.onExpire(event);
          this.getGameSession().removeModifier(this);
        }
      }
      return this.getGameSession().popTriggeringModifierFromStack();
    } else { // if inactive, modifier may still run out of duration but cannot respond
      if (this.durationStartTurn > 0) {
        this.durationStartTurn = this._getModifierDurationChangeInCaseOfBonusTurn(this.durationStartTurn);
        if (this.numStartTurnsElapsed >= this.durationStartTurn) {
          return this.getGameSession().removeModifier(this);
        }
      }
    }
  }

  _getModifierDurationChangeInCaseOfBonusTurn(duration) {
    // special case: if not swapping current player at end turn like normal (current player taking an turn)
    if (this.durationRespectsBonusTurns && !this.getGameSession().willSwapCurrentPlayerNextTurn()) {
      if (this.getGameSession().getCurrentPlayerId() === this.getCard().getOwnerId()) {
        // caster is taking a bonus turn, so modifier should expire next end turn
        if (duration > 1) { // make sure we don't make modifier infinite
          duration--;
        }
      } else {
        // opponent is taking a bonus turn, so modifier duration should be extended by one additional turn
        duration++;
      }
    }
    return duration;
  }

  _onActiveChange(event) {
    // modifiers update cached state at the modifier active change phase
    // at this point we know:
    // - all cards that died have been cleaned up
    this.updateCachedState();

    // if the modifier is destroyed, remove it
    // check for whether this modifier is already removed
    // as this code path is called during removal to trigger deactivation
    const isDestroyed = this.getIsDestroyed();
    if (isDestroyed && !this.getIsRemoved()) {
      return this.getGameSession().removeModifier(this);
    } else if (this._private.cachedIsActive && !this._private.cachedWasActive) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onActivate();
      return this.getGameSession().popTriggeringModifierFromStack();
    } else if (!this._private.cachedIsActive && this._private.cachedWasActive) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onDeactivate();
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  _onRemoveAura(event) {
    if (this.isAura) {
      if (this._private.cachedIsActive) {
        this.getGameSession().pushTriggeringModifierOntoStack(this);
        this._refreshAuraCardsAsNeeded();
        this._removeAuraFromCardsLeaving();
        return this.getGameSession().popTriggeringModifierFromStack();
      } else if (this._private.cachedWasActive) {
        this.getGameSession().pushTriggeringModifierOntoStack(this);
        this._removeAura();
        return this.getGameSession().popTriggeringModifierFromStack();
      }
    }
  }

  _onAddAura(event) {
    if (this.isAura && this._private.cachedIsActive) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this._refreshAuraCardsAsNeeded();
      this._addAuraToCards();
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  _onStartTurn(event) {
    if (this._private.cachedIsActive) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onStartTurn(event);
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  _onEndTurn(event) {
    if (this._private.cachedIsActive) {
      this.getGameSession().pushTriggeringModifierOntoStack(this);
      this.onEndTurn(event);
      return this.getGameSession().popTriggeringModifierFromStack();
    }
  }

  onModifyActionForValidation(event) {}
    // override this in sub classes

  onValidateAction(event) {}
    // override this in sub classes
    // check the actionEvent.action and set isValid to block an action

  invalidateAction(action, position, message) {
    // helper method for invalidating an action at a position with a message
    if (message == null) { message = "Invalid Action!"; }
    action.setIsValid(false);
    action.setValidationMessage(message);
    action.setValidationMessagePosition(position);
    return action.setValidatorType(this.getType());
  }

  onModifyActionForExecution(event) {}
    // override this in sub classes

  onBeforeAction(event) {}
    // override this in sub classes

  onAction(event) {}
    // override this in sub classes

  onAfterAction(event) {}
    // override this in sub classes

  onAfterCleanupAction(event) {}
    // override this in sub classes

  onEndTurnDurationChange(event) {}
    // override this in sub classes

  onStartTurnDurationChange(event) {}
    // override this in sub classes

  onExpire(event) {}
    // override this in sub classes

  onStartTurn(event) {}
    // override this in sub classes

  onEndTurn(event) {}
    // override this in sub classes

  //===== / ======

  /* JSON serialization */

  deserialize(data) {
    return UtilsJavascript.fastExtend(this,data);
  }

  postDeserialize() {
    if (this.getCard() != null) {
      // flush any cached data
      this.flushAllCachedData();

      // update cached state
      this.updateCachedState();
      this._private.cachedWasActive = this._private.cachedIsActive;
      this._private.cachedWasActiveInLocation = this._private.cachedIsActiveInLocation;
      if (this.isAura && this._private.cachedIsActive) {
        this._private.cachedCardsInAura = this._findNewCardsInAura();
      }

      // hook into events
      return this.startListeningToEvents();
    }
  }

  /**
   * Sets the modifier type of the modifier this should hide as for scrubbing.
   * @public
   * @param {String} modifierType.
   */
  setTransformModifierTypeForScrubbing(modifierType) {
    return this.hideAsModifierType = modifierType;
  }

  /**
   * Returns the modifier type of the modifier this should hide as for scrubbing.
   * @public
   * @returns {String}
   */
  getTransformModifierTypeForScrubbing() {
    return this.hideAsModifierType;
  }

  /**
   * Returns whether this is hideable.
   * @public
   * @return  {Boolean}
   */
  isHideable(scrubFromPerspectiveOfPlayerId, forSpectator) {
    if (this.hideAsModifierType != null) {
      const card = this.getCard();
      if ((card != null) && (card.getOwnerId() !== scrubFromPerspectiveOfPlayerId)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Hides the modifier during scrubbing as another modifier.
   * @public
   * @return  {Modifier}
   */
  createModifierToHideAs() {
    const {
      hideAsModifierType
    } = this;

    // create modifier this modifier will transform into
    const hiddenModifierClass = this.getGameSession().getModifierClassForType(hideAsModifierType);
    const hiddenModifier = this.getGameSession().createModifierForType(hideAsModifierType);

    // create a modifier context object for the transformed modifier
    hiddenModifier.contextObject = hiddenModifierClass.createContextObject();

    // copy properties from modifier
    for (var key of Array.from(this.getContextObjectKeysForCopy())) {
      hiddenModifier[key] = (hiddenModifier.contextObject[key] = this[key]);
    }

    // ensure modifier type is correct
    hiddenModifier.type = (hiddenModifier.contextObject.type = hideAsModifierType);

    // notify transformed modifier it was transformed from this modifier
    hiddenModifier.onCreatedToHide(this);

    return hiddenModifier;
  }

  /**
   * Method called automatically when this was created to hide a source modifier during scrubbing.
   * @public
   * @param {Modifier} source
   */
  onCreatedToHide(source) {}
}
Modifier.initClass();
    // override in sub class to implement custom behavior

module.exports = Modifier;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}