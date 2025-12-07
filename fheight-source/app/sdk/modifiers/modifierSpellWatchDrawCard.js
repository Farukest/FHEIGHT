/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSpellWatch = require('./modifierSpellWatch');
const DrawCardAction = require('app/sdk/actions/drawCardAction');

class ModifierSpellWatchDrawCard extends ModifierSpellWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSpellWatchDrawCard";
    this.type ="ModifierSpellWatchDrawCard";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  onSpellWatch(action) {

    return this.getGameSession().executeAction(new DrawCardAction(this.getGameSession(), this.getCard().getOwnerId()));
  }
}
ModifierSpellWatchDrawCard.initClass();

module.exports = ModifierSpellWatchDrawCard;
