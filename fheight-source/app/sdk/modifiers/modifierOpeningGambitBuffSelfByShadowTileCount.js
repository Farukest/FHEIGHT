/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit =       require('./modifierOpeningGambit');
const ModifierStackingShadows =  require('./modifierStackingShadows');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const Modifier = require('./modifier');

class ModifierOpeningGambitBuffSelfByShadowTileCount extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitBuffSelfByShadowTileCount";
    this.type = "ModifierOpeningGambitBuffSelfByShadowTileCount";
  
    this.modifierName = "Opening Gambit";
    this.description = "Gains %X for each of your Shadow Creep";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericBuff"];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.numTilesAtSpawn = 0;

    return p;
  }

  static createContextObject(attackBuff, maxHPBuff, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    if (options == null) { options = undefined; }
    const contextObject = super.createContextObject(options);
    const perTileStatBuffContextObject = Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff);
    perTileStatBuffContextObject.appliedName = "Drawn Power";
    contextObject.modifiersContextObjects = [perTileStatBuffContextObject];
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
    // apply once per sacrifice
    return __range__(0, this._private.numTilesAtSpawn, false).map((i) =>
      super.applyManagedModifiersFromModifiersContextObjects(modifiersContextObjects, card));
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    this._private.numTilesAtSpawn = ModifierStackingShadows.getNumStacksForPlayer(this.getGameSession().getBoard(), this.getCard().getOwner());
    return this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
  }
}
ModifierOpeningGambitBuffSelfByShadowTileCount.initClass();

module.exports = ModifierOpeningGambitBuffSelfByShadowTileCount;

function __range__(left, right, inclusive) {
  let range = [];
  let ascending = left < right;
  let end = !inclusive ? right : ascending ? right + 1 : right - 1;
  for (let i = left; ascending ? i < end : i > end; ascending ? i++ : i--) {
    range.push(i);
  }
  return range;
}