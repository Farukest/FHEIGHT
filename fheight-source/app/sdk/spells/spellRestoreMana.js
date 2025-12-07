/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const RestoreManaAction =  require('app/sdk/actions/restoreManaAction');

class SpellRestoreMana extends Spell {
  static initClass() {
  
    this.prototype.restoreManaAmount = 0;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const restoreManaAction = new RestoreManaAction(this.getGameSession());
    restoreManaAction.setManaAmount(this.restoreManaAmount);
    return this.getGameSession().executeAction(restoreManaAction);
  }
}
SpellRestoreMana.initClass();

module.exports = SpellRestoreMana;
