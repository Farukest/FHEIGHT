/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierKillWatch = require('./modifierKillWatch');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierKillWatchBounceEnemyToActionBar extends ModifierKillWatch {
  static initClass() {
  
    this.prototype.type ="ModifierKillWatchBounceEnemyToActionBar";
    this.type ="ModifierKillWatchBounceEnemyToActionBar";
  
    this.modifierName ="Kill Watch";
    this.description ="When this destroys a minion, bounce the enemy minion to its action bar.";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierKillWatch"];
  }

  onKillWatch(action) {
    super.onKillWatch(action);

    const enemyEntity = action.getTarget();
    if ((enemyEntity != null) && !enemyEntity.getIsGeneral()) {
      const cardToAddToHand = enemyEntity.createNewCardData();
      const opponentId = enemyEntity.getOwnerId();
      const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), opponentId, cardToAddToHand);
      return this.getGameSession().executeAction(putCardInHandAction);
    }
  }
}
ModifierKillWatchBounceEnemyToActionBar.initClass();

module.exports = ModifierKillWatchBounceEnemyToActionBar;
