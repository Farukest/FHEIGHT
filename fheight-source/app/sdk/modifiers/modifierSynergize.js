/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const PlaySignatureCardAction = require('app/sdk/actions/playSignatureCardAction');
const CardType = require('app/sdk/cards/cardType');

const i18next = require('i18next');

class ModifierSynergize extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSynergize";
    this.type ="ModifierSynergize";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.blood_surge_def");
  
    this.modifierName =i18next.t("modifiers.blood_surge_name");
    this.description = "";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSynergize"];
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;

    // watch for a spell being cast from Signature Card slot by player who owns this entity
    if ((action instanceof PlaySignatureCardAction) && (action.getOwnerId() === this.getCard().getOwnerId()) && (__guard__(action.getCard(), x => x.type) === CardType.Spell)) {
      return this.onSynergize(action);
    }
  }

  onSynergize(action) {}
}
ModifierSynergize.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierSynergize;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}