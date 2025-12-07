/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const BonusManaAction =       require('app/sdk/actions/bonusManaAction');
const Cards =                 require('app/sdk/cards/cardsLookupComplete');
const CardType =               require('app/sdk/cards/cardType');
const CONFIG =                 require('app/common/config');
const ModifierCollectable =   require('./modifierCollectable');
let i18next = require('i18next');

i18next = require('i18next');

class ModifierCollectableBonusMana extends ModifierCollectable {
  static initClass() {
  
    this.prototype.type ="ModifierCollectableBonusMana";
    this.type ="ModifierCollectableBonusMana";
  
    this.modifierName = i18next.t("modifiers.bonus_mana_name");
    this.description = i18next.t("modifiers.bonus_mana_def");
  
    this.prototype.bonusMana = 1;
    this.prototype.bonusDuration = 1;
    this.prototype.fxResource = ["FX.Modifiers.ModifierCollectibleBonusMana"];
  }

  onCollect(entity) {
    super.onCollect(entity);

    const action = this.getGameSession().createActionForType(BonusManaAction.type);
    action.setSource(this.getCard());
    action.setTarget(entity);
    action.bonusMana = this.bonusMana;
    action.bonusDuration = this.bonusDuration;
    return this.getGameSession().executeAction(action);
  }
}
ModifierCollectableBonusMana.initClass();

module.exports = ModifierCollectableBonusMana;
