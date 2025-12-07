/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellApplyModifiers = require('./spellApplyModifiers');
const Modifier = require('app/sdk/modifiers/modifier');
const Races = require('app/sdk/cards/racesLookup');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class SpellMightOfVespyr extends SpellApplyModifiers {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    
    let buffAmount = 0;
    const allUnits = board.getUnits(true, false);
    if (allUnits != null) {
      for (var unit of Array.from(allUnits)) {
        if ((unit != null) && (unit.getOwnerId() === this.getOwnerId()) && unit.getBelongsToTribe(Races.Vespyr)) {
          buffAmount += 2;
        }
      }
    }

    const statContextObject = Modifier.createContextObjectWithAttributeBuffs(buffAmount, buffAmount);
    statContextObject.appliedName = "Vespyrian Might";
    this.setTargetModifiersContextObjects([
      statContextObject
    ]);

    return super.onApplyEffectToBoardTile(board,x,y,sourceAction); // apply buff
  }
}

module.exports = SpellMightOfVespyr;
