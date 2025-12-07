/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS202: Simplify dynamic range loops
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const UtilsPosition = require('app/common/utils/utils_position');
const Range = require('./range');
const _ = require('underscore');

var AttackRange = (function() {
  let AttackAtlas = undefined;
  let AttackMap = undefined;
  let AttackNode = undefined;
  AttackRange = class AttackRange extends Range {
    static initClass() {
  
      this.prototype._attackAtlasesByIndex = null;
      this.prototype._targetsTestedForValidByIndex = null;
  
      // collections of attack maps for a entity and any number of potential attack positions
      AttackAtlas = class AttackAtlas {
        static initClass() {
          this.prototype.board = null;
          this.prototype.entity = null;
          this.prototype.positions = null;
          this.prototype.validNodes = null;
          this.prototype.validNodesByPosition = null;
          this.prototype.maps = null;
        }
  
        constructor(board, entity, positions) {
          let map;
          this.board = board;
          this.entity = entity;
          this.positions = positions;
  
          this.validNodes = [];
          this.validNodesByPosition = {};
          this.maps = [];
  
          const rowCount = board.getRowCount();
          const columnCount = board.getColumnCount();
          const bufferSize = rowCount * columnCount * Uint8Array.BYTES_PER_ELEMENT;
          const buffer = new ArrayBuffer(bufferSize);
          const bufferInterface = new Uint8Array(buffer);
  
          if (!this.entity.getAttackNeedsLOS() && this.getReachesEntireMap()) {
            // create a single map when entity reach runs from map edge to edge
            map = new AttackMap(this, this.entity.getPosition());
            this.maps.push(map);
          } else {
            // create a map for each position and do not allow duplicates
            for (var position of Array.from(positions)) {
              var mapIndex = UtilsPosition.getMapIndexFromPosition(columnCount, position.x, position.y);
              if (bufferInterface[mapIndex] !== 1) {
                bufferInterface[mapIndex] = 1;
                map = new AttackMap(this, position);
                this.maps.push(map);
              }
            }
          }
  
          // build all lines of sight
          if (this.entity.getAttackNeedsLOS()) {
            this.buildLinesOfSight();
          }
        }
  
        buildLinesOfSight() {
          this.validNodes = [];
          this.validNodesByPosition = {};
          return Array.from(this.maps).map((map) =>
            map.buildLinesOfSight());
        }
  
        hasLineOfSight(x, y) {
          if ((this._losByIndex == null)) { this._losByIndex = {}; }
          const index = UtilsPosition.getMapIndexFromPosition(this.board.getColumnCount(), x, y);
          const result = this._losByIndex[index];
          if (result != null) {
            return result;
          } else {
            for (var map of Array.from(this.maps)) {
              if (map.hasLineOfSight(x, y)) {
                return this._losByIndex[index] = true;
              }
            }
  
            return this._losByIndex[index] = false;
          }
        }
  
        getReachesEntireMap() {
          // check entity attack pattern for full board range
          const {
            board
          } = this;
          const entityPosition = this.entity.getPosition();
          const attackPattern = this.entity.getAttackPattern();
          const columnCount = board.getColumnCount();
          const rowCount = board.getRowCount();
          let minRangeX = columnCount;
          let maxRangeX = 0;
          let minRangeY = rowCount;
          let maxRangeY = 0;
          const testPosition = {x: 0, y: 0};
          for (var attackOffset of Array.from(attackPattern)) {
            testPosition.x = entityPosition.x + attackOffset.x;
            testPosition.y = entityPosition.y + attackOffset.y;
            if (board.isOnBoard(testPosition)) {
              // get attack range
              if (testPosition.x < minRangeX) { minRangeX = testPosition.x; }
              if (testPosition.x > maxRangeX) { maxRangeX = testPosition.x; }
              if (testPosition.y < minRangeY) { minRangeY = testPosition.y; }
              if (testPosition.y > maxRangeY) { maxRangeY = testPosition.y; }
            }
          }
  
          // range runs from edge to edge
          if ((minRangeX === 0) && (minRangeY === 0) && (maxRangeX === (columnCount - 1)) && (maxRangeY === (rowCount - 1))) {
            return true;
          }
  
          return false;
        }
  
        getValidPositions() {
          return this.validNodes.slice(0);
        }
  
        getValidTargets() {
          if ((this._validTargetEntities == null)) {
            // search board for valid target entities
            const validTargetEntities = (this._validTargetEntities = []);
            for (var validNode of Array.from(this.validNodes)) {
              for (var targetEntity of Array.from(validNode.entities)) {
                // this really gets all POTENTIAL valid targets for attack
                // attacks may still be invalidated on action validation step (common example: provoke)
                if (targetEntity && targetEntity.getIsActive() && targetEntity.getIsTargetable() && !targetEntity.getIsSameTeamAs(this.entity)) {
                  validTargetEntities.push(targetEntity);
                }
              }
            }
          }
  
          return this._validTargetEntities;
        }
      };
      AttackAtlas.initClass();
  
      // internal map of locations that a entity can attack from a given position
      AttackMap = class AttackMap {
        static initClass() {
          this.prototype.atlas = null;
          this.prototype.position = null;
          this.prototype.nodes = null;
          this.prototype._minRangeX = 0;
          this.prototype._minRangeY = 0;
          this.prototype._maxRangeX = 0;
          this.prototype._maxRangeY = 0;
        }
  
        constructor(atlas, position) {
          let node, row, x, y;
          this.atlas = atlas;
          this.position = position;
          this.nodes = {};
  
          const board = this.getBoard();
          const columnCount = board.getColumnCount();
          const rowCount = board.getRowCount();
          const entity = this.getEntity();
  
          // add entity node
          const entityNode = new AttackNode(this, this.position.x, this.position.y);
          this.nodes[UtilsPosition.getMapIndexFromPosition(columnCount, this.position.x, this.position.y)] = entityNode;
          // when entity does not need line of sight, any nodes in pattern are valid
          if (!entity.getAttackNeedsLOS()) {
            row = this.atlas.validNodesByPosition[this.position.y] || (this.atlas.validNodesByPosition[this.position.y] = {});
            if ((row[this.position.x] == null)) {
              row[this.position.x] = entityNode;
              this.atlas.validNodes.push(entityNode);
            }
          }
  
          // reset attack range
          this._minRangeX = columnCount;
          this._maxRangeX = 0;
          this._minRangeY = rowCount;
          this._maxRangeY = 0;
  
          // setup base nodes and range based on attack pattern
          const attackPattern = entity.getAttackPattern();
          for (var attackOffset of Array.from(attackPattern)) {
            x = this.position.x + attackOffset.x;
            y = this.position.y + attackOffset.y;
            if (board.isOnBoard({x, y})) {
              // get attack range
              if (x < this._minRangeX) { this._minRangeX = x; }
              if (x > this._maxRangeX) { this._maxRangeX = x; }
              if (y < this._minRangeY) { this._minRangeY = y; }
              if (y > this._maxRangeY) { this._maxRangeY = y; }
  
              // add pattern nodes
              node = new AttackNode(this, x, y);
              this.nodes[UtilsPosition.getMapIndexFromPosition(columnCount, x, y)] = node;
  
              // when entity does not need line of sight, any nodes in pattern are valid
              // add node to atlas's valid nodes, unless there is already a valid node at the location
              if (!entity.getAttackNeedsLOS() && ((this.position.x !== x) || (this.position.y !== y))) {
                row = this.atlas.validNodesByPosition[y] || (this.atlas.validNodesByPosition[y] = {});
                if ((row[x] == null)) {
                  row[x] = node;
                  this.atlas.validNodes.push(node);
                }
              }
            }
          }
  
          // assign all enemy board entities to nodes if within range
          const entities = board.getEntities();
          for (var otherEntity of Array.from(entities)) {
            ({
              x
            } = otherEntity.position);
            ({
              y
            } = otherEntity.position);
            if (otherEntity.getIsActive() && otherEntity.getIsTargetable() && !entity.getIsSameTeamAs(otherEntity) && this.getIsWithinRange(x, y)) {
              var entityNodeIndex = UtilsPosition.getMapIndexFromPosition(columnCount, x, y);
              node = this.nodes[entityNodeIndex];
              // create new nodes to record entities, for obstruction
              if ((node == null)) {
                node = (this.nodes[entityNodeIndex] = new AttackNode(this, x, y));
                node.withinPattern = false;
              }
              node.entities.push(otherEntity);
            }
          }
        }
  
        buildLinesOfSight() {
          let asc, end, start;
          let node, x, y;
          const board = this.getBoard();
          const columnCount = board.getColumnCount();
          const entity = this.getEntity();
          const atlasValidNodes = this.atlas.validNodes;
          const atlasValidNodesByPosition = this.atlas.validNodesByPosition;
  
          // origin is always safe
          const fromPosition = this.position;
          const fromNode = this.getNodeAt(fromPosition.x, fromPosition.y);
  
          // fill in map based on attack range
          // this ensures we'll step to all nodes even if they aren't connected to each other
          for (start = this._minRangeX + 1, x = start, end = this._maxRangeX, asc = start <= end; asc ? x < end : x > end; asc ? x++ : x--) {
            var asc1, end1, start1;
            for (start1 = this._minRangeY + 1, y = start1, end1 = this._maxRangeY, asc1 = start1 <= end1; asc1 ? y < end1 : y > end1; asc1 ? y++ : y--) {
              var fillIndex = UtilsPosition.getMapIndexFromPosition(columnCount, x, y);
              node = this.nodes[fillIndex];
              if ((node == null)) {
                node = (this.nodes[fillIndex] = new AttackNode(this, x, y));
                node.withinPattern = false;
              }
            }
          }
  
          // outward ring steps
          const step = [
            {x: -1, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 0},
            {x: 0, y: -1}
          ];
  
          let nodesToProcess = [fromNode];
          let nodesToProcessNext = [];
  
          while (true) {
            node = nodesToProcess.shift();
            for (var offset of Array.from(step)) {
              // get node at test location
              var nextNode = this.getNodeAt(node.x + offset.x, node.y + offset.y);
  
              // test but don't retest
              if (!nextNode || nextNode.tested) {
                continue;
              }
              nextNode.testNodeVisibility(fromNode);
  
              // record valid nodes
              if (nextNode.withinPattern && nextNode.visible && ((this.position.x !== nextNode.x) || (this.position.y !== nextNode.y))) {
                // add node to atlas's valid nodes, unless there is already a valid node at the location
                var row = atlasValidNodesByPosition[nextNode.y] || (atlasValidNodesByPosition[nextNode.y] = {});
                if ((row[nextNode.x] == null)) {
                  row[nextNode.x] = nextNode;
                  atlasValidNodes.push(nextNode);
                }
              }
  
              nodesToProcessNext.push(nextNode);
            }
  
            if (nodesToProcess.length === 0) {
              if (nodesToProcessNext.length > 0) {
                nodesToProcess = nodesToProcessNext;
                nodesToProcessNext = [];
              } else {
                return;
              }
            }
          }
        }
  
        hasLineOfSight(x, y) {
          const attackNode = this.getNodeAt(x, y);
          return (attackNode != null) && attackNode.visible && attackNode.withinPattern;
        }
  
        getIsWithinRange(x, y) {
          return (x >= this._minRangeX) && (x <= this._maxRangeX) && (y >= this._minRangeY) && (y <= this._maxRangeY);
        }
  
        getNodeAt(x, y) {
          const board = this.getBoard();
          if (board.isOnBoard({x, y})) {
            return this.nodes[UtilsPosition.getMapIndexFromPosition(board.getColumnCount(), x, y)];
          }
        }
  
        getEntity() {
          return this.atlas.entity;
        }
  
        getBoard() {
          return this.atlas.board;
        }
      };
      AttackMap.initClass();
  
      AttackNode = (function() {
        AttackNode = class AttackNode {
          static initClass() {
    
            this.prototype.map = null;
            this.prototype.entities = null;
            this.prototype.x = 0;
            this.prototype.y = 0;
            this.prototype.visible = true;
            this.prototype.tested = false;
            this.prototype.withinPattern = true;
            this.prototype._diagonalMinThreshold = 30.0 * (Math.PI / 180.0);
            this.prototype._diagonalMaxThreshold = 60.0 * (Math.PI / 180.0);
          }
  
          constructor(map, x, y) {
            this.entities = [];
            this.map = map;
            this.x = x;
            this.y = y;
          }
  
          testNodeVisibility(atNode) {
            this.tested = true;
  
            let dx = atNode.x - this.x;
            let dy = atNode.y - this.y;
            // check adjacent nodes towards origin
            if ((dx !== 0) && (dy !== 0)) {
              // threshold diagonal check
              const angle = Math.abs(Math.atan2(dy, dx)) % (Math.PI * 0.5);
              if ((angle <= this._diagonalMaxThreshold) && (angle >= this._diagonalMinThreshold)) {
                let sx, sy;
                if (dx > 0) { sx = 1; } else { sx = -1; }
                if (dy > 0) { sy = 1; } else { sy = -1; }
                return this.visible = this.isAdjacentNodeVisibleForEntity(sx, sy) && (this.isAdjacentNodeVisibleForEntity(sx, 0) || this.isAdjacentNodeVisibleForEntity(0, sy));
              }
  
              // force ignore of one direction for test
              if (angle > this._diagonalMaxThreshold) { dy = 0; } else { dx = 0; }
            }
  
            if (dx !== 0) {
              if (dx > 0) {
                return this.visible = this.isAdjacentNodeVisibleForEntity(1, 0);
              } else {
                return this.visible = this.isAdjacentNodeVisibleForEntity(-1, 0);
              }
            }
  
            if (dy !== 0) {
              if (dy > 0) {
                return this.visible = this.isAdjacentNodeVisibleForEntity(0, 1);
              } else {
                return this.visible = this.isAdjacentNodeVisibleForEntity(0, -1);
              }
            }
          }
  
          isAdjacentNodeVisibleForEntity(offsetX, offsetY) {
            const adjacentNode = this.map.getNodeAt(this.x + offsetX, this.y + offsetY);
            if (adjacentNode != null) {
              // check visibility
              if (!adjacentNode.visible) {
                return false;
              }
  
              // check blocking entities
              for (var entity of Array.from(adjacentNode.entities)) {
                if (!this.map.atlas.entity.getIsSameTeamAs(entity) && entity.getIsObstructing()) {
                  return false;
                }
              }
  
              return true;
            } else {
              return false;
            }
          }
        };
        AttackNode.initClass();
        return AttackNode;
      })();
    }

    flushCachedState() {
      super.flushCachedState();
      this._attackAtlasesByIndex = null;
      return this._targetsTestedForValidByIndex = null;
    }

    //Returns list of tile grid positions where attacks are valid (excluding locations with friendly targets)
    getValidPositions( board, entity, fromPositions) {
      const attackAtlas = this.getAttackAtlas(board, entity, fromPositions);
      return attackAtlas.getValidPositions();
    }

    getValidPosition(board, entity, position, attackAtlas) {
      if (board.isOnBoard(position)) {
        // if we've already tested this position, return previous result
        const columnCount = board.getColumnCount();
        const index = UtilsPosition.getMapIndexFromPosition(columnCount, position.x, position.y);
        if ((this._positionsTestedForValidByIndex == null)) { this._positionsTestedForValidByIndex = {}; }
        const isValid = this._positionsTestedForValidByIndex[index];
        if (isValid != null) {
          if (isValid) { return position; }
        } else {
          if (entity.getAttackNeedsLOS()) {
            if ((attackAtlas == null)) {
              attackAtlas = this.getAttackAtlas(board, entity);
            }

            if (attackAtlas.hasLineOfSight(position.x, position.y)) {
              // valid position found
              this._positionsTestedForValidByIndex[index] = true;
              return position;
            }
          } else {
            const entityPosition = entity.getPosition();
            const attackPatternMap = entity.getAttackPatternMap();
            const attackPatternPosition = {x: position.x - entityPosition.x, y: position.y - entityPosition.y};

            if (this.getIsPositionInPatternMap(board, attackPatternMap, attackPatternPosition)) {
              // valid position found
              this._positionsTestedForValidByIndex[index] = true;
              return position;
            } else {
              // no valid position found
              this._positionsTestedForValidByIndex[index] = false;
            }
          }
        }
      }

      return null;
    }

    getValidTargets(board, entity, fromPositions) {
      const attackAtlas = this.getAttackAtlas(board, entity, fromPositions);
      return attackAtlas.getValidTargets();
    }

    getIsValidTarget(board, entity, targetEntity) {
      const index = targetEntity.getIndex();
      if ((this._targetsTestedForValidByIndex == null)) { this._targetsTestedForValidByIndex = {}; }
      const isValid = this._targetsTestedForValidByIndex[index];
      if (isValid != null) {
        return isValid;
      } else {
        let needle;
        return this._targetsTestedForValidByIndex[index] = (needle = targetEntity, Array.from(this.getValidTargets(board, entity)).includes(needle));
      }
    }

    getAttackAtlas(board, entity, fromPositions) {
      if ((this._attackAtlasesByIndex == null)) { this._attackAtlasesByIndex = {}; }
      // ensure from positions is an array
      if ((fromPositions == null)) {
        fromPositions = [entity.getPosition()];
      } else if (!_.isArray(fromPositions)) {
        fromPositions = [fromPositions];
      }

      // calculate valid from positions and index of atlas based on positions
      // ideally, we'd sort the indices and then merge but the positions are unlikely to change order
      const validFromPositions = [];
      let index = "m";
      const columnCount = board.getColumnCount();
      for (var position of Array.from(fromPositions)) {
        if (board.isOnBoard(position)) {
          index += "_" + UtilsPosition.getMapIndexFromPosition(columnCount, position.x, position.y);
          validFromPositions.push(position);
        }
      }

      const attackAtlas = this._attackAtlasesByIndex[index];
      if (attackAtlas != null) {
        // use existing atlas
        return attackAtlas;
      } else {
        // create new atlas and cache
        return this._attackAtlasesByIndex[index] = new AttackAtlas(board, entity, validFromPositions);
      }
    }
  };
  AttackRange.initClass();
  return AttackRange;
})();

module.exports = AttackRange;
