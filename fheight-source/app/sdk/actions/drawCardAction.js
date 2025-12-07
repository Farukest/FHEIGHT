/*
 * decaffeinate suggestions:
 * DS002: Fix invalid constructor
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger =     require('app/common/logger');
const CONFIG =     require('app/common/config');
const PutCardInHandAction = require('./putCardInHandAction');
const HurtingDamageAction = require('./hurtingDamageAction');

class DrawCardAction extends PutCardInHandAction {
  static initClass() {
  
    this.type ="DrawCardAction";
  
    this.prototype.cardIndexFromDeck = null;
     // when set, card draw will not be random but will be a specific card from deck instead
  }

  constructor() {
    super(...arguments);
    if (this.type == null) { this.type = DrawCardAction.type; }
  }

  _execute() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      let index;
      const player = this.getGameSession().getPlayerById(this.getOwnerId());
      const deck = player.getDeck();
      const drawPile = deck.getDrawPile();

      // attempt to draw next card data from the deck.
      // if card data is still null post execution, indicates that no card was available to draw and player attempted to draw from an empty deck
      if (this.cardIndexFromDeck != null) {
        index = this.cardIndexFromDeck;
      } else if (!this.getGameSession().getAreDecksRandomized()) {
        index = drawPile.length - 1;
      } else {
        index = this.getGameSession().getRandomIntegerForExecution(drawPile.length);
      }
      this.cardDataOrIndex = this.cardIndexFromDeck || drawPile[index];

      /* THE HURTING */
      if (this.getIsDrawFromEmptyDeck() && !this.burnCard) {
        // if no card, then deal unavoidable damage to General of player trying to draw a card
        const damageTarget = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
        const hurtingDamageAction = new HurtingDamageAction(this.getGameSession());
        hurtingDamageAction.setOwnerId(this.getOwnerId());
        hurtingDamageAction.setTarget(damageTarget);
        this.getGameSession().executeAction(hurtingDamageAction);
      }
    }

    // now call the super execute to put the card in hand
    return super._execute();
  }

  /**
   * Returns true if card was drawn from empty deck, false otherwise
   * NOTE: this will only return reliable values POST EXECUTION
   */
  getIsDrawFromEmptyDeck() {
    return (this.cardDataOrIndex == null) && this.getGameSession().getAreDecksRandomized();
  }

  /**
   * Set a specific card index to be drawn.
   */
  setCardIndexFromDeck(index) {
    return this.cardIndexFromDeck = index;
  }

  /**
   * Returns true if card was drawn randomly from deck, false if card index was pre-chosen (draw a specific card)
   */
  getIsRandomDraw() {
    if (!this.cardIndexFromDeck) {
      return false;
    }
    return true;
  }
}
DrawCardAction.initClass();

module.exports = DrawCardAction;
