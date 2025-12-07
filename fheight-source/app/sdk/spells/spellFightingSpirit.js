/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Factions = require('app/sdk/cards/factionsLookup.js');
const Races = require('app/sdk/cards/racesLookup.js');

class SpellFightingSpirit extends SpellApplyModifiers {

  onApplyOneEffectToBoard(board, x, y, sourceAction) {
    super.onApplyOneEffectToBoard(board, x, y, sourceAction);

    // pull faction battle pets + neutral token battle pets
    const factionBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction1).getRace(Races.BattlePet).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
    const neutralBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getRace(Races.BattlePet).getIsToken(true).getIsPrismatic(false).getIsSkinned(false).getCards();
    const battlePetCards = [].concat(factionBattlePetCards, neutralBattlePetCards);

    const card = battlePetCards[this.getGameSession().getRandomIntegerForExecution(battlePetCards.length)];
    const a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), card.createNewCardData());
    return this.getGameSession().executeAction(a);
  }
}

module.exports = SpellFightingSpirit;
