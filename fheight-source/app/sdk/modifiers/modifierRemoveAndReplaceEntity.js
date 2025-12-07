/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const GameSession = require('app/sdk/gameSession');
const i18next = require('i18next');

class ModifierRemoveAndReplaceEntity extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierRemoveAndReplaceEntity";
    this.type ="ModifierRemoveAndReplaceEntity";
  
    this.prototype.maxStacks = 1;
  
    this.modifierName = "";
    this.description = "";
    this.isHiddenToUI = false;
    this.prototype.isRemovable = false;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  static createContextObject(cardDataOrIndexToSpawn, originalCardId) {
    if (originalCardId == null) { originalCardId = undefined; }
    const contextObject = super.createContextObject();
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.originalCardId = originalCardId;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject && modifierContextObject.originalCardId) {
      const cardName = GameSession.getCardCaches().getCardById(modifierContextObject.originalCardId).getName();
      return i18next.t("modifiers.temp_transformed",{unit_name: cardName});
    }
  }

  onExpire() {
    super.onExpire();
    return this.removeAndReplace();
  }

  removeAndReplace() {
    this.remove();
    return this.replace();
  }

  remove() {
    const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
    removeOriginalEntityAction.setOwnerId(this.getCard().getOwnerId());
    removeOriginalEntityAction.setTarget(this.getCard());
    return this.getGameSession().executeAction(removeOriginalEntityAction);
  }

  replace() {
    const spawnEntityAction = new PlayCardAsTransformAction(this.getCard().getGameSession(), this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, this.cardDataOrIndexToSpawn);
    return this.getGameSession().executeAction(spawnEntityAction);
  }
}
ModifierRemoveAndReplaceEntity.initClass();

module.exports = ModifierRemoveAndReplaceEntity;
