/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const Modifier = require('app/sdk/modifiers/modifier');
const CardType = require('app/sdk/cards/cardType');

class SpellSwapStats extends Spell {

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction); // apply buff

    const entity = board.getCardAtPosition({x, y}, CardType.Unit);

    if (entity != null) {
      // get current attack and health values WITHOUT aura contributions
      const attack = entity.getATK(false);
      const hp = entity.getHP(false);

      // apply a modifier that swaps current attack and health
      const contextObject = Modifier.createContextObjectWithAttributeBuffs();
      // set the attribute buffs manually in case either one is 0
      contextObject.attributeBuffs.atk = hp;
      contextObject.attributeBuffs.maxHP = attack;
      contextObject.attributeBuffsAbsolute = ["atk", "maxHP"];
      contextObject.resetsDamage = true;
      contextObject.isRemovable = false;
      contextObject.appliedName = "Reversal";
      contextObject.appliedDescription = "This minion's Attack and Health were swapped.";
      return this.getGameSession().applyModifierContextObject(contextObject, entity);
    }
  }
}

module.exports = SpellSwapStats;
