/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const RemoveAction = require('app/sdk/actions/removeAction');
const i18next = require('i18next');

class ModifierMirage extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierMirage";
    this.type ="ModifierMirage";
  
    this.modifierName =i18next.t("modifiers.mirage_name");
    this.description =i18next.t("modifiers.mirage_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
    this.prototype.isRemovable = false;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierMirage"];
  }

  onBeforeAction(event) {
    super.onBeforeAction(event);
    const {
      action
    } = event;

    // supress strikeback on this minion since it must vanish immediately when attacked
    if (action instanceof AttackAction && (action.getTarget() === this.getCard()) && action.getIsStrikebackAllowed()) {
      action.setIsStrikebackAllowed(false);
    }

    // when attacked, remove self immediately
    if (action instanceof AttackAction && (action.getTarget() === this.getCard()) && !action.getIsImplicit()) {
      const thisEntity = this.getCard();
      if (__guard__(this.getCard(), x => x.getIsActive())) {
        const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
        removeOriginalEntityAction.setOwnerId(thisEntity.getOwnerId());
        removeOriginalEntityAction.setTarget(thisEntity);
        removeOriginalEntityAction.setIsDepthFirst(true);
        return this.getGameSession().executeAction(removeOriginalEntityAction);
      }
    }
  }
}
ModifierMirage.initClass();


module.exports = ModifierMirage;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}