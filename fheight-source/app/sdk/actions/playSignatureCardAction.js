/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Logger =     require('app/common/logger');
const PlayCardAction =     require('./playCardAction');

class PlaySignatureCardAction extends PlayCardAction {
  static initClass() {
  
    this.type ="PlaySignatureCardAction";
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = PlaySignatureCardAction.type; }
  }

  getManaCost() {
    const card = this.getCard();
    if (card != null) { return card.getManaCost(); } else { return super.getManaCost(); }
  }

  _execute() {
    super._execute();

    const owner = __guard__(this.getCard(), x => x.getOwner());
    if (owner != null) {
      // set signature card as inactive
      owner.setIsSignatureCardActive(false);

      // generate new signature card
      return this.getGameSession().executeAction(owner.actionGenerateSignatureCard());
    }
  }
}
PlaySignatureCardAction.initClass();

module.exports = PlaySignatureCardAction;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}