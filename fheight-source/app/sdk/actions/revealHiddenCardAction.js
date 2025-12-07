/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger =     require('app/common/logger');
const UtilsJavascript =     require('app/common/utils/utils_javascript');
const Action =     require('./action');
const _ = require('underscore');

/*
Action to reveal a hidden card.
*/

class RevealHiddenCardAction extends Action {
  static initClass() {
  
    this.type ="RevealHiddenCardAction";
  
    this.prototype.isDepthFirst = true; // revealing hidden cards should always occur immediately
  
    this.prototype.cardData = null;
     // card data for revealed card
  }

  constructor(gameSession, ownerId, cardData) {
    super(gameSession);

    if (this.type == null) { this.type = RevealHiddenCardAction.type; }

    if (cardData != null) {
      // copy data so we don't modify anything unintentionally
      this.cardData = UtilsJavascript.fastExtend({}, cardData);
    }

    this.ownerId = ownerId + "";
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.isValidReveal = false; // whether reveal is valid (i.e. was card hidden on this game session?)

    return p;
  }

  isRemovableDuringScrubbing() {
    return false;
  }

  getManaCost() {
    return 0;
  }

  /**
   * Sets the card data used to reveal card.
   */
  setCardData(val) {
    return this.cardData = val;
  }

  /**
   * Returns the card data used to reveal card.
   */
  getCardData() {
    return this.cardData;
  }

  /**
   * Returns the card.
   * NOTE: This card may or may not be indexed if this method is called before this action is executed.
   */
  getCard() {
    if ((this._private.cachedCard == null)) {
      const target = this.getTarget();
      const cardId = this.cardData.id;
      if (target.getId() === cardId) {
        this._private.cachedCard = target;
      } else {
        // generate/set card when target is different from revealed
        this._private.cachedCard = this.getGameSession().createCardForIdentifier(cardId);
        if (this._private.cachedCard != null) {
          // copy properties from target
          for (var key of Array.from(target.getCardDataKeysForCopy())) {
            // only set certain properties on card data if they differ from the prototype, i.e. they are not DEFAULTS
            // this is done by checking if this object has it's won property (different than prototype) or is using the prototype
            if (target.hasOwnProperty(key)) {
              var val = target[key];
              if (_.isArray(val)) {
                this._private.cachedCard[key] = val.slice(0);
              } else if (_.isObject(val)) {
                this._private.cachedCard[key] = UtilsJavascript.fastExtend({}, val);
              } else {
                this._private.cachedCard[key] = val;
              }
            }
          }

          // apply card data
          this._private.cachedCard.applyCardData(this.cardData);

          // don't hide revealed card during scrubbing
          this._private.cachedCard.setHideAsCardId(null);
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

  /**
   * Returns whether the reveal of the card was valid.
   * NOTE: this will only return reliable values POST EXECUTION
   */
  getIsValidReveal() {
    return this._private.isValidReveal;
  }

  _execute() {
    super._execute();

    // get hidden card
    const target = this.getTarget();

    // check whether hidden card is different from revealed
    this._private.isValidReveal = target.getId() !== this.cardData.id;
    if (!this._private.isValidReveal) {
      // no need to reveal card
      // however, we should not hide target card during scrubbing
      return target.setHideAsCardId(null);
    } else {
      // get revealed card
      const card = this.getCard();

      // no longer hide this card during scrubbing
      card.setHideAsCardId(null);

      // update actions that applied hidden card to locations
      const applyCardToDeckAction = target.getAppliedToDeckByAction();
      if (applyCardToDeckAction != null) { applyCardToDeckAction.setCard(card); }
      const applyCardToHandAction = target.getAppliedToHandByAction();
      if (applyCardToHandAction != null) { applyCardToHandAction.setCard(card); }
      const applyCardToBoardAction = target.getAppliedToBoardByAction();
      if (applyCardToBoardAction != null) { applyCardToBoardAction.setCard(card); }
      const applyCardToSignatureCardsAction = target.getAppliedToSignatureCardsByAction();
      if (applyCardToSignatureCardsAction != null) { applyCardToSignatureCardsAction.setCard(card); }

      // index revealed card
      return this.getGameSession()._indexCardAsNeeded(card);
    }
  }
}
RevealHiddenCardAction.initClass();

module.exports = RevealHiddenCardAction;
