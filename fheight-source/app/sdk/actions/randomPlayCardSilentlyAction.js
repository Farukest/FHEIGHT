/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const PlayCardSilentlyAction = require('./playCardSilentlyAction');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');

class RandomPlayCardSilentlyAction extends PlayCardSilentlyAction {
  static initClass() {
  
    this.type = "RandomPlayCardSilentlyAction";
    this.prototype.spawnPattern = null;
    this.prototype.patternSourceIndex = null; // center the spawn pattern around a specific entity, or the whole board
    this.prototype.patternSourcePosition = null;
     // center the spawn pattern around a specific position, or the whole board
  }

  constructor(gameSession, ownerId, cardDataOrIndex, cardOwnedByGamesession) {
    super(gameSession, ownerId, -1, -1, cardDataOrIndex, cardOwnedByGamesession);
    if (this.type == null) { this.type = RandomPlayCardSilentlyAction.type; }
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.patternSource = null;

    return p;
  }

  getSpawnPattern() {
    return this.spawnPattern;
  }

  setSpawnPattern(spawnPattern) {
    return this.spawnPattern = spawnPattern;
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

    // find location to spawn
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let spawnLocations;
      const card = this.getCard();
      const sourcePosition = this.getSourcePosition();
      if ((card != null) && (sourcePosition != null)) {
        if (!this.getSpawnPattern()) { // if no spawn pattern defined, use whole board
          // pick a random spawn location
          spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, CONFIG.ALL_BOARD_POSITIONS, card, card, 1);
        } else { // pick target position from spawn pattern
          let patternSourcePosition;
          const patternSource = this.getPatternSource();
          if (patternSource != null) { // around pattern source entity
            patternSourcePosition = patternSource.getPosition();
          } else { // around pattern source position
            patternSourcePosition = this.getPatternSourcePosition();
          }

          if (patternSourcePosition != null) {
            spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), patternSourcePosition, this.getSpawnPattern(), card, card, 1);
          } else { // use whole board
            spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, this.getSpawnPattern(), card, card, 1);
          }
        }
      }

      if ((spawnLocations != null) && (spawnLocations.length > 0)) {
        const position = spawnLocations[0];
        return this.setTargetPosition(position);
      } else {
        // nowhere to spawn, set target position to an invalid location
        return this.setTargetPosition({x: -1, y: -1});
      }
    }
  }
}
RandomPlayCardSilentlyAction.initClass();

module.exports = RandomPlayCardSilentlyAction;
