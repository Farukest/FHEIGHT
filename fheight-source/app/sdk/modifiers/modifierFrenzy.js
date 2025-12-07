/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const ForcedAttackAction = require('app/sdk/actions/forcedAttackAction');
const CardType = require('app/sdk/cards/cardType');

const i18next = require('i18next');

class ModifierFrenzy extends Modifier {
  static initClass() {
  
    this.prototype.type = "ModifierFrenzy";
    this.type = "ModifierFrenzy";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.frenzy_def");
    this.prototype.maxStacks = 1;
  
    this.modifierName = i18next.t("modifiers.frenzy_name");
    this.description = null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierFrenzy"];
  }

  onEvent(event) {
    super.onEvent(event);

    if (this._private.listeningToEvents) {
      if (event.type === EVENTS.entities_involved_in_attack) {
        return this.onEntitiesInvolvedInAttack(event);
      }
    }
  }

  getIsActionRelevant(a) {
    // frenzy when we notice our entity is attacking, but only on an explict attack (i.e. not on a strikeback)
    if ((a.getSource() === this.getCard()) && ((a instanceof AttackAction && !a.getIsImplicit()) || a instanceof ForcedAttackAction)) {
      // check if attack is in melee range
      const target = a.getTarget();
      const targetPosition = target.getPosition();
      const entityPosition = this.getCard().getPosition();
      return (Math.abs(targetPosition.x - entityPosition.x) <= 1) && (Math.abs(targetPosition.y - entityPosition.y) <= 1);
    }
    return false;
  }

  getAttackableEntities(a) {
    const entities = [];
    const target = a.getTarget();

    // find all other attackable enemy entities
    for (var entity of Array.from(this.getGameSession().getBoard().getEnemyEntitiesAroundEntity(this.getCard(), CardType.Unit, 1))) {
      if (entity !== target) {
        entities.push(entity);
      }
    }

    return entities;
  }

  onBeforeAction(event) {
    super.onBeforeAction(event);

    const a = event.action;
    if (this.getIsActionRelevant(a)) {
      return (() => {
        const result = [];
        for (var entity of Array.from(this.getAttackableEntities(a))) {
          var attackAction = this.getCard().actionAttack(entity);
          result.push(this.getGameSession().executeAction(attackAction));
        }
        return result;
      })();
    }
  }

  onEntitiesInvolvedInAttack(actionEvent) {
    const a = actionEvent.action;
    if (this.getIsActive() && this.getIsActionRelevant(a)) {
      return (() => {
        const result = [];
        for (var entity of Array.from(this.getAttackableEntities(a))) {
          var attackAction = this.getCard().actionAttack(entity);
          attackAction.setTriggeringModifier(this);
          result.push(actionEvent.actions.push(attackAction));
        }
        return result;
      })();
    }
  }
}
ModifierFrenzy.initClass();

module.exports = ModifierFrenzy;
