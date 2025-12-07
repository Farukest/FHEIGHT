/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ReplaceCardFromHandAction = require('app/sdk/actions/replaceCardFromHandAction');
const i18next = require('i18next');

class ModifierBuffSelfOnReplace extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierBuffSelfOnReplace";
    this.type ="ModifierBuffSelfOnReplace";
  
    this.modifierName ="Buff Self On Replace";
    this.description =i18next.t("modifiers.buff_self_on_replace_def");
  
    this.prototype.activeInHand = true;
    this.prototype.activeInDeck = true;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBuffSelfOnReplace"];
  }

  static createContextObject(attackBuff, maxHPBuff, costChange, description, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    if (costChange == null) { costChange = 0; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    const statsBuff = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    statsBuff.appliedName = i18next.t("modifiers.buff_self_on_replace_name");
    statsBuff.attributeBuffs["manaCost"] = costChange;
    contextObject.modifiersContextObjects = [statsBuff];
    contextObject.description = description;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return i18next.t("modifiers.buff_self_on_replace_def",{desc:this.description});
      //return @description.replace /%X/, modifierContextObject.description
    } else {
      return this.description;
    }
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    // watch for my player replacing THIS card
    if (action instanceof ReplaceCardFromHandAction && (action.getOwnerId() === this.getCard().getOwnerId())) {
      const replacedCard = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(action.replacedCardIndex);
      if (replacedCard === this.getCard()) {
        return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
      }
    }
  }
}
ModifierBuffSelfOnReplace.initClass();

module.exports = ModifierBuffSelfOnReplace;
