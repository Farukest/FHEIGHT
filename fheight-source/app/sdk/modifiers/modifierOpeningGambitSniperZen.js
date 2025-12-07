/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const CardType = require('app/sdk/cards/cardType');
const SwapUnitAllegianceAction = require('app/sdk/actions/swapUnitAllegianceAction');

class ModifierOpeningGambitSniperZen extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitSniperZen";
    this.type = "ModifierOpeningGambitSniperZen";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit() {

    const position = this.getCard().getPosition();
    const units = this.getGameSession().getBoard().getEntitiesInRow(position.y, CardType.Unit);
    if (units != null) {
      return (() => {
        const result = [];
        for (var unit of Array.from(units)) {
          if ((unit != null) && !unit.getIsGeneral() && (unit.getOwnerId() !== this.getCard().getOwnerId()) && (unit.getATK() <= 2)) {
            var a = new SwapUnitAllegianceAction(this.getGameSession());
            a.setTarget(unit);
            result.push(this.getGameSession().executeAction(a));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierOpeningGambitSniperZen.initClass();

module.exports = ModifierOpeningGambitSniperZen;
