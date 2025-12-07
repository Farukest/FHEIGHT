/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const HealAction = require('app/sdk/actions/healAction');

const i18next = require('i18next');

class ModifierHallowedGround extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type = "ModifierHallowedGround";
    this.type = "ModifierHallowedGround";
  
    this.modifierName = i18next.t("modifiers.hallowed_ground_name");
    this.keywordDefinition = i18next.t("modifiers.hallowed_ground_def");
    this.description = i18next.t("modifiers.hallowed_ground_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierHallowedGround"];
  
    this.prototype.healAmount = 1;
     // hallowed ground heals 1 damage by default
  }

  static getDescription() {
    return this.description;
  }

  static getCardsWithHallowedGround(board, player) {
    // get all cards with hallowed ground modifiers owned by a player
    let allowUntargetable;
    const cards = [];
    for (var card of Array.from(board.getCards(null, (allowUntargetable=true)))) {
      if (card.isOwnedBy(player) && card.hasModifierClass(ModifierHallowedGround)) {
        cards.push(card);
      }
    }
    return cards;
  }

  static getNumStacksForPlayer(board, player) {
    // get the number of stacking hallowed ground modifiers
    let allowUntargetable;
    let numStacks = 0;
    for (var card of Array.from(board.getCards(null, (allowUntargetable=true)))) {
      if (card.isOwnedBy(player)) {
        numStacks += card.getNumModifiersOfClass(ModifierHallowedGround);
      }
    }
    return numStacks;
  }

  onTurnWatch(actionEvent) {
    super.onTurnWatch(actionEvent);

    // at end of my turn, if there is a friendly unit on this hallowed ground
    const unit = this.getGameSession().getBoard().getUnitAtPosition(this.getCard().getPosition());
    if ((unit != null) && this.getCard().getIsSameTeamAs(unit)) {
      const healAction = new HealAction(this.getGameSession());
      healAction.setSource(this.getCard());
      healAction.setTarget(unit);
      healAction.setHealAmount(this.healAmount);
      return this.getGameSession().executeAction(healAction);
    }
  }
}
ModifierHallowedGround.initClass();

module.exports = ModifierHallowedGround;
