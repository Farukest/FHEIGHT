/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const Modifier = require('./modifier');

const CONFIG = require('app/common/config');

class ModifierStartTurnWatchSwapStats extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchSwapStats";
    this.type ="ModifierStartTurnWatchSwapStats";
  
    this.description = "At the start of your turn, fully heal this minion and switch its Attack and Health";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch"];
  }

  onTurnWatch(action) {
    super.onTurnWatch();

    // reset damage dealt to this minion before swapping
    this.getCard().resetDamage();

    // get current attack and health values WITHOUT aura contributions
    const oldAttack = this.getCard().getATK(false);
    const oldHealth = this.getCard().getHP(false);

    // apply a hidden modifier that swaps current attack and health
    const contextObject = Modifier.createContextObjectWithAttributeBuffs();
    // set the attribute buffs manually in case either one is 0
    contextObject.attributeBuffs.atk = oldHealth;
    contextObject.attributeBuffs.maxHP = oldAttack;
    contextObject.attributeBuffsAbsolute = ["atk", "maxHP"];

    contextObject.isHiddenToUI = true;
    return this.getCard().getGameSession().applyModifierContextObject(contextObject, this.getCard());
  }
}
ModifierStartTurnWatchSwapStats.initClass();

module.exports = ModifierStartTurnWatchSwapStats;
