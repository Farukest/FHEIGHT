/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SDKObject = require('./object');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const Card =             require('./cards/card');
const CardType =             require('./cards/cardType');
const Entity =     require('./entities/entity');
const ApplyCardToBoardAction =     require('./actions/applyCardToBoardAction');
const _ = require('underscore');

class Board extends SDKObject {
  static initClass() {
  
    this.prototype.cardIndices = null;
    this.prototype.columnCount = CONFIG.BOARDCOL;
    this.prototype.rowCount = CONFIG.BOARDROW;
  }

  constructor(gameSession, columnCount, rowCount) {
    super(gameSession);

    // define public properties here that must be always be serialized
    // do not define properties here that should only serialize if different from the default
    this.columnCount = columnCount;
    this.rowCount = rowCount;
    this.cardIndices = [];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.units = [];
    p.tiles = [];
    p.spells = [];
    return p;
  }

  getCardIndices() {
    return this.cardIndices;
  }

  getColumnCount() {
    return this.columnCount;
  }

  getRowCount() {
    return this.rowCount;
  }

  getPositions() {
    const positions = [];
    for (let x = 0, end = this.columnCount, asc = 0 <= end; asc ? x < end : x > end; asc ? x++ : x--) {
      for (var y = 0, end1 = this.rowCount, asc1 = 0 <= end1; asc1 ? y < end1 : y > end1; asc1 ? y++ : y--) {
        positions.push({x,y});
      }
    }
    return positions;
  }

  getUnobstructedPositions() {
    const positions = [];
    for (let x = 0, end = this.columnCount, asc = 0 <= end; asc ? x < end : x > end; asc ? x++ : x--) {
      for (var y = 0, end1 = this.rowCount, asc1 = 0 <= end1; asc1 ? y < end1 : y > end1; asc1 ? y++ : y--) {
        var position = {x,y};
        if (!this.getObstructionAtPosition(position)) {
          positions.push(position);
        }
      }
    }
    return positions;
  }

  getUnobstructedPositionsForEntity(entity) {
    const positions = [];
    for (let x = 0, end = this.columnCount, asc = 0 <= end; asc ? x < end : x > end; asc ? x++ : x--) {
      for (var y = 0, end1 = this.rowCount, asc1 = 0 <= end1; asc1 ? y < end1 : y > end1; asc1 ? y++ : y--) {
        var position = {x,y};
        if (!this.getObstructionAtPositionForEntity(position, entity)) {
          positions.push(position);
        }
      }
    }
    return positions;
  }

  getUnobstructedPositionsForEntityAroundEntity(entity, aroundEntity, radius) {
    if (radius == null) { radius = 1; }
    const positions = [];
    let position = aroundEntity.getPosition();
    const positionX = position.x;
    const positionY = position.y;
    const startX = Math.max(0,positionX-radius);
    const endX = Math.min(this.columnCount-1,positionX+radius);
    const startY = Math.max(0,positionY-radius);
    const endY = Math.min(this.rowCount-1,positionY+radius);

    for (let x = startX, end = endX, asc = startX <= end; asc ? x <= end : x >= end; asc ? x++ : x--) {
      for (var y = startY, end1 = endY, asc1 = startY <= end1; asc1 ? y <= end1 : y >= end1; asc1 ? y++ : y--) {
        if ((x !== positionX) || (y !== positionY)) {
          position = {x,y};
          if (!this.getObstructionAtPositionForEntity(position, entity)) {
            positions.push(position);
          }
        }
      }
    }

    return positions;
  }

  isOnBoard(position) {
    return (position != null) && (position.x >= 0) && (position.y >= 0) && (position.x < this.columnCount) && (position.y < this.rowCount);
  }

  addCard(card) {
    if (card != null) {
      // track index of card while on board
      // so we know what cards are actually on the board
      const cardIndex = card.getIndex();
      if (!_.includes(this.cardIndices, cardIndex)) { this.cardIndices.push(cardIndex); }

      // add card to board
      const cardType = card.getType();
      if (cardType === CardType.Unit) {
        return this.addUnit(card);
      } else if (cardType === CardType.Tile) {
        return this.addTile(card);
      } else if (cardType === CardType.Spell) {
        return this.addSpell(card);
      }
    }
  }

  removeCard(card) {
    if (card != null) {
      // stop tracking index of card
      const cardIndex = card.getIndex();
      const index = _.indexOf(this.cardIndices, cardIndex);
      if (index !== -1) { this.cardIndices.splice(index, 1); }

      // remove card from board
      const cardType = card.getType();
      if (cardType === CardType.Unit) {
        return this.removeUnit(card);
      } else if (cardType === CardType.Tile) {
        return this.removeTile(card);
      } else if (cardType === CardType.Spell) {
        return this.removeSpell(card);
      }
    }
  }

  addUnit(unit) {
    const index = _.indexOf(this._private.units, unit);
    if (index === -1) {
      return this._private.units.push(unit);
    }
  }

  removeUnit(unit) {
    const index = _.indexOf(this._private.units, unit);
    if (index !== -1) {
      return this._private.units.splice(index, 1);
    }
  }

  addTile(tile) {
    const index = _.indexOf(this._private.tiles, tile);
    if (index === -1) {
      return this._private.tiles.push(tile);
    }
  }

  removeTile(tile) {
    const index = _.indexOf(this._private.tiles, tile);
    if (index !== -1) {
      return this._private.tiles.splice(index, 1);
    }
  }

  addSpell(spell) {
    const index = _.indexOf(this._private.spells, spell);
    if (index === -1) {
      return this._private.spells.push(spell);
    }
  }

  removeSpell(spell) {
    const index = _.indexOf(this._private.spells, spell);
    if (index !== -1) {
      return this._private.spells.splice(index, 1);
    }
  }

  getCards(type, allowUntargetable, allowQueued) {
    if (type != null) {
      // selective card find
      if (type === CardType.Entity) {
        return this.getEntities(allowUntargetable, allowQueued);
      } else if (type === CardType.Unit) {
        return this.getUnits(allowUntargetable, allowQueued);
      } else if (type === CardType.Tile) {
        return this.getTiles(allowUntargetable, allowQueued);
      } else if (type === CardType.Spell) {
        return this.getSpells(allowQueued);
      }
    } else {
      // all card find
      let cards = [];
      cards = cards.concat(this.getUnits(allowUntargetable, allowQueued));
      cards = cards.concat(this.getTiles(allowUntargetable, allowQueued));
      cards = cards.concat(this.getSpells(allowQueued));
      return cards;
    }
  }

  getEntities(allowUntargetable, allowQueued) {
    let cards = [];
    cards = cards.concat(this.getUnits(allowUntargetable, allowQueued));
    cards = cards.concat(this.getTiles(allowUntargetable, allowQueued));
    return cards;
  }

  getUnits(allowUntargetable, allowQueued) {
    if (allowUntargetable == null) { allowUntargetable = false; }
    if (allowQueued == null) { allowQueued = false; }
    const units = [];

    for (var unit of Array.from(this._private.units)) {
      if (unit.getIsActive() && (allowUntargetable || unit.getIsTargetable())) {
        units.push(unit);
      }
    }

    return units;
  }

  getTiles(allowUntargetable, allowQueued) {
    if (allowUntargetable == null) { allowUntargetable = false; }
    if (allowQueued == null) { allowQueued = false; }
    const tiles = [];

    for (var tile of Array.from(this._private.tiles)) {
      if (tile.getIsActive() && (allowUntargetable || tile.getIsTargetable())) {
        tiles.push(tile);
      }
    }

    return tiles;
  }

  getSpells(allowQueued) {
    if (allowQueued == null) { allowQueued = false; }
    const spells = [];

    for (var spell of Array.from(this._private.spells)) {
      if (spell.getIsActive()) {
        spells.push(spell);
      }
    }

    return spells;
  }

  getCardAtPosition(pos, type, allowUntargetable, allowQueued) {
    if (allowUntargetable == null) { allowUntargetable = false; }
    if (allowQueued == null) { allowQueued = false; }
    if (pos != null) {
      let cards;
      let numRemovalInQueue = 0;
      // get search list by type
      if ((type == null)) {
        return this.getEntityAtPosition(pos, allowUntargetable, allowQueued) || this.getSpellAtPosition(pos, allowQueued);
      } else if (type === CardType.Entity) {
        return this.getEntityAtPosition(pos, allowUntargetable, allowQueued);
      } else if (type === CardType.Unit) {
        cards = this._private.units;
        numRemovalInQueue = this.getGameSession().getRemovalActionsInQueue(pos, CardType.Unit).length;
      } else if (type === CardType.Tile) {
        cards = this._private.tiles;
        numRemovalInQueue = this.getGameSession().getRemovalActionsInQueue(pos, CardType.Tile).length;
      } else if (type === CardType.Spell) {
        cards = this._private.spells;
      }

      // get card at position
      for (var c of Array.from(cards)) {
        if (c.getIsActive() && UtilsPosition.getPositionsAreEqual(pos, c.position) && (allowUntargetable || c.getIsTargetable())) {
          // each time we find an active card on this space, count it towards the number of cards queued up to be removed
          if (numRemovalInQueue > 0) {
            numRemovalInQueue--;
          } else if (numRemovalInQueue === 0) {
            // when getting active cards, always return the first
            return c;
          }
        }
      }

      // check all cards in queue
      if (allowQueued) {
        return this.getQueuedCardAtPosition(pos, type, allowUntargetable);
      }
    }
  }

  getCardsAtPosition(pos, type, allowUntargetable, allowQueued) {
    const cards = [];
    if ((type == null)) {
      const unit = this.getUnitAtPosition(pos, allowUntargetable, allowQueued);
      if (unit != null) { cards.push(unit); }
      const tile = this.getTileAtPosition(pos, allowUntargetable, allowQueued);
      if (tile != null) { cards.push(tile); }
      const spell = this.getSpellAtPosition(pos, allowQueued);
      if (spell != null) { cards.push(spell); }
    } else {
      const card = this.getCardAtPosition(pos, type, allowUntargetable, allowQueued);
      if (card != null) { cards.push(card); }
    }
    return cards;
  }

  getEntityAtPosition(pos, allowUntargetable, allowQueued) {
    // getting an entity at a position uses a priority list instead of getting first in entity list
    return this.getUnitAtPosition(pos, allowUntargetable, allowQueued) || this.getTileAtPosition(pos, allowUntargetable, allowQueued);
  }

  getEntitiesAtPosition(pos, allowUntargetable, allowQueued) {
    const entities = [];
    const unit = this.getUnitAtPosition(pos, allowUntargetable, allowQueued);
    if (unit != null) { entities.push(unit); }
    const tile = this.getTileAtPosition(pos, allowUntargetable, allowQueued);
    if (tile != null) { entities.push(tile); }
    return entities;
  }

  getUnitAtPosition(pos, allowUntargetable, allowQueued) {
    return this.getCardAtPosition(pos, CardType.Unit, allowUntargetable, allowQueued);
  }

  getTileAtPosition(pos, allowUntargetable, allowQueued) {
    return this.getCardAtPosition(pos, CardType.Tile, allowUntargetable, allowQueued);
  }

  getSpellAtPosition(pos, allowQueued) {
    return this.getCardAtPosition(pos, CardType.Spell, allowQueued);
  }

  getObstructionAtPosition(pos, allowUntargetable, allowQueued) {
    if (allowUntargetable == null) { allowUntargetable = true; }
    if (allowQueued == null) { allowQueued = true; }
    const entityAtPosition = this.getEntityAtPosition(pos, allowUntargetable, allowQueued);
    if (entityAtPosition && entityAtPosition.getIsObstructing()) {
      return entityAtPosition;
    }
  }

  getObstructionAtPositionForEntity(pos, entity, allowUntargetable, allowQueued) {
    if (allowUntargetable == null) { allowUntargetable = true; }
    if (allowQueued == null) { allowQueued = true; }
    const entityAtPosition = this.getEntityAtPosition(pos, allowUntargetable, allowQueued);
    if (entityAtPosition && entityAtPosition.getObstructsEntity(entity)) {
      return entityAtPosition;
    }
  }

  getQueuedCardAtPosition(pos, type, allowUntargetable) {
    // there might be a card in the action queue to be played at this position
    // search the game session's action queue for all actions that may apply a card to board
    // return the first of those cards matching the target type
    if (allowUntargetable == null) { allowUntargetable = false; }
    for (var action of Array.from(this.getGameSession().getActionsOfClassInQueue(ApplyCardToBoardAction, pos))) {
      var card = action.getCard();
      if ((card != null) && (card.getType() === type) && (allowUntargetable || card.getIsTargetable())) {
        return card;
      }
    }
  }

  getValidPositionsForModifierSourceType(card, modifierSourceType) {
    const playerId = card.getOwnerId();
    // check all entities for the ModifierSource type
    const validMap = [];
    for (var entity of Array.from(this.getEntities())) {
      var modifierSource = entity.getModifierByType(modifierSourceType);
      if ((entity.getOwnerId() === playerId) && (modifierSource != null)) {
        // add only valid positions from where entity is now
        var sourceValidPositions = modifierSource.getValidPositions(card);
        for (var validPosition of Array.from(sourceValidPositions)) {
          validMap[UtilsPosition.getMapIndexFromPosition(this.columnCount, validPosition.x, validPosition.y)] = validPosition;
        }
      }
    }

    return UtilsPosition.getPositionsFromMap(validMap);
  }

  getValidSpawnPositions(card) {
    const playerId = card.getOwnerId();
    const validMap = [];
    for (var entity of Array.from(this.getUnits(true))) { // can spawn around any allied units (including untargetable allies)
      if (entity.getOwnerId() === playerId) {
        var position = entity.getPosition();
        var pattern = CONFIG.SPAWN_PATTERN_STEP;
        var validPositions = UtilsGameSession.getValidBoardPositionsFromPattern(this, position, pattern, false);
        // add own position if not obstructed
        if (!this.getObstructionAtPosition(position)) {
          validPositions.push(position);
        }

        for (var validPosition of Array.from(validPositions)) {
          validMap[UtilsPosition.getMapIndexFromPosition(this.columnCount, validPosition.x, validPosition.y)] = validPosition;
        }
      }
    }

    return UtilsPosition.getPositionsFromMap(validMap);
  }

  getCardsWithinRadiusOfPosition(position, type, radius, allowCardAtPosition, allowUntargetable, allowQueued) {

    if (radius == null) { radius = 1; }
    if (allowCardAtPosition == null) { allowCardAtPosition = true; }
    let cardsWithinRadius = [];

    if (position != null) {

      if (radius <= 0) {
        // special case: zero radius
        cardsWithinRadius = cardsWithinRadius.concat(this.getCardsAtPosition(position, type, allowUntargetable, allowQueued));
      } else {
        let x, y;
        const positionX = position.x;
        const positionY = position.y;
        const startX = Math.max(0,positionX-radius);
        const endX = Math.min(this.columnCount-1,positionX+radius);
        const startY = Math.max(0,positionY-radius);
        const endY = Math.min(this.rowCount-1,positionY+radius);

        if ((type == null) || (type === CardType.Entity)) {
          let asc, end;
          for (x = startX, end = endX, asc = startX <= end; asc ? x <= end : x >= end; asc ? x++ : x--) {
            var asc1, end1;
            for (y = startY, end1 = endY, asc1 = startY <= end1; asc1 ? y <= end1 : y >= end1; asc1 ? y++ : y--) {
              if (allowCardAtPosition || (x !== positionX) || (y !== positionY)) {
                if (type === CardType.Entity) {
                  cardsWithinRadius = cardsWithinRadius.concat(this.getEntitiesAtPosition({x,y}, allowUntargetable, allowQueued));
                } else {
                  cardsWithinRadius = cardsWithinRadius.concat(this.getCardsAtPosition({x,y}, type, allowUntargetable, allowQueued));
                }
              }
            }
          }
        } else {
          let asc2, end2;
          for (x = startX, end2 = endX, asc2 = startX <= end2; asc2 ? x <= end2 : x >= end2; asc2 ? x++ : x--) {
            var asc3, end3;
            for (y = startY, end3 = endY, asc3 = startY <= end3; asc3 ? y <= end3 : y >= end3; asc3 ? y++ : y--) {
              if (allowCardAtPosition || (x !== positionX) || (y !== positionY)) {
                cardsWithinRadius = cardsWithinRadius.concat(this.getCardsAtPosition({x,y}, type, allowUntargetable, allowQueued));
              }
            }
          }
        }
      }
    }

    return cardsWithinRadius;
  }

  getCardsOutsideRadiusOfPosition(position, type, radius, allowUntargetable, allowQueued) {

    if (radius == null) { radius = 1; }
    let cardsOutsideRadius = [];

    if (position != null) {
      const allCards = this.getCards(type, allowUntargetable, allowQueued);

      if (radius <= 0) {
        // special case: zero radius
        cardsOutsideRadius = cardsOutsideRadius.concat(allCards);
      } else {
        const positionX = position.x;
        const positionY = position.y;
        const startX = Math.max(0,positionX-radius);
        const endX = Math.min(this.columnCount-1,positionX+radius);
        const startY = Math.max(0,positionY-radius);
        const endY = Math.min(this.rowCount-1,positionY+radius);

        for (var card of Array.from(allCards)) {
          var cardPosition = card.getPosition();
          var cardPositionX = cardPosition.x;
          var cardPositionY = cardPosition.y;
          if ((cardPositionX < startX) || (cardPositionX > endX) || (cardPositionY < startY) || (cardPositionY > endY)) {
            cardsOutsideRadius.push(card);
          }
        }
      }
    }

    return cardsOutsideRadius;
  }

  getCardsAroundPosition(position, type, radius, allowUntargetable, allowQueued) {
    return this.getCardsWithinRadiusOfPosition(position, type, radius, false, allowUntargetable, allowQueued);
  }

  getCardsNotAroundPosition(position, type, radius, allowUntargetable, allowQueued) {
    return this.getCardsOutsideRadiusOfPosition(position, type, radius, allowUntargetable, allowQueued);
  }

  getCardsFromPattern(position, type, pattern, allowUntargetable, allowQueued) {
    let cards = [];
    if ((pattern == null)) { pattern = CONFIG.PATTERN_1x1; }

    for (var offset of Array.from(pattern)) {
      cards = cards.concat(this.getCardsAtPosition({x: offset.x + position.x, y: offset.y + position.y}, type, allowUntargetable, allowQueued));
    }

    return cards;
  }

  getEntitiesAroundEntity(entity, type, radius, allowUntargetable, allowQueued) {
    if (type == null) { type = CardType.Entity; }
    return this.getCardsAroundPosition(entity.getPosition(), type, radius, allowUntargetable, allowQueued);
  }

  getEntitiesNotAroundEntity(entity, type, radius, allowUntargetable, allowQueued) {
    if (type == null) { type = CardType.Entity; }
    return this.getCardsNotAroundPosition(entity.getPosition(), type, radius, allowUntargetable, allowQueued);
  }

  getEnemyEntitiesAroundEntity(entity, type, radius, allowUntargetable, allowQueued) {

    const nearbyEntities = [];
    for (var nearby of Array.from(this.getEntitiesAroundEntity(entity, type, radius, allowUntargetable, allowQueued))) {
      if (!entity.getIsSameTeamAs(nearby)) {
        nearbyEntities.push(nearby);
      }
    }

    return nearbyEntities;
  }

  getEnemyEntitiesNotAroundEntity(entity, type, radius, allowUntargetable, allowQueued) {

    const notNearbyEntities = [];
    for (var notNearby of Array.from(this.getEntitiesNotAroundEntity(entity, type, radius, allowUntargetable, allowQueued))) {
      if (!entity.getIsSameTeamAs(notNearby)) {
        notNearbyEntities.push(notNearby);
      }
    }

    return notNearbyEntities;
  }

  getFriendlyEntitiesAroundEntity(entity, type, radius, allowUntargetable, allowQueued) {

    const nearbyEntities = [];
    for (var nearby of Array.from(this.getEntitiesAroundEntity(entity, type, radius, allowUntargetable, allowQueued))) {
      if (entity.getIsSameTeamAs(nearby)) {
        nearbyEntities.push(nearby);
      }
    }

    return nearbyEntities;
  }

  getFriendlyEntitiesNotAroundEntity(entity, type, radius, allowUntargetable, allowQueued) {

    const notNearbyEntities = [];
    for (var notNearby of Array.from(this.getEntitiesNotAroundEntity(entity, type, radius, allowUntargetable, allowQueued))) {
      if (entity.getIsSameTeamAs(notNearby)) {
        notNearbyEntities.push(notNearby);
      }
    }

    return notNearbyEntities;
  }

  getEnemyEntitiesForEntity(entity, type, allowUntargetable, allowQueued) {

    if (type == null) { type = CardType.Entity; }
    const enemyEntities = [];
    const entities = this.getCards(type, allowUntargetable, allowQueued);
    for (var otherEntity of Array.from(entities)) {
      if ((otherEntity !== entity) && !entity.getIsSameTeamAs(otherEntity)) {
        enemyEntities.push(otherEntity);
      }
    }

    return enemyEntities;
  }

  getFriendlyEntitiesForEntity(entity, type, allowUntargetable, allowQueued) {

    if (type == null) { type = CardType.Entity; }
    const friendlyEntities = [];
    const entities = this.getCards(type, allowUntargetable, allowQueued);
    for (var otherEntity of Array.from(entities)) {
      if ((otherEntity !== entity) && entity.getIsSameTeamAs(otherEntity)) {
        friendlyEntities.push(otherEntity);
      }
    }

    return friendlyEntities;
  }


  getEntitiesInColumn(col, type, allowUntargetable, allowQueued) {

    if (type == null) { type = CardType.Entity; }
    const entitiesInCol = [];
    const entities = this.getCards(type, allowUntargetable, allowQueued);

    for (var entity of Array.from(entities)) {
      if (entity.getPosition().x === col) {
        entitiesInCol.push(entity);
      }
    }

    return entitiesInCol;
  }


  getEntitiesInRow(row, type, allowUntargetable, allowQueued) {

    if (type == null) { type = CardType.Entity; }
    const entitiesInRow = [];
    const entities = this.getCards(type, allowUntargetable, allowQueued);

    for (var entity of Array.from(entities)) {
      if (entity.getPosition().y === row) {
        entitiesInRow.push(entity);
      }
    }

    return entitiesInRow;
  }

  getEntitiesInfrontOf(entity, type, allowUntargetable, allowQueued) {

    if (type == null) { type = CardType.Entity; }
    const entitiesInfront = [];
    const entities = this.getCards(type, allowUntargetable, allowQueued);
    const row = entity.getPosition().y;

    for (var otherEntity of Array.from(entities)) {
      var otherPosition = otherEntity.getPosition();
      if ((otherPosition.y === row) && this.getIsPositionInfrontOfEntity(entity, otherPosition)) {
        entitiesInfront.push(otherEntity);
      }
    }

    return entitiesInfront;
  }

  getFriendlyEntitiesInfrontOfEntity(entity, type, allowUntargetable, allowQueued) {

    const friendsInfront = [];
    const entitiesInfront = this.getEntitiesInfrontOf(entity, type, allowUntargetable, allowQueued);

    for (var otherEntity of Array.from(entitiesInfront)) {
      if (otherEntity.getIsSameTeamAs(entity)) { friendsInfront.push(otherEntity); }
    }

    return friendsInfront;
  }

  getEnemyEntitiesInfrontOfEntity(entity, type, allowUntargetable, allowQueued) {

    const enemiesInfront = [];
    const entitiesInfront = this.getEntitiesInfrontOf(entity, type, allowUntargetable, allowQueued);

    for (var otherEntity of Array.from(entitiesInfront)) {
      if (!otherEntity.getIsSameTeamAs(entity)) { enemiesInfront.push(otherEntity); }
    }

    return enemiesInfront;
  }

  getIsPositionInfrontOfEntity(entity, targetPosition, maxDistanceX, maxDistanceY) {
    if (maxDistanceX == null) { maxDistanceX = CONFIG.INFINITY; }
    if (maxDistanceY == null) { maxDistanceY = CONFIG.INFINITY; }
    const position = entity.getPosition();
    const deltaX = targetPosition.x - position.x;
    const deltaY = targetPosition.y - position.y;
    return (Math.abs(deltaX) <= maxDistanceX) && (Math.abs(deltaY) <= maxDistanceY) && ((entity.isOwnedByPlayer1() && (deltaX > 0)) || (entity.isOwnedByPlayer2() && (deltaX < 0)));
  }

  getIsPositionBehindEntity(entity, targetPosition, maxDistanceX, maxDistanceY) {
    if (maxDistanceX == null) { maxDistanceX = CONFIG.INFINITY; }
    if (maxDistanceY == null) { maxDistanceY = CONFIG.INFINITY; }
    const position = entity.getPosition();
    const deltaX = targetPosition.x - position.x;
    const deltaY = targetPosition.y - position.y;
    return (Math.abs(deltaX) <= maxDistanceX) && (Math.abs(deltaY) <= maxDistanceY) && ((entity.isOwnedByPlayer1() && (deltaX < 0)) || (entity.isOwnedByPlayer2() && (deltaX > 0)));
  }

  getEntitiesOnCardinalAxisFromEntityToPosition(entity, targetPosition, type, allowUntargetable, allowQueued) {

    let otherEntity, otherPosition;
    if (type == null) { type = CardType.Entity; }
    const entitiesOnAxis = [];
    const position = entity.getPosition();
    const {
      x
    } = position;
    const {
      y
    } = position;
    const targetCol = targetPosition.x;
    const targetRow = targetPosition.y;
    if (x === targetCol) {
      // along same column
      const north = (targetRow - y) > 0;
      for (otherEntity of Array.from(this.getCards(type, allowUntargetable, allowQueued))) {
        otherPosition = otherEntity.getPosition();
        if ((otherPosition.x === targetCol) && ((north && (otherPosition.y > y)) || (!north && (otherPosition.y < y)))) {
          entitiesOnAxis.push(otherEntity);
        }
      }
    } else if (y === targetRow) {
      // along same row
      const east = (targetCol - x) > 0;
      for (otherEntity of Array.from(this.getCards(type, allowUntargetable, allowQueued))) {
        otherPosition = otherEntity.getPosition();
        if ((otherPosition.y === targetRow) && ((east && (otherPosition.x > x)) || (!east && (otherPosition.x < x)))) {
          entitiesOnAxis.push(otherEntity);
        }
      }
    }

    return entitiesOnAxis;
  }

  getFriendlyEntitiesOnCardinalAxisFromEntityToPosition(entity, targetPosition, type, allowUntargetable, allowQueued) {

    const friendsOnAxis = [];

    for (var otherEntity of Array.from(this.getEntitiesOnCardinalAxisFromEntityToPosition(entity, targetPosition, type, allowUntargetable, allowQueued))) {
      if (otherEntity.getIsSameTeamAs(entity)) { friendsOnAxis.push(otherEntity); }
    }

    return friendsOnAxis;
  }

  getEnemyEntitiesOnCardinalAxisFromEntityToPosition(entity, targetPosition, type, allowUntargetable, allowQueued) {

    const enemiesOnAxis = [];

    for (var otherEntity of Array.from(this.getEntitiesOnCardinalAxisFromEntityToPosition(entity, targetPosition, type, allowUntargetable, allowQueued))) {
      if (!otherEntity.getIsSameTeamAs(entity)) { enemiesOnAxis.push(otherEntity); }
    }

    return enemiesOnAxis;
  }

  getEntitiesOnEntityStartingSide(entity, type, allowUntargetable, allowQueued) {

    if (type == null) { type = CardType.Entity; }
    const entities = [];
    const allCards = this.getCards(type, allowUntargetable, allowQueued);

    let sideStartX = 0;
    let sideEndX = CONFIG.BOARDCOL;
    if (entity.isOwnedByPlayer1()) {
      sideEndX = Math.floor(((sideEndX - sideStartX) * 0.5) - 1);
    } else if (entity.isOwnedByPlayer2()) {
      sideStartX = Math.floor(((sideEndX - sideStartX) * 0.5) + 1);
    }

    for (var card of Array.from(allCards)) {
      var cardPosition = card.getPosition();
      var cardPositionX = cardPosition.x;
      if ((cardPositionX >= sideStartX) && (cardPositionX <= sideEndX)) {
        entities.push(card);
      }
    }

    return entities;
  }

  getFriendlyEntitiesOnEntityStartingSide(entity, type, allowUntargetable, allowQueued) {
    const entities = [];

    for (var otherEntity of Array.from(this.getEntitiesOnEntityStartingSide(entity, type, allowUntargetable, allowQueued))) {
      if (entity.getIsSameTeamAs(otherEntity)) { entities.push(otherEntity); }
    }

    return entities;
  }

  getEnemyEntitiesOnEntityStartingSide(entity, type, allowUntargetable, allowQueued) {
    const entities = [];

    for (var otherEntity of Array.from(this.getEntitiesOnEntityStartingSide(entity, type, allowUntargetable, allowQueued))) {
      if (!entity.getIsSameTeamAs(otherEntity)) { entities.push(otherEntity); }
    }

    return entities;
  }
}
Board.initClass();


module.exports = Board;
