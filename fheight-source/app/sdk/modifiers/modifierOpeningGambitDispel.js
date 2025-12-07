/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit =   require('./modifierOpeningGambit');
const CardType = require('app/sdk/cards/cardType');
const ModifierSilence = require('./modifierSilence');
const CONFIG = require('app/common/config');

class ModifierOpeningGambitDispel extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitDispel";
    this.type ="ModifierOpeningGambitDispel";
  
    this.modifierName ="Opening Gambit";
    this.description ="Dispel ALL spaces around it";
  }

  onOpeningGambit() {
    const entities = this.getGameSession().getBoard().getCardsWithinRadiusOfPosition(this.getCard().getPosition(), CardType.Entity, 1, false, true);
    return Array.from(entities).map((entity) =>
      this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), entity));
  }
}
ModifierOpeningGambitDispel.initClass();

module.exports = ModifierOpeningGambitDispel;
