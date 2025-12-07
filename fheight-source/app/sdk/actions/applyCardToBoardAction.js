/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Logger =     require('app/common/logger');
const UtilsJavascript =     require('app/common/utils/utils_javascript');
const Action =     require('./action');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

/*
Abstract action to apply a card to the board. Do not use directly.
*/

class ApplyCardToBoardAction extends Action {
  static initClass() {
  
    this.type ="ApplyCardToBoardAction";
    this.prototype.cardDataOrIndex = null; // card data or index for new card
    this.prototype.cardOwnedByGameSession = false; // card being applied may need to be owned by gamesession (a mana tile for example)
    this.prototype.isValidApplication = false;
  
    // target should always be the card we've applied to the board, so we'll alias getCard
    this.prototype.getTarget = this.prototype.getCard;
     // whether application was valid
  }

  constructor(gameSession, ownerId, x, y, cardDataOrIndex, cardOwnedByGameSession) {
    if (cardOwnedByGameSession == null) { cardOwnedByGameSession = false; }
    if (this.type == null) { this.type = ApplyCardToBoardAction.type; }
    this.targetPosition = {x,y};

    if (cardDataOrIndex != null) {
      // copy data so we don't modify anything unintentionally
      if (_.isObject(cardDataOrIndex)) {
        this.cardDataOrIndex = UtilsJavascript.fastExtend({}, cardDataOrIndex);
      } else {
        this.cardDataOrIndex = cardDataOrIndex;
      }
    }

    super(gameSession);

    // has to be done after super()
    this.ownerId = ownerId + "";
    this.cardOwnedByGameSession = cardOwnedByGameSession;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.cachedCard = null;

    return p;
  }

  isRemovableDuringScrubbing() {
    return false;
  }

  getManaCost() {
    return 0;
  }

  /**
   * Sets the card data or index used to create a card.
   */
  setCardDataOrIndex(val) {
    return this.cardDataOrIndex = val;
  }

  /**
   * Returns the card data or index used to create card that will be applied.
   */
  getCardDataOrIndex() {
    return this.cardDataOrIndex;
  }

  /**
   * Returns the card.
   * NOTE: This card may or may not be indexed if this method is called before this action is executed.
   */
  getCard() {
    if ((this._private.cachedCard == null)) {
      this._private.cachedCard = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(this.cardDataOrIndex);
      if (this._private.cachedCard != null) {
        if (!this.cardOwnedByGameSession) {
          this._private.cachedCard.setOwnerId(this.getOwnerId());
        }
      }
    }
    return this._private.cachedCard;
  }

  /**
   * Explicitly sets the card.
   * NOTE: This card reference is not serialized and will not be preserved through deserialize/rollback.
   */
  setCard(card) {
    return this._private.cachedCard = card;
  }

  getSource() {
    const source = super.getSource();
    if ((source == null)) {
      // check parent actions
      const parentAction = this.getResolveParentAction();
      if (parentAction != null) {
        this._private.source = parentAction.getSource();
      }
    }
    return source;
  }

  /**
   * Returns whether the application of the card was valid.
   * NOTE: this will only return reliable values POST EXECUTION
   */
  getIsValidApplication() {
    return this.isValidApplication;
  }

  _execute() {
    super._execute();

    // get the applying card
    const card = this.getCard();

    // force the target to match the card we're spawning
    this._private.target = card;

    // regenerate card data so we transmit the correct values to the clients
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      if (card.getIsFollowup()) {
        // followups should ignore incoming card data
        this.cardDataOrIndex = card.createCardData();
      } else {
        // apply incoming card data before regenerating
        card.applyCardData(this.cardDataOrIndex);
        this.cardDataOrIndex = card.createCardData(this.cardDataOrIndex);
      }

      // flag card data as applied locally so that we don't reapply regenerated data for clients
      this.cardDataOrIndex._hasBeenApplied = true;
    }

    // apply the card through the game session
    this.isValidApplication = this.getGameSession().applyCardToBoard(card, this.targetPosition.x, this.targetPosition.y, this.cardDataOrIndex, this);

    // add post apply card data so we transmit the correct values to the clients
    if (this.getGameSession().getIsRunningAsAuthoritative()) { this.cardDataOrIndex = card.updateCardDataPostApply(this.cardDataOrIndex); }

    // increment played cards for the player
    if (this.isValidApplication && !card.isOwnedByGameSession()) {
      if (CardType.getIsUnitCardType(card.getType())) {
        return card.getOwner().totalMinionsSpawned++;
      } else if (CardType.getIsSpellCardType(card.getType())) {
        return card.getOwner().totalSpellsCast++;
      }
    }
  }

  scrubSensitiveData(actionData, scrubFromPerspectiveOfPlayerId, forSpectator) {
    // transform card as needed
    const card = this.getCard();
    if ((card != null) && card.isHideable(scrubFromPerspectiveOfPlayerId, forSpectator)) {
      const hiddenCard = card.createCardToHideAs();
      actionData.cardDataOrIndex = hiddenCard.createCardData();
    }
    return actionData;
  }
}
ApplyCardToBoardAction.initClass();

module.exports = ApplyCardToBoardAction;
