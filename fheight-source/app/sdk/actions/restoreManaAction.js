/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');
const CONFIG = require('app/common/config');

class RestoreManaAction extends Action {
  static initClass() {
  
    // restore spent mana to owner of this action
  
    this.type ="RestoreManaAction";
  
    this.prototype.restoreManaAmount = 0;
  }

  constructor(gameSession) {
    super(gameSession);
    this.type = RestoreManaAction.type;
  }

  setManaAmount(manaToRestore) {
    return this.restoreManaAmount = manaToRestore;
  }

  _execute() {
    super._execute();

    const owner = this.getOwner();
    if (owner != null) {
      if (owner.getRemainingMana() < owner.getMaximumMana()) {
        if ((owner.getRemainingMana() + this.restoreManaAmount) <= owner.getMaximumMana()) {
          return owner.remainingMana += this.restoreManaAmount;
        } else {
          return owner.remainingMana = owner.getMaximumMana();
        }
      }
    }
  }
}
RestoreManaAction.initClass();

module.exports = RestoreManaAction;
