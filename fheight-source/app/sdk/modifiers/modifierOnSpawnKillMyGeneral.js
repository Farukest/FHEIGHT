/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierSilence =   require('app/sdk/modifiers/modifierSilence');
const KillAction = require('app/sdk/actions/killAction');
const DieAction = require('app/sdk/actions/dieAction');
const SwapGeneralAction = require('app/sdk/actions/swapGeneralAction');

class ModifierOnSpawnKillMyGeneral extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierOnSpawnKillMyGeneral";
    this.type ="ModifierOnSpawnKillMyGeneral";
  
    this.modifierName ="ModifierOnSpawnKillMyGeneral";
    this.description = "Kill your General";
  
    this.isHiddenToUI = true;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  onActivate() {
    super.onActivate();

    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const myCard = this.getCard();

    // make sure to remove self to prevent triggering this modifier again
    this.getGameSession().removeModifier(this);

    // turn the new unit into your general
    if (general != null) {
      const swapGeneralAction = new SwapGeneralAction(this.getGameSession());
      swapGeneralAction.setIsDepthFirst(false);
      swapGeneralAction.setSource(general);
      swapGeneralAction.setTarget(myCard);
      this.getGameSession().executeAction(swapGeneralAction);
    }

    // kill the old general
    const dieAction = new DieAction(this.getGameSession());
    dieAction.setOwnerId(myCard.getOwnerId());
    dieAction.setTarget(general);
    return this.getGameSession().executeAction(dieAction);
  }
}
ModifierOnSpawnKillMyGeneral.initClass();

module.exports = ModifierOnSpawnKillMyGeneral;
