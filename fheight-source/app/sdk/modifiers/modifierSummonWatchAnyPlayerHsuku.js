/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierSummonWatchAnyPlayer = require('./modifierSummonWatchAnyPlayer');
const ModifierFrenzy = require('./modifierFrenzy');
const ModifierFlying = require('./modifierFlying');
const ModifierTranscendance = require('./modifierTranscendance');
const ModifierProvoke = require('./modifierProvoke');
const ModifierRanged = require('./modifierRanged');
const ModifierFirstBlood = require('./modifierFirstBlood');
const ModifierRebirth = require('./modifierRebirth');
const ModifierBlastAttack = require('./modifierBlastAttack');
const ModifierForcefield = require('./modifierForcefield');

class ModifierSummonWatchAnyPlayerHsuku extends ModifierSummonWatchAnyPlayer {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchAnyPlayerHsuku";
    this.type ="ModifierSummonWatchAnyPlayerHsuku";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSummonWatch", "FX.Modifiers.ModifierGenericBuff"];
  
    this.prototype.abilitiesToGain = null; //abilities for Hsuku to gain, abilities will be removed from this list
    this.prototype.abilityMasterList = null;
     //unchanging list of possible abilities
  }

  static createContextObject(options) {
    const contextObject = super.createContextObject(options);
    contextObject.abilitiesToGain = [
      ModifierForcefield.type,
      ModifierFrenzy.type,
      ModifierFlying.type,
      ModifierTranscendance.type,
      ModifierProvoke.type,
      ModifierRanged.type,
      ModifierFirstBlood.type,
      ModifierRebirth.type,
      ModifierBlastAttack.type
    ];
    contextObject.abilityMasterList = [
      ModifierForcefield.type,
      ModifierFrenzy.type,
      ModifierFlying.type,
      ModifierTranscendance.type,
      ModifierProvoke.type,
      ModifierRanged.type,
      ModifierFirstBlood.type,
      ModifierRebirth.type,
      ModifierBlastAttack.type
    ];
    return contextObject;
  }

  onSummonWatch(action) {

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const unit = action.getTarget();
      if ((unit != null) && this.isNearbyAnyGeneral(unit.getPosition())) {

        // First try to find an ability neither Hsuku nor the unit have
        let ability;
        const mutualAbilitiesToGain = [];
        let abilityToGain = null;
        for (ability of Array.from(this.abilitiesToGain)) {
          if (!unit.hasActiveModifierType(ability) && !this.getCard().hasActiveModifierType(ability)) {
            mutualAbilitiesToGain.push(ability);
          }
        }
        if (mutualAbilitiesToGain.length > 0) {
          abilityToGain = mutualAbilitiesToGain[this.getGameSession().getRandomIntegerForExecution(mutualAbilitiesToGain.length)];
          this.abilitiesToGain.splice(this.abilitiesToGain.indexOf(abilityToGain), 1);
        } else {
          //No abilities both units need, instead give them one the unit needs
          const unitAbilitiesToGain = [];
          for (ability of Array.from(this.abilityMasterList)) {
            if (!unit.hasActiveModifierType(ability)) {
              unitAbilitiesToGain.push(ability);
            }
          }
          if (unitAbilitiesToGain.length > 0) {
            abilityToGain = unitAbilitiesToGain[this.getGameSession().getRandomIntegerForExecution(unitAbilitiesToGain.length)];
          } else if (this.abilitiesToGain.length > 0) {
            //somehow new unit doesn't need any abilities, give them one Hsuku needs if possible
            const hsukuAbilitiesToGain = [];
            for (ability of Array.from(this.abilitiesToGain)) {
              if (!this.getCard().hasActiveModifierType(ability)) {
                hsukuAbilitiesToGain.push(ability);
              }
            }
            if (hsukuAbilitiesToGain.length > 0) {
              //gain one that Hsuku didn't gain from elsewhere
              abilityToGain = hsukuAbilitiesToGain[this.getGameSession().getRandomIntegerForExecution(hsukuAbilitiesToGain.length)];
              this.abilitiesToGain.splice(this.abilitiesToGain.indexOf(abilityToGain), 1);
            } else {
              //Hsuku gained all his remaining abilities elsewhere, just give him a random one
              abilityToGain = this.abilitiesToGain.splice(this.getGameSession().getRandomIntegerForExecution(this.abilitiesToGain.length), 1)[0];
            }
          } else {
            //neither unit needs an ability, just give them a random ability in case one they have is temporary
            abilityToGain = this.abilityMasterList[this.getGameSession().getRandomIntegerForExecution(this.abilityMasterList.length)];
          }
        }

        this.getGameSession().applyModifierContextObject(this.getGameSession().getModifierClassForType(abilityToGain).createContextObject(), unit);
        return this.getGameSession().applyModifierContextObject(this.getGameSession().getModifierClassForType(abilityToGain).createContextObject(), this.getCard());
      }
    }
  }

  isNearbyAnyGeneral(position) {
    if (position != null) {
      const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
      const enemyGeneral = this.getCard().getGameSession().getGeneralForOpponentOfPlayerId(this.getCard().getOwnerId());
      if (this.positionsAreNearbyEachOther(position, general.getPosition()) || this.positionsAreNearbyEachOther(position, enemyGeneral.getPosition())) {
        return true;
      }
    }
    return false;
  }

  positionsAreNearbyEachOther(position1, position2) {
    if ((Math.abs(position1.x - position2.x) <= 1) && (Math.abs(position1.y - position2.y) <= 1)) {
      return true;
    }
    return false;
  }
}
ModifierSummonWatchAnyPlayerHsuku.initClass();


module.exports = ModifierSummonWatchAnyPlayerHsuku;
