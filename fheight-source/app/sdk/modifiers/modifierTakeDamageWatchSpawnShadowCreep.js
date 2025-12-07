/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierTakeDamageWatchSpawnShadowCreep extends ModifierTakeDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierTakeDamageWatchSpawnShadowCreep";
    this.type ="ModifierTakeDamageWatchSpawnShadowCreep";
  
    this.modifierName ="Take Damage Watch";
    this.description ="Whenever this minion takes damage, turn a space occupied by an enemy into Shadow Creep";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn"];
  }

  onDamageTaken(action) {
    super.onDamageTaken(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const allEnemies = this.getGameSession().getBoard().getEnemyEntitiesForEntity(this.getCard());
      const enemyToSpawnUnder = allEnemies[this.getGameSession().getRandomIntegerForExecution(allEnemies.length)];
      const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), enemyToSpawnUnder.getPosition().x, enemyToSpawnUnder.getPosition().y, {id: Cards.Tile.Shadow});
      playCardAction.setSource(this.getCard());
      return this.getGameSession().executeAction(playCardAction);
    }
  }
}
ModifierTakeDamageWatchSpawnShadowCreep.initClass();

module.exports = ModifierTakeDamageWatchSpawnShadowCreep;
