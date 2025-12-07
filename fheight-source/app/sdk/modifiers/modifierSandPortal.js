/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatchFromActionBar = require('./modifierSummonWatchFromActionBar');
const Cards = require('app/sdk/cards/cardsLookup');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

const i18next = require('i18next');

class ModifierSandPortal extends ModifierSummonWatchFromActionBar {
  static initClass() {
  
    this.prototype.type = "ModifierSandPortal";
    this.type = "ModifierSandPortal";
  
    this.modifierName = i18next.t("modifiers.exhuming_sand_name");
    this.keywordDefinition = i18next.t("modifiers.exhuming_sand_def");
    this.description = i18next.t("modifiers.exhuming_sand_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierShadowCreep"];
  }

  static getDescription() {
    return this.description;
  }

  static getCardsWithSandPortal(board, player) {
    // get all cards with sand portal modifiers owned by a player
    let allowUntargetable;
    const cards = [];
    for (var card of Array.from(board.getCards(null, (allowUntargetable=true)))) {
      if (card.isOwnedBy(player) && card.hasModifierClass(ModifierSandPortal)) {
        cards.push(card);
      }
    }
    return cards;
  }

  onSummonWatch(action) {
    let playCardAction;
    super.onSummonWatch(action);
    const board = this.getGameSession().getBoard();
    const entity = this.getGameSession().getCardCaches().getCardById(Cards.Faction3.IronDervish);
    const position = this.getCard().getPosition();

    const appliedToBoardByAction = this.getCard().getAppliedToBoardByAction();
    if (appliedToBoardByAction !== undefined) {
      const rootAppliedByCard = __guardMethod__(action.getRootAction(), 'getCard', o => o.getCard().getRootCard());
      const thisAppliedByCard = __guardMethod__(appliedToBoardByAction.getRootAction(), 'getCard', o1 => o1.getCard().getRootCard());
      // spawn an Iron Dervish on this tile when you summon another minion UNLESS the minion being summoned also caused this tile to spawn
      // (i.e. don't trigger on own creation by opening gambit)
      if (!board.getObstructionAtPositionForEntity(position, entity) && (rootAppliedByCard !== thisAppliedByCard)) {
        playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), position.x, position.y, {id: Cards.Faction3.IronDervish});
        playCardAction.setSource(this.getCard());
        return this.getGameSession().executeAction(playCardAction);
      }

    } else {
      if (!board.getObstructionAtPositionForEntity(position, entity)) {
        playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), position.x, position.y, {id: Cards.Faction3.IronDervish});
        playCardAction.setSource(this.getCard());
        return this.getGameSession().executeAction(playCardAction);
      }
    }
  }
}
ModifierSandPortal.initClass();

module.exports = ModifierSandPortal;

function __guardMethod__(obj, methodName, transform) {
  if (typeof obj !== 'undefined' && obj !== null && typeof obj[methodName] === 'function') {
    return transform(obj, methodName);
  } else {
    return undefined;
  }
}