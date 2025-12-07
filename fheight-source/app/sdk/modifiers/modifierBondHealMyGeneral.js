/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Modifier = require('./modifier');
const ModifierBond = require('./modifierBond');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CardType = require('app/sdk/cards/cardType');
const HealAction = require('app/sdk/actions/healAction');
const _ = require('underscore');

class ModifierBondHealMyGeneral extends ModifierBond {
  static initClass() {
  
    this.prototype.type ="ModifierBondHealMyGeneral";
    this.type ="ModifierBondHealMyGeneral";
  
    this.description = "Heal your General";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBond"];
  
    this.prototype.healAmount = 0;
  }

  static createContextObject(healAmount) {
    const contextObject = super.createContextObject();
    contextObject.healAmount = healAmount;
    return contextObject;
  }

  onBond() {

    const healAction = new HealAction(this.getGameSession());
    healAction.setOwnerId(this.getCard().getOwnerId());
    healAction.setTarget(this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()));
    healAction.setHealAmount(this.healAmount);

    return this.getGameSession().executeAction(healAction);
  }
}
ModifierBondHealMyGeneral.initClass();

module.exports = ModifierBondHealMyGeneral;