/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const SpellApplyEntityToBoard =   require('./spellApplyEntityToBoard');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const SpellFilterType = require('./spellFilterType');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const ModifierEgg = require('app/sdk/modifiers/modifierEgg');
const _ = require("underscore");

class SpellEggMorph extends SpellApplyEntityToBoard {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.NeutralDirect;
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Faction5.Egg};
     // if spawning an entity, it will be an egg
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    // check target entity.
    // if it's not already an egg, turn it into an egg
    // if it is an egg, then hatch it immediately
    const applyEffectPosition = {x, y};
    const existingEntity = board.getCardAtPosition(applyEffectPosition, CardType.Entity);
    if (existingEntity != null) {
      if (existingEntity.getBaseCardId() !== Cards.Faction5.Egg) { // turning non-egg entity into an egg
        const cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn(x, y);

        // create the action to spawn the new egg before the existing entity is removed
        // because we need information about the existing entity being turned into an egg
        const spawnAction = this.getSpawnAction(x, y, cardDataOrIndexToSpawn);

        // remove the existing entity
        const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
        removeOriginalEntityAction.setOwnerId(this.getOwnerId());
        removeOriginalEntityAction.setTarget(existingEntity);
        this.getGameSession().executeAction(removeOriginalEntityAction);

        // spawn the new egg
        if (spawnAction != null) {
          return this.getGameSession().executeAction(spawnAction);
        }
      } else { // entity is an egg, so let's hatch it
        const eggModifier = existingEntity.getModifierByClass(ModifierEgg);
        if (eggModifier != null) {
          this.getGameSession().pushTriggeringModifierOntoStack(eggModifier);
          eggModifier.removeAndReplace();
          return this.getGameSession().popTriggeringModifierFromStack();
        }
      }
    }
  }

  getCardDataOrIndexToSpawn(x, y) {
    let {
      cardDataOrIndexToSpawn
    } = this;
    if (cardDataOrIndexToSpawn != null) {
      const isObject = _.isObject(cardDataOrIndexToSpawn);
      if (isObject) { cardDataOrIndexToSpawn = UtilsJavascript.fastExtend({}, cardDataOrIndexToSpawn); }

      const existingEntity = this.getGameSession().getBoard().getCardAtPosition({x, y}, CardType.Entity);
      if (existingEntity != null) {
        if (!isObject) { cardDataOrIndexToSpawn = this.getGameSession().getCardByIndex(cardDataOrIndexToSpawn).createNewCardData(); }
        if (cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
        cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierEgg.createContextObject(existingEntity.createNewCardData()));
      }
    }

    return cardDataOrIndexToSpawn;
  }

  getSpawnAction(x, y, cardDataOrIndexToSpawn) {
    let spawnEntityAction;
    if ((cardDataOrIndexToSpawn == null)) { cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn(x, y); }
    const entity = this.getEntityToSpawn(x, y, cardDataOrIndexToSpawn);
    if (entity != null) {
      // we're going to spawn an egg as a transform
      spawnEntityAction = new PlayCardAsTransformAction(this.getGameSession(), entity.getOwnerId(), x, y, cardDataOrIndexToSpawn);
    }
    return spawnEntityAction;
  }

  getEntityToSpawn(x, y, cardDataOrIndexToSpawn) {
    let entity;
    if ((cardDataOrIndexToSpawn == null)) { ({
      cardDataOrIndexToSpawn
    } = this); }
    if (cardDataOrIndexToSpawn != null) {
      const existingEntity = this.getGameSession().getBoard().getCardAtPosition({x, y}, CardType.Entity);
      if (existingEntity != null) {
        entity = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(cardDataOrIndexToSpawn);
        entity.setOwnerId(existingEntity.getOwnerId());
      }
    }
    return entity;
  }

  _postFilterPlayPositions(validPositions) {
    // playable anywhere where a unit exists including an egg
    // but NOT a dispelled egg (dispelled egg cannot hatch)
    const filteredPositions = [];
    for (var position of Array.from(validPositions)) {
      var entityAtPosition = this.getGameSession().getBoard().getEntityAtPosition(position);
      if ((entityAtPosition != null) && ( (entityAtPosition.getBaseCardId() !== Cards.Faction5.Egg) || (entityAtPosition.hasModifierClass(ModifierEgg)) )) {
        filteredPositions.push(position);
      }
    }
    return filteredPositions;
  }
}
SpellEggMorph.initClass();

module.exports = SpellEggMorph;
