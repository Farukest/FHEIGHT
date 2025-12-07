/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SpellSpawnEntity = require('./spellSpawnEntity');
const CardType = require('app/sdk/cards/cardType');
const KillAction = require('app/sdk/actions/killAction');
const Modifier = require('app/sdk/modifiers/modifier');
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
const ModifierInvulnerable = require('app/sdk/modifiers/modifierInvulnerable');

class SpellAbhorrentUnbirth extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.appliedName = null;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    const general = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    const friendlyMinions = board.getFriendlyEntitiesForEntity(general, CardType.Unit, true, false);
    let abomAttack = 0;
    let abomHealth = 0;
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
    let growAmount = 0;
    let backstabAmount = 0;
    const modifierContextObjects = [];
    if (friendlyMinions != null) {
      for (var minion of Array.from(friendlyMinions)) {
        if ((minion != null) && !minion.hasActiveModifierClass(ModifierInvulnerable)) {
          var modifier;
          abomAttack += minion.getATK();
          abomHealth += minion.getHP();
          if (minion.hasActiveModifierClass(ModifierBackstab)) {
            hasBackstab = true;
            for (modifier of Array.from(minion.getModifiers())) {
              if (modifier instanceof ModifierBackstab && modifier.getIsActive()) {
                backstabAmount += modifier.getBackstabBonus();
              }
            }
          }
          if (!hasBlast && minion.hasActiveModifierClass(ModifierBlastAttack)) {
            hasBlast = true;
            modifierContextObjects.push(ModifierBlastAttack.createContextObject());
          }
          if (!hasCelerity && minion.hasActiveModifierClass(ModifierTranscendance)) {
            hasCelerity = true;
            modifierContextObjects.push(ModifierTranscendance.createContextObject());
          }
          if (!hasFlying && minion.hasActiveModifierClass(ModifierFlying)) {
            hasFlying = true;
            modifierContextObjects.push(ModifierFlying.createContextObject());
          }
          if (!hasForcefield && minion.hasActiveModifierClass(ModifierForcefield)) {
            hasForcefield = true;
            modifierContextObjects.push(ModifierForcefield.createContextObject());
          }
          if (!hasFrenzy && minion.hasActiveModifierClass(ModifierFrenzy)) {
            hasFrenzy = true;
            modifierContextObjects.push(ModifierFrenzy.createContextObject());
          }
          if (minion.hasActiveModifierClass(ModifierGrow)) {
            hasGrow = true;
            for (modifier of Array.from(minion.getModifiers())) {
              if (modifier instanceof ModifierGrow && modifier.getIsActive()) {
                growAmount += modifier.getGrowBonus();
              }
            }
          }
          if (!hasProvoke && minion.hasActiveModifierClass(ModifierProvoke)) {
            hasProvoke = true;
            modifierContextObjects.push(ModifierProvoke.createContextObject());
          }
          if (!hasRanged && minion.hasActiveModifierClass(ModifierRanged)) {
            hasRanged = true;
            modifierContextObjects.push(ModifierRanged.createContextObject());
          }
          if (!hasRebirth && minion.hasActiveModifierClass(ModifierRebirth)) {
            hasRebirth = true;
            modifierContextObjects.push(ModifierRebirth.createContextObject());
          }
          if (!hasRush && minion.hasActiveModifierClass(ModifierFirstBlood)) {
            hasRush = true;
            modifierContextObjects.push(ModifierFirstBlood.createContextObject());
          }
          if (!hasAirdrop && minion.hasActiveModifierClass(ModifierAirdrop)) {
            hasAirdrop = true;
            modifierContextObjects.push(ModifierAirdrop.createContextObject());
          }

          var killAction = new KillAction(this.getGameSession());
          killAction.setOwnerId(this.getOwnerId());
          killAction.setTarget(minion);
          this.getGameSession().executeAction(killAction);
        }
      }
    }

    if (hasGrow) {
      modifierContextObjects.push(ModifierGrow.createContextObject(growAmount));
    }
    if (hasBackstab) {
      modifierContextObjects.push(ModifierBackstab.createContextObject(backstabAmount));
    }

    if ((abomAttack > 0) || (abomHealth > 0)) {
      const statContextObject = Modifier.createContextObjectWithAttributeBuffs(abomAttack,abomHealth);
      statContextObject.appliedName = this.appliedName;
      modifierContextObjects.push(statContextObject);
    }

    if (modifierContextObjects.length > 0) {
      this.cardDataOrIndexToSpawn.additionalModifiersContextObjects = modifierContextObjects;
    }

    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
  }
}
SpellAbhorrentUnbirth.initClass();

module.exports = SpellAbhorrentUnbirth;
