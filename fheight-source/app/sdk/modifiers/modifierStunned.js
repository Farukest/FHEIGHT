/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG =     require('app/common/config');
const Logger = require('app/common/logger');
const RefreshExhaustionAction =  require('app/sdk/actions/refreshExhaustionAction');
const ApplyExhaustionAction =  require('app/sdk/actions/applyExhaustionAction');
const AttackAction =   require('app/sdk/actions/attackAction');
const MoveAction = require('app/sdk/actions/moveAction');
const Modifier = require('./modifier');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const _ = require('underscore');

const i18next = require('i18next');

class ModifierStunned extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierStunned";
    this.type ="ModifierStunned";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.stunned_def");
  
    this.modifierName = i18next.t("modifiers.stunned_name");
    this.description = null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
    this.prototype.durationEndTurn = 2; // stun effect lasts until end of owner's next turn
    this.prototype.fxResource = ["FX.Modifiers.ModifierStunned"];
  }

  onApplyToCardBeforeSyncState() {
    super.onApplyToCardBeforeSyncState();

    // if your unit is stunned during your turn, they will remain stunned
    // until the end of your NEXT turn
    if (this.getCard().isOwnersTurn()) {
      return this.durationEndTurn = 3;
    }
  }

  onValidateAction(event) {
    const a = event.action;

    // stunned unit cannot explicitly attack (but it can do "auto" attacks like strikeback)
    if (a.getIsValid()) {
      if (a instanceof AttackAction) {
        if (!a.getIsImplicit() && (this.getCard() === a.getSource())) {
          return this.invalidateAction(a, this.getCard().getPosition(), "Stunned, cannot attack.");
        }
      } else if (a instanceof MoveAction) {
        if (this.getCard() === a.getSource()) {
          return this.invalidateAction(a, this.getCard().getPosition(), "Stunned, cannot move.");
        }
      }
    }
  }
}
ModifierStunned.initClass();

module.exports = ModifierStunned;
