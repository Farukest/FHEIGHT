/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const TeleportAction = require('./teleportAction');
const CardType =       require('app/sdk/cards/cardType');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');

class RandomTeleportAction extends TeleportAction {
  static initClass() {
  
    this.type = "RandomTeleportAction";
    this.prototype.teleportPattern = null;
    this.prototype.patternSourceIndex = null; // center the teleport pattern around a specific entity, or the whole board
    this.prototype.patternSourcePosition = null;
     // center the teleport pattern around a specific position, or the whole board
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = RandomTeleportAction.type; }
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.patternSource = null;

    return p;
  }

  getTeleportPattern() {
    return this.teleportPattern;
  }

  setTeleportPattern(teleportPattern) {
    return this.teleportPattern = teleportPattern;
  }

  getPatternSource() {
    if ((this._private.patternSource == null) && (this.patternSourceIndex != null)) {
      this._private.patternSource = this.getGameSession().getCardByIndex(this.patternSourceIndex);
    }
    return this._private.patternSource;
  }

  setPatternSource(patternSource) {
    return this.patternSourceIndex = patternSource.getIndex();
  }

  getPatternSourcePosition() {
    return this.patternSourcePosition;
  }

  setPatternSourcePosition(patternSourcePosition) {
    return this.patternSourcePosition = patternSourcePosition;
  }

  _modifyForExecution() {
    super._modifyForExecution();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const source = this.getSource();
      if (source != null) {
        let moveLocations;
        if (!this.getTeleportPattern()) { // if no teleport pattern defined, use whole board
          // pick a random "spawn" location - locations that units can spawn are also valid target position for teleporting this unit
          moveLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, CONFIG.ALL_BOARD_POSITIONS, source, source, 1);
        } else { // pick target position from teleport pattern
          let patternSourcePosition;
          const patternSource = this.getPatternSource();
          if (patternSource != null) { // around pattern source entity
            patternSourcePosition = patternSource.getPosition();
          } else { // around pattern source position
            patternSourcePosition = this.getPatternSourcePosition();
          }

          if (patternSourcePosition != null) {
            moveLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), patternSourcePosition, this.getTeleportPattern(), source, source, 1);
          } else { // use whole board
            moveLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, this.getTeleportPattern(), source, source, 1);
          }
        }

        if (moveLocations.length > 0) {
          const position = moveLocations[0];
          return this.setTargetPosition(position);
        } else {
          return this.setTargetPosition(this.getSourcePosition());
        }
      }
    }
  }
}
RandomTeleportAction.initClass();

module.exports = RandomTeleportAction;
