/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const CardType = require('app/sdk/cards/cardType');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const ModifierTransformed = require('app/sdk/modifiers/modifierTransformed');

class SpellIllusoryIce extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const originalEntity = this.getGameSession().getBoard().getEntityAtPosition({x,y});
    const entities = this.getGameSession().getBoard().getEntitiesAroundEntity(originalEntity, CardType.Unit, 1);

    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        if ((entity != null) && !entity.getIsGeneral()) {
          var position = entity.getPosition();
          var ownerId = entity.getOwnerId();

          var removeEntityAction = new RemoveAction(this.getGameSession());
          removeEntityAction.setOwnerId(this.getOwnerId());
          removeEntityAction.setTarget(entity);
          this.getGameSession().executeAction(removeEntityAction);

          var existingEntity = this.getGameSession().getBoard().getCardAtPosition({x, y}, CardType.Unit);
          if ((existingEntity != null) && !this.getGameSession().getBoard().getObstructionAtPositionForEntity(position, existingEntity)) {
            var cardDataOrIndexToSpawn = existingEntity.createCloneCardData();
            if (cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
            cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierTransformed.createContextObject(entity.getExhausted(), entity.getMovesMade(), entity.getAttacksMade()));
            var spawnEntityAction = new PlayCardAsTransformAction(this.getGameSession(), ownerId, position.x, position.y, cardDataOrIndexToSpawn);
            result.push(this.getGameSession().executeAction(spawnEntityAction));
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}

module.exports = SpellIllusoryIce;
