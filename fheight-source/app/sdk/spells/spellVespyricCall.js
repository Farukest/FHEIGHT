/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Factions = require('app/sdk/cards/factionsLookup');
const Races = require('app/sdk/cards/racesLookup');
const Modifier = require('app/sdk/modifiers/modifier');
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class SpellVespyricCall extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const vespyrCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction6).getRace(Races.Vespyr).getIsGeneral(false).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
    const cardToDraw = vespyrCards[this.getGameSession().getRandomIntegerForExecution(vespyrCards.length)];
    const cardDataOrIndexToDraw = cardToDraw.createNewCardData();
    const buffContextObject = Modifier.createContextObjectWithAttributeBuffs(1,1);
    buffContextObject.appliedName = "Heeding the Call";
    cardDataOrIndexToDraw.additionalModifiersContextObjects = [ModifierManaCostChange.createContextObject(-1), buffContextObject];
    const a = new PutCardInHandAction(this.getGameSession(), this.getOwnerId(), cardDataOrIndexToDraw);
    return this.getGameSession().executeAction(a);
  }
}

module.exports = SpellVespyricCall;
