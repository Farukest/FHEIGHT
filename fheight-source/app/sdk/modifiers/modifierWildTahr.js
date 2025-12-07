/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEnemyAttackWatch = require('./modifierEnemyAttackWatch');
const Modifier = require('./modifier');
const i18next = require('i18next');

class  ModifierWildTahr extends ModifierEnemyAttackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierWildTahr";
    this.type ="ModifierWildTahr";
  
    this.modifierName ="ModifierWildTahr";
    this.description =i18next.t("modifiers.wild_tahr_def");
  }

  onEnemyAttackWatch(action) {

    const statContextObject = Modifier.createContextObjectWithAttributeBuffs(3);
    statContextObject.appliedName = i18next.t("modifiers.wild_tahr_name");
    statContextObject.durationEndTurn = 2;
    return this.getGameSession().applyModifierContextObject(statContextObject, this.getCard());
  }
}
ModifierWildTahr.initClass();

module.exports = ModifierWildTahr;
