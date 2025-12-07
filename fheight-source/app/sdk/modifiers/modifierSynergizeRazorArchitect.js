/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSynergize = require('./modifierSynergize');
const ModifierStunnedVanar = require('./modifierStunnedVanar');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierSynergizeRazorArchitect extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeRazorArchitect";
    this.type ="ModifierSynergizeRazorArchitect";
  }

  onSynergize(action) {
    super.onSynergize(action);
    const minionPosition = this.getCard().getPosition();

    const entities = this.getGameSession().getBoard().getEntitiesInRow(minionPosition.y, CardType.Unit);
    if (entities != null) {
      return (() => {
        const result = [];
        for (var entity of Array.from(entities)) {
          if ((entity != null) && (entity.getOwnerId() !== this.getCard().getOwnerId()) && !entity.getIsGeneral()) {
            var damageAction = new DamageAction(this.getGameSession());
            damageAction.setOwnerId(this.getCard().getOwnerId());
            damageAction.setSource(this.getCard());
            damageAction.setTarget(entity);
            damageAction.setDamageAmount(1);
            this.getGameSession().executeAction(damageAction);

            var stunModifier = ModifierStunnedVanar.createContextObject();
            result.push(this.getGameSession().applyModifierContextObject(stunModifier, entity));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierSynergizeRazorArchitect.initClass();

module.exports = ModifierSynergizeRazorArchitect;
