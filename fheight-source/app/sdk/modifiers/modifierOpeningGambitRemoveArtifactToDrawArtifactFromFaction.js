/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const RemoveRandomArtifactAction = require('app/sdk/actions/removeRandomArtifactAction');
const CardType = require('app/sdk/cards/cardType');
const GameFormat = require('app/sdk/gameFormat');

class ModifierOpeningGambitRemoveArtifactToDrawArtifactFromFaction extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitRemoveArtifactToDrawArtifactFromFaction";
    this.type = "ModifierOpeningGambitRemoveArtifactToDrawArtifactFromFaction";
  
    this.modifierName = "Opening Gambit";
    this.description = "Destroy a random enemy artifact to draw a random in-faction artifact";
  }

  onOpeningGambit() {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
      const modifiersByArtifact = enemyGeneral.getArtifactModifiersGroupedByArtifactCard();

      // if enemy General has at least one artifact on
      if (modifiersByArtifact.length > 0) {
        //remove 1 artifact at random
        const removeArtifactAction = new RemoveRandomArtifactAction(this.getGameSession());
        removeArtifactAction.setTarget(enemyGeneral);
        this.getGameSession().executeAction(removeArtifactAction);

        //add random in-faction artifact to action bar
        const factionId = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId()).getFactionId();
        let factionArtifacts = [];
        if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
          factionArtifacts = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(factionId).getType(CardType.Artifact).getIsHiddenInCollection(false).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
        } else {
          factionArtifacts = this.getGameSession().getCardCaches().getFaction(factionId).getType(CardType.Artifact).getIsHiddenInCollection(false).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
        }

        if (factionArtifacts.length > 0) {
          const cardToPutInHand = factionArtifacts[this.getGameSession().getRandomIntegerForExecution(factionArtifacts.length)];
          const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), cardToPutInHand.createNewCardData());
          return this.getGameSession().executeAction(a);
        }
      }
    }
  }
}
ModifierOpeningGambitRemoveArtifactToDrawArtifactFromFaction.initClass();

module.exports = ModifierOpeningGambitRemoveArtifactToDrawArtifactFromFaction;
