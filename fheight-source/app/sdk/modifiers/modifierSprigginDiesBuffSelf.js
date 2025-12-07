/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const DieAction = require('app/sdk/actions/dieAction');
const CardType = require('app/sdk/cards/cardType');
const i18next = require('i18next');

class ModifierSprigginDiesBuffSelf extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSprigginDiesBuffSelf";
    this.type ="ModifierSprigginDiesBuffSelf";
  
    this.description = "Whenever a Spriggin dies, give this +3/+3";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff"];
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [
      Modifier.createContextObjectWithAttributeBuffs(3,3,{
        modifierName:"Spriggin Dies Buff Self",
        appliedName:i18next.t("modifiers.spriggin_dies_buff_self_name"),
        description:i18next.t("modifiers.spriggin_dies_buff_self_def")
      })
    ];
    return contextObject;
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;
    const target = action.getTarget();
    const entity = this.getCard();
    // watch for a unit dying
    if (action instanceof DieAction && ((target != null ? target.type : undefined) === CardType.Unit) && (target !== entity)) {
      if (target.getBaseCardId() === Cards.Neutral.Spriggin) {
        return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
      }
    }
  }
}
ModifierSprigginDiesBuffSelf.initClass();

module.exports = ModifierSprigginDiesBuffSelf;
