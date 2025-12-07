/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const CardType = require('app/sdk/cards/cardType');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const ModifierBlastAttack = require('./modifierBlastAttack');
const ModifierBackstab = require('./modifierBackstab');
const ModifierInfiltrate = require('./modifierInfiltrate');
const ModifierGrow = require('./modifierGrow');
const ModifierBandingHealSelfAndGeneral = require('./modifierBandingHealSelfAndGeneral');
const ModifierDeathWatchDrawToXCards = require('./modifierDeathWatchDrawToXCards');
const i18next = require('i18next');

class ModifierRook extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierRook";
    this.type ="ModifierRook";
  
    this.description = "At the end of your turn, this minion gains a random Faction ability";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff"];
  }

  static createContextObject() {
    const contextObject = super.createContextObject();
    contextObject.allModifierContextObjects = [
      ModifierBlastAttack.createContextObject(),
      ModifierBackstab.createContextObject(5),
      ModifierInfiltrate.createContextObject([
        Modifier.createContextObjectWithAttributeBuffs(5, 0, {appliedName: i18next.t("modifiers.rook_infiltrate_name")})
      ], i18next.t("modifiers.rook_infiltrate_def")),
      ModifierGrow.createContextObject(5),
      ModifierBandingHealSelfAndGeneral.createContextObject(5),
      ModifierDeathWatchDrawToXCards.createContextObject(5)
    ];
    return contextObject;
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    if (this.getGameSession().getIsRunningAsAuthoritative() && (this.allModifierContextObjects.length > 0)) {
      // pick one modifier from the remaining list and splice it out of the set of choices
      const modifierContextObject = this.allModifierContextObjects.splice(this.getGameSession().getRandomIntegerForExecution(this.allModifierContextObjects.length), 1)[0];
      return this.getGameSession().applyModifierContextObject(modifierContextObject, this.getCard());
    }
  }
}
ModifierRook.initClass();

module.exports = ModifierRook;
