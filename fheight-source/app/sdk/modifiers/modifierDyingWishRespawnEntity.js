/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class ModifierDyingWishRespawnEntity extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishRespawnEntity";
    this.type ="ModifierDyingWishRespawnEntity";
  
    this.modifierName ="Dying Wish";
    this.description = "Dying Wish: Resummon this minion";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn"];
  }

  onDyingWish(action) {
    super.onDyingWish(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const spawnAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, this.getCard().createNewCardData());
      spawnAction.setSource(this.getCard());
      return this.getGameSession().executeAction(spawnAction);
    }
  }
}
ModifierDyingWishRespawnEntity.initClass();

module.exports = ModifierDyingWishRespawnEntity;
