/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierReplaceWatch = require('./modifierReplaceWatch');
const RandomDamageAction = require('app/sdk/actions/randomDamageAction');
const PutCardInDeckAction = require('app/sdk/actions/putCardInDeckAction');

class ModifierReplaceWatchShuffleCardIntoDeck extends ModifierReplaceWatch {
  static initClass() {
  
    this.prototype.type ="ModifierReplaceWatchShuffleCardIntoDeck";
    this.type ="ModifierReplaceWatchShuffleCardIntoDeck";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierReplaceWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(cardDataOrIndexToSpawn, numOfCopies, options) {
    if (numOfCopies == null) { numOfCopies = 1; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.numOfCopies = numOfCopies;
    return contextObject;
  }


  onReplaceWatch(action) {
    if ((this.cardDataOrIndexToSpawn != null) && (this.numOfCopies > 0)) {
      return (() => {
        const result = [];
        for (let i = 0, end = this.numOfCopies, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          var a = new PutCardInDeckAction(this.getGameSession(), this.getCard().getOwnerId(), this.cardDataOrIndexToSpawn);
          result.push(this.getGameSession().executeAction(a));
        }
        return result;
      })();
    }
  }
}
ModifierReplaceWatchShuffleCardIntoDeck.initClass();


module.exports = ModifierReplaceWatchShuffleCardIntoDeck;
