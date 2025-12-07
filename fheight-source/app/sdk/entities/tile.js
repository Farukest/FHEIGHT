/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Entity = require('./entity');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

class Tile extends Entity {
  static initClass() {
  
    this.prototype.type = CardType.Tile;
    this.type = CardType.Tile;
    this.prototype.name = "Tile";
  
    this.prototype.hp = 0;
    this.prototype.maxHP = 0;
    this.prototype.manaCost = 0;
    this.prototype.isTargetable = false;
    this.prototype.isObstructing = false;
    this.prototype.depleted = false;
    this.prototype.dieOnDepleted = true; // whether tile dies once used up
    this.prototype.obstructsOtherTiles = false;
    this.prototype.canBeDispelled = true;
  
    this.prototype.cleanse = this.prototype.silence;
    this.prototype.dispel = this.prototype.silence;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.occupant = null; // current entity occupying tile
    p.occupantChangingAction = null; // action that caused current unit to occupy tile

    return p;
  }

  getCanBeAppliedAnywhere() {
    return true;
  }

  silence() {
    if (this.canBeDispelled) {
      // silence/cleanse/dispel kills tiles
      return this.getGameSession().executeAction(this.actionDie());
    }
  }

  // region OCCUPANT

  setOccupant(occupant) {
    if (this._private.occupant !== occupant) {
      this._private.occupant = occupant;
      return this._private.occupantChangingAction = this.getGameSession().getExecutingAction();
    }
  }

  getOccupant() {
    return this._private.occupant;
  }

  getOccupantChangingAction() {
    return this._private.occupantChangingAction;
  }

  setDepleted(depleted) {
    this.depleted = depleted;
    if (this.depleted && this.getDieOnDepleted()) {
      return this.getGameSession().executeAction(this.actionDie());
    }
  }

  getDepleted() {
    return this.depleted;
  }

  getDieOnDepleted(){
    return this.dieOnDepleted;
  }

  // endregion OCCUPANT

  getObstructsOtherTiles() {
    return this.obstructsOtherTiles;
  }
}
Tile.initClass();

module.exports = Tile;
