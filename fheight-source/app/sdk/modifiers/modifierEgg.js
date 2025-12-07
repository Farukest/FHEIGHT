/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierRemoveAndReplaceEntity = require('./modifierRemoveAndReplaceEntity');
const ModifierSpawnedFromEgg = require('app/sdk/modifiers/modifierSpawnedFromEgg');
const _ = require('underscore');
const GameSession = require('app/sdk/gameSession');

const i18next = require('i18next');

class ModifierEgg extends ModifierRemoveAndReplaceEntity {
  static initClass() {
  
    this.prototype.type ="ModifierEgg";
    this.type ="ModifierEgg";
  
    this.modifierName = "";
    this.isHiddenToUI = false;
    this.prototype.isRemovable = true;
    this.prototype.isInherent = true; // eggs should show description in card text
  
    this.prototype.maxStacks = 1;
  
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.durationEndTurn = 2; // eggs placed on owner's turn take 2 turns to hatch (until end of enemy's next turn)
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEgg"];
  }

  static createContextObject(cardDataOrIndexToSpawn) {
    const contextObject = super.createContextObject(cardDataOrIndexToSpawn);
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const cardName = GameSession.getCardCaches().getCardById(modifierContextObject.cardDataOrIndexToSpawn.id).getName();
      return i18next.t("modifiers.egg_text",{unit_name: cardName});
    }
  }

  onActivate() {
    super.onActivate();

    // reset turns elapsed and duration when activating due to changed location
    // ex: played from hand to board
    if (!this._private.cachedWasActiveInLocation && this._private.cachedIsActiveInLocation) {
      this.setNumEndTurnsElapsed(0);
      return this.updateDurationForOwner();
    }
  }

  onApplyToCardBeforeSyncState() {
    super.onApplyToCardBeforeSyncState();
    this.getCard().setReferencedCardData(this.cardDataOrIndexToSpawn);
    return this.updateDurationForOwner();
  }

  onChangeOwner(fromOwnerId, toOwnerId) {
    super.onChangeOwner(fromOwnerId, toOwnerId);

    return this.updateDurationForOwner();
  }

  updateDurationForOwner() {
    if (!this.getCard().isOwnersTurn()) {
      // eggs placed during enemy turn will hatch at the end of that turn
      return this.durationEndTurn = this.numEndTurnsElapsed + 1;
    } else {
      // eggs placed during owner's turn will hatch at end of enemy's next turn
      return this.durationEndTurn = this.numEndTurnsElapsed + 2;
    }
  }

  replace() {
    if ((this.cardDataOrIndexToSpawn != null) && !_.isObject(this.cardDataOrIndexToSpawn)) { this.cardDataOrIndexToSpawn = this.getGameSession().getCardByIndex(this.cardDataOrIndexToSpawn).createNewCardData(); }
    if (this.cardDataOrIndexToSpawn.additionalModifiersContextObjects == null) { this.cardDataOrIndexToSpawn.additionalModifiersContextObjects = []; }
    this.cardDataOrIndexToSpawn.additionalModifiersContextObjects.push(ModifierSpawnedFromEgg.createContextObject());
    return super.replace();
  }
}
ModifierEgg.initClass();

module.exports = ModifierEgg;
