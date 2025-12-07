/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsPosition = require('app/common/utils/utils_position');

class Range {
  static initClass() {
  
    // shared pool of patterns and maps by distance
    // if the range sub class's pattern step changes, override "getPatternByDistance" and "getPatternMapByDistance"
    this.patternsByDistance = {};
    this.patternMapsByDistance = {};
  
    // the pattern step used to auto generate the final range pattern
    // think of it like a stamp that fills out the final pattern until it reaches the max distance
  
    // cached valid positions
    this.prototype._validPositions = null;
    this.prototype._positionsTestedForValidByIndex = null;
  }

  constructor(gameSession) {
    this._gameSession = gameSession;
  }

  getGameSession() {
    return this._gameSession;
  }

  // flushed out any cached state so that the next call to use it will regenerate
  flushCachedState() {
    this._validPositions = null;
    return this._positionsTestedForValidByIndex = null;
  }

  getValidPositions(board, entity) {
    if ((this._validPositions == null)) {
      const entityPosition = entity.getPosition();
      const pattern = entity.getPattern();

      const validPositions = (this._validPositions = []);

      for (var node of Array.from(pattern)) {
        var testPosition = {x: entityPosition.x + node.x, y: entityPosition.y + node.y};
        if (board.isOnBoard( testPosition ) && !((entityPosition.x === testPosition.x) && (entityPosition.y === testPosition.y))) {
          var entityAtTarget = board.getCardAtPosition( testPosition, entity.getType() );
          if (!entityAtTarget) {
            validPositions.push( testPosition );
          }
        }
      }
    }

    return this._validPositions;
  }

  getIsPositionValid(board, entity, position) {
    return (this.getValidPosition(board, entity, position) != null);
  }

  getValidPosition(board, entity, position) {
    if (board.isOnBoard(position)) {
      // if we've already tested this position, return previous result
      const index = UtilsPosition.getMapIndexFromPosition(board.getColumnCount(), position.x, position.y);
      if ((this._positionsTestedForValidByIndex == null)) { this._positionsTestedForValidByIndex = {}; }
      const isValid = this._positionsTestedForValidByIndex[index];
      if (isValid != null) {
        if (isValid) { return position; }
      } else {
        const pattern = this.getValidPositions(board,entity);
        for (var patternPosition of Array.from(pattern)) {
          if ((patternPosition.x === position.x) && (patternPosition.y === position.y)) {
            // position is valid
            this._positionsTestedForValidByIndex[index] = true;
            return position;
          }
        }

        // position is not valid
        this._positionsTestedForValidByIndex[index] = false;
      }
    }
    return null;
  }

  getIsPositionInPatternMap(board, patternMap, position) {
    const rowCount = board.getRowCount();
    const columnCount = board.getColumnCount();
    const mapX = position.x + (columnCount - 1);
    const mapY = position.y + (rowCount - 1);
    if ((mapX >= 0) && (mapX < ((columnCount * 2) - 1)) && (mapY >= 0) && (mapY < ((rowCount * 2) - 1))) {
      return (patternMap[mapX][mapY] != null);
    }
  }

  getPatternByDistance(board, distance) {
    let pattern = Range.patternsByDistance[distance];
    if ((pattern == null)) {
      Range._generateAndCachePatternAndMap(board, distance, CONFIG.RANGE_PATTERN_STEP, Range.patternsByDistance, Range.patternMapsByDistance);
      pattern = Range.patternsByDistance[distance];
    }
    return pattern;
  }

  getPatternMapByDistance(board, distance) {
    let patternMap = Range.patternMapsByDistance[distance];
    if ((patternMap == null)) {
      Range._generateAndCachePatternAndMap(board, distance, CONFIG.RANGE_PATTERN_STEP, Range.patternsByDistance, Range.patternMapsByDistance);
      patternMap = Range.patternMapsByDistance[distance];
    }
    return patternMap;
  }

  getPatternMapFromPattern(board, pattern) {
    const rowCount = board.getRowCount();
    const rowCount2 = (rowCount * 2) - 1;
    const rowOffset = rowCount - 1;
    const columnCount = board.getColumnCount();
    const columnCount2 = (columnCount * 2) - 1;
    const columnOffset = columnCount - 1;
    const patternMap = [];
    for (let i = 0, end = columnCount2, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      patternMap[i] = [];
      patternMap[i].length = rowCount2;
    }

    for (var node of Array.from(pattern)) {
      var mapX = node.x + columnOffset;
      var mapY = node.y + rowOffset;
      if ((mapX >= 0) && (mapX < columnCount2) && (mapY >= 0) && (mapY < rowCount2) && (patternMap[mapX][mapY] == null)) {
        patternMap[mapX][mapY] = node;
      }
    }

    return patternMap;
  }

  static _generateAndCachePatternAndMap(board, distance, step, patternCache, patternMapCache) {
    const originNode = {x: 0, y: 0};
    const rowCount = board.getRowCount();
    const rowCount2 = (rowCount * 2) - 1;
    const rowOffset = rowCount - 1;
    const columnCount = board.getColumnCount();
    const columnCount2 = (columnCount * 2) - 1;
    const columnOffset = columnCount - 1;
    const pattern = (patternCache[distance] = []);
    const patternMap = (patternMapCache[distance] = []);
    for (let i = 0, end = columnCount2, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      patternMap[i] = [];
      patternMap[i].length = rowCount2;
    }
    patternMap[columnOffset][rowOffset] = originNode;
    let nodesToProcess = [originNode];
    let nodesToProcessNext = [];
    let currentDistance = 1;

    return (() => {
      const result = [];
      while (nodesToProcess.length > 0) {
        var node = nodesToProcess.shift();
        for (var offset of Array.from(step)) {
          var nextNodeX = node.x + offset.x;
          var nextNodeY = node.y + offset.y;
          var nextNode = {x: nextNodeX, y: nextNodeY};

          // node must be within distance and not a duplicate
          if (currentDistance <= distance) {
            var mapX = nextNodeX + columnOffset;
            var mapY = nextNodeY + rowOffset;
            if ((mapX >= 0) && (mapX < columnCount2) && (mapY >= 0) && (mapY < rowCount2) && (patternMap[mapX][mapY] == null)) {
              patternMap[mapX][mapY] = nextNode;
              pattern.push(nextNode);
              nodesToProcessNext.push(nextNode);
            }
          }
        }

        if (nodesToProcess.length === 0) {
          currentDistance++;
          if (nodesToProcessNext.length > 0) {
            nodesToProcess = nodesToProcessNext;
            result.push(nodesToProcessNext = []);
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
}
Range.initClass();

module.exports = Range;
