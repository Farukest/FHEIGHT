/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const SwapUnitAllegianceAction =     require('app/sdk/actions/swapUnitAllegianceAction');
const i18next = require('i18next');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');

class ModifierSwitchAllegiancesGainAttack extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierSwitchAllegiancesGainAttack";
    this.type ="ModifierSwitchAllegiancesGainAttack";
  
    this.modifierName ="ModifierSwitchAllegiancesGainAttack";
    this.description = "ModifierSwitchAllegiancesGainAttack";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBond"];
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    return contextObject;
  }

  onActivate() {
    let allowUntargetable;
    super.onActivate();

    const allUnits = this.getGameSession().getBoard().getCards(CardType.Unit, (allowUntargetable=true));
    let friendlyUnitCounter = 0;

    for (var unit of Array.from(allUnits)) {
      if (!unit.getIsGeneral() && (unit !== this.getCard())) {
        if (unit.getOwnerId() === this.getCard().getOwnerId()) {
          friendlyUnitCounter++;
        }
        var a = new SwapUnitAllegianceAction(this.getGameSession());
        a.setTarget(unit);
        this.getGameSession().executeAction(a);
      }
    }

    //apply the buff
    friendlyUnitCounter = friendlyUnitCounter * 3;
    const attackBuff = [Modifier.createContextObjectWithAttributeBuffs(friendlyUnitCounter,friendlyUnitCounter,{
      modifierName:"Discordant Spirit",
      description:Stringifiers.stringifyAttackHealthBuff(friendlyUnitCounter,friendlyUnitCounter),
    })];
    return this.applyManagedModifiersFromModifiersContextObjects(attackBuff, this.getCard());
  }
}
ModifierSwitchAllegiancesGainAttack.initClass();


module.exports = ModifierSwitchAllegiancesGainAttack;
