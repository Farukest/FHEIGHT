/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellIntensify = require('./spellIntensify');
const Modifier = require('app/sdk/modifiers/modifier');
const CardType = require('app/sdk/cards/cardType');

class SpellIntensifyIncreasingDominance extends SpellIntensify {
  static initClass() {
  
    this.prototype.modifierAppliedName = null;
  }

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board,x,y,sourceAction);

    const buffAmount = this.getIntensifyAmount() * 2;

    const statContextObject = Modifier.createContextObjectWithAttributeBuffs(0,buffAmount);
    statContextObject.appliedName = this.modifierAppliedName;

    const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    if (myGeneral != null) {
      return (() => {
        const result = [];
        for (var entity of Array.from(board.getFriendlyEntitiesForEntity(myGeneral, CardType.Unit))) {
          if (entity != null) {
            result.push(this.getGameSession().applyModifierContextObject(statContextObject, entity));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
SpellIntensifyIncreasingDominance.initClass();

module.exports = SpellIntensifyIncreasingDominance;
