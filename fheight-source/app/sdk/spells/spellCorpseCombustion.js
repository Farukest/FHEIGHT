/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const CONFIG = require('app/common/config');
const SpellSpawnEntity = require('./spellSpawnEntity');
const CardType = require('app/sdk/cards/cardType');
const Rarity = require('app/sdk/cards/rarityLookup');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const DieAction = require('app/sdk/actions/dieAction');
const ModifierDyingWish = require('app/sdk/modifiers/modifierDyingWish');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const _ = require('underscore');

class SpellCorpseCombustion extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spawnSilently = true;
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Faction3.Dervish};
     // use Wind Dervish as default unit for checking spawn positions, etc
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.deadUnits = null;

    return p;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    // find a random dead entity
    const entities = this.getDeadUnits();
    const whichEntity = [this.getGameSession().getRandomIntegerForExecution(entities.length)];
    const entityToSpawn = entities[whichEntity];
    if (entityToSpawn != null) {
      this.cardDataOrIndexToSpawn = entityToSpawn.createNewCardData();
      this._private.deadUnits.splice(whichEntity,1); // remove this unit from the list of dead units (don't summon the same one twice)
      return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
    }
  }

  _findApplyEffectPositions(position, sourceAction) {
    let applyEffectPositions;
    const card = this.getEntityToSpawn();
    const generalPosition = this.getGameSession().getGeneralForPlayerId(this.ownerId).getPosition();
    const numberOfApplyPositions = this.getDeadUnits().length;

    if (numberOfApplyPositions > 0) {
      applyEffectPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, CONFIG.PATTERN_WHOLE_BOARD, card, this, numberOfApplyPositions);
    } else {
      applyEffectPositions = [];
    }

    return applyEffectPositions;
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }

  getAllActionsFromParentAction(action) {
    let actions = [action];

    const subActions = action.getSubActions();
    if ((subActions != null) && (subActions.length > 0)) {
      for (let i = 0; i < subActions.length; i++) {
        action = subActions[i];
        actions = actions.concat(this.getAllActionsFromParentAction(subActions[i]));
      }
    }
    return actions;
  }

  getDeadUnits() {
    let deadUnits;
    if ((this._private.deadUnits == null)) {
      let card, turn;
      deadUnits = [];
      const turnsToCheck = [];
      turnsToCheck.push(this.getGameSession().getCurrentTurn()); // always check current turn
      // find all game turns that occured since my last turn and add them as well
      const iterable = this.getGameSession().getTurns();
      for (let i = iterable.length - 1; i >= 0; i--) {
        turn = iterable[i];
        if (turn.playerId === this.getOwnerId()) {
          break;
        } else {
          turnsToCheck.push(turn);
        }
      }

      let actions = [];
      for (turn of Array.from(turnsToCheck)) {
        for (var step of Array.from(turn.steps)) {
          actions = actions.concat(this.getAllActionsFromParentAction(step.getAction()));
        }
      }

      // get friendly minions that died
      for (var action of Array.from(actions)) {
        if (action.getType() === DieAction.type) {
          card = action.getTarget();
          if (((card != null ? card.getType() : undefined) === CardType.Unit) && card.getIsRemoved() && (card.getOwnerId() === this.getOwnerId()) && !(card.getRarityId() === Rarity.TokenUnit) && !card.getWasGeneral()) {
            deadUnits.push(card);
          }
        }
      }

      const deadUnitsWithDyingWish = [];
      // NOTE: since this is acting on dead units we can only check base on INHERENT modifiers, not added ones
      // check inherent modifiers for any dying wish modifier
      for (var deadUnit of Array.from(deadUnits)) {
        card = this.getGameSession().getCardCaches().getCardById(deadUnit.getId());
        for (var modifierContextObject of Array.from(card.getInherentModifiersContextObjects())) {
          if (this.getGameSession().createModifierForType(modifierContextObject.type) instanceof ModifierDyingWish) {
            // if we find a "Dying Wish"
            deadUnitsWithDyingWish.push(deadUnit);
          }
        }
      }
      this._private.deadUnits = deadUnitsWithDyingWish;
      return deadUnitsWithDyingWish;
    } else {
      return this._private.deadUnits;
    }
  }

  // corpse combustion picks its apply locations by itself, so don't set limits on where it can be cast
  _postFilterPlayPositions(validPositions) {
    return validPositions;
  }
}
SpellCorpseCombustion.initClass();

module.exports = SpellCorpseCombustion;
