/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Quest = require('./quest');
const QuestType = require('./questTypeLookup');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const GameType = require('app/sdk/gameType');

class QuestBeginner extends Quest {
  static initClass() {
    // TODO: needs documentation
    this.prototype.isReplaceable =false;
    this.prototype.isRequired =true;
    this.prototype.isBeginner =true;
  
    // Set the default Gold reward for quests.
    this.prototype.goldReward = 150;
  }

  constructor(){
    super(...arguments);
    if (Math.floor(this.id / 100) !== 99) {
      throw new Error("Invalid Beginner Quest ID");
    }
  }
}
QuestBeginner.initClass();

module.exports = QuestBeginner;
