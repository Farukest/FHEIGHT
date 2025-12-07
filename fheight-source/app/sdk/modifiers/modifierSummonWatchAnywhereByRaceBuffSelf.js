/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatchByRaceBuffSelf = require('./modifierSummonWatchByRaceBuffSelf');

class ModifierSummonWatchAnywhereByRaceBuffSelf extends ModifierSummonWatchByRaceBuffSelf {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchAnywhereByRaceBuffSelf";
    this.type ="ModifierSummonWatchAnywhereByRaceBuffSelf";
  
    this.prototype.activeInHand = true;
    this.prototype.activeInDeck = true;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  onActivate() {
    // special check on activation in case this card is created mid-game
    // need to check all actions that occured this gamesession for triggers
    const summonMinionActions = this.getGameSession().filterActions(this.getIsActionRelevant.bind(this));
    return (() => {
      const result = [];
      for (var action of Array.from(summonMinionActions)) {
        if (this.getIsCardRelevantToWatcher(action.getCard()) && (action.getCard() !== this.getCard())) {
          result.push(this.onSummonWatch(action));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierSummonWatchAnywhereByRaceBuffSelf.initClass();

module.exports = ModifierSummonWatchAnywhereByRaceBuffSelf;
