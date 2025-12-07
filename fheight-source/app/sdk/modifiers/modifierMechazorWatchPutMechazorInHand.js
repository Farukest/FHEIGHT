/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');

class ModifierMechazorWatchPutMechazorInHand extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierMechazorWatchPutMechazorInHand";
    this.type ="ModifierMechazorWatchPutMechazorInHand";
  
    this.modifierName ="Spawn Another Mechazor";
    this.description ="Whenever you summon MECHAZ0R, put a MECHAZ0R in your action bar";
  
    this.prototype.cardDataOrIndexToSpawn = null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  onAction(e) {
    super.onAction(e);

    const {
      action
    } = e;

    if (
      (action instanceof PlayCardAction && (action.getOwnerId() === this.getCard().getOwnerId()) && (action.getCard().getBaseCardId() === Cards.Spell.DeployMechaz0r)) ||
      (action instanceof PlayCardFromHandAction && (action.getOwnerId() === this.getCard().getOwnerId()) && (action.getCard().getBaseCardId() === Cards.Neutral.Mechaz0r))
    ) {
      const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), {id: Cards.Neutral.Mechaz0r});
      return this.getGameSession().executeAction(a);
    }
  }
}
ModifierMechazorWatchPutMechazorInHand.initClass();

module.exports = ModifierMechazorWatchPutMechazorInHand;
