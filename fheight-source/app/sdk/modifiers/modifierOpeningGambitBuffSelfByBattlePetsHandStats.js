/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const Modifier = require('./modifier');
const Races = require('app/sdk/cards/racesLookup');

class ModifierOpeningGambitBuffSelfByBattlePetsHandStats extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitBuffSelfByBattlePetsHandStats";
    this.type = "ModifierOpeningGambitBuffSelfByBattlePetsHandStats";
  
    this.description = "Gain the combined Attack and Health of all Battle Pets in your action bar";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericBuff"];
  }

  onOpeningGambit() {
    super.onOpeningGambit();
    let healthBuff = 0;
    let attackBuff = 0;
    for (var card of Array.from(this.getCard().getOwner().getDeck().getCardsInHandExcludingMissing())) {
      if (card.getBelongsToTribe(Races.BattlePet)) {
        healthBuff += card.getMaxHP();
        attackBuff += card.getATK();
      }
    }
    const buffContextObject = Modifier.createContextObjectWithAttributeBuffs(attackBuff, healthBuff);
    buffContextObject.appliedName = "Calculated Power";
    return this.getGameSession().applyModifierContextObject(buffContextObject, this.getCard());
  }
}
ModifierOpeningGambitBuffSelfByBattlePetsHandStats.initClass();

module.exports = ModifierOpeningGambitBuffSelfByBattlePetsHandStats;
