/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const i18next = require('i18next');

class ModifierSilence extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierSilence";
    this.type = "ModifierSilence";
  
    this.modifierName =i18next.t("modifiers.silence_name");
    this.description =i18next.t("modifiers.silence_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDispel"];
  }

  onApplyToCard(card) {
    let allowableSilenceTarget = true;
    if ((card.getType() === CardType.Unit) && !card.getIsTargetable()) {
      allowableSilenceTarget = false;
    }

    // temporarily make self unremovable
    const wasRemovable = this.isRemovable;
    this.isRemovable = false;

    if (allowableSilenceTarget) {
      // silence card and remove all other modifiers
      card.silence();
    }

    super.onApplyToCard(card);

    // restore removable state
    this.isRemovable = wasRemovable;

    if (!allowableSilenceTarget) { // remove modifier immediately after attempting to slience
      return this.getGameSession().removeModifier(this);
    }
  }
}
ModifierSilence.initClass();

module.exports = ModifierSilence;
