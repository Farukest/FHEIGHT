/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Action = require('app/sdk/actions/action');

/*
  Action used for modifiers.
*/
class ModifierAction extends Action {
  static initClass() {
  
    this.type = "ModifierAction";
    this.prototype.type = "ModifierAction";
    this.prototype._modifier = null;
    this.prototype.modifierIndex = null;
    this.prototype._parentModifier = null;
    this.prototype.parentModifierIndex = null;
  }

  constructor(gameSession, modifier) {
    super(gameSession);
    this.setModifier(modifier);
  }

  getLogName(){
    return super.getLogName() + `_${__guard__(this.getModifier(), x => x.getLogName())}`;
  }

  setModifier(modifier) {
    if (modifier != null) {
      this.modifierIndex = modifier.getIndex();

      // TODO: stop extracting card from modifier
      const card = modifier.getCardAffected();
      this.setOwnerId(card != null ? card.getOwnerId() : undefined);
      this.setSource(card);
      return this.setTarget(card);
    }
  }

  getModifierIndex() {
    return this.modifierIndex;
  }

  getModifier() {
    if (this._modifier == null) { this._modifier = this.getGameSession().getModifierByIndex(this.modifierIndex); }
    return this._modifier;
  }

  setParentModifier(parentModifier) {
    if (parentModifier != null) {
      return this.parentModifierIndex = parentModifier.getIndex();
    }
  }

  getParentModifierIndex() {
    return this.parentModifierIndex;
  }

  getParentModifier() {
    if (this._parentModifier == null) { this._parentModifier = this.getGameSession().getModifierByIndex(this.parentModifierIndex); }
    return this._parentModifier;
  }
}
ModifierAction.initClass();

module.exports = ModifierAction;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}