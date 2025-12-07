/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifierEmblemSummonWatch = require('./playerModifierEmblemSummonWatch');
const CardType = require('app/sdk/cards/cardType');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');

class PlayerModifierEmblemSummonWatchFromHandMagmarBuffQuest extends PlayerModifierEmblemSummonWatch {
  static initClass() {
  
    this.prototype.type ="PlayerModifierEmblemSummonWatchFromHandMagmarBuffQuest";
    this.type ="PlayerModifierEmblemSummonWatchFromHandMagmarBuffQuest";
  
    this.prototype.maxStacks = 1;
  
    this.prototype.modifiersContextObjects = null;
  }

  static createContextObject(modifiersContextObjects, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    return contextObject;
  }

  onSummonWatch(action) {
    if (action instanceof PlayCardFromHandAction) {
      const entity = action.getTarget();
      if ((entity != null) && (this.modifiersContextObjects != null)) {
        return (() => {
          const result = [];
          for (var modifiersContextObject of Array.from(this.modifiersContextObjects)) {
            if (modifiersContextObject != null) {
              modifiersContextObject.isRemovable = false;
              //Set this parent of buff, so it's known the modifier originates from an emblem
              result.push(this.getGameSession().applyModifierContextObject(modifiersContextObject, entity, this));
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
PlayerModifierEmblemSummonWatchFromHandMagmarBuffQuest.initClass();

module.exports = PlayerModifierEmblemSummonWatchFromHandMagmarBuffQuest;
