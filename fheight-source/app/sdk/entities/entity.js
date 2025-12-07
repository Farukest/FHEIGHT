/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const CONFIG = require('app/common/config');
const EVENTS = require('app/common/event_types');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const Card = require('app/sdk/cards/card');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');

const MovementRange = require('./movementRange');
const AttackRange =   require('./attackRange');

const MoveAction =   require('app/sdk/actions/moveAction');
const DamageAction =   require('app/sdk/actions/damageAction');
const AttackAction =   require('app/sdk/actions/attackAction');
const RemoveAction =   require('app/sdk/actions/removeAction');
const DieAction =   require('app/sdk/actions/dieAction');
const KillAction =   require('app/sdk/actions/killAction');

const ModifierUntargetable =   require('app/sdk/modifiers/modifierUntargetable');
const ModifierObstructing =   require('app/sdk/modifiers/modifierObstructing');
const ModifierProvoked =   require('app/sdk/modifiers/modifierProvoked');
const ModifierCustomSpawn = require('app/sdk/modifiers/modifierCustomSpawn');

const ModifierAirdrop =   require('app/sdk/modifiers/modifierAirdrop');
const ModifierProvoke =   require('app/sdk/modifiers/modifierProvoke');
const ModifierRangedProvoked = require('app/sdk/modifiers/modifierRangedProvoked');
const ModifierRangedProvoke = require('app/sdk/modifiers/modifierRangedProvoke');
const ModifierBattlePet = require('app/sdk/modifiers/modifierBattlePet');
const ModifierTamedBattlePet = require('app/sdk/modifiers/modifierTamedBattlePet');

const PlayerModifierChangeSignatureCard = require('app/sdk/playerModifiers/playerModifierChangeSignatureCard');

const _ = require('underscore');

class Entity extends Card {
  static initClass() {
  
    this.prototype.type = CardType.Entity;
    this.type = CardType.Entity;
    this.prototype.name = "Entity";
  
    this.prototype.atk = 0; // attack damage
    this.prototype.attacks = 1; // max attacks this entity can make
    this.prototype.attacksMade = 0; // number of attacks this entity has made this turn
    this.prototype.damage = 0; // current damage
    this.prototype.exhausted = true; // whether an entity is exhausted regardless of how many moves/attacks it has made
    this.prototype.isGeneral = false; // whether entity is a general
    this.prototype.isObstructing = false; // whether the entity takes up an entire board position and blocks view for units that need LOS
    this.prototype.isTargetable = true; // whether the entity can be targeted
    this.prototype.lastDmg = 0; // value of last damage taken
    this.prototype.lastHeal = 0; // value of last heal
    this.prototype.maxHP = 1; // max HP
    this.prototype.moves = 1; // max moves this entity can make
    this.prototype.movesMade = 0; // number of moves this entity has made this turn
    this.prototype.reach = 0; // how far the entity can attack
    this.prototype.speed = 0; // how far the entity can go per move
    this.prototype.wasGeneral = false; // whether this entity was a general at some time during game
    this.prototype.signatureCardData = null;
     // normally this will be null, but will be populated for Generals
  }

  constructor(gameSession) {
    // super constructor
    super(gameSession);
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    // cache
    p.cachedAttackPattern = null;
    p.cachedAttackPatternMap = null;
    p.cachedEntitiesKilledByAttackOn = null;
    p.cachedMovementPattern = null;
    p.cachedMovementPatternMap = null;
    p.cachedReferenceSignatureCard = null;
    p.cachedIsBattlePet = null;
    p.cachedIsUncontrollableBattlePet = null;

    // misc
    p.attackRange = new AttackRange(p.gameSession);
    p.movementRange = new MovementRange(p.gameSession);
    p.customAttackPattern = null;
    p.boundingBox = {x: 0, y: 0, width: 80, height: 80};

    return p;
  }

  createCloneCardData() {
    const cardData = super.createCloneCardData();

    cardData.damage = this.damage;

    return cardData;
  }

  onRemoveFromBoard(board, x, y, sourceAction) {
    super.onRemoveFromBoard(board, x, y, sourceAction);

    if (this.getIsGeneral()) {
      // notify the game session this entity is a general and has died
      return this.getGameSession().p_requestGameOver();
    }
  }

  //region ### Getters/Setters ###

  getLogName(){
    return super.getLogName() + `(${this.getPosition().x},${this.getPosition().y})`;
  }

  setIsGeneral(isGeneral) {
    if (this.isGeneral !== isGeneral) {
      this.wasGeneral = this.isGeneral || isGeneral || this.wasGeneral;
      this.isGeneral = isGeneral;
      this.flushCachedDescription();
      return this.flushCachedModifiers();
    }
  }

  getIsGeneral() {
    return this.isGeneral;
  }

  getWasGeneral() {
    return this.wasGeneral;
  }

  getIsBattlePet() {
    if (this._private.cachedIsBattlePet == null) { this._private.cachedIsBattlePet = this.hasModifierClass(ModifierBattlePet); }
    return this._private.cachedIsBattlePet;
  }

  getIsUncontrollableBattlePet() {
    // normally battle pets are uncontrollable, unless tamed
    // generals that are acting like battle pets are always uncontrollable
    if (this._private.cachedIsUncontrollableBattlePet == null) { this._private.cachedIsUncontrollableBattlePet = this.getIsBattlePet() && (!this.hasModifierClass(ModifierTamedBattlePet) || this.getIsGeneral()); }
    return this._private.cachedIsUncontrollableBattlePet;
  }

  getDescription(options) {
    // TODO: Is removing this commented out code correct?
//    # general description should be description of signature card
//    if @getWasGeneral() and (!@_private.cachedDescription? or @_private.cachedDescriptionOptions != options)
//      signatureCard = @getReferenceSignatureCard()
//      if signatureCard?
//        @_private.cachedDescriptionOptions = options
//        boldStart = options?.boldStart or ""
//        boldEnd = options?.boldEnd or ""
//        @_private.cachedDescription = boldStart + "Bloodbound Spell:" + boldEnd + " " + signatureCard.getDescription()

    return super.getDescription(options);
  }

  //endregion ### Getters/Setters ###

  //region ### BOUNDING BOX ###

  setBoundingBox(val) {
    return this._private.boundingBox = val;
  }

  getBoundingBox() {
    return this._private.boundingBox;
  }

  setBoundingBoxX(val) {
    return this._private.boundingBox.x = val;
  }

  getBoundingBoxX() {
    return this._private.boundingBox.x;
  }

  setBoundingBoxY(val) {
    return this._private.boundingBox.y = val;
  }

  getBoundingBoxY() {
    return this._private.boundingBox.y;
  }

  setBoundingBoxWidth(val) {
    return this._private.boundingBox.width = val;
  }

  getBoundingBoxWidth() {
    return this._private.boundingBox.width;
  }

  setBoundingBoxHeight(val) {
    return this._private.boundingBox.height = val;
  }

  getBoundingBoxHeight() {
    return this._private.boundingBox.height;
  }

  //endregion ### BOUNDING BOX ###

  //region ### VALID POSITIONS ###

  getValidTargetPositions() {
    if ((this._private.cachedValidTargetPositions == null)) {
      let validPositions;
      if (this.getCanBeAppliedAnywhere()) {
        // some cards can be applied anywhere on board
        validPositions = this._getValidApplyAnywherePositions();
      } else if (this.hasActiveModifierClass(ModifierCustomSpawn)) {
        validPositions = this.getActiveModifiersByClass(ModifierCustomSpawn)[0].getCustomSpawnPositions();
      } else {
        validPositions = this.getGameSession().getBoard().getValidSpawnPositions(this);
      }

      // always guarantee at least an empty array
      this._private.cachedValidTargetPositions = validPositions || [];
    }
    return this._private.cachedValidTargetPositions;
  }

  _getValidApplyAnywherePositions() {
    return this.getGameSession().getBoard().getUnobstructedPositionsForEntity(this);
  }

  getCanBeAppliedAnywhere() {
    // airdrop is a special trait that allows units to spawn anywhere on the map
    return super.getCanBeAppliedAnywhere() || this.hasActiveModifierClass(ModifierAirdrop);
  }

  //endregion ### VALID POSITIONS ###

  // region ### SIGNATURE CARD ###

  /**
   * Sets signature card data. Should only be valid for generals.
   * @param {Object|null}
   */
  setSignatureCardData(cardData) {
    this.signatureCardData = cardData;
    this.flushCachedReferenceSignatureCard();
    return this.flushCachedDescription();
  }

  /**
   * Gets current signature card data, accounting for modifiers.
   * NOTE: only valid for generals!
   * @returns {Object|null}
   */
  getSignatureCardData() {
    // first check to see if a player modifier is overriding signature card data
    let signatureCardData;
    if (this.hasModifierClass(PlayerModifierChangeSignatureCard)) {
      // populate signature card data based on order of application of player modifiers
      const modifiers = this.getActiveModifiersByClass(PlayerModifierChangeSignatureCard);
      if (modifiers.length > 0) { signatureCardData = modifiers[modifiers.length - 1].getSignatureCardData(); }
    }

    if (signatureCardData != null) {
      // if General is prismatic, return a prismatic signature card
      if (Cards.getIsPrismaticCardId(this.getId())) {
        signatureCardData.id = Cards.getPrismaticCardId(signatureCardData.id);
      }

      return signatureCardData;
    } else {
      // if no updated signature card found (based on modifiers), use the base
      return this.getBaseSignatureCardData();
    }
  }

  /**
   * Gets signature card data, unmodified.
   * NOTE: only valid for generals!
   * @returns {Object|null}
   */
  getBaseSignatureCardData() {
    const {
      signatureCardData
    } = this;

    // if General is prismatic, return a prismatic signature card
    if (signatureCardData != null) {
      if (Cards.getIsPrismaticCardId(this.getId())) {
        signatureCardData.id = Cards.getPrismaticCardId(signatureCardData.id);
      }
    }
    return signatureCardData;
  }

  /**
   * Gets a for reference signature card.
   * NOTE: this card is never used in game and is only for reference!
   * @returns {Card|null}
   */
  getReferenceSignatureCard() {
    const owner = this.getOwner();
    if ((owner != null) && (owner !== this.getGameSession())) {
      return owner.getReferenceSignatureCard();
    } else if ((this._private.cachedReferenceSignatureCard == null)) {
      this._private.cachedReferenceSignatureCard = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(this.getSignatureCardData());
    }
    return this._private.cachedReferenceSignatureCard;
  }

  /**
   * Flushes the cached reference card for signature so that the next call will regenerate the card.
   */
  flushCachedReferenceSignatureCard() {
    return this._private.cachedReferenceSignatureCard = null;
  }

  // endregion ### SIGNATURE CARD ###

  // region ### STATS ###

  getHP() {
    return Math.max(0, this.getMaxHP() - this.getDamage());
  }

  getMaxHP(withAuras) {
    return this.getBuffedAttribute(this.maxHP, "maxHP", withAuras);
  }

  getBaseMaxHP() {
    return this.getBaseAttribute(this.maxHP, "maxHP");
  }

  setDamage(damage) {
    return this.damage = Math.max(0, damage);
  }

  getDamage() {
    return this.damage;
  }

  resetDamage() {
    this.lastDmg = this.getDamage();
    return this.setDamage(0);
  }

  applyDamage(dmg) {
    this.lastDmg = this.getDamage();
    return this.setDamage(this.damage + dmg);
  }

  applyHeal(heal) {
    this.lastDmg = this.getDamage();
    return this.setDamage(this.damage - heal);
  }

  getCanBeHealed() {
    return this.getHP() < this.getMaxHP();
  }

  getATK(withAuras) {
    return this.getBuffedAttribute(this.atk, "atk", withAuras);
  }

  getBaseATK() {
    return this.getBaseAttribute(this.atk, "atk");
  }

  setReach(reach) {
    this.reach = reach;
    return this.flushCachedAttackPattern();
  }

  getReach(withAuras) {
    return this.getBuffedAttribute(this.reach, "reach", withAuras);
  }

  isMelee() {
    return this.getReach() === CONFIG.REACH_MELEE;
  }

  isRanged() {
    return this.getReach() === CONFIG.REACH_RANGED;
  }

  getAttackRange() {
    return this._private.attackRange;
  }

  setCustomAttackPattern(pattern) {
    this._private.customAttackPattern = pattern;
    if (!this.isRanged()) {
      return this.flushCachedAttackPattern();
    }
  }

  getAttackPattern() {
    if ((this._private.cachedAttackPattern == null)) {
      // don't use custom attack patterns if ranged (can already attack everywhere)
      if ((this._private.customAttackPattern != null) && !this.isRanged()) {
        this._private.cachedAttackPattern = this._private.customAttackPattern;
      } else {
        this._private.cachedAttackPattern = this._private.attackRange.getPatternByDistance(this.getGameSession().getBoard(), this.getReach());
      }
    }
    return this._private.cachedAttackPattern;
  }

  getAttackPatternMap() {
    if ((this._private.cachedAttackPatternMap == null)) {
      // don't use custom attack patterns if ranged (can already attack everywhere)
      if ((this._private.customAttackPattern != null) && !this.isRanged()) {
        this._private.cachedAttackPatternMap = this._private.attackRange.getPatternMapFromPattern(this.getGameSession().getBoard(), this._private.customAttackPattern);
      } else {
        this._private.cachedAttackPatternMap = this._private.attackRange.getPatternMapByDistance(this.getGameSession().getBoard(), this.getReach());
      }
    }
    return this._private.cachedAttackPatternMap;
  }

  flushCachedAttackPattern() {
    this._private.cachedAttackPattern = null;
    this._private.cachedAttackPatternMap = null;
    return this._private.attackRange.flushCachedState();
  }

  getAttackNeedsLOS() {
    return false;
  }

  setSpeed(speed) {
    this.speed = speed;
    return this.flushCachedMovementPattern();
  }

  getSpeed(withAuras) {
    return this.getBuffedAttribute(this.speed, "speed", withAuras);
  }

  getMovementRange() {
    return this._private.movementRange;
  }

  getMovementPattern() {
    if ((this._private.cachedMovementPattern == null)) {
      this._private.cachedMovementPattern = this._private.movementRange.getPatternByDistance(this.getGameSession().getBoard(), this.getSpeed());
    }
    return this._private.cachedMovementPattern;
  }

  getMovementPatternMap() {
    if ((this._private.cachedMovementPatternMap == null)) {
      this._private.cachedMovementPatternMap = this._private.movementRange.getPatternMapByDistance(this.getGameSession().getBoard(), this.getSpeed());
    }
    return this._private.cachedMovementPatternMap;
  }

  flushCachedMovementPattern() {
    this._private.cachedMovementPattern = null;
    this._private.cachedMovementPatternMap = null;
    return this._private.movementRange.flushCachedState();
  }

  setMovesMade(movesMade) {
    this.movesMade = Math.max(0, movesMade);
    // also check attacks made and increase to always be at least 1 less than moves
    // this enforces celerity rules of not allowing more than one move per attack
    const minimumAttacksMade = this.movesMade - 1;
    if (this.getAttacksMade() < minimumAttacksMade) { return this.setAttacksMade(minimumAttacksMade); }
  }

  getMovesMade() {
    return this.movesMade;
  }

  getMoves(withAuras) {
    return this.getBuffedAttribute(this.moves, "moves", withAuras);
  }

  getHasMovesLeft() {
    return this.getIsUncontrollableBattlePet() || (this.getMovesMade() < this.getMoves());
  }

  getCanMove() {
    return !this.getIsExhausted() && this.getHasMovesLeft() && (this.getSpeed() > 0);
  }

  setAttacksMade(attacksMade) {
    this.attacksMade = Math.max(0, attacksMade);
    // also check moves made and increase to match attacks
    // this enforces sequence of move before attack and never after
    if (this.getMovesMade() < this.attacksMade) { return this.setMovesMade(this.attacksMade); }
  }

  getAttacksMade() {
    return this.attacksMade;
  }

  getAttacks(withAuras) {
    return this.getBuffedAttribute(this.attacks, "attacks", withAuras);
  }

  getHasAttacksLeft() {
    return this.getIsUncontrollableBattlePet() || (this.getAttacksMade() < this.getAttacks());
  }

  getCanAttack() {
    return !this.getIsExhausted() && this.getHasAttacksLeft() && (this.getATK() > 0) && (this.getReach() > 0);
  }

  getCanAct() {
    return this.isOwnersTurn() && this.getDoesOwnerHaveEnoughManaToAct() && (this.getCanMove() || this.getCanAttack());
  }

  getNeverActs() {
    return (this.getSpeed() <= 0) && (this.getATK() <= 0);
  }

  /*
  * Returns exhausted state, accounting for all factors.
  * NOTE: for checking actual exhausted state value, use "getExhausted".
  * @returns {Boolean}
  */
  getIsExhausted() {
    if (this.getIsUncontrollableBattlePet()) {
      return false;
    } else {
      return this.getExhausted() || !this.getHasAttacksLeft();
    }
  }

  setExhausted(val) {
    return this.exhausted = val;
  }

  /*
  * Returns actual exhausted state value, not accounting for any other factors.
  * NOTE: for checking exhausted state that accounts for all factors, use "getIsExhausted".
  * @returns {Boolean}
  */
  getExhausted() {
    return this.exhausted;
  }

  refreshExhaustion() {
    this.setExhausted(false);
    this.setMovesMade(0);
    return this.setAttacksMade(0);
  }

  applyExhaustion() {
    return this.setExhausted(true);
  }

  getDoesOwnerHaveEnoughManaToAct() {
    if (this.getGameSession() != null) {
      // if we want unit moves to cost mana, un-comment the lines below
      /*
      owner = this.getGameSession().getPlayerById(@ownerId)
      return !@getIsExhausted() && (owner.getRemainingMana() > 0 || (owner.getRemainingMana() == 0 && @getCanAct()))
      */
      return !this.getIsExhausted();
    } else {
      return false;
    }
  }

  getCanAssist(unit) {
    return false;
  }

  getEntitiesKilledByAttackOn(attackTarget) {
    const gameSession = this.getGameSession();

    // prefer cached
    let entitiesKilled = this._private.cachedEntitiesKilledByAttackOn != null ? this._private.cachedEntitiesKilledByAttackOn[attackTarget.getIndex()] : undefined;
    if (entitiesKilled != null) { return entitiesKilled; } else { entitiesKilled = []; }

    // calculate entities killed
    if ((attackTarget != null) && this.getAttackRange().getIsValidTarget(gameSession.getBoard(), this, attackTarget)) {
      // create explicit attack
      const attackAction = this.actionAttack(attackTarget);

      // set index on attack to allow it to be the parent for all sub attacks
      attackAction.setIndex("attack");

      // create list of actions
      const actions = [];
      const validActions = [];

      // emit event for all modifiers to validate explicit attack for attack prediction
      gameSession.pushEvent({type: EVENTS.validate_action, action: attackAction, gameSession}, {blockNewImplicitActions: true});

      if (attackAction.getIsValid()) {
        // emit event for all modifiers to modify explicit attack for attack prediction
        let action;
        gameSession.pushEvent({type: EVENTS.modify_action_for_entities_involved_in_attack, action: attackAction, gameSession});

        // emit event for all modifiers to add entities and attacks that are involved in this attack
        gameSession.pushEvent({type: EVENTS.entities_involved_in_attack, action: attackAction, actions, gameSession});

        // for all implicit actions
        while (actions.length > 0) {
          // get next action
          action = actions.shift();

          // parent/root actions are retrieved by index but none of these actions have indices
          // so the getter methods must be modified to always return the attack action
          action.getParentAction = (action.getResolveParentAction = (action.getRootAction = () => attackAction));
          action.getIsImplicit = () => true;

          // emit event for all modifiers to validate resulting actions for attack prediction
          gameSession.pushEvent({type: EVENTS.validate_action, action, gameSession}, {blockNewImplicitActions: true});

          if (action.getIsValid()) {
            // add valid action
            validActions.push(action);

            // set action as sub action of explicit attack action
            attackAction.addSubAction(action);

            // emit event for all modifiers to modify resulting actions for attack prediction
            gameSession.pushEvent({type: EVENTS.modify_action_for_entities_involved_in_attack, action, gameSession});

            // emit event for all modifiers to add entities and attacks that are involved in this attack
            gameSession.pushEvent({type: EVENTS.entities_involved_in_attack, action, actions, gameSession});
          }
        }

        // after testing actions add explicit attack action to list
        validActions.push(attackAction);

        // test damage of each attack action against hp of target
        for (action of Array.from(validActions)) {
          var target = action.getTarget();
          if (((target != null) && (action instanceof DamageAction && (action.getTotalDamageAmount() >= target.getHP()))) || (action instanceof RemoveAction || action instanceof KillAction)) {
            entitiesKilled.push(target);
          }
        }
      }
    }

    // make list unique
    entitiesKilled = _.uniq(entitiesKilled);

    // cache results
    if (this._private.cachedEntitiesKilledByAttackOn == null) { this._private.cachedEntitiesKilledByAttackOn = {}; }
    this._private.cachedEntitiesKilledByAttackOn[attackTarget.getIndex()] = entitiesKilled;

    return entitiesKilled;
  }

  // endregion ### STATS ###

  //region ### PROPERTIES FROM MODIFIERS ###

  getIsObstructing() {
    return this.isObstructing || this.hasModifierClass(ModifierObstructing);
  }

  getObstructsEntity(entity) {
    if (this.getType() === CardType.Unit) {
      if (entity.getType() === CardType.Unit) { return true; }
      if (entity.getIsObstructing()) { return true; }
    } else if (entity.getType() === CardType.Unit) {
      if (this.getIsObstructing()) { return true; }
    } else if ((this.getType() === CardType.Tile) && (entity.getType() === CardType.Tile)) {
      if (this.getObstructsOtherTiles()) { return true; }
    }
    return false;
  }

  getIsTargetable() {
    return this.isTargetable && !this.hasActiveModifierClass(ModifierUntargetable);
  }

  getIsProvoked() {
    return this.hasActiveModifierClass(ModifierProvoked);
  }

  getIsProvoker() {
    return this.hasActiveModifierClass(ModifierProvoke);
  }

  getIsRangedProvoked() {
    return this.hasActiveModifierClass(ModifierRangedProvoked);
  }

  getIsRangedProvoker() {
    return this.hasActiveModifierClass(ModifierRangedProvoke);
  }

  getEntitiesProvoked() {
    const provokeModifier = this.getActiveModifierByClass(ModifierProvoke);
    if (provokeModifier != null) {
      return provokeModifier.getEntitiesInAura();
    } else {
      const rangedProvokeModifier = this.getActiveModifierByClass(ModifierRangedProvoke);
      if (rangedProvokeModifier != null) {
        return rangedProvokeModifier.getEntitiesInAura();
      }
    }

    // default to no entities provoked
    return [];
  }

  //endregion ### PROPERTIES FROM MODIFIERS ###

  //region ### ACTIONS ###

  actionDie(source) {
    const a = this.getGameSession().createActionForType(DieAction.type);
    a.setSource(source);
    a.setTarget(this);
    return a;
  }

  actionMove(pos) {
    const a = this.getGameSession().createActionForType(MoveAction.type);
    a.setSource(this);
    a.setTarget(this);
    a.setTargetPosition(pos);
    return a;
  }

  actionAttack(entity) {
    const a = this.getGameSession().createActionForType(AttackAction.type);
    a.setSource(this);
    a.setTarget(entity);
    return a;
  }

  actionAttackEntityAtPosition(position) {
    const targetEntity = this.getGameSession().getBoard().getUnitAtPosition(position);
    if (!targetEntity) {
      Logger.module("SDK").error(`[G:${this.getGameSession().getGameId()}] Entity ${this.getLogName()} actionAttackEntityAtPosition - attempt to attack position with no entity`);
    }
    return this.actionAttack(targetEntity);
  }

  //endregion ### ACTIONS ###

  // region CACHE

  updateCachedState() {
    super.updateCachedState();

    this._private.cachedEntitiesKilledByAttackOn = null;

    // flush movement and attack range cached state
    // ideally this only needs to be done once per step
    // because movement and attack ranges ONLY affect explicit actions
    this._private.movementRange.flushCachedState();
    return this._private.attackRange.flushCachedState();
  }

  flushCachedModifiers() {
    super.flushCachedModifiers();

    this._private.cachedIsBattlePet = null;
    return this._private.cachedIsUncontrollableBattlePet = null;
  }

  // endregion CACHE

  // region ACTION STATE RECORD

  actionPropertiesForActionStateRecord() {
    const properties = super.actionPropertiesForActionStateRecord();

    // add entity specific properties to record
    properties.damage = () => { return this.getDamage();  };
    properties.hp = () => { return this.getHP();  };
    properties.maxHP = () => { return this.getMaxHP();  };
    properties.baseMaxHP = () => { return this.getBaseMaxHP();  };
    properties.atk = () => { return this.getATK();  };
    properties.baseATK = () => { return this.getBaseATK();  };

    return properties;
  }

  resolvePropertiesForActionStateRecord() {
    const properties = super.resolvePropertiesForActionStateRecord();

    // add entity specific properties to record
    properties.damage = () => { return this.getDamage();  };
    properties.hp = () => { return this.getHP();  };
    properties.maxHP = () => { return this.getMaxHP();  };
    properties.baseMaxHP = () => { return this.getBaseMaxHP();  };
    properties.atk = () => { return this.getATK();  };
    properties.baseATK = () => { return this.getBaseATK();  };

    return properties;
  }
}
Entity.initClass();

  // endregion ACTION STATE RECORD

module.exports = Entity;
