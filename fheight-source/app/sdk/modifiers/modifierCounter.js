/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

/*
  Abstract modifier class that counts something in the game.
  ex: building has (3,2,1) turns until it builds
      mechaz0r progress is (20%,40%,100%)
*/
class ModifierCounter extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierCounter";
    this.type ="ModifierCounter";
  
    this.prototype.isHiddenToUI = true;
    this.prototype.isRemovable = false;
  }

  static getDescription() {
    return this.description;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.currentCount = 0;
    p.previousCount = 0;

    return p;
  }

  onDeactivate() {
    // reset to default states when deactivated
    this._private.currentCount = (this._private.previousCount = 0);
    return this.removeManagedModifiersFromCard(this.getCard());
  }

  updateCachedStateAfterActive() {
    if (this._private.cachedIsActive) {
      this.updateCountIfNeeded();
    }
    return super.updateCachedStateAfterActive();
  }

  updateCountIfNeeded() {
    this._private.previousCount = this._private.currentCount;
    this._private.currentCount = this.getCurrentCount();
    if (this._private.currentCount !== this._private.previousCount) {
      this.removeSubModifiers();
      return this.getGameSession().applyModifierContextObject(this.getModifierContextObjectToApply(), this.getCard(), this);
    }
  }

  // operates during aura phase, but is not an aura itself

  // remove modifiers during remove aura phase
  _onRemoveAura(event) {
    super._onRemoveAura(event);
    if (this._private.cachedIsActive) {
      return this.updateCountIfNeeded();
    }
  }

  removeSubModifiers() {
    return (() => {
      const result = [];
      const iterable = this.getSubModifiers();
      for (let i = iterable.length - 1; i >= 0; i--) {
        var subMod = iterable[i];
        result.push(this.getGameSession().removeModifier(subMod));
      }
      return result;
    })();
  }

  // update count during add aura phase
  _onAddAura(event) {
    super._onAddAura(event);
    if (this._private.cachedIsActive) {
      return this.updateCountIfNeeded();
    }
  }

  getModifierContextObjectToApply() {
    // override this method to return correct context object for sub modifier to be displayed in-game
    return {};
  }

  getCurrentCount() {
    // override this method to calculate change in board state
    return 0;
  }
}
ModifierCounter.initClass();

module.exports = ModifierCounter;
