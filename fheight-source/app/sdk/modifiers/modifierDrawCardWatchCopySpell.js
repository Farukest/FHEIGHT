/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierDrawCardWatch = require('./modifierDrawCardWatch');
const CardType = require('app/sdk/cards/cardType');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierDrawCardWatchCopySpell extends ModifierDrawCardWatch {
  static initClass() {
  
    this.prototype.type ="ModifierDrawCardWatchCopySpell";
    this.type ="ModifierDrawCardWatchCopySpell";
  
    this.modifierName ="Draw Card Watch";
    this.description = "Whenever you draw a spell, put another copy of it in your Action Bar";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDrawCardWatch"];
  }

  onDrawCardWatch(action) {
    if (__guard__(action.getCard(), x => x.getType()) === CardType.Spell) {
      const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), action.getCard().createCloneCardData() );
      return this.getGameSession().executeAction(a);
    }
  }
}
ModifierDrawCardWatchCopySpell.initClass();

module.exports = ModifierDrawCardWatchCopySpell;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}