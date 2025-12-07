/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const UtilsPosition = require('app/common/utils/utils_position');
const ModifierSummonWatch = require('./modifierSummonWatch');
const CardType = require('app/sdk/cards/cardType');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const ModifierOpponentSummonWatch = require('./modifierOpponentSummonWatch');
const CloneEntityAsTransformAction = require('app/sdk/actions/cloneEntityAsTransformAction');
const Modifier = require('./modifier');
const RemoveAction = require('app/sdk/actions/removeAction');
const Factions = require('app/sdk/cards/factionsLookup');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierOpponentSummonWatchRandomTransform extends ModifierOpponentSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierOpponentSummonWatchRandomTransform";
    this.type ="ModifierOpponentSummonWatchRandomTransform";
  
    this.modifierName ="Opponent Summon Watch";
    this.description ="Whenever an enemy summons a minion, transform it into a random minion of the same cost";
  
    this.prototype.cardDataOrIndexToSpawn = null;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);

    return contextObject;
  }

  onSummonWatch(action) {
    super.onSummonWatch(action);

    const targetUnit = action.getTarget();
    const targetManaCost = targetUnit.getManaCost();
    const targetOwnerId = targetUnit.getOwnerId();
    const targetPosition = targetUnit.getPosition();

    if (targetUnit != null) {
      // find valid minions
      let card;
      const cardCache = this.getGameSession().getCardCaches().getIsHiddenInCollection(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getType(CardType.Unit).getCards();
      const cards = [];
      for (card of Array.from(cardCache)) {
        if (card.getManaCost() === targetManaCost) {
          cards.push(card);
        }
      }

      if (cards.length > 0) {
        // remove original entity
        const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
        removeOriginalEntityAction.setOwnerId(this.getOwnerId());
        removeOriginalEntityAction.setTarget(targetUnit);
        this.getGameSession().executeAction(removeOriginalEntityAction);

        // pick randomly from among the units we found with right mana cost
        card = cards[this.getGameSession().getRandomIntegerForExecution(cards.length)];
        this.cardDataOrIndexToSpawn = card.createNewCardData();

        const spawnEntityAction = new PlayCardAsTransformAction(this.getCard().getGameSession(), targetOwnerId, targetPosition.x, targetPosition.y, this.cardDataOrIndexToSpawn);
        return this.getGameSession().executeAction(spawnEntityAction);
      }
    }
  }

  getIsCardRelevantToWatcher(card) {
    return true;
  }
}
ModifierOpponentSummonWatchRandomTransform.initClass(); //default when no card restrictions are needed

module.exports = ModifierOpponentSummonWatchRandomTransform;
