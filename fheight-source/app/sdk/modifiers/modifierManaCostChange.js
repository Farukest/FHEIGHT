/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =   require('./modifier');
const ApplyCardToBoardAction =   require('../actions/applyCardToBoardAction');
const _ = require('underscore');
const i18next = require('i18next');

class ModifierManaCostChange extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierManaCostChange";
    this.type ="ModifierManaCostChange";
  
    this.modifierName =i18next.t("modifiers.mana_shift_name");
  
    this.prototype.attributeBuffs = {
      manaCost: 0
    };
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierManaCostChange"];
  }

  static createContextObject(costChange, options) {
    if (costChange == null) { costChange = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.attributeBuffs = {manaCost: costChange};
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const costChange = modifierContextObject.attributeBuffs.manaCost;
      if (costChange >= 0) {
        if ((modifierContextObject.attributeBuffsAbsolute != null) && _.includes(modifierContextObject.attributeBuffsAbsolute, "manaCost")) {
          return i18next.t("modifiers.mana_shift_set",{amount: Math.abs(costChange)});
        } else {
          return i18next.t("modifiers.mana_shift_plus",{amount: Math.abs(costChange)});
        }
      } else if (costChange < 0) {
        return i18next.t("modifiers.mana_shift_minus",{amount: Math.abs(costChange)});
      }
    }
  }

  _onAfterAction(event) {
    // destroy this modifier if the card it is applied to has been played
    const {
      action
    } = event;
    if (this.getCard().getIsPlayed()) {
      const appliedByActionIndex = this.getCard().getAppliedToBoardByActionIndex();
      if ((appliedByActionIndex === -1) || (action.getIndex() === appliedByActionIndex)) {
        this.getGameSession().removeModifier(this);
        return;
      }
    }

    return super._onAfterAction(event);
  }
}
ModifierManaCostChange.initClass();

module.exports = ModifierManaCostChange;
