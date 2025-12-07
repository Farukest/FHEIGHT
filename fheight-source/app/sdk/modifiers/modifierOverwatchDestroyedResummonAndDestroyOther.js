/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CardType = require('../cards/cardType');
const KillAction = require('../actions/killAction');
const PlayCardSilentlyAction = require('../actions/playCardSilentlyAction');
const ModifierOverwatchDestroyed = require('./modifierOverwatchDestroyed');

class ModifierOverwatchDestroyedResummonAndDestroyOther extends ModifierOverwatchDestroyed {
  static initClass() {
  
    this.prototype.type ="ModifierOverwatchDestroyedResummonAndDestroyOther";
    this.type ="ModifierOverwatchDestroyedResummonAndDestroyOther";
  }

  onOverwatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const card = this.getCard();

      // destroy other friendly minion
      const potentialUnitsToDestroy = [];
      for (var unit of Array.from(this.getGameSession().getBoard().getFriendlyEntitiesForEntity(this.getCard(), CardType.Unit))) {
        if ((unit !== card) && !unit.getIsGeneral() && this.getGameSession().getCanCardBeScheduledForRemoval(unit)) {
          potentialUnitsToDestroy.push(unit);
        }
      }
      if (potentialUnitsToDestroy.length > 0) {
        const unitToDestroy = potentialUnitsToDestroy[this.getGameSession().getRandomIntegerForExecution(potentialUnitsToDestroy.length)];
        if (unitToDestroy != null) {
          const killAction = new KillAction(this.getGameSession());
          killAction.setOwnerId(this.getCard().getOwnerId());
          killAction.setSource(this.getCard());
          killAction.setTarget(unitToDestroy);
          this.getGameSession().executeAction(killAction);
        }
      }

      // resummon self
      const respawnPosition = card.getPosition();
      const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), respawnPosition.x, respawnPosition.y, card.createNewCardData());
      playCardAction.setSource(this.getCard());
      return this.getGameSession().executeAction(playCardAction);
    }
  }
}
ModifierOverwatchDestroyedResummonAndDestroyOther.initClass();

module.exports = ModifierOverwatchDestroyedResummonAndDestroyOther;
