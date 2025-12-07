/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType =  require('./spellFilterType');
const _ = require('underscore');

class SpellOverload extends Spell {
  static initClass() {
  
    this.prototype.spellFilterType = SpellFilterType.NeutralIndirect;
  }

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    // draw card for caster
    let player = this.getGameSession().getPlayerById(this.getOwnerId());
    let action = player.getDeck().actionDrawCard();
    this.getGameSession().executeAction(action);

    // draw card for opponent of caster
    player = this.getGameSession().getOpponentPlayerOfPlayerId(this.getOwnerId());
    action = player.getDeck().actionDrawCard();
    return this.getGameSession().executeAction(action);
  }
}
SpellOverload.initClass();

module.exports = SpellOverload;
