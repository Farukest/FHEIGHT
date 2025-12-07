/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellDamage =  require('./spellDamage');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const ModifierSilence = require('app/sdk/modifiers/modifierSilence');
const _ = require('underscore');

class SpellVeilOfUnraveling extends SpellDamage {
  static initClass() {
  
    this.prototype.damageAmount = null;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    if ((this.damageAmount == null)) {
      this.destroyShadowCreepAndSetSpellDamage();
    }
    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
  }

  destroyShadowCreepAndSetSpellDamage() {
    this.damageAmount = 0;
    // find friendly shadow creep
    return (() => {
      const result = [];
      for (var card of Array.from(this.getGameSession().getBoard().getCards(CardType.Tile, true))) {
        if ((card.getBaseCardId() === Cards.Tile.Shadow) && card.isOwnedBy(this.getOwner())) {
          this.damageAmount++; //increase damage of spell
          result.push(this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), card));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
SpellVeilOfUnraveling.initClass(); // destroy shadow creep tile

module.exports = SpellVeilOfUnraveling;
