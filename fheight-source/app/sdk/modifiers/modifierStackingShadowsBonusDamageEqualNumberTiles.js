/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStackingShadowsBonusDamage = require('./modifierStackingShadowsBonusDamage');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');

class ModifierStackingShadowsBonusDamageEqualNumberTiles extends ModifierStackingShadowsBonusDamage {
  static initClass() {
  
    this.prototype.type ="ModifierStackingShadowsBonusDamageEqualNumberTiles";
    this.type ="ModifierStackingShadowsBonusDamageEqualNumberTiles";
  
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  }

  static createContextObject() {
    const contextObject = super.createContextObject(0,1);
    return contextObject;
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
    let allowUntargetable;
    let shadowTileCount = 0;
    for (var card of Array.from(this.getGameSession().getBoard().getCards(CardType.Tile, (allowUntargetable=true)))) {
      if ((card.getBaseCardId() === Cards.Tile.Shadow) && card.isOwnedBy(this.getCard().getOwner())) {
        shadowTileCount++;
      }
    }
    return shadowTileCount;
  }

  getFlatBonusDamage() {
    const numTiles = this.getCurrentCount();
    if (numTiles > 0) {
      return numTiles - 1;
    }
    return 0;
  }
}
ModifierStackingShadowsBonusDamageEqualNumberTiles.initClass();

module.exports = ModifierStackingShadowsBonusDamageEqualNumberTiles;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}