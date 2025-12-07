/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierMyAttackOrCounterattackWatch = require('./modifierMyAttackOrCounterattackWatch');
const ModifierEgg = require('./modifierEgg');
const ModifierTransformed = require('./modifierTransformed');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');

class ModifierMyAttackOrCounterattackWatchTransformIntoEgg extends ModifierMyAttackOrCounterattackWatch {
  static initClass() {
  
    this.prototype.type ="ModifierMyAttackOrCounterattackWatchTransformIntoEgg";
    this.type ="ModifierMyAttackOrCounterattackWatchTransformIntoEgg";
  }

  onMyAttackOrCounterattackWatch(action) {

    const entity = this.getCard();

    const egg = {id: Cards.Faction5.Egg};
    if (egg.additionalInherentModifiersContextObjects == null) { egg.additionalInherentModifiersContextObjects = []; }
    egg.additionalInherentModifiersContextObjects.push(ModifierEgg.createContextObject(entity.createNewCardData(), entity.getName()));
    egg.additionalInherentModifiersContextObjects.push(ModifierTransformed.createContextObject(entity.getExhausted(), entity.getMovesMade(), entity.getAttacksMade()));

    const removeEntityAction = new RemoveAction(this.getGameSession());
    removeEntityAction.setOwnerId(this.getCard().getOwnerId());
    removeEntityAction.setTarget(this.getCard());
    this.getGameSession().executeAction(removeEntityAction);

    const spawnEntityAction = new PlayCardAsTransformAction(this.getCard().getGameSession(), entity.getOwnerId(), entity.getPosition().x, entity.getPosition().y, egg);
    return this.getGameSession().executeAction(spawnEntityAction);
  }
}
ModifierMyAttackOrCounterattackWatchTransformIntoEgg.initClass();

module.exports = ModifierMyAttackOrCounterattackWatchTransformIntoEgg;
