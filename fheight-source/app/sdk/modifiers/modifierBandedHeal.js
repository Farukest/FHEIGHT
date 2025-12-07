/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierBanded = require('./modifierBanded');
const HealAction =     require("app/sdk/actions/healAction");

const i18next = require('i18next');

class ModifierBandedHeal extends ModifierBanded {
  static initClass() {
  
    this.prototype.type = "ModifierBandedHeal";
    this.type = "ModifierBandedHeal";
  
    this.modifierName = i18next.t("modifiers.banded_heal_name");
    this.description = i18next.t("modifiers.banded_heal_desc");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZealed", "FX.Modifiers.ModifierZealedHeal"];
  }

  onEndTurn() {
    super.onEndTurn();

    if ((this.getGameSession().getCurrentPlayer() === this.getCard().getOwner()) && (this.getCard().getHP() < this.getCard().getMaxHP())) {
      const healAction = this.getCard().getGameSession().createActionForType(HealAction.type);
      healAction.setTarget(this.getCard());
      healAction.setHealAmount(this.getCard().getMaxHP() - this.getCard().getHP());
      return this.getCard().getGameSession().executeAction(healAction);
    }
  }
}
ModifierBandedHeal.initClass();

module.exports = ModifierBandedHeal;
