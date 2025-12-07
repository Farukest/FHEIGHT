/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Sandbox = require('./sandbox');
const Deck = require('app/sdk/cards/deck');

class SandboxDeveloper extends Sandbox {
  static initClass() {
  
    this.type = "SandboxDeveloper";
    this.prototype.type = "SandboxDeveloper";
  
    this.prototype.skipMulligan = true;
  }

  setupSessionModes(gameSession) {
    super.setupSessionModes(gameSession);
    return gameSession.setIsDeveloperMode(true);
  }
}
SandboxDeveloper.initClass();

module.exports = SandboxDeveloper;
