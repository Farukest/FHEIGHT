/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellApplyModifiers =   require('./spellApplyModifiers');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const RemoveAction = require('app/sdk/actions/removeAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const UtilsJavascript = require('app/common/utils/utils_javascript');

class SpellBounceToActionbarApplyModifiers extends SpellApplyModifiers {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const applyEffectPosition = {x, y};

    // remove the existing unit
    const removingEntity = board.getCardAtPosition(applyEffectPosition, this.targetType);
    if (removingEntity != null) {
      const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
      removeOriginalEntityAction.setOwnerId(this.getOwnerId());
      removeOriginalEntityAction.setTarget(removingEntity);
      this.getGameSession().executeAction(removeOriginalEntityAction);
    }

    // put a fresh card matching the original unit into hand
    const newCardData = removingEntity.createNewCardData();
    // add additional modifiers as needed
    if (this.targetModifiersContextObjects) {
      if (newCardData.additionalModifiersContextObjects != null) {
        newCardData.additionalModifiersContextObjects.concat(UtilsJavascript.deepCopy(this.targetModifiersContextObjects));
      } else {
        newCardData.additionalModifiersContextObjects = UtilsJavascript.deepCopy(this.targetModifiersContextObjects);
      }
    }
    const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), removingEntity.getOwnerId(), newCardData);
    return this.getGameSession().executeAction(putCardInHandAction);
  }
}
SpellBounceToActionbarApplyModifiers.initClass();


module.exports = SpellBounceToActionbarApplyModifiers;
