/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('./action');

class RemoveManaCoreAction extends Action {
  static initClass() {
  
    // Removes a mana core
  
    this.type ="RemoveManaCoreAction";
  
    this.prototype.manaAmount = 0;
  }

  constructor(gameSession, manaAmount) {
    super(gameSession);
    if (manaAmount == null) { manaAmount = 0; }
    this.type = RemoveManaCoreAction.type;
    this.manaAmount = manaAmount;
  }

  _execute() {
    super._execute();

    const owner = this.getOwner();
    if (owner != null) {
      return (() => {
        const result = [];
        for (let i = 0, end = this.manaAmount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          if (owner.getMaximumMana() > 0) {
            result.push(owner.maximumMana--);
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
  
  getManaAmount() {
    return this.manaAmount;
  }

  setManaAmount(manaAmount) {
    return this.manaAmount = Math.max(manaAmount, 0);
  }
}
RemoveManaCoreAction.initClass();

module.exports = RemoveManaCoreAction;
