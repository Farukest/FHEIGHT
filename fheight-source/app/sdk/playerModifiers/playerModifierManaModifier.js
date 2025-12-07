/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const PlayerModifier = require('./playerModifier');
const CardType = require('app/sdk/cards/cardType');

class PlayerModifierManaModifier extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierManaModifier";
    this.type ="PlayerModifierManaModifier";
  
    this.prototype.bonusMana = 0;
    this.prototype.costChange = 0;
    this.prototype.isAura = false; // mana modifiers may be auras, but only when they change the cost of cards
    this.prototype.auraIncludeAlly = true;
    this.prototype.auraIncludeBoard = false;
    this.prototype.auraIncludeEnemy = false;
    this.prototype.auraIncludeGeneral = false;
    this.prototype.auraIncludeHand = true;
    this.prototype.auraIncludeSelf = false;
    this.prototype.auraIncludeSignatureCards = false;
  }

  static createContextObject(bonusMana, costChange, auraFilterByCardType, auraFilterByRaceIds, options) {
    if (bonusMana == null) { bonusMana = 0; }
    if (costChange == null) { costChange = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.bonusMana = bonusMana;
    contextObject.costChange = costChange;
    if (costChange !== 0) {
      // modifies mana cost of cards
      contextObject.isAura = true;
      contextObject.auraFilterByCardType = auraFilterByCardType;
      contextObject.auraFilterByRaceIds = auraFilterByRaceIds;
      contextObject.modifiersContextObjects = [ModifierManaCostChange.createContextObject(costChange)];
    }
    return contextObject;
  }

  static createCostChangeContextObject(costChange, auraFilterByCardType, auraFilterByRaceIds, options) {
    return this.createContextObject(0, costChange, auraFilterByCardType, auraFilterByRaceIds, options);
  }

  static createBonusManaContextObject(bonusMana, options) {
    return this.createContextObject(bonusMana, null, null, null, options);
  }

  _filterPotentialCardInAura(card) {
    let beingUsedForBonusMana = false;
    if ((this.costChange === 0) && !this.isAura) {
      beingUsedForBonusMana = true;
    }
    return beingUsedForBonusMana || super._filterPotentialCardInAura(card);
  }
}
PlayerModifierManaModifier.initClass();

module.exports = PlayerModifierManaModifier;
