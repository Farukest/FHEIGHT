/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

/*
  Abstract modifier class that checks for a change in count of specific board state and stacks a count of sub modifiers based on that board state
  ex: has +1/+1 for each Shadow Creep tile on the board
      costs 1 less for each Battle Pet on the board
*/
class ModifierDynamicCountModifySelf extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDynamicCountModifySelf";
    this.type ="ModifierDynamicCountModifySelf";
  
    this.description ="Change stats based on count of something on board";
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
      this._private.previousCount = this._private.currentCount;
      this._private.currentCount = this.getCurrentCount();
    }
    return super.updateCachedStateAfterActive();
  }

  // operates during aura phase, but is not an aura itself

  // remove modifiers during remove aura phase
  _onRemoveAura(event) {
    super._onRemoveAura(event);
    if (this._private.cachedIsActive) {
      const countChange = this._private.currentCount - this._private.previousCount;
      if (countChange < 0) {
        return this.removeSubModifiers(Math.abs(countChange));
      }
    }
  }

  removeSubModifiers(numModifiers) {
    const subMods = this.getSubModifiers();
    let removeCount = 0;
    if (subMods.length < numModifiers) {
      removeCount = subMods.length;
    } else {
      removeCount = numModifiers;
    }
    if (removeCount > 0) {
      return (() => {
        const result = [];
        for (let i = subMods.length - 1; i >= 0; i--) {
          var subMod = subMods[i];
          this.getGameSession().removeModifier(subMod);
          removeCount--;
          if (removeCount === 0) {
            break;
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  // add modifiers during add modifier phase
  _onAddAura(event) {
    super._onAddAura(event);
    if (this._private.cachedIsActive) {
      const countChange = this._private.currentCount - this._private.previousCount;
      if (countChange > 0) {
        return this.addSubModifiers(countChange);
      }
    }
  }

  addSubModifiers(numModifiers) {
    return __range__(0, numModifiers-1, true).map((i) =>
      this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard()));
  }

  getCurrentCount() {
    // override this method to calculate change in board state
    return 0;
  }
}
ModifierDynamicCountModifySelf.initClass();

module.exports = ModifierDynamicCountModifySelf;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}