/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

const i18next = require('i18next');

class ModifierBond extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierBond";
    this.type ="ModifierBond";
  
    // Duplicated below.
    //@description: "Bond"
  
    this.isKeyworded = true;
    this.modifierName = i18next.t("modifiers.bond_name");
    this.description = null;
    this.keywordDefinition = i18next.t("modifiers.bond_def");
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBond"];
  }

  onActivate() {
    super.onActivate();

    // make sure this card has a tribe
    const thisCardTribe = this.getCard().getRaceId();
    if (thisCardTribe != null) {
      // check for any friendly minion on the board that has same tribe as this card
      return (() => {
        const result = [];
        for (var friendlyMinion of Array.from(this.getGameSession().getBoard().getFriendlyEntitiesForEntity(this.getCard()))) {
          if (friendlyMinion.getBelongsToTribe(thisCardTribe)) {
            // if we find a friendly minion with same tribe, activate bond effect once
            this.onBond();
            break;
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }

  onBond() {}
}
ModifierBond.initClass();
    // override me in sub classes to implement special behavior

module.exports = ModifierBond;
