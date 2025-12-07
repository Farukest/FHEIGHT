/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit =   require('./modifierOpeningGambit');
const CardType = require('app/sdk/cards/cardType');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierOpeningGambitRetrieveRandomSpell extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitRetrieveRandomSpell";
    this.type ="ModifierOpeningGambitRetrieveRandomSpell";
  
    this.modifierName ="Opening Gambit";
    this.description ="Put a copy of a random spell you cast this game into your action bar";
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const spellsPlayedToBoard = this.getGameSession().getSpellsPlayed();
      if (spellsPlayedToBoard.length > 0) {
        const ownerId = this.getCard().getOwnerId();
        const spellsPlayedByOwner = [];
        for (var spell of Array.from(spellsPlayedToBoard)) {
          if (!spell.getIsFollowup() && (spell.getOwnerId() === ownerId)) {
            spellsPlayedByOwner.push(spell);
          }
        }

        if (spellsPlayedByOwner.length > 0) {
          const spellToCopy = spellsPlayedByOwner[this.getGameSession().getRandomIntegerForExecution(spellsPlayedByOwner.length)];
          if (spellToCopy != null) {
            // put fresh copy of spell into hand
            const a = new PutCardInHandAction(this.getGameSession(), ownerId, spellToCopy.createNewCardData());
            return this.getGameSession().executeAction(a);
          }
        }
      }
    }
  }
}
ModifierOpeningGambitRetrieveRandomSpell.initClass();

module.exports = ModifierOpeningGambitRetrieveRandomSpell;
