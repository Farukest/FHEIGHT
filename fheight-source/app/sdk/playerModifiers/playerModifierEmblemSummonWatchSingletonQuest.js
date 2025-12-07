/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifierEmblemGainMinionOrLoseControlWatch = require('./playerModifierEmblemGainMinionOrLoseControlWatch');
const ModifierQuestBuffNeutral = require('app/sdk/modifiers/modifierQuestBuffNeutral');
const CardType = require('app/sdk/cards/cardType');

class PlayerModifierEmblemSummonWatchSingletonQuest extends PlayerModifierEmblemGainMinionOrLoseControlWatch {
  static initClass() {
  
    this.prototype.type ="PlayerModifierEmblemSummonWatchSingletonQuest";
    this.type ="PlayerModifierEmblemSummonWatchSingletonQuest";
  
    this.prototype.maxStacks = 1;
  
    this.prototype.modifiersContextObjects = null;
  }

  static createContextObject(modifiersContextObjects, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    return contextObject;
  }

  onGainMinionWatch(action) {
    const entity = action.getTarget();
    if ((entity != null) && (this.modifiersContextObjects != null)) {
      return (() => {
        const result = [];
        for (var modifiersContextObject of Array.from(this.modifiersContextObjects)) {
          if (modifiersContextObject != null) {
            modifiersContextObject.isRemovable = false;
            result.push(this.getGameSession().applyModifierContextObject(modifiersContextObject, entity));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  onLoseControlWatch(action) {
    const entity = action.getTarget();
    if (entity != null) {
      const modifiers = entity.getModifiers();
      if (modifiers != null) {
        return (() => {
          const result = [];
          for (var modifier of Array.from(modifiers)) {
            if (modifier instanceof ModifierQuestBuffNeutral) {
              result.push(this.getGameSession().removeModifier(modifier));
            } else {
              result.push(undefined);
            }
          }
          return result;
        })();
      }
    }
  }

  onActivate() {
    super.onActivate();
    if (this.modifiersContextObjects != null) {
      return (() => {
        const result = [];
        for (var unit of Array.from(this.getGameSession().getBoard().getFriendlyEntitiesForEntity(this.getCard()))) {
          if ((unit != null) && !unit.getIsGeneral() && (unit.getType() === CardType.Unit) && (unit !== this.getSourceCard())) {
            result.push((() => {
              const result1 = [];
              for (var modifier of Array.from(this.modifiersContextObjects)) {
                if (modifier != null) {
                  modifier.isRemovable = false;
                  result1.push(this.getGameSession().applyModifierContextObject(modifier, unit));
                } else {
                  result1.push(undefined);
                }
              }
              return result1;
            })());
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
PlayerModifierEmblemSummonWatchSingletonQuest.initClass();

module.exports = PlayerModifierEmblemSummonWatchSingletonQuest;
