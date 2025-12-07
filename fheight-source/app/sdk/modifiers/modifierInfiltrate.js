/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSituationalBuffSelf = require('./modifierSituationalBuffSelf');
const CardType = require('app/sdk/cards/cardType');
const CONFIG = require('app/common/config');
const _ = require('underscore');
const ModifierAlwaysInfiltrated = require('app/sdk/modifiers/modifierAlwaysInfiltrated');
const ModifierProvidesAlwaysInfiltrated = require('app/sdk/modifiers/modifierProvidesAlwaysInfiltrated');

const i18next = require('i18next');

class ModifierInfiltrate extends ModifierSituationalBuffSelf {
  static initClass() {
  
    this.prototype.type ="ModifierInfiltrate";
    this.type ="ModifierInfiltrate";
  
    this.isKeyworded = true;
  
    this.modifierName =i18next.t("modifiers.infiltrate_name");
    this.description ="Whenever this minion is on the enemy side of the battlefield..";
    this.keywordDefinition =i18next.t("modifiers.infiltrate_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierInfiltrate"];
  }

  static createContextObject(modifiersContextObjects, description, options) {
    const contextObject = super.createContextObject(options);
    contextObject.modifiersContextObjects = modifiersContextObjects;
    if (modifiersContextObjects != null) {
      for (const modifierContextObject of modifiersContextObjects) {
        if (modifierContextObject.appliedName == null) { modifierContextObject.appliedName = "Infiltrated"; }
      }
    }
    contextObject.description = description;
    return contextObject;
  }

  getIsSituationActiveForCache() {
    if (this.getCard().hasModifierType(ModifierAlwaysInfiltrated.type)) {
      return true;
    }
    for (var unit of Array.from(this.getGameSession().getBoard().getFriendlyEntitiesForEntity(this.getCard()))) {
      if (unit.hasActiveModifierClass(ModifierProvidesAlwaysInfiltrated)) {
        return true;
      }
    }
    // infiltrate is active when this entity is on the enemy side of the battlefield (determined by player starting side)

    // begin with "my side" defined as whole board
    let enemySideStartX = 0;
    let enemySideEndX = CONFIG.BOARDCOL;

    if (this.getCard().isOwnedByPlayer1()) {
      enemySideStartX = Math.floor(((enemySideEndX - enemySideStartX) * 0.5) + 1);
    } else if (this.getCard().isOwnedByPlayer2()) {
      enemySideEndX = Math.floor(((enemySideEndX - enemySideStartX) * 0.5) - 1);
    }

    const {
      x
    } = this.getCard().getPosition();
    return (x >= enemySideStartX) && (x <= enemySideEndX);
  }
}
ModifierInfiltrate.initClass();

module.exports = ModifierInfiltrate;
