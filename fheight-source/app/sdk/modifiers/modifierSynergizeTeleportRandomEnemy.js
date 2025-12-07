/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierSynergize = require('./modifierSynergize');
const TeleportBehindUnitAction = require('app/sdk/actions/teleportBehindUnitAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierSynergizeTeleportRandomEnemy extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeTeleportRandomEnemy";
    this.type ="ModifierSynergizeTeleportRandomEnemy";
  
    this.description ="Teleport a random enemy to the space behind your General";
  
    this.prototype.canTargetGenerals = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  onSynergize(action) {
    super.onSynergize(action);

    // find target to teleport
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, CONFIG.WHOLE_BOARD_RADIUS);
      const validEntities = [];
      for (var entity of Array.from(entities)) {
        if (!entity.getIsGeneral() || this.canTargetGenerals) {
          validEntities.push(entity);
        }
      }

      // pick a random enemy from all enemies found on the board
      if (validEntities.length > 0) {
        const unitToTeleport = validEntities[this.getGameSession().getRandomIntegerForExecution(validEntities.length)];
        const teleportBehindUnitAction = new TeleportBehindUnitAction(this.getGameSession(), this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()), unitToTeleport);
        // and teleport it
        return this.getGameSession().executeAction(teleportBehindUnitAction);
      }
    }
  }
}
ModifierSynergizeTeleportRandomEnemy.initClass();

module.exports = ModifierSynergizeTeleportRandomEnemy;
