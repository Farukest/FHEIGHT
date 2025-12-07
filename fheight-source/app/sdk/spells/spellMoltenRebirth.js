/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity =   require('./spellSpawnEntity');
const Factions = require('app/sdk/cards/factionsLookup');
const CardType = require('app/sdk/cards/cardType');
const KillAction = require('app/sdk/actions/killAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const GameFormat = require('app/sdk/gameFormat');
const _ = require('underscore');

class SpellMoltenRebirth extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Faction5.Rex};
    this.prototype.spawnSilently = true;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    // find unit that is to be killed (followup source)
    const targetUnit = board.getUnitAtPosition(this.getFollowupSourcePosition());
    const targetManaCost = targetUnit.getManaCost();

    if (targetUnit != null) {
      // kill original entity
      const killAction = new KillAction(this.getGameSession());
      killAction.setOwnerId(this.getOwnerId());
      killAction.setTarget(targetUnit);
      this.getGameSession().executeAction(killAction);

      // find valid Magmar minions with cost 1 greater than the source unit
      let cardCache = [];
      if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
        cardCache = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(Factions.Faction5).getIsHiddenInCollection(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getType(CardType.Unit).getCards();
      } else {
        cardCache = this.getGameSession().getCardCaches().getFaction(Factions.Faction5).getIsHiddenInCollection(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getType(CardType.Unit).getCards();
      }

      if (cardCache.length > 0) {
        let card;
        let cards = [];
        for (card of Array.from(cardCache)) {
          if (card.getManaCost() === (targetManaCost + 1)) {
            cards.push(card);
          }
        }

        if ((cards != null ? cards.length : undefined) > 0) {
          // filter mythron cards
          cards = _.reject(cards, card => card.getRarityId() === 6);
        }

        // pick randomly from among the Magmar units we found with right mana cost
        if (cards.length > 0) {
          card = cards[this.getGameSession().getRandomIntegerForExecution(cards.length)];
          this.cardDataOrIndexToSpawn = card.createNewCardData();

          return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
        }
      }
    }
  }
}
SpellMoltenRebirth.initClass();

module.exports = SpellMoltenRebirth;
