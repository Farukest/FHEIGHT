/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const PlayerModifierEndTurnWatchRevertBBS = require('app/sdk/playerModifiers/playerModifierEndTurnWatchRevertBBS');

class ModifierOpeningGambitChangeSignatureCardForThisTurn extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitChangeSignatureCardForThisTurn";
    this.type ="ModifierOpeningGambitChangeSignatureCardForThisTurn";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  
    this.prototype.cardData = null;
  }

  static createContextObject(cardData) {
    const contextObject = super.createContextObject();
    contextObject.cardData = cardData;
    return contextObject;
  }

  onOpeningGambit(action) {
    super.onOpeningGambit(action);

    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());

    //only add modifier to revert if one doesn't already exist, so we don't revert to a temp BBS
    if (!general.hasActiveModifierClass(PlayerModifierEndTurnWatchRevertBBS)) {

      const currentBBS = general.getSignatureCardData();
      const revertBBSModifier = PlayerModifierEndTurnWatchRevertBBS.createContextObject(currentBBS);
      revertBBSModifier.durationEndTurn = 1;
      this.getGameSession().applyModifierContextObject(revertBBSModifier, general);
    }

    general.setSignatureCardData(this.cardData);
    return this.getGameSession().executeAction(general.getOwner().actionGenerateSignatureCard());
  }
}
ModifierOpeningGambitChangeSignatureCardForThisTurn.initClass();

module.exports = ModifierOpeningGambitChangeSignatureCardForThisTurn;
