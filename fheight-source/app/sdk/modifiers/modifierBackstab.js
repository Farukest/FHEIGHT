/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const ModifierAlwaysBackstabbed = require('./modifierAlwaysBackstabbed');

const i18next = require('i18next');

class ModifierBackstab extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierBackstab";
    this.type ="ModifierBackstab";
  
    this.isKeyworded = true;
    this.keywordDefinition =i18next.t("modifiers.backstab_def");
  
    this.modifierName =i18next.t("modifiers.backstab_name");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBackstab"];
  }

  onEvent(event) {
    super.onEvent(event);

    if (this._private.listeningToEvents) {
      if (event.type === EVENTS.modify_action_for_entities_involved_in_attack) {
        return this.onModifyActionForEntitiesInvolvedInAttack(event);
      }
    }
  }

  static createContextObject(backstabBonus,options) {
    if (backstabBonus == null) { backstabBonus = 0; }
    const contextObject = super.createContextObject(options);
    contextObject.backstabBonus = backstabBonus;
    return contextObject;
  }
    
  getIsActionRelevant(a) {
    return a instanceof AttackAction && (a.getSource() === this.getCard()) && (this.getGameSession().getBoard().getIsPositionBehindEntity(a.getTarget(), this.getCard().getPosition(), 1, 0) || __guard__(a.getTarget(), x => x.hasActiveModifierClass(ModifierAlwaysBackstabbed)));
  }

  _modifyAction(a) {
    a.setChangedByModifier(this);
    a.changeDamageBy(this.backstabBonus);
    return a.setIsStrikebackAllowed(false); // backstab attacker does not suffer strikeback
  }

  onModifyActionForExecution(actionEvent) {
    super.onModifyActionForExecution(actionEvent);
    const a = actionEvent.action;
    if (this.getIsActionRelevant(a)) {
      return this._modifyAction(a);
    }
  }

  onModifyActionForEntitiesInvolvedInAttack(actionEvent) {
    const a = actionEvent.action;
    if (this.getIsActive() && this.getIsActionRelevant(a)) {
      return this._modifyAction(a);
    }
  }

  getBackstabBonus() {
    return this.backstabBonus;
  }
}
ModifierBackstab.initClass();

module.exports = ModifierBackstab;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}