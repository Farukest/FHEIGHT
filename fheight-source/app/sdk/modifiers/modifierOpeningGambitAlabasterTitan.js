/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierOpeningGambitAlabasterTitan extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitAlabasterTitan";
    this.type ="ModifierOpeningGambitAlabasterTitan";
  
    this.description ="If you have no spells in your deck, equip a full set of armor";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit(action) {

    const gameSession = this.getGameSession();

    let hasSpells = false;

    const drawPile = this.getCard().getOwner().getDeck().getDrawPile();
    for (let i = 0; i < drawPile.length; i++) {
      var cardIndex = drawPile[i];
      if (__guard__(gameSession.getCardByIndex(cardIndex), x => x.getType()) === CardType.Spell) {
        hasSpells = true;
        break;
      }
    }
    
    if (!hasSpells) {
      const artifact1 = {id: Cards.Artifact.ArclyteRegalia};
      const artifact2 = {id: Cards.Artifact.IndomitableWill};
      const artifact3 = {id: Cards.Artifact.HaloBulwark};

      const playCardAction1 = new PlayCardSilentlyAction(gameSession, this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, artifact1);
      const playCardAction2 = new PlayCardSilentlyAction(gameSession, this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, artifact2);
      const playCardAction3 = new PlayCardSilentlyAction(gameSession, this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, artifact3);

      playCardAction1.setSource(this.getCard());
      playCardAction2.setSource(this.getCard());
      playCardAction3.setSource(this.getCard());

      gameSession.executeAction(playCardAction1);
      gameSession.executeAction(playCardAction2);
      return gameSession.executeAction(playCardAction3);
    }
  }
}
ModifierOpeningGambitAlabasterTitan.initClass();

module.exports = ModifierOpeningGambitAlabasterTitan;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}