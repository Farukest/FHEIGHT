/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierDeathWatch = require('./modifierDeathWatch');
const DrawToXCardsAction = require('app/sdk/actions/drawToXCardsAction');

class ModifierDeathWatchDrawToXCards extends ModifierDeathWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDeathWatchDrawToXCards";
    this.type ="ModifierDeathWatchDrawToXCards";
  
    this.modifierName ="Deathwatch";
    this.description = "Draw until you have %X cards";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDeathwatch"];
  }

  static createContextObject(cardCount,options) {
    if (cardCount == null) { cardCount = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.cardCount = cardCount;
    contextObject.triggeredOnActionIndices = [];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.cardCount);
    } else {
      return this.description;
    }
  }

  onDeathWatch(action) {
    // only trigger once per root action
    // since this is a deathwatch, many things can die at once
    // and we don't want to trigger multiple sets of card draws
    let needle;
    const rootAction = action.getRootAction();
    if (!((needle = rootAction.getIndex(), Array.from(this.triggeredOnActionIndices).includes(needle)))) {
      const drawToXCardsAction = new DrawToXCardsAction(this.getGameSession(), this.getCard().getOwnerId());
      drawToXCardsAction.setCardCount(this.cardCount);
      this.getGameSession().executeAction(drawToXCardsAction);
      return this.triggeredOnActionIndices.push(rootAction.getIndex());
    }
  }
}
ModifierDeathWatchDrawToXCards.initClass();

module.exports = ModifierDeathWatchDrawToXCards;
