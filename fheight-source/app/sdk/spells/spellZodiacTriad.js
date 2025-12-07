/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Factions = require('app/sdk/cards/factionsLookup.js');
const CardType = require('app/sdk/cards/cardType');
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const GameFormat = require('app/sdk/gameFormat');
const _ = require('underscore');

class SpellZodiacTriad extends Spell {

  onApplyOneEffectToBoard(board, x, y, sourceAction) {
    super.onApplyOneEffectToBoard(board, x, y, sourceAction);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      // pull faction minions
      let factionMinions = [];
      if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
        factionMinions = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(Factions.Faction2).getType(CardType.Unit).getIsGeneral(false).getIsHiddenInCollection(false).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      } else {
        factionMinions = this.getGameSession().getCardCaches().getFaction(Factions.Faction2).getType(CardType.Unit).getIsGeneral(false).getIsHiddenInCollection(false).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      }

      if ((factionMinions != null ? factionMinions.length : undefined) > 0) {
        // filter mythron cards
        factionMinions = _.reject(factionMinions, card => card.getRarityId() === 6);
      }

      if (factionMinions.length > 0) {
        const card1 = factionMinions[this.getGameSession().getRandomIntegerForExecution(factionMinions.length)].createNewCardData();
        const card2 = factionMinions[this.getGameSession().getRandomIntegerForExecution(factionMinions.length)].createNewCardData();
        const card3 = factionMinions[this.getGameSession().getRandomIntegerForExecution(factionMinions.length)].createNewCardData();

        card1.additionalModifiersContextObjects = [ModifierManaCostChange.createContextObject(-1)];
        card2.additionalModifiersContextObjects = [ModifierManaCostChange.createContextObject(-1)];
        card3.additionalModifiersContextObjects = [ModifierManaCostChange.createContextObject(-1)];

        let a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), card1);
        this.getGameSession().executeAction(a);
        a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), card2);
        this.getGameSession().executeAction(a);
        a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), card3);
        return this.getGameSession().executeAction(a);
      }
    }
  }
}

module.exports = SpellZodiacTriad;
