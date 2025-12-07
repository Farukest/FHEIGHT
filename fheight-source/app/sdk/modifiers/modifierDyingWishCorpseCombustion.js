/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const ModifierDyingWish = require('./modifierDyingWish');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const DamageAction = require('app/sdk/actions/damageAction');
const CardType = require('app/sdk/cards/cardType');


class ModifierDyingWishCorpseCombustion extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishCorpseCombustion";
    this.type ="ModifierDyingWishCorpseCombustion";
  
    this.modifierName ="Dying Wish";
    this.description = "Resummon this minion and deal 3 damage to all nearby enemies";
  
    this.prototype.damageAmount = 3;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn", "FX.Modifiers.ModifierGenericDamage"];
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  onDyingWish(action) {
    super.onDyingWish(action);

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      // deal damage to nearby enemies
      this.getGameSession().executeAction(playCardAction);
      const entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
      for (var entity of Array.from(entities)) {
        var damageAction = new DamageAction(this.getGameSession());
        damageAction.setOwnerId(this.getCard().getOwnerId());
        damageAction.setSource(this.getCard());
        damageAction.setTarget(entity);
        damageAction.setDamageAmount(this.damageAmount);
        this.getGameSession().executeAction(damageAction);
      }

      // respawn original card
      const cardData = {id: this.getCard().getId()};
      var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, cardData);
      playCardAction.setSource(this.getCard());
      return this.getGameSession().executeAction(playCardAction);
    }
  }
}
ModifierDyingWishCorpseCombustion.initClass();

module.exports = ModifierDyingWishCorpseCombustion;
