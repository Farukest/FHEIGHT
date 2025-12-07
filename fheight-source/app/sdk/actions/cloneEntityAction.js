/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger =     require('app/common/logger');
const PlayCardSilentlyAction =     require('./playCardSilentlyAction');

/*
Clone an entity on the board silently.
*/

class CloneEntityAction extends PlayCardSilentlyAction {
  static initClass() {
  
    this.type ="CloneEntityAction";
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = CloneEntityAction.type; }
  }

  getCard() {
    if ((this._private.cachedCard == null)) {
      if (this.getGameSession().getIsRunningAsAuthoritative()) {
        // get source entity and create clone card data from it
        // this way when card is created it'll be an exact copy of the source
        const source = this.getSource();
        if (source != null) {
          this.cardDataOrIndex = source.createCloneCardData();
        }
      }

      // create the card
      super.getCard();
    }

    return this._private.cachedCard;
  }
}
CloneEntityAction.initClass();

module.exports = CloneEntityAction;
