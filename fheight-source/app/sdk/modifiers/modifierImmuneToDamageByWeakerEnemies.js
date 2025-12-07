/*
 * decaffeinate suggestions:
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierImmuneToDamage =   require('./modifierImmuneToDamage');
const DamageAction =   require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');

class ModifierImmuneToDamageByWeakerEnemies extends ModifierImmuneToDamage {
  static initClass() {
  
    this.prototype.type ="ModifierImmuneToDamageByWeakerEnemies";
    this.type ="ModifierImmuneToDamageByWeakerEnemies";
  
    this.prototype.includeGenerals = false;
  }

  static createContextObject(includeGenerals, options) {
    const contextObject = super.createContextObject(options);
    contextObject.includeGenerals = includeGenerals;
    return contextObject;
  }

  getIsActionRelevant(a) {
    return (this.getCard() != null) && a instanceof DamageAction && a.getIsValid() && (this.getCard() === a.getTarget()) && (__guard__(a.getSource(), x => x.getType()) === CardType.Unit) && (this.includeGenerals || !a.getSource().getIsGeneral()) && (a.getSource().getATK() < a.getTarget().getATK());
  }
}
ModifierImmuneToDamageByWeakerEnemies.initClass();

module.exports = ModifierImmuneToDamageByWeakerEnemies;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}