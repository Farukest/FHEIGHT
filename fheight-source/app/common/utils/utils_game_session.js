/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
/*
  UtilsGameSession - game session utility methods.
*/

const UtilsGameSession = {};
module.exports = UtilsGameSession;

const CONFIG = require('app/common/config');
const UtilsPosition = require('./utils_position');
const UtilsJavascript = require('./utils_javascript');
const CardType = require('app/sdk/cards/cardType');
const GameType = require('app/sdk/gameType');
const _ = require('underscore');

UtilsGameSession.getWinningPlayerId = function(gameSessionData) {
  // Returns the winning player's id, or undefined if neither is the winner yet
  if (gameSessionData.players[0].isWinner) {
    return gameSessionData.players[0].playerId;
  } else if (gameSessionData.players[1].isWinner) {
    return gameSessionData.players[1].playerId;
  } else {
    return undefined;
  }
};

UtilsGameSession.getOpponentIdToPlayerId = function(gameSessionData,playerId) {
  for (var playerData of Array.from(gameSessionData.players)) {
    if (playerData.playerId !== playerId) {
      return playerData.playerId;
    }
  }
  return undefined;
};

UtilsGameSession.getPlayerDataForId = function(gameSessionData,playerId) {
  for (var playerData of Array.from(gameSessionData.players)) {
    if (playerData.playerId === playerId) {
      return playerData;
    }
  }
  return undefined;
};

UtilsGameSession.getPlayerSetupDataForPlayerId = function(gameSessionData,playerId) {
  const {
    gameSetupData
  } = gameSessionData;
  for (let i = 0; i < gameSessionData.players.length; i++) {
    var playerData = gameSessionData.players[i];
    if (playerData.playerId === playerId) {
      return gameSetupData.players[i];
    }
  }
  return undefined;
};

UtilsGameSession.groupModifiersBySourceCard = function(modifiers) {
  // hash modifiers by the index of the action that played their source card
  const modifiersBySourceCardActionIndex = {};
  for (var m of Array.from(modifiers)) {
    var sourceCardActionIndex;
    var sourceCard = m.getSourceCard();
    if (sourceCard != null) { sourceCardActionIndex = sourceCard.getAppliedToBoardByActionIndex(); } else { sourceCardActionIndex = -1; }
    if ((modifiersBySourceCardActionIndex[sourceCardActionIndex] == null)) { modifiersBySourceCardActionIndex[sourceCardActionIndex] = []; }
    modifiersBySourceCardActionIndex[sourceCardActionIndex].push(m);
  }

  // create list of modifiers by source card in order of when the cards were played
  const modifiersGroupedBySourceCard = [];
  const sourceCardActionIndices = Object.keys(modifiersBySourceCardActionIndex).sort((a, b) => parseInt(a) - parseInt(b));
  for (var index of Array.from(sourceCardActionIndices)) {
    modifiersGroupedBySourceCard.push(modifiersBySourceCardActionIndex[index]);
  }
  return modifiersGroupedBySourceCard;
};

UtilsGameSession.getValidBoardPositionsFromPattern = function(board, boardPosition, pattern, allowObstructions) {
  if (allowObstructions == null) { allowObstructions = true; }
  if (UtilsPosition.getArrayOfPositionsContainsArrayOfPositions(pattern, CONFIG.PATTERN_WHOLE_BOARD)) {
    // special case: entire board
    if (allowObstructions) {
      return board.getPositions();
    } else {
      return board.getUnobstructedPositions();
    }
  } else {
    let bpx, bpy;
    const boardPositions = [];

    if (UtilsPosition.getArrayOfPositionsContainsMultipleArrayOfPositions(pattern, CONFIG.PATTERN_WHOLE_COLUMN)) {
      // special case: entire column(s)
      bpx = boardPosition.x;
      bpy = Math.floor(CONFIG.BOARDROW * 0.5);
    } else if (UtilsPosition.getArrayOfPositionsContainsMultipleArrayOfPositions(pattern, CONFIG.PATTERN_WHOLE_ROW)) {
      // special case: entire row(s)
      bpx = Math.floor(CONFIG.BOARDCOL * 0.5);
      bpy = boardPosition.y;
    } else {
      if ((pattern == null)) { pattern = CONFIG.PATTERN_1x1; }
      bpx = boardPosition.x;
      bpy = boardPosition.y;
    }

    for (var offset of Array.from(pattern)) {
      var patternPosition = {x: offset.x + bpx, y: offset.y + bpy};
      if (board.isOnBoard(patternPosition) && (allowObstructions || !board.getObstructionAtPosition(patternPosition))) {
        boardPositions.push(patternPosition);
      }
    }

    return boardPositions;
  }
};

/*
* Gets a list of valid spawn positions, accounting for existing and queued obstructions.
* @param {GameSession} gameSession
* @param {Vec2} sourcePosition
* @param {Array} pattern
* @param {Card} cardToSpawn
* @returns {Array} a list of all valid spawn positions
*/
UtilsGameSession.getSmartSpawnPositionsFromPattern = function(gameSession, sourcePosition, pattern, cardToSpawn) {
  const board = gameSession.getBoard();
  const spawnPositions = [];
  if ((pattern == null)) { pattern = CONFIG.PATTERN_1x1; }

  for (var offset of Array.from(pattern)) {
    // make sure the potential spawn location is on the board and spawn only when not obstructing or position is unobstructed
    var spawnPosition = {x: sourcePosition.x + offset.x, y: sourcePosition.y + offset.y};
    if (board.isOnBoard(spawnPosition) && !board.getObstructionAtPositionForEntity(spawnPosition, cardToSpawn)) {
      spawnPositions.push(spawnPosition);
    }
  }

  return spawnPositions;
};

/*
* Gets a list of random valid spawn positions, accounting for existing and queued obstructions.
* @param {GameSession} gameSession
* @param {Vec2} sourcePosition
* @param {Array} pattern
* @param {Card} cardToSpawn
* @param {Card|Modifier} source
* @param {Number} [spawnCount=1] spawnCount
* @returns {Array} a list randomly chosen spawn positions
*/
UtilsGameSession.getRandomSmartSpawnPositionsFromPattern = function(gameSession, sourcePosition, pattern, cardToSpawn, source, spawnCount) {
  let i;
  let asc, end;
  if (spawnCount == null) { spawnCount = 1; }
  const spawnPositions = [];

  const validSpawnPositions = UtilsGameSession.getSmartSpawnPositionsFromPattern(gameSession, sourcePosition, pattern, cardToSpawn);

  // never randomly overwrite friendly tiles
  if (cardToSpawn.getType() === CardType.Tile) {
    for (i = validSpawnPositions.length - 1; i >= 0; i--) {
      var spawnPosition = validSpawnPositions[i];
      var targetTile = gameSession.getBoard().getTileAtPosition(spawnPosition, true, true);
      if (targetTile && (targetTile.getOwner() === source.getOwner())) {
        validSpawnPositions.splice(i, 1);
      }
    }
  }

  // pick random spawn positions
  for (i = 0, end = spawnCount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
    if (validSpawnPositions.length > 0) {
      spawnPositions.push(validSpawnPositions.splice(gameSession.getRandomIntegerForExecution(validSpawnPositions.length), 1)[0]);
    } else {
      break;
    }
  }

  return spawnPositions;
};

/*
* Coordinates valid spawn positions between a list of sources with spawn patterns.
* @param {GameSession} gameSession
* @param {Array} sourcePositions
* @param {Array} patternOrPatterns list of patterns or single pattern
* @param {Array} cardOrCardsToSpawn list of cards or single card to spawn
* @param {Array} sourceOrSources list of sources or single source
* @param {Array} [spawnCountOrCounts=1] list of number of spawns or single number of spawns
* @returns {Array} a list of spawn data objects with "source" and "spawnPositions" properties.
*/
UtilsGameSession.getRandomNonConflictingSmartSpawnPositionsFromPatterns = function(gameSession, sourcePositions, patternOrPatterns, cardOrCardsToSpawn, sourceOrSources, spawnCountOrCounts) {
  let cardToSpawn, i, pattern, source, sourcePosition, spawnCount, spawnData, spawnPosition, targetTile, validSpawnPositions;
  const spawnPositionsWithSource = [];

  if (sourcePositions.length === 1) {
    // special case: only a single source so no conflicts are possible
    sourcePosition = sourcePositions[0];
    pattern = _.isArray(patternOrPatterns) && _.isArray(patternOrPatterns[0]) ? patternOrPatterns[0] : patternOrPatterns;
    cardToSpawn = _.isArray(cardOrCardsToSpawn) ? cardOrCardsToSpawn[0] : cardOrCardsToSpawn;
    source = _.isArray(sourceOrSources) ? sourceOrSources[0] : sourceOrSources;
    spawnCount = _.isArray(spawnCountOrCounts) ? spawnCountOrCounts[0] : spawnCountOrCounts;
    if (!_.isNumber(spawnCount) || isNaN(spawnCount) || (spawnCount <= 0)) { spawnCount = 1; }
    validSpawnPositions = UtilsGameSession.getSmartSpawnPositionsFromPattern(gameSession, sourcePosition, pattern, cardToSpawn);

    // never randomly overwrite friendly tiles
    if (cardToSpawn.getType() === CardType.Tile) {
      for (i = validSpawnPositions.length - 1; i >= 0; i--) {
        spawnPosition = validSpawnPositions[i];
        targetTile = gameSession.getBoard().getTileAtPosition(spawnPosition, true, true);
        if (targetTile && (targetTile.getOwner() === source.getOwner())) {
          validSpawnPositions.splice(i, 1);
        }
      }
    }

    spawnPositionsWithSource.push({
      source,
      cardToSpawn,
      spawnCount,
      sourcePosition,
      spawnPositions: [],
      validSpawnPositions
    });
  } else {
    let j;
    let conflictDataForPosition, conflicts, nonConflictingPositions, position;
    const getAppliedByActionIndexFromSource = source => (typeof source.getAppliedByActionIndex === 'function' ? source.getAppliedByActionIndex() : undefined) || (typeof source.getAppliedToBoardByActionIndex === 'function' ? source.getAppliedToBoardByActionIndex() : undefined);

    const comparatorMethod = function(a, b) {
      const indexA = getAppliedByActionIndexFromSource(a.source);
      const indexB = getAppliedByActionIndexFromSource(b.source);
      if (indexA >= 0) {
        if (indexB >= 0) { return indexA - indexB; } else { return 1; }
      } else if (indexB >= 0) { return -1;
      } else { return a.source.getIndex() - b.source.getIndex(); }
    };

    // find valid spawn positions
    for (j = 0, i = j; j < sourcePositions.length; j++, i = j) {
      sourcePosition = sourcePositions[i];
      pattern = _.isArray(patternOrPatterns) && _.isArray(patternOrPatterns[i]) ? patternOrPatterns[i] : patternOrPatterns;
      cardToSpawn = _.isArray(cardOrCardsToSpawn) ? cardOrCardsToSpawn[i] : cardOrCardsToSpawn;
      source = _.isArray(sourceOrSources) ? sourceOrSources[i] : sourceOrSources;
      spawnCount = _.isArray(spawnCountOrCounts) ? spawnCountOrCounts[i] : spawnCountOrCounts;
      if (!_.isNumber(spawnCount) || isNaN(spawnCount) || (spawnCount <= 0)) { spawnCount = 1; }

      validSpawnPositions = UtilsGameSession.getSmartSpawnPositionsFromPattern(gameSession, sourcePosition, pattern, cardToSpawn);

      // never randomly overwrite friendly tiles
      if (cardToSpawn.getType() === CardType.Tile) {
        for (i = validSpawnPositions.length - 1; i >= 0; i--) {
          spawnPosition = validSpawnPositions[i];
          targetTile = gameSession.getBoard().getTileAtPosition(spawnPosition, true, true);
          if (targetTile && (targetTile.getOwner() === source.getOwner())) {
            validSpawnPositions.splice(i, 1);
          }
        }
      }

      spawnData = {
        source,
        cardToSpawn,
        spawnCount,
        sourcePosition,
        spawnPositions: [],
        conflicts: [],
        nonConflictingPositions: [],
        validSpawnPositions
      };

      // sort by number of available spawn locations and then by applied index
      UtilsJavascript.arraySortedInsertAscendingByComparator(spawnPositionsWithSource, spawnData, comparatorMethod);
    }

    // find conflicts
    let numConflicts = 0;
    const conflictScoringMethod = conflictDataForPosition => conflictDataForPosition.conflicts.length;
    for (spawnData of Array.from(spawnPositionsWithSource)) {
      ({
        validSpawnPositions
      } = spawnData);
      ({
        conflicts
      } = spawnData);
      ({
        nonConflictingPositions
      } = spawnData);
      var numConflictsForSpawnData = 0;
      for (position of Array.from(validSpawnPositions)) {
        var {
          x
        } = position;
        var {
          y
        } = position;
        conflictDataForPosition = null;
        for (var otherSpawnData of Array.from(spawnPositionsWithSource)) {
          if (otherSpawnData !== spawnData) {
            var otherSpawnPositions = otherSpawnData.validSpawnPositions;
            for (var otherIndex = 0; otherIndex < otherSpawnPositions.length; otherIndex++) {
              var otherPosition = otherSpawnPositions[otherIndex];
              if ((x === otherPosition.x) && (y === otherPosition.y)) {
                if ((conflictDataForPosition == null)) { conflictDataForPosition = {position, conflicts: []}; }
                conflictDataForPosition.conflicts.push(otherSpawnData);
                break;
              }
            }
          }
        }

        if ((conflictDataForPosition != null) && (conflictDataForPosition.conflicts.length  > 0)) {
          numConflictsForSpawnData++;
          UtilsJavascript.arraySortedInsertByScore(conflicts, conflictDataForPosition, conflictScoringMethod);
        } else {
          nonConflictingPositions.push(position);
        }
      }

      if ((numConflictsForSpawnData > 0) && (nonConflictingPositions.length === 0)) {
        numConflicts += numConflictsForSpawnData;
      }
    }

    // resolve conflicts
    let spawnDataIndex = 0;
    const numSpawnData = spawnPositionsWithSource.length;
    while (numConflicts > 0) {
      spawnData = spawnPositionsWithSource[spawnDataIndex];
      spawnDataIndex = (spawnDataIndex + 1) % numSpawnData;
      ({
        conflicts
      } = spawnData);
      ({
        nonConflictingPositions
      } = spawnData);
      if ((conflicts != null) && (conflicts.length > 0) && (nonConflictingPositions.length === 0)) {
        ({
          validSpawnPositions
        } = spawnData);
        ({
          source
        } = spawnData);
        conflictDataForPosition = conflicts.pop();
        numConflicts--;
        var conflictedPosition = conflictDataForPosition.position;
        if (!UtilsPosition.getIsPositionInPositions(validSpawnPositions, conflictedPosition)) {
          // this conflicted position has been resolved by another source, try again with same source
          if (spawnDataIndex === 0) { spawnDataIndex = numSpawnData - 1; } else { spawnDataIndex--; }
        } else {
          // resolve conflicted position for this source
          var resolvedConflict = false;
          for (var conflictingSpawnData of Array.from(conflictDataForPosition.conflicts)) {
            var conflictingSpawnPositions = conflictingSpawnData.validSpawnPositions;
            var numSpawnPositions = conflictingSpawnPositions.length;
            if (numSpawnPositions > 1) {
              UtilsPosition.removePositionFromPositions(conflictedPosition, conflictingSpawnPositions);
              resolvedConflict = true;
            } else if (numSpawnPositions > 0) {
              var appliedIndex = getAppliedByActionIndexFromSource(source);
              var conflictingAppliedIndex = getAppliedByActionIndexFromSource(conflictingSpawnData.source);
              if ((appliedIndex < conflictingAppliedIndex) || ((appliedIndex === -1) && (conflictingAppliedIndex === -1) && (source.getIndex() < conflictingSpawnData.source.getIndex()))) {
                UtilsPosition.removePositionFromPositions(conflictedPosition, conflictingSpawnPositions);
                resolvedConflict = true;
              } else {
                resolvedConflict = false;
                break;
              }
            } else {
              resolvedConflict = false;
              break;
            }
          }

          if (!resolvedConflict) {
            UtilsPosition.removePositionFromPositions(conflictedPosition, validSpawnPositions);
          }
        }
      }
    }
  }

  // pick random spawn positions for all sources that have valid spawn positions
  for (spawnData of Array.from(spawnPositionsWithSource)) {
    var asc, end;
    ({
      validSpawnPositions
    } = spawnData);
    var {
      spawnPositions
    } = spawnData;
    ({
      spawnCount
    } = spawnData);
    for (i = 0, end = spawnCount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
      if (validSpawnPositions.length > 0) {
        spawnPositions.push(validSpawnPositions.splice(gameSession.getRandomIntegerForExecution(validSpawnPositions.length), 1)[0]);
      } else {
        break;
      }
    }
  }

  return spawnPositionsWithSource;
};

/*
* Coordinates valid spawn positions for a modifier with all other modifiers that will act the same.
* NOTE: modifier must implement "getCardDataOrIndexToSpawn" method and "spawnPattern" and "spawnCount" properties
* @param {Modifier} modifier
* @param {Modifier} [modifierClass=modifier class]
* @returns {Array} a list of random valid spawn positions.
*/
UtilsGameSession.getRandomNonConflictingSmartSpawnPositionsForModifier = function(modifier, modifierClass) {
  // coordinate spawning with all other spawns after this modifier
  const gameSession = modifier.getGameSession();
  const modifiersToCoordinateWith = modifier.getModifiersToCoordinateWith(modifierClass);
  modifiersToCoordinateWith.unshift(modifier);
  const positions = [];
  const patterns = [];
  const cardsToSpawn = [];
  const spawnCounts = [];
  for (var coordinatingModifier of Array.from(modifiersToCoordinateWith)) {
    var card = coordinatingModifier.getCard();
    positions.push(card.getPosition());
    patterns.push(coordinatingModifier.spawnPattern);
    cardsToSpawn.push(gameSession.getExistingCardFromIndexOrCachedCardFromData(coordinatingModifier.getCardDataOrIndexToSpawn()));
    spawnCounts.push(coordinatingModifier.spawnCount);
  }

  // spawn position for this modifier should always be the first
  const spawnPositionsWithSource = UtilsGameSession.getRandomNonConflictingSmartSpawnPositionsFromPatterns(gameSession, positions, patterns, cardsToSpawn, modifiersToCoordinateWith, spawnCounts);
  return spawnPositionsWithSource[0].spawnPositions;
};

/**
 * Remove sensitive data like deck and card information from an game session for an opponent who might attempt to peek at the data to cheat.
 * @public
 * @param  {GameSession}  gameSession      The GameSession source of the data.
 * @param  {Object}    gameSessionData    The GameSession data object we want to scrub.
 * @param  {String}    scrubFromPerspectiveOfPlayerId  Player ID for who we want to scrub for (the player who should NOT see sensitive data).
 * @param  {Boolean}    forSpectator            Should the scrubbing be done for someone watching the game? If so we usually want to blank out the deck since even if a buddy can see your hand, they shouldn't be able to deck snipe.
 */
UtilsGameSession.scrubGameSessionData = function(gameSession, gameSessionData, scrubFromPerspectiveOfPlayerId, forSpectator) {
  // for casual games, set game type to ranked if we're sending this data to a ranked player or spectator
  let index, step;
  if (gameSession.isCasual()) {
    const player = gameSession.getPlayerById(scrubFromPerspectiveOfPlayerId);
    if (forSpectator || player.getIsRanked()) {
      gameSessionData.gameType = GameType.Ranked;
    }
  }

  // reset ai properties to default
  delete gameSessionData.aiPlayerId;
  delete gameSessionData.aiDifficulty;

  // scrub opponent game setup data
  UtilsGameSession.scrubGameSetupData(gameSession, gameSessionData.gameSetupData, scrubFromPerspectiveOfPlayerId, forSpectator);

  // scrub player data
  UtilsGameSession.scrubSensitivePlayerData(gameSession, gameSessionData.players, scrubFromPerspectiveOfPlayerId, forSpectator);

  // scrub opponent cards that aren't yet played and are not a signature card
  const cardsIndices = Object.keys(gameSessionData.cardsByIndex);
  for (index of Array.from(cardsIndices)) {
    var card = gameSession.getCardByIndex(index);
    if ((card == null) || card.isScrubbable(scrubFromPerspectiveOfPlayerId, forSpectator)) {
      delete gameSessionData.cardsByIndex[index];
    } else if (card.isHideable(scrubFromPerspectiveOfPlayerId, forSpectator)) {
      var hiddenCard = card.createCardToHideAs();
      var hiddenCardData = JSON.parse(gameSession.serializeToJSON(hiddenCard));
      gameSessionData.cardsByIndex[index] = hiddenCardData;
    }
  }

  // scrub modifiers and context objects that are on cards that have been scrubbed
  const modifierIndices = Object.keys(gameSessionData.modifiersByIndex);
  for (index of Array.from(modifierIndices)) {
    var modifierData = gameSessionData.modifiersByIndex[index];
    if ((modifierData.cardAffectedIndex != null) && (gameSessionData.cardsByIndex[modifierData.cardAffectedIndex] == null)) {
      delete gameSessionData.modifiersByIndex[index];
    } else {
      var modifier = gameSession.getModifierByIndex(index);
      if ((modifier != null) && modifier.isHideable(scrubFromPerspectiveOfPlayerId, forSpectator)) {
        var hiddenModifier = modifier.createModifierToHideAs();
        var hiddenModifierData = JSON.parse(gameSession.serializeToJSON(hiddenModifier));
        gameSessionData.modifiersByIndex[index] = hiddenModifierData;
      }
    }
  }

  // scrub data from current step actions
  for (step of Array.from(gameSessionData.currentTurn.steps)) {
    UtilsGameSession.scrubSensitiveActionData(gameSession, step.action, scrubFromPerspectiveOfPlayerId, forSpectator);
  }

  // scrub data for step actions
  for (var turn of Array.from(gameSessionData.turns)) {
    for (step of Array.from(turn.steps)) {
      UtilsGameSession.scrubSensitiveActionData(gameSession, step.action, scrubFromPerspectiveOfPlayerId, forSpectator);
    }
  }

  return gameSessionData;
};

/*
 * Resets/scrubs all cheat sensitive data in game setup data.
 * @param  {GameSession}  gameSession            The GameSession source of the data.
 * @param   {Object}   gameSetupData              Plain js object for game setup data.
 * @param   {String}   scrubFromPerspectiveOfPlayerId    The player for who we want to scrub. (The player that is not allowed to see the data).
 * @param   {Boolean}   forSpectator              Should the scrubbing be done for someone watching the game? If so we usually want to blank out the deck since even if a buddy can see your hand, they shouldn't be able to deck snipe.
 * @returns {Object}
 */
UtilsGameSession.scrubGameSetupData = function(gameSession, gameSetupData, scrubFromPerspectiveOfPlayerId, forSpectator) {
  for (let i = 0; i < gameSetupData.players.length; i++) {
    // reset isRanked to default so players don't know if matched vs ranked or casual player
    var playerData = gameSetupData.players[i];
    delete playerData.isRanked;

    // scrub card ids and only retain card indices in deck if scrubbing for spectator or opponent's data
    if (forSpectator || (playerData.userId !== scrubFromPerspectiveOfPlayerId)) {
      playerData.deck = _.map(playerData.deck, cardData => ({
        id:-1,
        index: cardData.index
      }));
      playerData.startingDrawPile = _.map(playerData.startingDrawPile, cardData => ({
        id:-1,
        index: cardData.index
      }));
      // scrub the starting hand for opponent regardless if it's for the spectator or not
      if (playerData.userId !== scrubFromPerspectiveOfPlayerId) {
        playerData.startingHand = _.map(playerData.startingHand, function(cardData) { if (cardData != null) { return {id:-1, index: cardData.index}; } else { return null; } });
      }
    }
  }

  return gameSetupData;
};

/**
 * Remove sensitive data from player so it's safe to send to an opponent who might attempt to peek at the data to cheat.
 * @public
 * @param  {GameSession}  gameSession            The GameSession source of the data.
 * @param  {Object}    actionData            Plain JS object or Action object that we want to scrub.
 * @param  {String}    scrubFromPerspectiveOfPlayerId  Player ID for who we want to scrub for (the player who should NOT see sensitive data).
 * @param  {Boolean}    forSpectator            Should the scrubbing be done for someone watching the game? If so we usually want to blank out the deck since even if a buddy can see your hand, they shouldn't be able to deck snipe.
 */
UtilsGameSession.scrubSensitivePlayerData = (gameSession, playersData, scrubFromPerspectiveOfPlayerId, forSpectator) => (() => {
  const result = [];
  for (let i = 0; i < playersData.length; i++) {
  // reset isRanked to default so players don't know if matched vs ranked or casual player
    var playerData = playersData[i];
    delete playerData.isRanked;
    result.push(delete playerData.rank);
  }
  return result;
})();

/**
 * Remove sensitive data like deck and card information from an action and it's sub-actions so it's safe to send to an opponent who might attempt to peek at the data to cheat.
 * @public
 * @param  {GameSession}  gameSession            The GameSession source of the data.
 * @param  {Object}    actionData            Plain JS object or Action object that we want to scrub.
 * @param  {String}    scrubFromPerspectiveOfPlayerId  Player ID for who we want to scrub for (the player who should NOT see sensitive data).
 * @param  {Boolean}    forSpectator            Should the scrubbing be done for someone watching the game? If so we usually want to blank out the deck since even if a buddy can see your hand, they shouldn't be able to deck snipe.
 */
UtilsGameSession.scrubSensitiveActionData = function(gameSession, actionData, scrubFromPerspectiveOfPlayerId, forSpectator) {
  // scrub action by creating an instance of the action
  // and using the action's scrub sensitive data method
  let i, target;
  const action = gameSession.getActionByIndex(actionData.index);
  if (action != null) {
    action.scrubSensitiveData(actionData, scrubFromPerspectiveOfPlayerId, forSpectator);
  }

  // scrub resolve sub actions
  const {
    resolveSubActionIndices
  } = actionData;
  if (resolveSubActionIndices != null) {
    for (i = resolveSubActionIndices.length - 1; i >= 0; i--) {
      var resolveSubActionIndex = resolveSubActionIndices[i];
      var resolveSubAction = gameSession.getActionByIndex(resolveSubActionIndex);
      if ((resolveSubAction == null)) {
        // delete resolve sub actions that don't exist
        resolveSubActionIndices.splice(i, 1);
      } else {
        target = resolveSubAction.getTarget();
        if (resolveSubAction.isRemovableDuringScrubbing(scrubFromPerspectiveOfPlayerId, forSpectator) && (target != null) && target.isScrubbable(scrubFromPerspectiveOfPlayerId, forSpectator)) {
          // delete sub actions acting on cards that don't exist or haven't been played yet
          resolveSubActionIndices.splice(i, 1);
        }
      }
    }
  }

  // scrub sub-actions
  const subActionsOrderedByEventTypeData = actionData.subActionsOrderedByEventType;
  if (subActionsOrderedByEventTypeData != null) {
    for (i = subActionsOrderedByEventTypeData.length - 1; i >= 0; i--) {
      var subActionsByEventTypeData = subActionsOrderedByEventTypeData[i];
      var subActionsData = subActionsByEventTypeData.actions;
      for (var j = subActionsData.length - 1; j >= 0; j--) {
        var subActionData = subActionsData[j];
        var subAction = gameSession.getActionByIndex(subActionData.index);
        if ((subAction == null)) {
          // delete sub actions that don't exist
          subActionsData.splice(j, 1);
        } else {
          target = subAction.getTarget();
          if (subAction.isRemovableDuringScrubbing(scrubFromPerspectiveOfPlayerId, forSpectator) && (target != null) && target.isScrubbable(scrubFromPerspectiveOfPlayerId, forSpectator)) {
            // delete sub actions acting on cards that don't exist or haven't been played yet
            subActionsData.splice(j, 1);
          } else {
            // scrub sub action
            UtilsGameSession.scrubSensitiveActionData(gameSession, subActionData, scrubFromPerspectiveOfPlayerId, forSpectator);
          }
        }
      }

      if (subActionsData.length === 0) {
        // delete sub actions by event type data when no actions remain
        subActionsOrderedByEventTypeData.splice(i, 1);
      }
    }
  }

  return actionData;
};
