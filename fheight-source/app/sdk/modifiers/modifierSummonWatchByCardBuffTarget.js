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
const ModifierSummonWatch = require('./modifierSummonWatch');

class ModifierSummonWatchByCardBuffTarget extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchByCardBuffTarget";
    this.type ="ModifierSummonWatchByCardBuffTarget";
  
    this.modifierName ="Summon Watch (buff by card Id)";
    this.description = "Whenever you summon %X, %Y";
    this.prototype.validCardIds = null; // array of card IDs to watch for
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject(modContextObject, validCardIds, cardDescription, buffDescription, options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modContextObject;
    contextObject.validCardIds = validCardIds;
    contextObject.cardDescription = cardDescription;
    contextObject.buffDescription = buffDescription;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const replaceText = this.description.replace(/%X/, modifierContextObject.cardDescription);
      return replaceText.replace(/%Y/, modifierContextObject.buffDescription);
    } else {
      return this.description;
    }
  }

  onSummonWatch(action) {
    const entity = action.getCard();
    if (entity != null) {
      return Array.from(this.modifiersContextObjects).map((modifierContextObject) =>
        this.getGameSession().applyModifierContextObject(modifierContextObject, entity));
    }
  }

  getIsCardRelevantToWatcher(card) {
    let needle;
    return (needle = card.getBaseCardId(), Array.from(this.validCardIds).includes(needle));
  }
}
ModifierSummonWatchByCardBuffTarget.initClass(); // card is in list of cards we want to buff

module.exports = ModifierSummonWatchByCardBuffTarget;
