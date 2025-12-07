/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const CardType = require('app/sdk/cards/cardType');
const Rarity = require('app/sdk/cards/rarityLookup');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const GameFormat = require('app/sdk/gameFormat');

class ModifierDyingWishDrawEnemyLegendaryArtifact extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishDrawEnemyLegendaryArtifact";
    this.type ="ModifierDyingWishDrawEnemyLegendaryArtifact";
  }

  onDyingWish(action) {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
      const factionId = enemyGeneral.getFactionId();

      let factionArtifacts = [];
      if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
        factionArtifacts = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(factionId).getType(CardType.Artifact).getRarity(Rarity.Legendary).getIsHiddenInCollection(false).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      } else {
        factionArtifacts = this.getGameSession().getCardCaches().getFaction(factionId).getType(CardType.Artifact).getRarity(Rarity.Legendary).getIsHiddenInCollection(false).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      }

      if (factionArtifacts.length > 0) {
        const cardToPutInHand = factionArtifacts[this.getGameSession().getRandomIntegerForExecution(factionArtifacts.length)];
        const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), cardToPutInHand.createNewCardData());
        return this.getGameSession().executeAction(a);
      }
    }
  }
}
ModifierDyingWishDrawEnemyLegendaryArtifact.initClass();

module.exports = ModifierDyingWishDrawEnemyLegendaryArtifact;
