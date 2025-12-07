/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const ModifierFrenzy = require('./modifierFrenzy');
const ModifierTranscendance = require('./modifierTranscendance');
const ModifierRanged = require('./modifierRanged');
const ModifierForcefield = require('./modifierForcefield');
const ModifierCannotMove = require('./modifierCannotMove');
const ModifierStunned = require('./modifierStunned');
const ModifierCannotStrikeback = require('./modifierCannotStrikeback');
const Modifier = require('./modifier');

class ModifierEndTurnWatchHsuku extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchHsuku";
    this.type ="ModifierEndTurnWatchHsuku";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff"];
  
    this.prototype.buffName = null;
    this.prototype.debuffName = null;
  }

  onTurnWatch() {
    super.onTurnWatch();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      const units = this.getGameSession().getBoard().getUnits();

      return (() => {
        const result = [];
        for (var unit of Array.from(units)) {
          if ((unit != null) && !unit.getIsGeneral()) {
            var randomNum = this.getGameSession().getRandomIntegerForExecution(6);
            var statModifier = null;
            var abilityModifier = null;
            if (unit.getOwnerId() === this.getCard().getOwnerId()) {
              switch (randomNum) {
                case 0:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(1,0);
                  abilityModifier = ModifierTranscendance.createContextObject();
                  break;
                case 1:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(1,0);
                  abilityModifier = ModifierRanged.createContextObject();
                  break;
                case 2:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(1,0);
                  abilityModifier = ModifierFrenzy.createContextObject();
                  break;
                case 3:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(1,3);
                  break;
                case 4:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(2,2);
                  break;
                case 5:
                  abilityModifier = ModifierForcefield.createContextObject();
                  break;
              }
              if (statModifier != null) {
                statModifier.appliedName = this.buffName;
              }
            } else {
              switch (randomNum) {
                case 0:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(-1,0);
                  abilityModifier = ModifierCannotMove.createContextObject();
                  break;
                case 1:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(-1,0);
                  abilityModifier = ModifierCannotStrikeback.createContextObject();
                  break;
                case 2:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(2,-2);
                  break;
                case 3:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(-2,0);
                  break;
                case 4:
                  statModifier = Modifier.createContextObjectWithAttributeBuffs(-1,-1);
                  break;
                case 5:
                  abilityModifier = ModifierStunned.createContextObject();
                  break;
              }
              if (statModifier != null) {
                statModifier.appliedName = this.debuffName;
              }
            }
          
            if (statModifier != null) {
              this.getGameSession().applyModifierContextObject(statModifier, unit);
            }
            if (abilityModifier != null) {
              result.push(this.getGameSession().applyModifierContextObject(abilityModifier, unit));
            } else {
              result.push(undefined);
            }
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
}
ModifierEndTurnWatchHsuku.initClass();

module.exports = ModifierEndTurnWatchHsuku;
