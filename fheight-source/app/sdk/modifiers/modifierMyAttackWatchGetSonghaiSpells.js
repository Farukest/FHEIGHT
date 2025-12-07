/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackWatch = require('./modifierMyAttackWatch');
const CardType = require('app/sdk/cards/cardType');
const Factions = require('app/sdk/cards/factionsLookup.js');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const GameFormat = require('app/sdk/gameFormat');

class ModifierMyAttackWatchGetSonghaiSpells extends ModifierMyAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackWatchGetSonghaiSpells";
    this.type ="ModifierMyAttackWatchGetSonghaiSpells";
  
    this.prototype.numCards = 0;
  }

  static createContextObject(numCards) {
    const contextObject = super.createContextObject();
    contextObject.numCards = numCards;
    return contextObject;
  }

  onMyAttackWatch(action) {
    super.onMyAttackWatch(action);

    return (() => {
      const result = [];
      for (let i = 0, end = this.numCards, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        if (this.getGameSession().getIsRunningAsAuthoritative()) {
          var f2SpellCards = [];
          if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
            f2SpellCards = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(Factions.Faction2).getType(CardType.Spell).getIsHiddenInCollection(false).getIsPrismatic(false).getIsSkinned(false).getCards();
          } else {
            f2SpellCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction2).getType(CardType.Spell).getIsHiddenInCollection(false).getIsPrismatic(false).getIsSkinned(false).getCards();
          }
          if (f2SpellCards.length > 0) {
            var spellCard = f2SpellCards[this.getGameSession().getRandomIntegerForExecution(f2SpellCards.length)];
            var cardData = spellCard.createNewCardData();
            var a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), cardData);
            result.push(this.getGameSession().executeAction(a));
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierMyAttackWatchGetSonghaiSpells.initClass();

module.exports = ModifierMyAttackWatchGetSonghaiSpells;
