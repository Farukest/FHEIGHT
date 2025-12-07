/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const EVENTS = require('app/common/event_types');
const CONFIG = require('app/common/config');
const Modifier = require('./modifier');
const AttackAction = require('app/sdk/actions/attackAction');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');
const i18next = require('i18next');

class ModifierBlastAttack extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierBlastAttack";
    this.type ="ModifierBlastAttack";
  
    this.isKeyworded = true;
    this.keywordDefinition =i18next.t("modifiers.blast_def");
  
    this.modifierName =i18next.t("modifiers.blast_name");
    this.description =null;
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBlast"];
    this.prototype.cardFXResource = ["FX.Cards.Faction3.Blast"];
  }

  onEvent(event) {
    super.onEvent(event);

    if (this._private.listeningToEvents) {
      if (event.type === EVENTS.entities_involved_in_attack) {
        return this.onEntitiesInvolvedInAttack(event);
      }
    }
  }

  onActivate() {
    super.onActivate();

    // override the attack pattern with blast
    return this.getCard().setCustomAttackPattern(CONFIG.PATTERN_BLAST);
  }

  onDeactivate() {
    super.onDeactivate();

    this.getCard().setCustomAttackPattern(null); //entity can no longer attack whole row if blast is dispelled
    return this.getCard().setReach(CONFIG.REACH_MELEE); //turn it into a plain melee unit
  }

  getIsActionRelevant(a) {
    // when this unit initially attacks (only blast on explicit initial attacks, not on strike backs or other implicit attacks)
    return a instanceof AttackAction && (a.getSource() === this.getCard()) && !a.getIsImplicit();
  }

  getAttackableEntities(a) {
    const entities = [];
    const target = a.getTarget();

    if (target != null) {
      // find all other attackable enemy entities
      for (var entity of Array.from(this.getGameSession().getBoard().getEnemyEntitiesOnCardinalAxisFromEntityToPosition(this.getCard(), target.getPosition(), CardType.Unit, false))) {
        if (entity !== target) {
          entities.push(entity);
        }
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

  postDeserialize() {
    super.postDeserialize();
    if ((this.getCard() != null) && this._private.cachedIsActive) {
      // override the attack pattern with blast
      return this.getCard().setCustomAttackPattern(CONFIG.PATTERN_BLAST);
    }
  }
}
ModifierBlastAttack.initClass();

module.exports = ModifierBlastAttack;
