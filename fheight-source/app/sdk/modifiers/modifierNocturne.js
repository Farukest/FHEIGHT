/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierNocturne extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierNocturne";
    this.type ="ModifierNocturne";
  
    this.modifierName ="ModifierNocturne";
    this.description = "Whenever you make Shadow Creep or a Wraithling, instead make both";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch"];
  }

  onAfterCleanupAction(e) {
    super.onAfterCleanupAction(e);

    const {
      action
    } = e;


    if (action instanceof ApplyCardToBoardAction && (action.getOwnerId() === this.getCard().getOwnerId())) {
      // if summoning a wraithling
      let playCardAction;
      if (action.getCard().getBaseCardId() === Cards.Faction4.Wraithling) {
        // also spawn a shadow creep
        playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), action.getTargetPosition().x, action.getTargetPosition().y, {id: Cards.Tile.Shadow});
        playCardAction.setSource(this.getCard());
        return this.getGameSession().executeAction(playCardAction);
      // if summoning a shadow creep tile
      } else if (action.getCard().getBaseCardId() === Cards.Tile.Shadow) {
        // also spawn a wraithling
        playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), action.getTargetPosition().x, action.getTargetPosition().y, {id: Cards.Faction4.Wraithling});
        playCardAction.setSource(this.getCard());
        return this.getGameSession().executeAction(playCardAction);
      }
    }
  }
}
ModifierNocturne.initClass();


module.exports = ModifierNocturne;
