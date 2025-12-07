/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOnSummonFromHand = require('./modifierOnSummonFromHand');

class ModifierOnSummonFromHandApplyEmblems extends ModifierOnSummonFromHand {
  static initClass() {
  
    this.prototype.type ="ModifierOnSummonFromHandApplyEmblems";
    this.type ="ModifierOnSummonFromHandApplyEmblems";
  
    this.isKeyworded = true;
    this.modifierName = "Destiny";
    this.description = null;
    this.keywordDefinition = "Summon to gain a permanent game-changing effect.";
  
    this.prototype.emblems = null; //player modifiers for the emblem's ongoing effect
    this.prototype.applyToSelf = true;
    this.prototype.applyToEnemy = false;
  }

  static createContextObject(emblems, applyToSelf, applyToEnemy, options) {
    if (applyToSelf == null) { applyToSelf = true; }
    if (applyToEnemy == null) { applyToEnemy = false; }
    const contextObject = super.createContextObject(options);
    contextObject.emblems = emblems;
    contextObject.applyToSelf = applyToSelf;
    contextObject.applyToEnemy = applyToEnemy;
    return contextObject;
  }

  onSummonFromHand() {

    if (this.emblems != null) {
      const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
      const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
      return (() => {
        const result = [];
        for (var emblem of Array.from(this.emblems)) {
          emblem.isRemovable = false;
          if (emblem != null) {
            if (this.applyToSelf) {
              this.getGameSession().applyModifierContextObject(emblem, general);
            }
            if (this.applyToEnemy) {
              result.push(this.getGameSession().applyModifierContextObject(emblem, enemyGeneral));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierOnSummonFromHandApplyEmblems.initClass();

module.exports = ModifierOnSummonFromHandApplyEmblems;
