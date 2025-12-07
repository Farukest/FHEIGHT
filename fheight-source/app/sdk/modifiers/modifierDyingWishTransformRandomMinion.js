/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const CardType = require('app/sdk/cards/cardType');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const ModifierTransformed = require('app/sdk/modifiers/modifierTransformed');

class ModifierDyingWishTransformRandomMinion extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishTransformRandomMinion";
    this.type ="ModifierDyingWishTransformRandomMinion";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericBuff"];
  
    this.prototype.minionToTransformTo = null;
    this.prototype.includeAllies = true;
    this.prototype.includeEnemies = true;
    this.prototype.race = null;
  }

  static createContextObject(minionToTransformTo, includeAllies, includeEnemies, race, options) {
    if (includeAllies == null) { includeAllies = true; }
    if (includeEnemies == null) { includeEnemies = true; }
    const contextObject = super.createContextObject(options);
    contextObject.minionToTransformTo = minionToTransformTo;
    contextObject.includeAllies = includeAllies;
    contextObject.includeEnemies = includeEnemies;
    contextObject.race = race;
    return contextObject;
  }

  onDyingWish(action) {

    if (this.minionToTransformTo != null) {
      const potentialUnits = [];
      // find all potential minions
      for (var unit of Array.from(this.getGameSession().getBoard().getUnits())) {
        if (unit != null) {
          if (this.includeAllies) {
            if (unit.getIsSameTeamAs(this.getCard()) && !unit.getIsGeneral() && this.getGameSession().getCanCardBeScheduledForRemoval(unit) && ((this.race == null) || unit.getBelongsToTribe(this.race))) {
              potentialUnits.push(unit);
            }
          }

          if (this.includeEnemies) {
            if (!unit.getIsSameTeamAs(this.getCard()) && !unit.getIsGeneral() && this.getGameSession().getCanCardBeScheduledForRemoval(unit) && ((this.race == null) || unit.getBelongsToTribe(this.race))) {
              potentialUnits.push(unit);
            }
          }
        }
      }

      // if we found at least one minion on the board
      if (potentialUnits.length > 0) {
        // pick one
        const existingEntity = potentialUnits[this.getGameSession().getRandomIntegerForExecution(potentialUnits.length)];
        const targetPosition = existingEntity.getPosition();

        // remove it
        const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
        removeOriginalEntityAction.setOwnerId(this.getCard().getOwnerId());
        removeOriginalEntityAction.setTarget(existingEntity);
        this.getGameSession().executeAction(removeOriginalEntityAction);

        //transform it
        if (existingEntity != null) {
          const cardData = this.minionToTransformTo;
          if (cardData.additionalInherentModifiersContextObjects == null) { cardData.additionalInherentModifiersContextObjects = []; }
          cardData.additionalInherentModifiersContextObjects.push(ModifierTransformed.createContextObject(existingEntity.getExhausted(), existingEntity.getMovesMade(), existingEntity.getAttacksMade()));
          const spawnEntityAction = new PlayCardAsTransformAction(this.getCard().getGameSession(), this.getCard().getOwnerId(), targetPosition.x, targetPosition.y, cardData);
          return this.getGameSession().executeAction(spawnEntityAction);
        }
      }
    }
  }
}
ModifierDyingWishTransformRandomMinion.initClass();

module.exports = ModifierDyingWishTransformRandomMinion;
