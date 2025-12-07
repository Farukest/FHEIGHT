/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');

class GameSessionModifier extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="GameSessionModifier";
    this.type ="GameSessionModifier";
  }
}
GameSessionModifier.initClass();

  // use this for modifiers that should be treated as if they belong to game session
  // really a player modifier but need to be able to differentiate this from standard Player Modifiers

module.exports = GameSessionModifier;
