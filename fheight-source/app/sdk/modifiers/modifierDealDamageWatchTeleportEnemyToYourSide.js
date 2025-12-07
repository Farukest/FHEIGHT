/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const RandomTeleportAction = require('app/sdk/actions/randomTeleportAction');
const CONFIG = require('app/common/config');
const _ = require('underscore');

class ModifierDealDamageWatchTeleportEnemyToYourSide extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchTeleportEnemyToYourSide";
    this.type ="ModifierDealDamageWatchTeleportEnemyToYourSide";
  
    this.modifierName ="Deal Damage Teleport Enemy";
    this.description ="Whenever this minion deals damage to an enemy, teleport it to your starting side of the battlefield";
  }

  onDealDamage(action) {

    const enemy = action.getTarget();
    if (enemy.getOwnerId() !== this.getCard().getOwnerId()) {

      const randomTeleportAction = new RandomTeleportAction(this.getGameSession());
      randomTeleportAction.setOwnerId(this.getCard().getOwnerId());
      randomTeleportAction.setSource(enemy);
      if (enemy.isOwnedByPlayer1()) { // if owned by player 1, we want to teleport onto player 2s side
        randomTeleportAction.setPatternSourcePosition({x: Math.ceil(CONFIG.BOARDCOL * 0.5), y:0});
      } else if (enemy.isOwnedByPlayer2()) { // if owned by player 2, we want to teleport onto player 1s side
        randomTeleportAction.setPatternSourcePosition({x:0, y:0});
      }
      randomTeleportAction.setTeleportPattern(CONFIG.PATTERN_HALF_BOARD);
      randomTeleportAction.setFXResource(_.union(randomTeleportAction.getFXResource(), this.getFXResource()));
      return this.getGameSession().executeAction(randomTeleportAction);
    }
  }
}
ModifierDealDamageWatchTeleportEnemyToYourSide.initClass();

module.exports = ModifierDealDamageWatchTeleportEnemyToYourSide;
