/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Action = require('./action');
const CardType = require('app/sdk/cards/cardType');

class RemoveRandomArtifactAction extends Action {
  static initClass() {
  
    this.type ="RemoveRandomArtifactAction";
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = RemoveRandomArtifactAction.type; }
  }

  _execute() {
    super._execute();

    // remove artifact
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const target = this.getTarget();
      if (target != null) {
        if (!target.getIsGeneral()) { //artifacts are only on the general
          return;
        }

        // get all artifact modifiers by source card
        const modifiersByArtifact = target.getArtifactModifiersGroupedByArtifactCard();

        // pick a random set of modifiers that were added by the same source card index and remove them
        if (modifiersByArtifact.length > 0) {
          const modifiersToRemove = modifiersByArtifact[this.getGameSession().getRandomIntegerForExecution(modifiersByArtifact.length)];
          return (() => {
            const result = [];
            for (let i = modifiersToRemove.length - 1; i >= 0; i--) {
              var modifier = modifiersToRemove[i];
              result.push(target.getGameSession().removeModifier(modifier));
            }
            return result;
          })();
        }
      }
    }
  }
}
RemoveRandomArtifactAction.initClass();

module.exports = RemoveRandomArtifactAction;
