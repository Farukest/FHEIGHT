/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell =             require('./spell');
const IntentType =           require('app/sdk/intentType');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const SwapUnitAllegianceAction =     require('app/sdk/actions/swapUnitAllegianceAction');

class SpellThoughtExchange extends Spell {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const entity = board.getUnitAtPosition(applyEffectPosition);
    const surroundingEnemies = board.getEnemyEntitiesAroundEntity(entity, this.targetType);
    const attackThreshold = entity.getATK();
    const a = new SwapUnitAllegianceAction(this.getGameSession());
    a.setTarget(entity);
    this.getGameSession().executeAction(a);

    if (surroundingEnemies.length > 0) {
      return (() => {
        const result = [];
        for (var enemy of Array.from(surroundingEnemies)) {
          if ((enemy.getATK() < attackThreshold) && !enemy.getIsGeneral()) {
            var swapAction = new SwapUnitAllegianceAction(this.getGameSession());
            swapAction.setTarget(enemy);
            result.push(this.getGameSession().executeAction(swapAction));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
SpellThoughtExchange.initClass();


module.exports = SpellThoughtExchange;
