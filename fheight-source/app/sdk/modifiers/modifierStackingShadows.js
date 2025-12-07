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
const DamageAction = require('app/sdk/actions/damageAction');
const ModifierStackingShadowsBonusDamage = require('./modifierStackingShadowsBonusDamage');
const ModifierCounterShadowCreep = require('./modifierCounterShadowCreep');

const i18next = require('i18next');

class ModifierStackingShadows extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type = "ModifierStackingShadows";
    this.type = "ModifierStackingShadows";
  
    this.modifierName = i18next.t("modifiers.shadow_creep_name");
    this.keywordDefinition = i18next.t("modifiers.shadow_creep_def");
    this.description = i18next.t("modifiers.shadow_creep_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierShadowCreep"];
  
    this.prototype.damageAmount = 1;
     // shadow creep deal 1 damage by default
  }

  static getDescription() {
    return this.description;
  }

  onApplyToCardBeforeSyncState() {
    // apply a shadow creep counter to the General when first shadow creep tile is played
    // once a counter is there, don't need to keep adding - original counter will update on further shadow creep additions
    const targetCard = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (!targetCard.hasActiveModifierClass(ModifierCounterShadowCreep)) {
      return this.getGameSession().applyModifierContextObject(ModifierCounterShadowCreep.createContextObject("ModifierStackingShadows"), targetCard);
    }
  }

  static getCardsWithStackingShadows(board, player) {
    // get all cards with stacking shadow modifiers owned by a player
    let allowUntargetable;
    const cards = [];
    for (var card of Array.from(board.getCards(null, (allowUntargetable=true)))) {
      if (card.isOwnedBy(player) && card.hasModifierClass(ModifierStackingShadows)) {
        cards.push(card);
      }
    }
    return cards;
  }

  static getNumStacksForPlayer(board, player) {
    // get the number of stacking shadow modifiers
    let allowUntargetable;
    let numStacks = 0;
    for (var card of Array.from(board.getCards(null, (allowUntargetable=true)))) {
      if (card.isOwnedBy(player)) {
        numStacks += card.getNumModifiersOfClass(ModifierStackingShadows);
      }
    }
    return numStacks;
  }

  getShadowCreepDamage() {
    let multiBonus = 1;
    let bonusDamage = 0;

    // shadow creep base damage can be increased by adding ModifierStackingShadowsBonusDamage to this card
    for (var mod of Array.from(this.getCard().getActiveModifiersByClass(ModifierStackingShadowsBonusDamage))) {
      bonusDamage += mod.getFlatBonusDamage();
      multiBonus *= mod.getMultiplierBonusDamage();
    }

    return Math.max(0, (this.damageAmount + bonusDamage) * multiBonus);
  }

  getBuffedAttribute(attributeValue, buffKey) {
    //this is really just for the inspector, since tiles can't attack
    //calculate the damage that this shadow tile will deal and return that as its "attack" value
    if (buffKey === "atk") {
      return this.getShadowCreepDamage();
    } else {
      return super.getBuffedAttribute(attributeValue, buffKey);
    }
  }

  onActivate() {
    super.onActivate();

    // flush cached atk attribute for this card
    return this.getCard().flushCachedAttribute("atk");
  }

  onDeactivate() {
    super.onDeactivate();

    // flush cached atk attribute for this card
    return this.getCard().flushCachedAttribute("atk");
  }

  onTurnWatch(actionEvent) {
    super.onTurnWatch(actionEvent);
    // at end of my turn, if there is an enemy unit on this shadow creep, deal damage to it
    return this._activateCreep();
  }

  activateShadowCreep() {
    // when called, if there is an enemy unit on this shadow creep, deal damage to it
    return this._activateCreep();
  }

  _activateCreep() {
    const unit = this.getGameSession().getBoard().getUnitAtPosition(this.getCard().getPosition());
    if ((unit != null) && !this.getCard().getIsSameTeamAs(unit)) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setSource(this.getCard());
      damageAction.setTarget(unit);
      damageAction.setDamageAmount(this.getShadowCreepDamage());
      return this.getGameSession().executeAction(damageAction);
    }
  }
}
ModifierStackingShadows.initClass();

module.exports = ModifierStackingShadows;
