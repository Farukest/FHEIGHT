/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const PlayerModifierCardDrawModifier = require('app/sdk/playerModifiers/playerModifierCardDrawModifier');

class SpellDrawCardEndOfTurn extends Spell {

  onApplyOneEffectToBoard(board,x,y,sourceAction) {

    const ownerId = this.getOwnerId();
    const general = this.getGameSession().getGeneralForPlayerId(ownerId);
    return this.getGameSession().applyModifierContextObject(PlayerModifierCardDrawModifier.createContextObject(1,1), general);
  }
}

module.exports = SpellDrawCardEndOfTurn;
