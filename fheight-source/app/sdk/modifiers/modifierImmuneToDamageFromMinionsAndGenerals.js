/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierImmuneToDamage =   require('./modifierImmuneToDamage');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');
const i18next = require('i18next');

/*
  Modifier that reduces all damage dealt by minions or generals to this unit to 0.
*/

class ModifierImmuneToDamageFromMinionsAndGenerals extends ModifierImmuneToDamage {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToDamageFromMinionsAndGenerals";
    this.type ="ModifierImmuneToDamageFromMinionsAndGenerals";
  
    this.modifierName =i18next.t("modifiers.immune_to_damage_from_minions_and_generals_name");
    this.description =i18next.t("modifiers.immune_to_damage_from_minions_and_generals_def");
  }


  getIsActionRelevant(a) {
    return (this.getCard() != null) && a instanceof DamageAction && a.getIsValid() && (this.getCard() === a.getTarget()) && (a.getSource().getRootCard().getType() === CardType.Unit);
  }
}
ModifierImmuneToDamageFromMinionsAndGenerals.initClass();

module.exports = ModifierImmuneToDamageFromMinionsAndGenerals;
