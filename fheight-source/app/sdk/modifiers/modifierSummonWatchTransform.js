/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatch = require('./modifierSummonWatch');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const ModifierTransformed = require('app/sdk/modifiers/modifierTransformed');

class ModifierSummonWatchTransform extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchTransform";
    this.type ="ModifierSummonWatchTransform";
  
    this.prototype.cardDataOrIndexToSpawn = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch"];
  }

  static createContextObject(cardDataOrIndexToSpawn, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    return contextObject;
  }

  onSummonWatch(action) {
    super.onSummonWatch(action);
    const entity = action.getTarget();
    if ((entity != null) && (this.cardDataOrIndexToSpawn != null) && this.getIsValidTransformPosition(entity.getPosition())) {

      const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
      removeOriginalEntityAction.setOwnerId(this.getCard().getOwnerId());
      removeOriginalEntityAction.setTarget(entity);
      this.getGameSession().executeAction(removeOriginalEntityAction);

      if (this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
      this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierTransformed.createContextObject(entity.getExhausted(), entity.getMovesMade(), entity.getAttacksMade()));
      const spawnEntityAction = new PlayCardAsTransformAction(this.getCard().getGameSession(), this.getCard().getOwnerId(), entity.getPosition().x, entity.getPosition().y, this.cardDataOrIndexToSpawn);
      return this.getGameSession().executeAction(spawnEntityAction);
    }
  }

  getIsValidTransformPosition(summonedUnitPosition) {
    // override this in subclass to filter by position
    return true;
  }
}
ModifierSummonWatchTransform.initClass();

module.exports = ModifierSummonWatchTransform;
