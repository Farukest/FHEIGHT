/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOverwatch = require('./modifierOverwatch');
const ModifierSentinelHidden = require('./modifierSentinelHidden');
const CardType = require('app/sdk/cards/cardType');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const RemoveAction = require('app/sdk/actions/removeAction');

const i18next = require('i18next');

class ModifierSentinel extends ModifierOverwatch {
  static initClass() {
  
    this.prototype.type ="ModifierSentinel";
    this.type ="ModifierSentinel";
  
    this.isKeyworded = true;
    this.keywordDefinition =i18next.t("modifiers.sentinel_def");
  
    this.modifierName =i18next.t("modifiers.sentinel_name");
    this.description = null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
    this.prototype.isRemovable = false;
    this.prototype.transformCardData = null;
    this.prototype.maxStacks = 1;
  
    this.prototype.hideAsModifierType = ModifierSentinelHidden.type;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSentinel"];
  }

  static createContextObject(description, transformCardData, options) {
    const contextObject = super.createContextObject(description, options);
    contextObject.transformCardData = transformCardData;
    return contextObject;
  }

  onOverwatch(action) {
    return this.transformSelf(); // sentinels transform when overwatch triggers
  }
    // override me in sub classes to implement special behavior for when overwatch is triggered

  transformSelf() {
    // create the action to spawn the new entity before the existing entity is removed
    // because we may need information about the existing entity being replaced
    const spawnAction = new PlayCardAsTransformAction(this.getGameSession(), this.getCard().getOwnerId(), this.getCard().getPositionX(), this.getCard().getPositionY(), this.transformCardData);

    // remove the existing entity
    const removingEntity = this.getGameSession().getBoard().getCardAtPosition(this.getCard().getPosition(), CardType.Unit);
    if (removingEntity != null) {
      const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
      removeOriginalEntityAction.setOwnerId(this.getCard().getOwnerId());
      removeOriginalEntityAction.setTarget(removingEntity);
      removeOriginalEntityAction.setIsDepthFirst(true);
      this.getGameSession().executeAction(removeOriginalEntityAction);
    }

    // spawn the new entity
    if (spawnAction != null) {
      spawnAction.setIsDepthFirst(true);
      this.getGameSession().executeAction(spawnAction);
      return spawnAction.getTarget();
    }
  }

  getRevealedCardData(){
    return this.transformCardData;
  }
}
ModifierSentinel.initClass();

module.exports = ModifierSentinel;
