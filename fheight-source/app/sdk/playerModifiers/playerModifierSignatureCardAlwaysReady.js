/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');

class PlayerModifierSignatureCardAlwaysReady extends PlayerModifier {
  static initClass() {
  
    // essentially just a tag that this player's bloodborn spell should be ready every turn
  
    this.prototype.type ="PlayerModifierSignatureCardAlwaysReady";
    this.type ="PlayerModifierSignatureCardAlwaysReady";
  }
}
PlayerModifierSignatureCardAlwaysReady.initClass();

module.exports = PlayerModifierSignatureCardAlwaysReady;
