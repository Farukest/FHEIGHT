/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DieAction = require('app/sdk/actions/dieAction');

const i18next = require('i18next');

class ModifierDyingWish extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWish";
    this.type ="ModifierDyingWish";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.dying_wish_def");
  
    this.modifierName =i18next.t("modifiers.dying_wish_name");
    this.description = null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish"];
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    // when our entity has died
    if (action instanceof DieAction && (action.getTarget() === this.getCard()) && this.getCard().getIsRemoved()) {
      return this.onDyingWish(action);
    }
  }

  onDyingWish(action) {}
}
ModifierDyingWish.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierDyingWish;
