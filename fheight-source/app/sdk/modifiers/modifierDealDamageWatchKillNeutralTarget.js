/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const ModifierDealDamageWatchKillTarget = require('./modifierDealDamageWatchKillTarget');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const Factions = require('app/sdk/cards/factionsLookup');
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const KillAction = require('app/sdk/actions/killAction');

class ModifierDealDamageWatchKillNeutralTarget extends ModifierDealDamageWatchKillTarget {
  static initClass() {
  
    this.prototype.type ="ModifierDealDamageWatchKillNeutralTarget";
    this.type ="ModifierDealDamageWatchKillNeutralTarget";
  
    this.modifierName ="Neutral Assassin";
    this.description ="Whenever this damages a neutral minion, destroy that minion";
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDealDamageWatch", "FX.Modifiers.ModifierGenericKill"];
  }

  getIsActionRelevant(a) {
    // kill the target as long as it satisfies base requirements AND is Neutral
    return super.getIsActionRelevant(a) && (__guard__(a.getTarget(), x => x.getFactionId()) === Factions.Neutral);
  }

  onDealDamage(action) {
    const target = action.getTarget();
    if (target.getFactionId() === Factions.Neutral) {
      return super.onDealDamage(action);
    }
  }
}
ModifierDealDamageWatchKillNeutralTarget.initClass();

module.exports = ModifierDealDamageWatchKillNeutralTarget;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}