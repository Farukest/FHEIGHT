/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSituationalBuffSelf = require('./modifierSituationalBuffSelf');
const Modifier = require('./modifier');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierSituationalBuffSelfIfSpriggin extends ModifierSituationalBuffSelf {
  static initClass() {
  
    this.prototype.type ="ModifierSituationalBuffSelfIfSpriggin";
    this.type ="ModifierSituationalBuffSelfIfSpriggin";
  
    this.modifierName ="ModifierSituationalBuffSelfIfSpriggin";
    this.description ="If there is a Spriggin gain +3 Attack";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = [
      Modifier.createContextObjectWithAttributeBuffs(3,0,{
        modifierName:"Spriggin Buff",
        appliedName:"Might of Spriggin",
        description:"If there is a Spriggin gain +3 Attack"
      })
    ];
    return contextObject;
  }

  getIsSituationActiveForCache() {
    for (var unit of Array.from(this.getGameSession().getBoard().getUnits())) {
      if ((unit != null ? unit.getBaseCardId() : undefined) === Cards.Neutral.Spriggin) {
        return true;
      }
    }
    return false;
  }
}
ModifierSituationalBuffSelfIfSpriggin.initClass();

module.exports = ModifierSituationalBuffSelfIfSpriggin;
