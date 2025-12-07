/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEnemyTeamMoveWatch = require('./modifierEnemyTeamMoveWatch');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');

class ModifierEnemyTeamMoveWatchSummonEntityBehind extends ModifierEnemyTeamMoveWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEnemyTeamMoveWatchSummonEntityBehind";
    this.type ="ModifierEnemyTeamMoveWatchSummonEntityBehind";
  
    this.modifierName ="Enemy Team Move Watch Buff Target";
    this.description = "Whenever an enemy minion is moved for any reason, summon %X";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMyTeamMoveWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnDescription, spawnCount, spawnSilently, options) {
    if (spawnDescription == null) { spawnDescription = ""; }
    if (spawnCount == null) { spawnCount = 1; }
    if (spawnSilently == null) { spawnSilently = false; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.spawnDescription = spawnDescription;
    contextObject.spawnCount = spawnCount;
    contextObject.spawnSilently = spawnSilently;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const replaceText = "a "+modifierContextObject.spawnDescription+" behind them";
      return this.description.replace(/%X/, replaceText);
    } else {
      return this.description;
    }
  }

  onEnemyTeamMoveWatch(action, movingTarget) {
    super.onEnemyTeamMoveWatch(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const behindPosition = this.getSpaceBehindMovingUnit(movingTarget);
      const board = this.getGameSession().getBoard();
      const unitInBehindPosition = board.getUnitAtPosition(behindPosition);
      // check to see if there's anything behind the unit (where we want to summon).  if there's not, summon the unit there
      if(!unitInBehindPosition) {
        let spawnAction;
        const ownerId = this.getSpawnOwnerId(action);
        const cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn();
        if (this.spawnSilently) {
          spawnAction = new PlayCardSilentlyAction(this.getGameSession(), ownerId, behindPosition.x, behindPosition.y, cardDataOrIndexToSpawn);
        } else {
          spawnAction = new PlayCardAction(this.getGameSession(), ownerId, behindPosition.x, behindPosition.y, cardDataOrIndexToSpawn);
        }
        spawnAction.setSource(this.getCard());
        return this.getGameSession().executeAction(spawnAction);
      }
    }
  }

  getCardDataOrIndexToSpawn() {
    return this.cardDataOrIndexToSpawn;
  }

  getSpaceBehindMovingUnit(behindUnit) {
    if (behindUnit != null) {
      const position = behindUnit.getPosition();
      position.x += behindUnit.isOwnedByPlayer1() ? -1 : 1;

      return position;
    }
  }

  getSpawnOwnerId(action) {
    return this.getCard().getOwnerId();
  }
}
ModifierEnemyTeamMoveWatchSummonEntityBehind.initClass();

module.exports = ModifierEnemyTeamMoveWatchSummonEntityBehind;
