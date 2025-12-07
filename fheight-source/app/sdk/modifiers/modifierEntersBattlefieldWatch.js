/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierEntersBattlefieldWatch extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierEntersBattlefieldWatch";
    this.type ="ModifierEntersBattlefieldWatch";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  onActivate() {
    super.onActivate();
    return this.onEntersBattlefield();
  }

  onEntersBattlefield() {}
}
ModifierEntersBattlefieldWatch.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierEntersBattlefieldWatch;
