/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackWatch = require('./modifierMyAttackWatch');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

var ModifierMyAttackWatchSummonDeadMinions = (function() {
  let numMinions = undefined;
  ModifierMyAttackWatchSummonDeadMinions = class ModifierMyAttackWatchSummonDeadMinions extends ModifierMyAttackWatch {
    static initClass() {
  
      this.prototype.type ="ModifierMyAttackWatchSummonDeadMinions";
      this.type ="ModifierMyAttackWatchSummonDeadMinions";
  
      numMinions = 0;
    }

    static createContextObject(numMinions,options) {
      const contextObject = super.createContextObject(options);
      contextObject.numMinions = numMinions;
      return contextObject;
    }

    onMyAttackWatch(action) {
      if (this.getGameSession().getIsRunningAsAuthoritative()) {
        const deadMinions = this.getGameSession().getDeadUnits(this.getCard().getOwnerId());
        if ((deadMinions != null) && (deadMinions.length > 0)) {
          let numToSpawn = this.numMinions;
          if (deadMinions.length < numToSpawn) {
            numToSpawn = deadMinions.length;
          }
          return (() => {
            const result = [];
            for (let i = 0, end = numToSpawn, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
              var minion = deadMinions.splice(this.getGameSession().getRandomIntegerForExecution(deadMinions.length), 1)[0];
              var validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, CONFIG.ALL_BOARD_POSITIONS, minion);
              if (validSpawnLocations.length > 0) {
                var location = validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0];
                var cardData = minion.createNewCardData();
                var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), location.x, location.y, cardData);
                playCardAction.setSource(this.getCard());
                result.push(this.getGameSession().executeAction(playCardAction));
              } else {
                result.push(undefined);
              }
            }
            return result;
          })();
        }
      }
    }
  };
  ModifierMyAttackWatchSummonDeadMinions.initClass();
  return ModifierMyAttackWatchSummonDeadMinions;
})();

module.exports = ModifierMyAttackWatchSummonDeadMinions;
