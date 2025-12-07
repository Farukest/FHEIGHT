/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('app/sdk/spells/spellApplyModifiers');
const PlayCardAction = require('app/sdk/actions/playCardAction');

class SpellApplyModifiersSummonTile extends SpellApplyModifiers {
  static initClass() {
  
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};

    // always spawn a tile at position
    if (board.isOnBoard(applyEffectPosition)) {
      const action = new PlayCardAction(this.getGameSession(), this.getOwnerId(), x, y, this.cardDataOrIndexToSpawn);
      action.setOwnerId(this.getOwnerId());
      return this.getGameSession().executeAction(action);
    }
  }
}
SpellApplyModifiersSummonTile.initClass();


module.exports = SpellApplyModifiersSummonTile;