/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifierCardDrawModifier = require('app/sdk/playerModifiers/playerModifierCardDrawModifier');
const SpellDamage = require('app/sdk/spells/spellDamage');

class SpellGotatsu extends SpellDamage {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const ownerId = this.getOwnerId();
    const general = this.getGameSession().getGeneralForPlayerId(ownerId);
    return this.getGameSession().applyModifierContextObject(PlayerModifierCardDrawModifier.createContextObject(1,1), general);
  }
}

module.exports = SpellGotatsu;