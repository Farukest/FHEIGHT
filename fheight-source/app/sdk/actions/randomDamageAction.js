/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const DamageAction = require('./damageAction');
const CardType =       require('app/sdk/cards/cardType');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');

class RandomDamageAction extends DamageAction {
  static initClass() {
  
    this.type = "RandomDamageAction";
  
    this.prototype.canTargetGenerals = false;
  }

  constructor() {
    super(...arguments);
    this.type = RandomDamageAction.type;
  }

  _modifyForExecution() {
    super._modifyForExecution();

    // find target to damage
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getSource(), CardType.Unit, CONFIG.WHOLE_BOARD_RADIUS);
      const validEntities = [];
      for (var entity of Array.from(entities)) {
        if (!entity.getIsGeneral() || this.canTargetGenerals) {
          validEntities.push(entity);
        }
      }

      if (validEntities.length > 0) {
        const unitToDamage = validEntities[this.getGameSession().getRandomIntegerForExecution(validEntities.length)];
        return this.setTarget(unitToDamage);
      }
    }
  }
}
RandomDamageAction.initClass();

module.exports = RandomDamageAction;
