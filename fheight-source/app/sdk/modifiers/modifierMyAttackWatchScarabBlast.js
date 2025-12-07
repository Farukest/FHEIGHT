/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackWatch = require('./modifierMyAttackWatch');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class ModifierMyAttackWatchScarabBlast extends ModifierMyAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackWatchScarabBlast";
    this.type ="ModifierMyAttackWatchScarabBlast";
  }

  onMyAttackWatch(action) {

    const target = action.getTarget();
    if (target != null) {
      let spawnPosition;
      let sameRowRight = false;
      let sameRowLeft = false;
      let sameColumnUp = false;
      let sameColumnDown = false;

      const targetPosition = target.getPosition();
      const myPosition = this.getCard().getPosition();
      const board = this.getCard().getGameSession().getBoard();

      if (targetPosition.x === myPosition.x) {
        if (targetPosition.y < myPosition.y) {
          sameColumnDown = true;
        } else {
          sameColumnUp = true;
        }
      } else if (targetPosition.y === myPosition.y) {
        if (targetPosition.x < myPosition.x) {
          sameRowLeft = true;
        } else {
          sameRowRight = true;
        }
      }

      const spawnPositions = [];

      if (sameRowRight) {
        spawnPosition = {x: myPosition.x + 1, y: myPosition.y};
        while (board.isOnBoard(spawnPosition)) {
          spawnPositions.push(spawnPosition);
          spawnPosition = {x: spawnPosition.x + 1, y: spawnPosition.y};
        }
      } else if (sameRowLeft) {
        spawnPosition = {x: myPosition.x - 1, y: myPosition.y};
        while (board.isOnBoard(spawnPosition)) {
          spawnPositions.push(spawnPosition);
          spawnPosition = {x: spawnPosition.x - 1, y: spawnPosition.y};
        }
      } else if (sameColumnUp) {
        spawnPosition = {x: myPosition.x, y: myPosition.y + 1};
        while (board.isOnBoard(spawnPosition)) {
          spawnPositions.push(spawnPosition);
          spawnPosition = {x: spawnPosition.x, y: spawnPosition.y + 1};
        }
      } else if (sameColumnDown) {
        spawnPosition = {x: myPosition.x, y: myPosition.y - 1};
        while (board.isOnBoard(spawnPosition)) {
          spawnPositions.push(spawnPosition);
          spawnPosition = {x: spawnPosition.x, y: spawnPosition.y - 1};
        }
      }

      if (spawnPositions.length > 0) {
        return (() => {
          const result = [];
          for (var position of Array.from(spawnPositions)) {
            if ((position != null) && !((position.x === targetPosition.x) && (position.y === targetPosition.y))) {
              var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, {id: Cards.Faction3.Scarab});
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
}
ModifierMyAttackWatchScarabBlast.initClass();

module.exports = ModifierMyAttackWatchScarabBlast;
