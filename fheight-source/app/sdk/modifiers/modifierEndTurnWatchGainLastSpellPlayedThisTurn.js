/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');

class ModifierEndTurnWatchGainLastSpellPlayedThisTurn extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchGainLastSpellPlayedThisTurn";
    this.type ="ModifierEndTurnWatchGainLastSpellPlayedThisTurn";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch"];
  }

  onTurnWatch(action) {

    let actions = [];
    let lastSpell = null;
    for (var step of Array.from(this.getGameSession().getCurrentTurn().getSteps())) {
      actions = actions.concat(step.getAction().getFlattenedActionTree());
    }
    for (let i = actions.length - 1; i >= 0; i--) {
      action = actions[i];
      if (action instanceof ApplyCardToBoardAction &&
      (__guard__(__guard__(action.getCard(), x1 => x1.getRootCard()), x => x.getType()) === CardType.Spell) &&
      (action.getCard().getRootCard() === action.getCard()) &&
      !action.getIsImplicit() &&
      (action.getOwnerId() === this.getOwnerId())) {
        lastSpell = action.getCard();
        break;
      }
    }

    if (lastSpell != null) {
      // put fresh copy of spell into hand
      const putCardInHandAction = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), lastSpell.createNewCardData());
      return this.getGameSession().executeAction(putCardInHandAction);
    }
  }
}
ModifierEndTurnWatchGainLastSpellPlayedThisTurn.initClass();

module.exports = ModifierEndTurnWatchGainLastSpellPlayedThisTurn;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}