/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierBanding = require('./modifierBanding');
const ModifierDealDamageWatchDrawCard =  require('./modifierDealDamageWatchDrawCard');
const i18next = require('i18next');

class ModifierBandingDealDamageWatchDrawCard extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingDealDamageWatchDrawCard";
    this.type ="ModifierBandingDealDamageWatchDrawCard";
  
    //maxStacks: 1
    this.description = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal"];
  }

  static createContextObject(options) {
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    contextObject.appliedName = i18next.t("modifiers.banding_deal_damage_watch_draw_card_name");
    const bandedContextObject = ModifierDealDamageWatchDrawCard.createContextObject();
    bandedContextObject.appliedName = i18next.t("modifiers.banding_deal_damage_watch_draw_card_name");
    contextObject.modifiersContextObjects = [bandedContextObject];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    return this.description;
  }
}
ModifierBandingDealDamageWatchDrawCard.initClass();

module.exports = ModifierBandingDealDamageWatchDrawCard;
