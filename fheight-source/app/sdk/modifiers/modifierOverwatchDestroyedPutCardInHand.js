/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CardType = require('../cards/cardType');
const ModifierOverwatchDestroyed = require('./modifierOverwatchDestroyed');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierOverwatchDestroyedPutCardInHand extends ModifierOverwatchDestroyed {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchDestroyedPutCardInHand";
    this.type ="ModifierOverwatchDestroyedPutCardInHand";
  }

  onOverwatch(action) {
    const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), {id: this.getCard().getId()});
    return this.getGameSession().executeAction(a);
  }
}
ModifierOverwatchDestroyedPutCardInHand.initClass();

module.exports = ModifierOverwatchDestroyedPutCardInHand;
