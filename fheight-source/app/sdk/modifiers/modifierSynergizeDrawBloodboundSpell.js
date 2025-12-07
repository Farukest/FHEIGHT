/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSynergize = require('./modifierSynergize');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierSynergizeDrawBloodboundSpell extends ModifierSynergize {
  static initClass() {
  
    this.prototype.type ="ModifierSynergizeDrawBloodboundSpell";
    this.type ="ModifierSynergizeDrawBloodboundSpell";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSpellWatch"];
  }

  onSynergize(action) {
    super.onSynergize(action);
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const bloodboundSpell = general.getSignatureCardData();
    const a = new PutCardInHandAction(this.getCard().getGameSession(), this.getCard().getOwnerId(),  bloodboundSpell);
    return this.getGameSession().executeAction(a);
  }
}
ModifierSynergizeDrawBloodboundSpell.initClass();

module.exports = ModifierSynergizeDrawBloodboundSpell;