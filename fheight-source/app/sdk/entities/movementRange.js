/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsPosition = require('app/common/utils/utils_position');
const Range = require('./range');
const ModifierFlying = require('app/sdk/modifiers/modifierFlying');

var MovementRange = (function() {
  let _MoveNode = undefined;
  MovementRange = class MovementRange extends Range {
    static initClass() {
  
      // movement has a different pattern step than the default
      // so movement range needs a separate cache for patterns
      this.patternsByDistance = {};
      this.patternMapsByDistance = {};
  
      this.prototype._pathsToPositionsByIndex = null;
  
      _MoveNode = class _MoveNode {
        constructor(_position, parent) {
          this._position = _position;
          this.pathTo = (parent != null) ? parent.pathTo.slice() : [];
          this.pathTo.push(this._position);
        }
      };
    }

    flushCachedState() {
      super.flushCachedState();
      return this._pathsToPositionsByIndex = null;
    }

    getValidPositions(board, entity) {
      if ((this._validPositions == null)) {
        const entityPosition = entity.getPosition();
        const entityMovementPatternMap = entity.getMovementPatternMap();
        const speed = entity.getSpeed();
        const step = CONFIG.MOVE_PATTERN_STEP;

        const validPositions = (this._validPositions = []);

        const rowCount = board.getRowCount();
        const columnCount = board.getColumnCount();
        const bufferSize = rowCount * columnCount * Uint8Array.BYTES_PER_ELEMENT;
        const buffer = new ArrayBuffer(bufferSize);
        const bufferInterface = new Uint8Array(buffer);

        const originNode = {x: 0, y: 0, speed: 0};
        const nodesToProcess = [originNode];

        // breadth first traversal so we always find the shortest path
        // but never allow paths longer than entity's speed
        while (nodesToProcess.length > 0) {
          var node = nodesToProcess.shift();
          for (var offset of Array.from(step)) {
            // calculate distance and current speed required to get to this node
            var distance = Math.sqrt((offset.x * offset.x) + (offset.y * offset.y));
            var nextSpeed = node.speed + distance;
            // skip this node if it is too far away
            if (nextSpeed > speed) {
              continue;
            }

            var nextNode = {x: node.x + offset.x, y: node.y + offset.y, speed: nextSpeed};
            var movePosition = {x: entityPosition.x + nextNode.x, y: entityPosition.y + nextNode.y};
            var index = UtilsPosition.getMapIndexFromPosition(columnCount, movePosition.x, movePosition.y);
            // skip this node if we already have a shorter path to this position
            // or if the node is off the board or not within pattern
            if ((bufferInterface[index] === 1) || !board.isOnBoard(movePosition) || !this.getIsPositionInPatternMap(board, entityMovementPatternMap, nextNode)) {
              continue;
            }

            // mark position as tested
            bufferInterface[index] = 1;

            var obstructionAtPosition = board.getObstructionAtPositionForEntity(movePosition, entity);

            // valid node to path through if unoccupied, occupant is same team, or moving entity is flying
            if (!obstructionAtPosition || entity.getIsSameTeamAs(obstructionAtPosition) || entity.hasActiveModifierClass(ModifierFlying)) {
              nextNode.parent = node;
              nodesToProcess.push(nextNode);
            }

            // valid node to move to only if nothing is there
            if (!obstructionAtPosition) {
              var path = [movePosition];
              var {
                parent
              } = nextNode;
              while (parent != null) {
                path.unshift({x: entityPosition.x + parent.x, y: entityPosition.y + parent.y});
                ({
                  parent
                } = parent);
              }
              validPositions.push(path);
            }
          }
        }
      }

      return this._validPositions;
    }

    getPathTo(board, entity, position) {
      if (board.isOnBoard(position)) {
        // if we've already tested this position, return previous result
        const index = UtilsPosition.getMapIndexFromPosition(board.getColumnCount(), position.x, position.y);
        if ((this._pathsToPositionsByIndex == null)) { this._pathsToPositionsByIndex = {}; }
        let path = this._pathsToPositionsByIndex[index];
        if (path != null) {
          return path;
        } else {
          const moves = this.getValidPositions(board,entity);
          for (path of Array.from(moves)) {
            var realEnd = path[path.length - 1];
            if ((realEnd.x === position.x) && (realEnd.y === position.y)) {
              // valid path found
              return this._pathsToPositionsByIndex[index] = path;
            }
          }

          // no valid path found
          this._pathsToPositionsByIndex[index] = [];
        }
      }
      return [];
    }

    getValidPosition(board, entity, position) {
      if (this.getPathTo(board, entity, position).length > 0) {
        return position;
      }
      return null;
    }

    getPatternByDistance(board, distance) {
      let pattern = MovementRange.patternsByDistance[distance];
      if ((pattern == null)) {
        Range._generateAndCachePatternAndMap(board, distance, CONFIG.MOVE_PATTERN_STEP, MovementRange.patternsByDistance, MovementRange.patternMapsByDistance);
        pattern = MovementRange.patternsByDistance[distance];
      }
      return pattern;
    }

    getPatternMapByDistance(board, distance) {
      let patternMap = MovementRange.patternMapsByDistance[distance];
      if ((patternMap == null)) {
        Range._generateAndCachePatternAndMap(board, distance, CONFIG.MOVE_PATTERN_STEP, MovementRange.patternsByDistance, MovementRange.patternMapsByDistance);
        patternMap = MovementRange.patternMapsByDistance[distance];
      }
      return patternMap;
    }
  };
  MovementRange.initClass();
  return MovementRange;
})();

module.exports = MovementRange;
