/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const PlayerModifier = require('./playerModifier');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const _ = require("underscore");

class PlayerModifierEndTurnRespawnEntityWithBuff extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifierEndTurnRespawnEntityWithBuff";
    this.type ="PlayerModifierEndTurnRespawnEntityWithBuff";
  
    this.isHiddenToUI = true;
    this.prototype.durationEndTurn = 1;
    this.prototype.cardDataOrIndexToSpawn = null;
  }

  static createContextObject(cardDataOrIndexToSpawn, modifiersContextObjects, position, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.position = position;
    contextObject.modifiersContextObjects = modifiersContextObjects;
    return contextObject;
  }

  onEndTurn(action) {
    super.onEndTurn(action);

    // add modifiers
    let {
      cardDataOrIndexToSpawn
    } = this;
    if (cardDataOrIndexToSpawn != null) {
      if (_.isObject(cardDataOrIndexToSpawn)) {
        cardDataOrIndexToSpawn = UtilsJavascript.fastExtend({}, cardDataOrIndexToSpawn);
      } else {
        cardDataOrIndexToSpawn = this.getGameSession().getCardByIndex(cardDataOrIndexToSpawn).createNewCardData();
      }
      if (cardDataOrIndexToSpawn.additionalModifiersContextObjects == null) { cardDataOrIndexToSpawn.additionalModifiersContextObjects = []; }
      cardDataOrIndexToSpawn.additionalModifiersContextObjects = cardDataOrIndexToSpawn.additionalModifiersContextObjects.concat(UtilsJavascript.deepCopy(this.modifiersContextObjects));

      const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getPlayer().getPlayerId(), this.position.x, this.position.y, cardDataOrIndexToSpawn);
      playCardAction.setSource(this.getCard());
      return this.getGameSession().executeAction(playCardAction);
    }
  }
}
PlayerModifierEndTurnRespawnEntityWithBuff.initClass();

module.exports = PlayerModifierEndTurnRespawnEntityWithBuff;
