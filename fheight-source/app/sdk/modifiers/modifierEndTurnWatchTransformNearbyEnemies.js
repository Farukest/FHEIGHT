/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const ModifierTransformed = require('app/sdk/modifiers/modifierTransformed');

class ModifierEndTurnWatchTransformNearbyEnemies extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchTransformNearbyEnemies";
    this.type ="ModifierEndTurnWatchTransformNearbyEnemies";
  
    this.modifierName ="End Turn Watch Transform Enemies";
    this.description ="At the end of your turn, transform nearby enemies";
  
    this.prototype.cardToBecome = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch"];
  }

  static createContextObject(cardToBecome, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardToBecome = cardToBecome;
    return contextObject;
  }

  onTurnWatch(action) {

    const opponentId = this.getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId()).getOwnerId();
    const entities = this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        if (!entity.getIsGeneral()) {

          // remove it
          var removeOriginalEntityAction = new RemoveAction(this.getGameSession());
          removeOriginalEntityAction.setOwnerId(this.getCard().getOwnerId());
          removeOriginalEntityAction.setTarget(entity);
          this.getGameSession().executeAction(removeOriginalEntityAction);

          // and turn it into a Panddo
          if (entity != null) {
            var cardData = this.cardToBecome;
            if (cardData.additionalInherentModifiersContextObjects == null) { cardData.additionalInherentModifiersContextObjects = []; }
            cardData.additionalInherentModifiersContextObjects.push(ModifierTransformed.createContextObject(entity.getExhausted(), entity.getMovesMade(), entity.getAttacksMade()));
            var spawnEntityAction = new PlayCardAsTransformAction(this.getCard().getGameSession(), opponentId, entity.getPosition().x, entity.getPosition().y, cardData);
            result.push(this.getGameSession().executeAction(spawnEntityAction));
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierEndTurnWatchTransformNearbyEnemies.initClass();

module.exports = ModifierEndTurnWatchTransformNearbyEnemies;
