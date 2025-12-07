/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');

class SpellSpawnEntityAndApplyPlayerModifiers extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.applyToOwnGeneral = false;
    this.prototype.applyToOpponentGeneral = false;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    if (this.targetModifiersContextObjects != null) {
      let modifierContextObject;
      const ownerId = this.getOwnerId();

      if (this.applyToOwnGeneral) {
        // cast on own General
        const ownGeneral = this.getGameSession().getGeneralForPlayerId(ownerId);
        for (modifierContextObject of Array.from(this.targetModifiersContextObjects)) {
          this.getGameSession().applyModifierContextObject(modifierContextObject, ownGeneral);
        }
      }

      if (this.applyToOpponentGeneral) {
        // cast on opponent's General
        const opponentGeneral = this.getGameSession().getGeneralForOpponentOfPlayerId(ownerId);
        return (() => {
          const result = [];
          for (modifierContextObject of Array.from(this.targetModifiersContextObjects)) {
            result.push(this.getGameSession().applyModifierContextObject(modifierContextObject, opponentGeneral));
          }
          return result;
        })();
      }
    }
  }
}
SpellSpawnEntityAndApplyPlayerModifiers.initClass();

module.exports = SpellSpawnEntityAndApplyPlayerModifiers;
