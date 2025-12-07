/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CardType = require('app/sdk/cards/cardType');
const Races = require('app/sdk/cards/racesLookup');
const ModifierAnySummonWatch = require('./modifierAnySummonWatch');
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

class ModifierAnySummonWatchGainGeneralKeywords extends ModifierAnySummonWatch {
  static initClass() {
  
    this.prototype.type ="ModifierAnySummonWatchGainGeneralKeywords";
    this.type ="ModifierAnySummonWatchGainGeneralKeywords";
  
    this.prototype.activeInHand = false;
    this.prototype.activeInDeck = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  }

  onSummonWatch(action) {

    let modifier;
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

    const myGeneral = this.getGameSession().getGeneralForPlayerId(action.getCard().getOwnerId());

    if (myGeneral != null) {
      if (myGeneral.hasModifierClass(ModifierBackstab)) {
        hasBackstab = true;
        for (modifier of Array.from(myGeneral.getModifiers())) {
          if (modifier instanceof ModifierBackstab) {
            backstabAmount += modifier.getBackstabBonus();
          }
        }
      }
      if (!hasBlast && myGeneral.hasModifierClass(ModifierBlastAttack)) {
        hasBlast = true;
      }
      if (!hasCelerity && myGeneral.hasModifierClass(ModifierTranscendance)) {
        hasCelerity = true;
      }
      if (!hasFlying && myGeneral.hasModifierClass(ModifierFlying)) {
        hasFlying = true;
      }
      if (!hasForcefield && myGeneral.hasModifierClass(ModifierForcefield)) {
        hasForcefield = true;
      }
      if (!hasFrenzy && myGeneral.hasModifierClass(ModifierFrenzy)) {
        hasFrenzy = true;
      }
      if (myGeneral.hasModifierClass(ModifierGrow)) {
        hasGrow = true;
        for (modifier of Array.from(myGeneral.getModifiers())) {
          if (modifier instanceof ModifierGrow) {
            growAmount += modifier.getGrowBonus();
          }
        }
      }
      if (!hasProvoke && myGeneral.hasModifierClass(ModifierProvoke)) {
        hasProvoke = true;
      }
      if (!hasRanged && myGeneral.hasModifierClass(ModifierRanged)) {
        hasRanged = true;
      }
      if (!hasRebirth && myGeneral.hasModifierClass(ModifierRebirth)) {
        hasRebirth = true;
      }
      if (!hasRush && myGeneral.hasModifierClass(ModifierFirstBlood)) {
        hasRush = true;
      }
      if (!hasAirdrop && myGeneral.hasModifierClass(ModifierAirdrop)) {
        hasAirdrop = true;
      }
    }

    const summonedMinion = action.getCard();
    if (summonedMinion != null) {
      if (hasBackstab) {
        let currentBackstabAmount = 0;
        if (summonedMinion.hasModifierClass(ModifierBackstab)) {
          for (modifier of Array.from(summonedMinion.getModifiers())) {
            if (modifier instanceof ModifierBackstab) {
              currentBackstabAmount += modifier.getBackstabBonus();
            }
          }
        }
        if (backstabAmount > currentBackstabAmount) {
          this.getGameSession().applyModifierContextObject(ModifierBackstab.createContextObject(backstabAmount - currentBackstabAmount), summonedMinion);
        }
      }
      if (hasBlast && !summonedMinion.hasModifierClass(ModifierBlastAttack)) {
        this.getGameSession().applyModifierContextObject(ModifierBlastAttack.createContextObject(), summonedMinion);
      }
      if (hasCelerity && !summonedMinion.hasModifierClass(ModifierTranscendance)) {
        this.getGameSession().applyModifierContextObject(ModifierTranscendance.createContextObject(), summonedMinion);
      }
      if (hasFlying && !summonedMinion.hasModifierClass(ModifierFlying)) {
        this.getGameSession().applyModifierContextObject(ModifierFlying.createContextObject(), summonedMinion);
      }
      if (hasForcefield && !summonedMinion.hasModifierClass(ModifierForcefield)) {
        this.getGameSession().applyModifierContextObject(ModifierForcefield.createContextObject(), summonedMinion);
      }
      if (hasFrenzy && !summonedMinion.hasModifierClass(ModifierFrenzy)) {
        this.getGameSession().applyModifierContextObject(ModifierFrenzy.createContextObject(), summonedMinion);
      }
      if (hasGrow) {
        let currentGrowAmount = 0;
        if (summonedMinion.hasModifierClass(ModifierGrow)) {
          for (modifier of Array.from(summonedMinion.getModifiers())) {
            if (modifier instanceof ModifierGrow) {
              currentGrowAmount += modifier.getGrowBonus();
            }
          }
        }
        if (growAmount > currentGrowAmount) {
          this.getGameSession().applyModifierContextObject(ModifierGrow.createContextObject(growAmount - currentGrowAmount), summonedMinion);
        }
      }
      if (hasProvoke && !summonedMinion.hasModifierClass(ModifierProvoke)) {
        this.getGameSession().applyModifierContextObject(ModifierProvoke.createContextObject(), summonedMinion);
      }
      if (hasRanged && !summonedMinion.hasModifierClass(ModifierRanged)) {
        this.getGameSession().applyModifierContextObject(ModifierRanged.createContextObject(), summonedMinion);
      }
      if (hasRebirth && !summonedMinion.hasModifierClass(ModifierRebirth)) {
        this.getGameSession().applyModifierContextObject(ModifierRebirth.createContextObject(), summonedMinion);
      }
      if (hasRush && !summonedMinion.hasModifierClass(ModifierFirstBlood)) {
        this.getGameSession().applyModifierContextObject(ModifierFirstBlood.createContextObject(), summonedMinion);
      }
      if (hasAirdrop && !summonedMinion.hasModifierClass(ModifierAirdrop)) {
        return this.getGameSession().applyModifierContextObject(ModifierAirdrop.createContextObject(), summonedMinion);
      }
    }
  }
}
ModifierAnySummonWatchGainGeneralKeywords.initClass();
      // if hasInvulnerable and !mech.hasModifierClass(ModifierInvulnerable)
      //   @getGameSession().applyModifierContextObject(ModifierInvulnerable.createContextObject(), mech)


module.exports = ModifierAnySummonWatchGainGeneralKeywords;
