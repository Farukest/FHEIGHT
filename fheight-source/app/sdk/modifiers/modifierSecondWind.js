/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DieAction = require('app/sdk/actions/dieAction');
const DamageAction = require('app/sdk/actions/damageAction');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const i18next = require('i18next');

class ModifierSecondWind extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSecondWind";
    this.type ="ModifierSecondWind";
  
    this.modifierName =i18next.t("modifiers.second_wind_name");
    this.description =i18next.t("modifiers.second_wind_def");
  
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSecondWind"];
  }

  static createContextObject(attackBuff, maxHPBuff, buffsAreRemovable, buffAppliedName, buffAppliedDescription=null, options) {
    if (attackBuff == null) { attackBuff = 0; }
    if (maxHPBuff == null) { maxHPBuff = 0; }
    if (buffsAreRemovable == null) { buffsAreRemovable = true; }
    if (buffAppliedName == null) { buffAppliedName = undefined; }
    const contextObject = super.createContextObject(options);
    if (buffAppliedDescription == null) { buffAppliedDescription = Stringifiers.stringifyAttackHealthBuff(attackBuff,maxHPBuff); }
    contextObject.modifiersContextObjects = [
      Modifier.createContextObjectWithAttributeBuffs(attackBuff,maxHPBuff,{
        modifierName:this.modifierName,
        appliedName:buffAppliedName,
        appliedDescription:buffAppliedDescription,
        resetsDamage: true,
        isRemovable:buffsAreRemovable
      })
    ];
    return contextObject;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.secondWindAtActionIndex = -1; // index of action triggering second wind

    return p;
  }

  onAfterCleanupAction(event) {
    super.onAfterCleanupAction(event);

    const {
      action
    } = event;

    if (this.getGameSession().getIsRunningAsAuthoritative() && (this._private.secondWindAtActionIndex === action.getIndex())) {
      // after cleaning up action, trigger second wind
      this.onSecondWind(action);

      // make sure to remove self to prevent triggering second wind again
      return this.getGameSession().removeModifier(this);
    }
  }

  onValidateAction(event) {
    super.onValidateAction(event);

    const {
      action
    } = event;

    // when our entity would die, invalidate the action until second wind executes
    if (action instanceof DieAction && (action.getTarget() === this.getCard()) && action.getParentAction() instanceof DamageAction) {
      // record index of parent action of die action, so we know when to trigger second wind
      this._private.secondWindAtActionIndex = action.getParentAction().getIndex();
      return this.invalidateAction(action, this.getCard().getPosition(), this.getCard().getName() + " finds a second wind and avoids death!");
    }
  }

  onSecondWind(action) {
    // silence self to remove all existing buffs/debuffs
    // set this modifier as not removable until we complete second wind
    this.isRemovable = false;
    this.getCard().silence();

    // apply buffs
    const {
      modifiersContextObjects
    } = this;
    if ((modifiersContextObjects != null) && (modifiersContextObjects.length > 0)) {
      return Array.from(modifiersContextObjects).map((modifierContextObject) =>
        this.getGameSession().applyModifierContextObject(modifierContextObject, this.getCard()));
    }
  }
}
ModifierSecondWind.initClass();

module.exports = ModifierSecondWind;
