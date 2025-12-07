/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const i18next = require('i18next');

class ModifierShadowScar extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierShadowScar";
    this.type ="ModifierShadowScar";
  
    //@isKeyworded: false
    this.modifierName =i18next.t("modifiers.shadow_scar_name");
    this.description =i18next.t("modifiers.shadow_scar_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn"];
    this.prototype.cardDataOrIndexToSpawn = null;
    this.prototype.spawnOwnerId = null;
     // dying wish spawn entity will spawn for player with this ID
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnOwnerId, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.spawnOwnerId = spawnOwnerId;
    return contextObject;
  }

  onDyingWish(action) {
    super.onDyingWish(action);

    if (this.getGameSession().getIsRunningAsAuthoritative() && (this.cardDataOrIndexToSpawn != null)) {
      if (this.spawnOwnerId != null) {
        const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.spawnOwnerId, this.getCard().getPositionX(), this.getCard().getPositionY(), this.cardDataOrIndexToSpawn);
        playCardAction.setSource(this.getCard());
        return this.getGameSession().executeAction(playCardAction);
      }
    }
  }
}
ModifierShadowScar.initClass();

module.exports = ModifierShadowScar;
