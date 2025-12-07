/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS202: Simplify dynamic range loops
 * DS204: Change includes calls to have a more natural evaluation order
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const Card = require('app/sdk/cards/card');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const _ = require('underscore');

class Spell extends Card {
  static initClass() {
  
    this.prototype.type = CardType.Spell;
    this.type = CardType.Spell;
    this.prototype.name = "Spell";
  
    this.prototype.canBeAppliedAnywhere = true; // spells can usually be targetted anywhere
    this.prototype.targetType = CardType.Entity;
    this.prototype.spellFilterType = SpellFilterType.None;
    this.prototype.filterCardIds = null; // array of card ids to filter for
    this.prototype.filterRaceIds = null; // array of race ids to filter for
    this.prototype.filterNearGeneral = false; // whether to only allow targets near general
    this.prototype.canTargetGeneral = false;
    this.prototype.radius = 0; // when multi-target, if radius > 0 it will get all targets in a radius around target position
    this.prototype.drawCardsPostPlay = 0; // if non-zero, will immediately draw X cards for the player who played this spell (cantrips)
    this.prototype.targetModifiersContextObjects = null; // just like entity modifier contexts objects, but used to create modifiers that are added to target of spell
    this.prototype.applyEffectPosition = null; // last position spell effect was applied at, used for followup source positions
    this.prototype.applyEffectPositions = null; // positions spell effect is being applied at
    this.prototype.applyEffectPositionsCardIndices = null;
     // indices of cards that were at apply effect positions when spell was cast
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.effectCenterPosition = null; // absolute center position spell effect is being applied at (ex: CONFIG.BOARDCENTER)
    p.canConvertCardToPrismatic = true; // whether this spell can convert cards played by it into prismatics
    p.canConvertCardToSkinned = true; // whether this spell can convert cards played by it into skinned versions

    return p;
  }

  updateCardDataPostApply(cardData) {
    cardData = super.updateCardDataPostApply(cardData);

    if (this.applyEffectPositions != null) { cardData.applyEffectPositions = this.applyEffectPositions; }
    if (this.applyEffectPositionsCardIndices != null) { cardData.applyEffectPositionsCardIndices = this.applyEffectPositionsCardIndices; }
    if (this.applyEffectPosition != null) { cardData.applyEffectPosition = this.applyEffectPosition; }

    return cardData;
  }

  // region ### GETTERS / SETTERS ###

  setTargetModifiersContextObjects(targetModifiersContextObjects) {
    return this.targetModifiersContextObjects = targetModifiersContextObjects;
  }

  getTargetModifiersContextObjects() {
    return this.targetModifiersContextObjects;
  }

  getCanConvertCardToPrismatic() {
    return this._private.canConvertCardToPrismatic;
  }

  getCanConvertCardToSkinned() {
    return this._private.canConvertCardToSkinned;
  }

  // region ### GETTERS / SETTERS ###

  // region ### APPLY ###

  onApplyToBoard(board,x,y,sourceAction) {
    super.onApplyToBoard(board,x,y,sourceAction);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      // force reset of apply effect positions
      // in case they have been requested before the spell is played
      this.applyEffectPosition = this.getPosition();
      this.applyEffectPositions = this._findApplyEffectPositions(this.applyEffectPosition, sourceAction);

      // remove all duplicate positions
      this.applyEffectPositions = UtilsPosition.getUniquePositions(this.applyEffectPositions);

      this.applyEffectPositionsCardIndices = [];
      for (var applyEffectPosition of Array.from(this.applyEffectPositions)) {
        // always store the last position applied at
        this.applyEffectPosition = applyEffectPosition;

        var applyingToUnit = board.getCardAtPosition(applyEffectPosition, CardType.Unit);
        if (applyingToUnit != null) {
          this.applyEffectPositionsCardIndices.push(applyingToUnit.getIndex());
        }

        // apply spell at each effect position
        this.onApplyEffectToBoardTile(board, applyEffectPosition.x, applyEffectPosition.y, sourceAction);
      }

      // handle apply cases that only need to act once
      // instead of at every applied effect position
      this.onApplyOneEffectToBoard(board,x,y,sourceAction);

      // after spell is done applying its effects, draw cards if requested
      if (this.drawCardsPostPlay > 0) {
        return (() => {
          const result = [];
          for (let i = 0, end = this.drawCardsPostPlay, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
            var deck = this.getGameSession().getPlayerById(this.getOwnerId()).getDeck();
            result.push(this.getGameSession().executeAction(deck.actionDrawCard()));
          }
          return result;
        })();
      }
    }
  }

  onApplyOneEffectToBoard(board, x, y, sourceAction) {}
    // override in spell class to do custom behavior once for this spell

  onApplyEffectToBoardTile(board,x,y,sourceAction) {}
    // override in spell class to do custom behavior at each location spell is applied

  setApplyEffectPosition(val) {
    return this.applyEffectPosition = val;
  }

  getApplyEffectPosition() {
    return this.applyEffectPosition;
  }

  getPositionForFollowupSourcePosition() {
    return this.getApplyEffectPosition();
  }

  _findApplyEffectPositions(position, sourceAction) {
    let applyEffectPositions = [];
    const board = this.getGameSession().getBoard();
    const affectPattern = this.getAffectPattern();

    if ((affectPattern != null) && (affectPattern.length > 0)) {
      applyEffectPositions = this.getAffectPositionsFromPattern(position);
    } else if (this.radius > 0) {
      const startX = Math.max(0,position.x-this.radius);
      const endX = Math.min(board.columnCount-1,position.x+this.radius);
      const startY = Math.max(0,position.y-this.radius);
      const endY = Math.min(board.rowCount-1,position.y+this.radius);
      for (let nx = startX, end = endX, asc = startX <= end; asc ? nx <= end : nx >= end; asc ? nx++ : nx--) {
        for (var ny = startY, end1 = endY, asc1 = startY <= end1; asc1 ? ny <= end1 : ny >= end1; asc1 ? ny++ : ny--) {
          var nextPosition = {x:nx, y:ny};
          if (board.isOnBoard(nextPosition)) {
            applyEffectPositions.push(nextPosition);
          }
        }
      }
    }

    // add base position to apply
    applyEffectPositions.push(position);

    // filter positions
    applyEffectPositions = this._filterApplyPositions(applyEffectPositions);

    return applyEffectPositions;
  }

  getApplyEffectPositions() {
    return this.applyEffectPositions || [];
  }

  getApplyEffectPositionsCardIndices() {
    return this.applyEffectPositionsCardIndices || [];
  }

  getAppliesSameEffectToMultipleTargets() {
    // should return true only if spell attempts to apply the same affect to multiple targets
    // ex: return true for a spell that deals 1 damage to all units
    // ex: return false for a spell that deals damage to one unit and heals another unit
    const affectPattern = this.getAffectPattern();
    if (affectPattern != null) {
      return affectPattern.length > 1;
    } else {
      return this.radius > 0;
    }
  }

  getCenterPositionOfAppliedEffects() {
    // should return the absolute center position of the applied effects
    // if absolute center position is already set, it will use the existing value instead of calculating
    if ((this._private.effectCenterPosition == null)) {
      // default center is spell position
      this._private.effectCenterPosition = this.getPosition();

      // for area effect spells try to find center of affect pattern
      const affectPattern = this.getAffectPattern();
      if ((affectPattern != null) && (affectPattern.length > 0)) {
        if (UtilsPosition.getArrayOfPositionsContainsMultipleArrayOfPositions(affectPattern, CONFIG.PATTERN_WHOLE_ROW)) {
          this._private.effectCenterPosition = {x: Math.floor(CONFIG.BOARDCOL * 0.5), y: this.getPosition().y};
        } else if (UtilsPosition.getArrayOfPositionsContainsMultipleArrayOfPositions(affectPattern, CONFIG.PATTERN_WHOLE_COLUMN)) {
          this._private.effectCenterPosition = {x: this.getPosition().x, y: Math.floor(CONFIG.BOARDCOL * 0.5)};
        } else {
          const patternCenter = {x: 0, y: 0};
          const boardPosition = {x: 0, y: 0};
          let numLocationsOnBoard = 0;
          const board = this.getGameSession().getBoard();
          for (var position of Array.from(affectPattern)) {
            boardPosition.x = this._private.effectCenterPosition.x + position.x;
            boardPosition.y = this._private.effectCenterPosition.y + position.y;
            if (board.isOnBoard(boardPosition)) {
              patternCenter.x += position.x;
              patternCenter.y += position.y;
              numLocationsOnBoard++;
            }
          }
          if (numLocationsOnBoard > 0) {
            this._private.effectCenterPosition.x += patternCenter.x / numLocationsOnBoard;
            this._private.effectCenterPosition.y += patternCenter.y / numLocationsOnBoard;
          }
        }
      } else if ((this.radius >= CONFIG.WHOLE_BOARD_RADIUS) || (this.getCanBeAppliedAnywhere() && this.getTargetsAnywhere())) {
        this._private.effectCenterPosition = CONFIG.BOARDCENTER;
      }
    }

    return this._private.effectCenterPosition;
  }

  // endregion ### APPLY ###

  // region ### VALID POSITIONS ###

  getCanBeAppliedAnywhere() {
    return super.getCanBeAppliedAnywhere() && !this.getCanBeAppliedAsFollowup();
  }

  getCanBeAppliedAsFollowup() {
    const followupSourcePattern = this.getFollowupSourcePattern();
    return this.getIsFollowup() && (followupSourcePattern != null) && (followupSourcePattern.length > 0);
  }

  getValidTargetPositions() {
    // returns a list of valid target positions
    // it is recommended that spells do not override this method directly
    if ((this._private.cachedValidTargetPositions == null)) {
      let validPositions = this._getPrefilteredValidTargetPositions();

      if (this.getIsFollowup()) {
        let parentCard = this.getParentCard();
        const previouslyAppliedPositions = [];
        while (parentCard) {
          previouslyAppliedPositions.push(parentCard.getPosition());
          parentCard = parentCard.getParentCard();
        }

        const filteredValidPositions = [];
        for (var position of Array.from(validPositions)) {
          var stillValid = true;
          for (var pos of Array.from(previouslyAppliedPositions)) {
            if ((pos.x === position.x) && (pos.y === position.y)) {
              stillValid = false;
              break;
            }
          }
          if (stillValid) {
            filteredValidPositions.push(position);
          }
        }
        validPositions = filteredValidPositions;
      }

      // filter positions for play
      validPositions = this._filterPlayPositions(validPositions);

      // always guarantee at least an empty array
      this._private.cachedValidTargetPositions = validPositions || [];
    }

    return this._private.cachedValidTargetPositions;
  }

  _getPrefilteredValidTargetPositions() {
    if (this.getCanBeAppliedAnywhere()) {
      // some cards can be applied anywhere on board
      return this._getValidApplyAnywherePositions();
    } else if (this.getCanBeAppliedAsFollowup()) {
      // followups should provide a source pattern for specific playable locations
      // otherwise it is assumed they can be played anywhere on board
      return this._getValidFollowupPositions();
    } else {
      return this.getGameSession().getBoard().getPositions();
    }
  }

  _getValidFollowupPositions() {
    return UtilsGameSession.getValidBoardPositionsFromPattern(this.getGameSession().getBoard(), this.getFollowupSourcePosition(), this.getFollowupSourcePattern());
  }

  _getValidApplyAnywherePositions() {
    return this.getGameSession().getBoard().getPositions();
  }

  // endregion ### VALID POSITIONS ###

  // region ### FILTERS ###

  _filterPlayPositions(spellPositions) {
    // filter positions that the spell will be first played at
    let validPositions = [];
    const gameSession = this.getGameSession();

    if (gameSession != null) {
      // run positions through primary filter
      let entity;
      if (this.spellFilterType === SpellFilterType.AllyDirect) {
        for (entity of Array.from(this._getEntitiesForFilter())) {
          if ((entity.getOwnerId() === this.getOwnerId()) && this._entityPassesFilter(spellPositions, entity)) {
            validPositions.push(entity.getPosition());
          }
        }

      } else if (this.spellFilterType === SpellFilterType.EnemyDirect) {
        for (entity of Array.from(this._getEntitiesForFilter())) {
          if ((entity.ownerId !== this.getOwnerId()) && this._entityPassesFilter(spellPositions, entity)) {
            validPositions.push(entity.getPosition());
          }
        }

      } else if (this.spellFilterType === SpellFilterType.NeutralDirect) {
        for (entity of Array.from(this._getEntitiesForFilter())) {
          if (this._entityPassesFilter(spellPositions, entity)) {
            validPositions.push(entity.getPosition());
          }
        }

      } else if (this.spellFilterType === SpellFilterType.SpawnSource) {
        validPositions = this.getGameSession().getBoard().getValidSpawnPositions(this);

      } else if (this.getTargetsAnywhere()) {
        validPositions = spellPositions;
      }

      // run secondary filter
      validPositions = this._postFilterPlayPositions(validPositions);
    }

    return validPositions;
  }

  _postFilterPlayPositions(validPositions) {
    // override to run a custom filter on play positions after they've run through primary filter
    return validPositions;
  }

  _filterApplyPositions(spellPositions) {
    // filter positions that the spell will actually be applied at
    let validPositions = [];
    const gameSession = this.getGameSession();

    if (gameSession != null) {
      // run positions through primary filter
      let entity;
      if (this.getTargetsAllies()) {
        for (entity of Array.from(this._getEntitiesForFilter())) {
          if ((entity.getOwnerId() === this.getOwnerId()) && this._entityPassesFilter(spellPositions, entity)) {
            validPositions.push(entity.getPosition());
          }
        }

      } else if (this.getTargetsEnemies()) {
        for (entity of Array.from(this._getEntitiesForFilter())) {
          if ((entity.ownerId !== this.getOwnerId()) && this._entityPassesFilter(spellPositions, entity)) {
            validPositions.push(entity.getPosition());
          }
        }

      } else if (this.getTargetsNeutral()) {
        for (entity of Array.from(this._getEntitiesForFilter())) {
          if (this._entityPassesFilter(spellPositions, entity)) {
            validPositions.push(entity.getPosition());
          }
        }

      } else if (this.spellFilterType === SpellFilterType.SpawnSource) {
        validPositions = spellPositions;

      } else if (this.spellFilterType === SpellFilterType.None) {
        validPositions = spellPositions;
      }

      // run secondary filter
      validPositions = this._postFilterApplyPositions(validPositions);
    }

    return validPositions;
  }

  _postFilterApplyPositions(validPositions) {
    // override to run a custom filter on apply positions after they've run through primary filter
    return validPositions;
  }

  _getEntitiesForFilter(allowUntargetable) {
    if (allowUntargetable == null) { allowUntargetable = false; }
    const board = this.getGameSession().getBoard();
    if (this.filterNearGeneral) {
      const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
      if (this.spellFilterType === SpellFilterType.AllyDirect) {
        return board.getEntitiesAroundEntity(general, this.targetType, 1);
      } else if (this.spellFilterType === SpellFilterType.EnemyDirect) {
        return board.getEntitiesAroundEntity(general, this.targetType, 1);
      } else if (this.spellFilterType === SpellFilterType.NeutralDirect) {
        return board.getEntitiesAroundEntity(general, this.targetType, 1);
      }
    } else {
      return board.getCards(this.targetType, allowUntargetable);
    }
  }

  _entityPassesFilter(spellPositions, entity) {
    let needle;
    if (entity.getIsGeneral() && !this.canTargetGeneral) { return false; }
    if (this.filterCardIds && !((needle = entity.getBaseCardId(), Array.from(this.filterCardIds).includes(needle)))) { return false; }
    if (this.filterRaceIds) {
      let passesRaceFilter = false;
      for (var raceId of Array.from(this.filterRaceIds)) {
        if (entity.getBelongsToTribe(raceId)) {
          passesRaceFilter = true;
          break;
        }
      }
      if (!passesRaceFilter) { return false; }
    }
    if (!UtilsPosition.getIsPositionInPositions(spellPositions, entity.getPosition())) { return false; }
    return true;
  }

  getTargetsAllies() {
    return (this.spellFilterType === SpellFilterType.AllyDirect) || (this.spellFilterType === SpellFilterType.AllyIndirect);
  }

  getTargetsEnemies() {
    return (this.spellFilterType === SpellFilterType.EnemyDirect) || (this.spellFilterType === SpellFilterType.EnemyIndirect);
  }

  getTargetsNeutral() {
    return (this.spellFilterType === SpellFilterType.NeutralDirect) || (this.spellFilterType === SpellFilterType.NeutralIndirect);
  }

  getTargetsAnywhere() {
    return (this.spellFilterType === SpellFilterType.None) || (this.spellFilterType === SpellFilterType.NeutralIndirect) || (this.spellFilterType === SpellFilterType.EnemyIndirect) || (this.spellFilterType === SpellFilterType.AllyIndirect);
  }

  getTargetsSpace() {
    return super.getTargetsSpace() || this.getTargetsAnywhere();
  }
}
Spell.initClass();

  // endregion ### FILTERS ###

module.exports = Spell;
