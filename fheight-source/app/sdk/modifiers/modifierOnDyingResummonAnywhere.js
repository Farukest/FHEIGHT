/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOnDying = require('./modifierOnDying');
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const UtilsPosition = require('app/common/utils/utils_position');
const _ = require('underscore');

class ModifierOnDyingResummonAnywhere extends ModifierOnDying {
  static initClass() {
  
    this.prototype.type ="ModifierOnDyingResummonAnywhere";
    this.type ="ModifierOnDyingResummonAnywhere";
  }

  onDying() {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const wholeBoardPattern = CONFIG.ALL_BOARD_POSITIONS;
      const cardData = this.getCard().createNewCardData();
      const thisEntityPosition = this.getCard().getPosition();
      const validPositions = _.reject(wholeBoardPattern, position => UtilsPosition.getPositionsAreEqual(position, thisEntityPosition));
      const spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, validPositions, this.getCard(), this.getCard(), 1);

      return (() => {
        const result = [];
        for (var position of Array.from(spawnLocations)) {
          var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, cardData);
          playCardAction.setSource(this.getCard());
          result.push(this.getGameSession().executeAction(playCardAction));
        }
        return result;
      })();
    }
  }
}
ModifierOnDyingResummonAnywhere.initClass();

module.exports = ModifierOnDyingResummonAnywhere;
