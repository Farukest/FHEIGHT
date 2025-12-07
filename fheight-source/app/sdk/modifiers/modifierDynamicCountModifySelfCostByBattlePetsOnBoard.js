/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDynamicCountModifySelf = require('./modifierDynamicCountModifySelf');
const ModifierManaCostChange = require('./modifierManaCostChange');
const Races = require('app/sdk/cards/racesLookup');
const CardType = require('app/sdk/cards/cardType');

class ModifierDynamicCountModifySelfCostByBattlePetsOnBoard extends ModifierDynamicCountModifySelf {
  static initClass() {
  
    this.prototype.type ="ModifierDynamicCountModifySelfCostByBattlePetsOnBoard";
    this.type ="ModifierDynamicCountModifySelfCostByBattlePetsOnBoard";
  
    this.description ="Costs %X for each friendly Battle Pet on the field";
  
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = true;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  static createContextObject(manaCostChange, description, appliedName, options) {
    if (manaCostChange == null) { manaCostChange = 0; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    const perPetCostChangeBuff = ModifierManaCostChange.createContextObject(manaCostChange);
    if (appliedName) {
      perPetCostChangeBuff.appliedName = appliedName;
    }
    contextObject.description = description;
    contextObject.modifiersContextObjects = [perPetCostChangeBuff];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    return this.description.replace(/%X/, modifierContextObject.description);
  }

  getCurrentCount() {
    let battlePetCount = 0;
    for (var card of Array.from(this.getGameSession().getBoard().getCards(CardType.Unit))) {
      if ((card.getOwnerId() === this.getCard().getOwnerId()) && card.getBelongsToTribe(Races.BattlePet)) {
        battlePetCount++;
      }
    }
    return battlePetCount;
  }
}
ModifierDynamicCountModifySelfCostByBattlePetsOnBoard.initClass();

module.exports = ModifierDynamicCountModifySelfCostByBattlePetsOnBoard;
