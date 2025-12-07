/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyBuildWatch = require('./modifierMyBuildWatch');
const DrawCardAction = require('app/sdk/actions/drawCardAction');

class ModifierMyBuildWatchDrawCards extends ModifierMyBuildWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyBuildWatchDrawCards";
    this.type ="ModifierMyBuildWatchDrawCards";
  
    this.prototype.drawAmount = 0;
  }

  static createContextObject(drawAmount, options) {
    const contextObject = super.createContextObject(options);
    contextObject.drawAmount = drawAmount;
    return contextObject;
  }

  onBuildWatch(action) {
    super.onBuildWatch();

    return __range__(0, this.drawAmount, false).map((i) =>
      this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), this.getCard().getOwnerId())));
  }
}
ModifierMyBuildWatchDrawCards.initClass();

module.exports = ModifierMyBuildWatchDrawCards;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}