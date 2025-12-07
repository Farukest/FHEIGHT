/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierDyingWish = require('./modifierDyingWish');
const ModifierSilence = require('./modifierSilence');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

class ModifierDyingWishDispelNearestEnemy extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishDispelNearestEnemy";
    this.type ="ModifierDyingWishDispelNearestEnemy";
  
    this.description ="Dispel the nearest enemy minion";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish"];
  }

  onDyingWish(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let bestAbsoluteDistance = 9999;
      let potentialTargets = [];
      for (var potentialTarget of Array.from(this.getGameSession().getBoard().getEnemyEntitiesForEntity(this.getCard(), CardType.Unit))) {
        if (!potentialTarget.getIsGeneral() && potentialTarget.getIsActive()) { // don't target Generals or inactive cards for dispel
          var absoluteDistance = Math.abs(this.getCard().position.x - potentialTarget.position.x) + Math.abs(this.getCard().position.y - potentialTarget.position.y);
          // found a new best target
          if (absoluteDistance < bestAbsoluteDistance) {
            bestAbsoluteDistance = absoluteDistance;
            potentialTargets = []; // reset potential targets
            potentialTargets.push(potentialTarget);
            //found an equally good target
          } else if (absoluteDistance === bestAbsoluteDistance) {
            potentialTargets.push(potentialTarget);
          }
        }
      }

      if (potentialTargets.length > 0) {
        // choose randomly between all equally close enemy minions and dispel one
        const target = potentialTargets[this.getGameSession().getRandomIntegerForExecution(potentialTargets.length)];
        return this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), target);
      }
    }
  }
}
ModifierDyingWishDispelNearestEnemy.initClass();


module.exports = ModifierDyingWishDispelNearestEnemy;
