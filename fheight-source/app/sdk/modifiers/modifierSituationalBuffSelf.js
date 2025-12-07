/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const UtilsGameSession = require('app/common/utils/utils_game_session');

/*
  Abstract modifier class that checks for a specific board state (situation) and when that situation is active applies modifiers from modifiers context objects to the card this modifier is applied to.
*/
class ModifierSituationalBuffSelf extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSituationalBuffSelf";
    this.type ="ModifierSituationalBuffSelf";
  
    this.description ="Whenever %X";
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.cachedIsSituationActive = false;
    p.cachedWasSituationActive = false;

    return p;
  }

  onApplyToCardBeforeSyncState() {
    super.onApplyToCardBeforeSyncState();

    // apply situational modifiers once and retain them on self
    // this way we can enable/disable based on whether the situation is active
    // rather than constantly adding and removing modifiers
    return this.applyManagedModifiersFromModifiersContextObjectsOnce(this.modifiersContextObjects, this.getCard());
  }

  updateCachedStateAfterActive() {
    this._private.cachedWasSituationActive = this._private.cachedIsSituationActive;
    this._private.cachedIsSituationActive = this._private.cachedIsActive && this.getIsSituationActiveForCache();

    // call super after updating whether situation is active
    // because we need to know if situation is active to know whether sub modifiers are disabled
    return super.updateCachedStateAfterActive();
  }

  getAreSubModifiersActiveForCache() {
    return this._private.cachedIsSituationActive;
  }

  getIsAura() {
    // situational modifiers act as auras but do not use the default aura behavior
    return true;
  }

  getIsSituationActiveForCache() {
    // always assume not in correct situation
    // override in sub class to determine situations in which this modifier should apply modifierContextObjects
    return false;
  }
}
ModifierSituationalBuffSelf.initClass();

module.exports = ModifierSituationalBuffSelf;
