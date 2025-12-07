/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CardType = require('app/sdk/cards/cardType');
const Races = require('app/sdk/cards/racesLookup');
const ModifierSummonWatch = require('./modifierSummonWatch');
const ModifierBackstab = require('app/sdk/modifiers/modifierBackstab');
const ModifierBlastAttack = require('app/sdk/modifiers/modifierBlastAttack');
const ModifierTranscendance = require('app/sdk/modifiers/modifierTranscendance');
const ModifierFlying = require('app/sdk/modifiers/modifierFlying');
const ModifierForcefield = require('app/sdk/modifiers/modifierForcefield');
const ModifierFrenzy = require('app/sdk/modifiers/modifierFrenzy');
const ModifierGrow = require('app/sdk/modifiers/modifierGrow');
const ModifierProvoke = require('app/sdk/modifiers/modifierProvoke');
const ModifierRanged = require('app/sdk/modifiers/modifierRanged');
const ModifierRebirth = require('app/sdk/modifiers/modifierRebirth');
const ModifierFirstBlood = require('app/sdk/modifiers/modifierFirstBlood');
const ModifierAirdrop = require('app/sdk/modifiers/modifierAirdrop');
// ModifierInvulnerable = require 'app/sdk/modifiers/modifierInvulnerable'

class ModifierSummonWatchMechsShareKeywords extends ModifierSummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSummonWatchMechsShareKeywords";
    this.type ="ModifierSummonWatchMechsShareKeywords";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  onActivate() {
    super.onActivate();
    return this.onSummonWatch();
  }

  onSummonWatch(action) {

    let hasBackstab = false;
    let hasBlast = false;
    let hasCelerity = false;
    let hasFlying = false;
    let hasForcefield = false;
    let hasFrenzy = false;
    let hasGrow = false;
    let hasProvoke = false;
    let hasRanged = false;
    let hasRebirth = false;
    let hasRush = false;
    let hasAirdrop = false;
    // hasInvulnerable = false
    let growAmount = 0;
    let backstabAmount = 0;

    const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const friendlyMinions = this.getGameSession().getBoard().getFriendlyEntitiesForEntity(myGeneral, CardType.Unit, true, false);
    const friendlyMechs = [];

    if (friendlyMinions != null) {
      let modifier;
      for (var minion of Array.from(friendlyMinions)) {
        if ((minion != null) && !minion.getIsGeneral() && minion.getBelongsToTribe(Races.Mech)) {
          friendlyMechs.push(minion);
          if (minion.hasActiveModifierClass(ModifierBackstab)) {
            hasBackstab = true;
            for (modifier of Array.from(minion.getModifiers())) {
              if (modifier instanceof ModifierBackstab && modifier.getIsActive()) {
                backstabAmount += modifier.getBackstabBonus();
                //arbitrary cap to prevent exponential increase
                if (backstabAmount > 999) {
                  backstabAmount = 999;
                  break;
                }
              }
            }
          }
          if (!hasBlast && minion.hasActiveModifierClass(ModifierBlastAttack)) {
            hasBlast = true;
          }
          if (!hasCelerity && minion.hasActiveModifierClass(ModifierTranscendance)) {
            hasCelerity = true;
          }
          if (!hasFlying && minion.hasActiveModifierClass(ModifierFlying)) {
            hasFlying = true;
          }
          if (!hasForcefield && minion.hasActiveModifierClass(ModifierForcefield)) {
            hasForcefield = true;
          }
          if (!hasFrenzy && minion.hasActiveModifierClass(ModifierFrenzy)) {
            hasFrenzy = true;
          }
          if (minion.hasActiveModifierClass(ModifierGrow)) {
            hasGrow = true;
            for (modifier of Array.from(minion.getModifiers())) {
              if (modifier instanceof ModifierGrow && modifier.getIsActive()) {
                growAmount += modifier.getGrowBonus();
                //arbitrary cap to prevent exponential increase
                if (growAmount > 999) {
                  growAmount = 999;
                  break;
                }
              }
            }
          }
          if (!hasProvoke && minion.hasActiveModifierClass(ModifierProvoke)) {
            hasProvoke = true;
          }
          if (!hasRanged && minion.hasActiveModifierClass(ModifierRanged)) {
            hasRanged = true;
          }
          if (!hasRebirth && minion.hasActiveModifierClass(ModifierRebirth)) {
            hasRebirth = true;
          }
          if (!hasRush && minion.hasActiveModifierClass(ModifierFirstBlood)) {
            hasRush = true;
          }
          if (!hasAirdrop && minion.hasActiveModifierClass(ModifierAirdrop)) {
            hasAirdrop = true;
          }
        }
      }
          // if !hasInvulnerable and minion.hasActiveModifierClass(ModifierInvulnerable)
          //   hasInvulnerable = true

      return (() => {
        const result = [];
        for (var mech of Array.from(friendlyMechs)) {
          if (hasBackstab) {
            var currentBackstabAmount = 0;
            if (mech.hasActiveModifierClass(ModifierBackstab)) {
              for (modifier of Array.from(mech.getModifiers())) {
                if (modifier instanceof ModifierBackstab && modifier.getIsActive()) {
                  currentBackstabAmount += modifier.getBackstabBonus();
                }
              }
            }
            if (backstabAmount > currentBackstabAmount) {
              this.getGameSession().applyModifierContextObject(ModifierBackstab.createContextObject(backstabAmount - currentBackstabAmount), mech);
            }
          }
          if (hasBlast && !mech.hasActiveModifierClass(ModifierBlastAttack)) {
            this.getGameSession().applyModifierContextObject(ModifierBlastAttack.createContextObject(), mech);
          }
          if (hasCelerity && !mech.hasActiveModifierClass(ModifierTranscendance)) {
            this.getGameSession().applyModifierContextObject(ModifierTranscendance.createContextObject(), mech);
          }
          if (hasFlying && !mech.hasActiveModifierClass(ModifierFlying)) {
            this.getGameSession().applyModifierContextObject(ModifierFlying.createContextObject(), mech);
          }
          if (hasForcefield && !mech.hasActiveModifierClass(ModifierForcefield)) {
            this.getGameSession().applyModifierContextObject(ModifierForcefield.createContextObject(), mech);
          }
          if (hasFrenzy && !mech.hasActiveModifierClass(ModifierFrenzy)) {
            this.getGameSession().applyModifierContextObject(ModifierFrenzy.createContextObject(), mech);
          }
          if (hasGrow) {
            var currentGrowAmount = 0;
            if (mech.hasActiveModifierClass(ModifierGrow)) {
              for (modifier of Array.from(mech.getModifiers())) {
                if (modifier instanceof ModifierGrow && modifier.getIsActive()) {
                  currentGrowAmount += modifier.getGrowBonus();
                }
              }
            }
            if (growAmount > currentGrowAmount) {
              this.getGameSession().applyModifierContextObject(ModifierGrow.createContextObject(growAmount - currentGrowAmount), mech);
            }
          }
          if (hasProvoke && !mech.hasActiveModifierClass(ModifierProvoke)) {
            this.getGameSession().applyModifierContextObject(ModifierProvoke.createContextObject(), mech);
          }
          if (hasRanged && !mech.hasActiveModifierClass(ModifierRanged)) {
            this.getGameSession().applyModifierContextObject(ModifierRanged.createContextObject(), mech);
          }
          if (hasRebirth && !mech.hasActiveModifierClass(ModifierRebirth)) {
            this.getGameSession().applyModifierContextObject(ModifierRebirth.createContextObject(), mech);
          }
          if (hasRush && !mech.hasActiveModifierClass(ModifierFirstBlood)) {
            this.getGameSession().applyModifierContextObject(ModifierFirstBlood.createContextObject(), mech);
          }
          if (hasAirdrop && !mech.hasActiveModifierClass(ModifierAirdrop)) {
            result.push(this.getGameSession().applyModifierContextObject(ModifierAirdrop.createContextObject(), mech));
          } else {
            result.push(undefined);
          }
        }
        return result;
      })();
    }
  }
        // if hasInvulnerable and !mech.hasActiveModifierClass(ModifierInvulnerable)
        //   @getGameSession().applyModifierContextObject(ModifierInvulnerable.createContextObject(), mech)

  getIsCardRelevantToWatcher(card) {
    return card.getBelongsToTribe(Races.Mech);
  }
}
ModifierSummonWatchMechsShareKeywords.initClass();

module.exports = ModifierSummonWatchMechsShareKeywords;
