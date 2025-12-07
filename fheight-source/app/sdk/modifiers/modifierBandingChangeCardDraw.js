/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierBanding = require('./modifierBanding');
const PlayerModifierCardDrawModifier =   require('app/sdk/playerModifiers/playerModifierCardDrawModifier');
const ModifierCardControlledPlayerModifiers = require('./modifierCardControlledPlayerModifiers');
const i18next = require('i18next');

class ModifierBandingChangeCardDraw extends ModifierBanding {
  static initClass() {
  
    this.prototype.type ="ModifierBandingChangeCardDraw";
    this.type ="ModifierBandingChangeCardDraw";
  
    this.description =i18next.t("modifiers.banding_change_card_draw_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierZeal", "FX.Modifiers.ModifierZealHeal"];
  }

  static createContextObject(cardDraw, options) {
    if (cardDraw == null) { cardDraw = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.appliedName = i18next.t("modifiers.banding_change_card_draw_name");
    contextObject.cardDraw = cardDraw;
    const cardDrawContextObject = PlayerModifierCardDrawModifier.createContextObject(cardDraw);
    cardDrawContextObject.activeInHand = (contextObject.activeInDeck = (contextObject.activeInSignatureCards = false));
    cardDrawContextObject.activeOnBoard = true;
    const bandedContextObject = ModifierCardControlledPlayerModifiers.createContextObjectToTargetOwnPlayer([cardDrawContextObject], "Draw cards");
    bandedContextObject.appliedName = contextObject.appliedName;
    bandedContextObject.description = ModifierBandingChangeCardDraw.getDescription(contextObject);
    contextObject.modifiersContextObjects = [bandedContextObject];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return i18next.t("modifiers.banding_change_card_draw_def",{amount:modifierContextObject.cardDraw});
      //return @description.replace /%X/, modifierContextObject.cardDraw
    } else {
      return this.description;
    }
  }

  onChangeOwner(fromOwnerId, toOwnerId) {
    super.onChangeOwner(fromOwnerId, toOwnerId);
    this.removeManagedModifiersFromCard(this.getCard());
    const cardDrawContextObject = PlayerModifierCardDrawModifier.createContextObject(this.cardDraw);
    cardDrawContextObject.activeInHand = (cardDrawContextObject.activeInDeck = (cardDrawContextObject.activeInSignatureCards = false));
    cardDrawContextObject.activeOnBoard = true;
    const bandedContextObject = ModifierCardControlledPlayerModifiers.createContextObjectToTargetOwnPlayer([cardDrawContextObject], "Draw cards");
    bandedContextObject.appliedName = this.modifiersContextObjects[0].appliedName;
    bandedContextObject.description = this.modifiersContextObjects[0].description;
    this.modifiersContextObjects = [bandedContextObject];
    return this.applyManagedModifiersFromModifiersContextObjectsOnce(this.modifiersContextObjects, this.getCard());
  }
}
ModifierBandingChangeCardDraw.initClass();

module.exports = ModifierBandingChangeCardDraw;
