/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');
const CardType = require('app/sdk/cards/cardType');
const KillAction = require('app/sdk/actions/killAction');
const Modifier = require('app/sdk/modifiers/modifier');
const Factions = require('app/sdk/cards/factionsLookup');
const FactionFactory = require('app/sdk/cards/factionFactory');
const _ = require('underscore');

class SpellSummonHighestCostMinion extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.appliedName = null;
    this.prototype.neutralOnly = true;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    let cardIndex;
    const gameSession = this.getGameSession();
    const ownerId = this.getOwnerId();
    const general = this.getGameSession().getGeneralForPlayerId(ownerId);
    const drawPile = this.getOwner().getDeck().getDrawPile();
    const possibleCardsToSummon = [];

    // first grab indices of all minions in the deck
    for (cardIndex of Array.from(drawPile)) {
      if (__guard__(gameSession.getCardByIndex(cardIndex), x1 => x1.getType()) === CardType.Unit) {
        if (this.neutralOnly) {
          if (gameSession.getCardByIndex(cardIndex).factionId === Factions.Neutral) {
            possibleCardsToSummon.push(cardIndex);
          }
        } else {
          possibleCardsToSummon.push(cardIndex);
        }
      }
    }

    if (possibleCardsToSummon.length > 0) {
      // then grab the cards those indexes are pointing to
      let cardToSummon, cardToSummonIndex;
      const minionList = [];
      for (cardIndex of Array.from(possibleCardsToSummon)) {
        minionList.push(gameSession.getCardByIndex(cardIndex));
      }

      // sort that list of cards by the highest mana cost
      const sortedMinionList = _.sortBy(minionList, 'manaCost').reverse();
      const highestManaCost = sortedMinionList[0].getManaCost();
      const highestManaCostMinions = [];

      // once we find the highest mana cost minion, find all other minions that match that mana cost
      for (var card of Array.from(sortedMinionList)) {
        if (card.getManaCost() === highestManaCost) {
          highestManaCostMinions.push(card);
        }
      }

      // then choose a random one from the list of those high cost minions
      if (highestManaCostMinions.length > 0) {
        const randomIndex = this.getGameSession().getRandomIntegerForExecution(highestManaCostMinions.length);
        cardToSummon = highestManaCostMinions[randomIndex];
      }

      // now that we know the card we want to summon, we have to look back in our list of indices to find the index that matches that card
      for (cardIndex of Array.from(possibleCardsToSummon)) {
        if (gameSession.getCardByIndex(cardIndex) === cardToSummon) {
          cardToSummonIndex = cardIndex;
        }
      }

      // that new index is what we summon
      if (cardToSummonIndex != null) {
        this.cardDataOrIndexToSpawn = cardToSummonIndex;
      }
    }

    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
  }
}
SpellSummonHighestCostMinion.initClass();

module.exports = SpellSummonHighestCostMinion;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}