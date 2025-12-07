/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierSilence =   require('app/sdk/modifiers/modifierSilence');

class ModifierOnSpawnCopyMyGeneral extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierOnSpawnCopyMyGeneral";
    this.type ="ModifierOnSpawnCopyMyGeneral";
  
    this.modifierName ="ModifierOnSpawnCopyMyGeneral";
    this.description = "Become a copy of your General";
  
    this.isHiddenToUI = true;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericSpawn"];
  }

  onApplyToCardBeforeSyncState() {
    super.onApplyToCardBeforeSyncState();

    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const myCard = this.getCard();

    // set the max hp of the clone to the current hp of the general
    // instead of using getHP (the current hp), we have to use the base max - damage taken
    // as we'll clone all modifiers from the general next, which could boost the clone's max hp
    myCard.maxHP = general.maxHP - general.getDamage();

    // flush cached maxHP attribute on clone
    // this is necessary as no modifier is changing the attribute value via the expected methods
    myCard.flushCachedAttribute("maxHP");

    // clone all modifiers from general
    return (() => {
      const result = [];
      for (var modifier of Array.from(general.getModifiers())) {
        if ((modifier != null) && !modifier.getIsAdditionalInherent() && modifier.getIsCloneable() && !(modifier instanceof ModifierSilence)) {
          var contextObject = modifier.createContextObjectForClone();

          // convert artifact modifiers into "plain" modifiers
          if (contextObject.maxDurability > 0) {
            contextObject.durability = 0;
            contextObject.maxDurability = 0;
            contextObject.isRemovable = true;
          }

          // hide all modifiers applied to this copy (prevents weird names from showing up)
          contextObject.isHiddenToUI = true;
          result.push(this.getCard().getGameSession().applyModifierContextObject(contextObject, this.getCard()));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierOnSpawnCopyMyGeneral.initClass();

module.exports = ModifierOnSpawnCopyMyGeneral;
