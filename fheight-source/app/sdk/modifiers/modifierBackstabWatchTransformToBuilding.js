/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBackstabWatch = require('./modifierBackstabWatch');
const ModifierBuilding = require('./modifierBuilding');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const RemoveAction = require('app/sdk/actions/removeAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');

class ModifierBackstabWatchTransformToBuilding extends ModifierBackstabWatch {
  static initClass() {
  
    this.prototype.type ="ModifierBackstabWatchTransformToBuilding";
    this.type ="ModifierBackstabWatchTransformToBuilding";
  
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.buildModifierDescription = null;
  }

  static createContextObject(buildingToSpawn, buildModifierDescription, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = buildingToSpawn;
    contextObject.buildModifierDescription = buildModifierDescription;
    return contextObject;
  }

  onBackstabWatch(action) {
    // create the action to spawn the new entity before the existing entity is removed
    // because we may need information about the existing entity being replaced
    if (this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
    this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierBuilding.createContextObject(this.buildModifierDescription, {id: Cards.Faction2.Penumbraxx}, 1));
    const spawnAction = new PlayCardAsTransformAction(this.getGameSession(), this.getCard().getOwnerId(), this.getCard().getPositionX(), this.getCard().getPositionY(), this.cardDataOrIndexToSpawn);

    // remove the existing entity
    const removingEntity = this.getGameSession().getBoard().getCardAtPosition(this.getCard().getPosition(), CardType.Unit);
    if (removingEntity != null) {
      const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
      removeOriginalEntityAction.setOwnerId(this.getCard().getOwnerId());
      removeOriginalEntityAction.setTarget(removingEntity);
      this.getGameSession().executeAction(removeOriginalEntityAction);
    }

    // spawn the new entity
    if (spawnAction != null) {
      return this.getGameSession().executeAction(spawnAction);
    }
  }
}
ModifierBackstabWatchTransformToBuilding.initClass();

module.exports = ModifierBackstabWatchTransformToBuilding;
