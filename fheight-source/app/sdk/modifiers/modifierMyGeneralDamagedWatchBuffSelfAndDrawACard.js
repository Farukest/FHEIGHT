/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier.js');
const ModifierMyGeneralDamagedWatch = require('./modifierMyGeneralDamagedWatch.js');
const DamageAction = require('app/sdk/actions/damageAction.js');

class ModifierMyGeneralDamagedWatchBuffSelfAndDrawACard extends ModifierMyGeneralDamagedWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyGeneralDamagedWatchBuffSelfAndDrawACard";
    this.type ="ModifierMyGeneralDamagedWatchBuffSelfAndDrawACard";
  
    this.modifierName ="My General Damaged Watch";
    this.description ="Whenever your General takes damage, give this minion %X and draw a card";
  }

  static createContextObject(statContextObject, description, options) {
    const contextObject = super.createContextObject(options);
    contextObject.description = description;
    contextObject.modifiersContextObjects = statContextObject;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      return this.description.replace(/%X/, modifierContextObject.description);
    } else {
      return this.description;
    }
  }

  onDamageDealtToGeneral(action) {
    this.applyManagedModifiersFromModifiersContextObjects(this.modifiersContextObjects, this.getCard());
    return this.getGameSession().executeAction(this.getCard().getOwner().getDeck().actionDrawCard());
  }
}
ModifierMyGeneralDamagedWatchBuffSelfAndDrawACard.initClass();

module.exports = ModifierMyGeneralDamagedWatchBuffSelfAndDrawACard;
