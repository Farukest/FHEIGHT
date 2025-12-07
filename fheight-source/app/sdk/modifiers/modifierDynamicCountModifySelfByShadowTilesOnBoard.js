/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierDynamicCountModifySelf = require('./modifierDynamicCountModifySelf');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');

class ModifierDynamicCountModifySelfByShadowTilesOnBoard extends ModifierDynamicCountModifySelf {
  static initClass() {
  
    this.prototype.type ="ModifierDynamicCountModifySelfByShadowTilesOnBoard";
    this.type ="ModifierDynamicCountModifySelfByShadowTilesOnBoard";
  
    this.description ="This minion has %X for each friendly Shadow Creep";
  
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  static createContextObject(attackBuff, maxHPBuff, description, appliedName, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    const perTileStatBuffContextObject = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    if (appliedName) {
      perTileStatBuffContextObject.appliedName = appliedName;
    }
    contextObject.description = description;
    contextObject.modifiersContextObjects = [perTileStatBuffContextObject];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    return this.description.replace(/%X/, modifierContextObject.description);
  }

  getCurrentCount() {
    let allowUntargetable;
    let shadowTileCount = 0;
    for (var card of Array.from(this.getGameSession().getBoard().getCards(CardType.Tile, (allowUntargetable=true)))) {
      if ((card.getBaseCardId() === Cards.Tile.Shadow) && card.isOwnedBy(this.getCard().getOwner())) {
        shadowTileCount++;
      }
    }
    return shadowTileCount;
  }
}
ModifierDynamicCountModifySelfByShadowTilesOnBoard.initClass();

module.exports = ModifierDynamicCountModifySelfByShadowTilesOnBoard;
