/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const Modifier = require('./modifier');

class ModifierOpeningGambitBuffSelfByOpponentHandCount extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitBuffSelfByOpponentHandCount";
    this.type = "ModifierOpeningGambitBuffSelfByOpponentHandCount";
  
    this.description = "Gains %X for each card in your opponent\'s action bar";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericBuff"];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.numCardsInHand = 0;

    return p;
  }

  static createContextObject(attackBuff, maxHPBuff, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    const buffContextObject = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    buffContextObject.appliedName = "Power of The Hand";
    contextObject.modifiersContextObjects = [buffContextObject];
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const subContextObject = modifierContextObject.modifiersContextObjects[0];
      return this.description.replace(/%X/, Stringifiers.stringifyAttackHealthBuff(subContextObject.attributeBuffs.atk,subContextObject.attributeBuffs.maxHP));
    } else {
      return this.description;
    }
  }

  applyManagedModifiersFromModifiersContextObjects(modifiersContextObjects, card) {
    // apply once per card in opponent's hand
    return __range__(0, this._private.numCardsInHand, false).map((i) =>
      super.applyManagedModifiersFromModifiersContextObjects(modifiersContextObjects, card));
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    this._private.numCardsInHand = this.getCard().getGameSession().getOpponentPlayerOfPlayerId(this.getCard().getOwnerId()).getDeck().getNumCardsInHand();
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierOpeningGambitBuffSelfByOpponentHandCount.initClass();

module.exports = ModifierOpeningGambitBuffSelfByOpponentHandCount;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}