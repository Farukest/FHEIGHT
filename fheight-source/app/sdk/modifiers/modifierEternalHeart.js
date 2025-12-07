/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DieAction = require('app/sdk/actions/dieAction');
const SetDamageAction = require('app/sdk/actions/setDamageAction');
const i18next = require('i18next');

class ModifierEternalHeart extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierEternalHeart";
    this.type ="ModifierEternalHeart";
  
    this.modifierName ="Eternal Heart";
    this.description = "Can't die";
  
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.EternalHeart"];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.eternalHeartAtActionIndexActionIndex = -1; // index of action triggering eternal heart

    return p;
  }

  onAfterCleanupAction(event) {
    super.onAfterCleanupAction(event);

    const {
      action
    } = event;
    if (this.getGameSession().getIsRunningAsAuthoritative() && (this._private.eternalHeartAtActionIndexActionIndex === action.getIndex())) {
      // after cleaning up action, set HP to 1
      const setDamageAction = new SetDamageAction(this.getGameSession());
      setDamageAction.setOwnerId(this.getOwnerId());
      setDamageAction.setTarget(this.getCard());
      setDamageAction.damageValue = this.getCard().getMaxHP() - 1;
      return this.getGameSession().executeAction(setDamageAction);
    }
  }


  onValidateAction(event) {
    super.onValidateAction(event);

    const {
      action
    } = event;

    // when this would die, invalidate the death
    if (action instanceof DieAction && (action.getTarget() === this.getCard())) {
      // record index of parent action of die action, so we know when to trigger eternal heart
      if (action.getParentAction() != null) {
        this._private.eternalHeartAtActionIndexActionIndex = action.getParentActionIndex();
      } else {
        this._private.eternalHeartAtActionIndexActionIndex = action.getIndex();
      }
      return this.invalidateAction(action, this.getCard().getPosition(), i18next.t("modifiers.eternal_heart_error"));
    }
  }
}
ModifierEternalHeart.initClass();


module.exports = ModifierEternalHeart;
