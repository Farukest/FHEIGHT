/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const SpellApplyEntityToBoard =   require('./spellApplyEntityToBoard');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const _ = require('underscore');

class SpellRemoveAndReplaceEntity extends SpellApplyEntityToBoard {
  static initClass() {
  
    this.prototype.targetType = CardType.Entity;
    this.prototype.spellFilterType = SpellFilterType.NeutralDirect;
    this.prototype.cardDataOrIndexToSpawn = null;
     // id of card to spawn
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};
    const cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn(x, y);

    // create the action to spawn the new entity before the existing entity is removed
    // because we may need information about the existing entity being replaced
    const spawnAction = this.getSpawnAction(x, y, cardDataOrIndexToSpawn);

    // remove the existing entity
    const removePosition = this.getRemovePosition(applyEffectPosition);
    const removingEntity = board.getCardAtPosition(removePosition, this.targetType);
    if (removingEntity != null) {
      const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
      removeOriginalEntityAction.setOwnerId(this.getOwnerId());
      removeOriginalEntityAction.setTarget(removingEntity);
      this.getGameSession().executeAction(removeOriginalEntityAction);
    }

    // spawn the new entity
    if (spawnAction != null) {
      return this.getGameSession().executeAction(spawnAction);
    }
  }

  getRemovePosition(applyEffectPosition) {
    // override in sub class to provide a custom remove position
    return applyEffectPosition;
  }

  getCardDataOrIndexToSpawn(x, y) {
    let {
      cardDataOrIndexToSpawn
    } = this;
    if ((cardDataOrIndexToSpawn != null) && _.isObject(cardDataOrIndexToSpawn)) { cardDataOrIndexToSpawn = UtilsJavascript.fastExtend({}, cardDataOrIndexToSpawn); }
    return cardDataOrIndexToSpawn;
  }

  getSpawnAction(x, y, cardDataOrIndexToSpawn) {
    if ((cardDataOrIndexToSpawn == null)) { cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn(x, y); }
    const entity = this.getEntityToSpawn(x, y, cardDataOrIndexToSpawn);
    if (entity != null) {
      return new PlayCardAsTransformAction(this.getGameSession(), entity.getOwnerId(), x, y, cardDataOrIndexToSpawn);
    }
  }

  getEntityToSpawn(x, y, cardDataOrIndexToSpawn) {
    let entity;
    if ((cardDataOrIndexToSpawn == null)) { cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn(x, y); }
    if (cardDataOrIndexToSpawn != null) {
      entity = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(cardDataOrIndexToSpawn);
      const existingEntity = this.getGameSession().getBoard().getCardAtPosition({x, y}, CardType.Entity);
      if (existingEntity != null) {
        entity.setOwnerId(existingEntity.getOwnerId());
      } else {
        entity.setOwnerId(this.getOwnerId());
      }
    }
    return entity;
  }

  _postFilterPlayPositions(validPositions) {
    // ignore super class's filtering
    // allow this spell to be played where entities are
    return validPositions;
  }
}
SpellRemoveAndReplaceEntity.initClass();

module.exports = SpellRemoveAndReplaceEntity;
