/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSynergize = require('./modifierSynergize');

class ModifierSynergizeRefreshSpell extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeRefreshSpell";
    this.type ="ModifierSynergizeRefreshSpell";
  
    this.description ="Refresh your Bloodbound spell";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  onSynergize(action) {
    super.onSynergize(action);

    const player = this.getCard().getGameSession().getPlayerById(this.getCard().getOwnerId());
    return this.getGameSession().executeAction(player.actionActivateSignatureCard());
  }
}
ModifierSynergizeRefreshSpell.initClass();

module.exports = ModifierSynergizeRefreshSpell;
