/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierCostEqualGeneralHealth extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierCostEqualGeneralHealth";
    this.type ="ModifierCostEqualGeneralHealth";
  
    this.modifierName = "Raging Taura";
    this.description ="This minion's cost is equal to your General's Health";
  
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = true;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  }

  constructor(gameSession) {
    super(gameSession);
    this.attributeBuffsAbsolute = ["manaCost"];
    this.attributeBuffsFixed = ["manaCost"];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.cachedManaCost = 0;

    return p;
  }

  getBuffedAttribute(attributeValue, buffKey) {
    if (buffKey === "manaCost") {
      return this._private.cachedManaCost;
    } else {
      return super.getBuffedAttribute(attributeValue, buffKey);
    }
  }

  getBuffsAttributes() {
    return true;
  }

  getBuffsAttribute(buffKey) {
    return (buffKey === "manaCost") || super.getBuffsAttribute(buffKey);
  }

  updateCachedStateAfterActive() {
    super.updateCachedStateAfterActive();

    const card = this.getCard();
    const owner = card != null ? card.getOwner() : undefined;
    const general = this.getGameSession().getGeneralForPlayer(owner);
    let manaCost = 0;
    if (general != null) {
      manaCost = Math.max(0, general.getHP());
    } else {
      manaCost = 0;
    }

    if (this._private.cachedManaCost !== manaCost) {
      this._private.cachedManaCost = manaCost;
      return this.getCard().flushCachedAttribute("manaCost");
    }
  }
}
ModifierCostEqualGeneralHealth.initClass();

module.exports = ModifierCostEqualGeneralHealth;
