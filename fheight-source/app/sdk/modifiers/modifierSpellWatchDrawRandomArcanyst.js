/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierSpellWatch = require('./modifierSpellWatch');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Races = require('app/sdk/cards/racesLookup');
const GameFormat = require('app/sdk/gameFormat');

class ModifierSpellWatchDrawRandomArcanyst extends ModifierSpellWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSpellWatchDrawRandomArcanyst";
    this.type ="ModifierSpellWatchDrawRandomArcanyst";
  
    this.modifierName ="Spell Watch";
    this.description = "Whenever you cast a spell, draw a random Arcanyst";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  onSpellWatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let arcanystCards = [];
      if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
        arcanystCards = this.getGameSession().getCardCaches().getIsLegacy(false).getRace(Races.Arcanyst).getIsToken(false).getIsHiddenInCollection(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      } else {
        arcanystCards = this.getGameSession().getCardCaches().getRace(Races.Arcanyst).getIsToken(false).getIsHiddenInCollection(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      }
      if (arcanystCards.length > 0) {
        const arcanystCard = arcanystCards[this.getGameSession().getRandomIntegerForExecution(arcanystCards.length)];
        const cardData = arcanystCard.createNewCardData();
        const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), cardData);
        return this.getGameSession().executeAction(a);
      }
    }
  }
}
ModifierSpellWatchDrawRandomArcanyst.initClass();

module.exports = ModifierSpellWatchDrawRandomArcanyst;
