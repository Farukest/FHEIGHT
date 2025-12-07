/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('app/sdk/spells/spell');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const CONFIG = require('app/common/config');
const Modifier = require('app/sdk/modifiers/modifier');
const ModifierTakeDamageWatchHealMyGeneral = require('app/sdk/modifiers/modifierTakeDamageWatchHealMyGeneral');
const ModifierMyAttackOrCounterattackWatchDamageRandomEnemy = require('app/sdk/modifiers/modifierMyAttackOrCounterattackWatchDamageRandomEnemy');
const ModifierMyAttackWatchSummonDeadMinions = require('app/sdk/modifiers/modifierMyAttackWatchSummonDeadMinions');
const ModifierMyAttackMinionWatchStealGeneralHealth = require('app/sdk/modifiers/modifierMyAttackMinionWatchStealGeneralHealth');
const ModifierDealDamageWatchApplyModifiersToAllies = require('app/sdk/modifiers/modifierDealDamageWatchApplyModifiersToAllies');
const ModifierMyAttackWatchSpawnMinionNearby = require('app/sdk/modifiers/modifierMyAttackWatchSpawnMinionNearby');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const KillAction = require('app/sdk/actions/killAction');
const ModifierForgedArtifactDescription = require('app/sdk/modifiers/modifierForgedArtifactDescription');

const i18next = require('i18next');

class SpellForgeArtifact extends Spell {
  static initClass() {
  
    this.prototype.magmarModifierAppliedName = null;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    const target = board.getCardAtPosition({x, y}, CardType.Unit);
    if (target != null) {
      let cardDataToEquip = null;
      const attack = target.getATK();
      const faction = target.getFactionId();

      const killAction = new KillAction(this.getGameSession());
      killAction.setOwnerId(this.getOwnerId());
      killAction.setTarget(target);
      this.getGameSession().executeAction(killAction);

      const artifactModifiers = [];
      if (faction === 1) {
        cardDataToEquip = {id: Cards.Artifact.LyonarRelic};
        artifactModifiers.push(ModifierTakeDamageWatchHealMyGeneral.createContextObject(attack));
      } else if (faction === 2) {
        cardDataToEquip = {id: Cards.Artifact.SonghaiRelic};
        artifactModifiers.push(ModifierMyAttackOrCounterattackWatchDamageRandomEnemy.createContextObject(attack));
      } else if (faction === 3) {
        cardDataToEquip = {id: Cards.Artifact.VetruvianRelic};
        artifactModifiers.push(ModifierMyAttackWatchSummonDeadMinions.createContextObject(attack));
      } else if (faction === 4) {
        cardDataToEquip = {id: Cards.Artifact.AbyssianRelic};
        artifactModifiers.push(ModifierMyAttackMinionWatchStealGeneralHealth.createContextObject(attack));
      } else if (faction === 5) {
        cardDataToEquip = {id: Cards.Artifact.MagmarRelic};
        const statsBuff = Modifier.createContextObjectWithAttributeBuffs(attack,attack);
        statsBuff.appliedName = this.magmarModifierAppliedName;
        const attackWatchModifier = ModifierDealDamageWatchApplyModifiersToAllies.createContextObject([statsBuff], false);
        artifactModifiers.push(attackWatchModifier);
      } else if (faction === 6) {
        cardDataToEquip = {id: Cards.Artifact.VanarRelic};
        artifactModifiers.push(ModifierMyAttackWatchSpawnMinionNearby.createContextObject({id: Cards.Faction6.ShadowVespyr}, i18next.t("cards.faction_6_unit_night_howler_name"), attack));
      } else {
        cardDataToEquip = {id: Cards.Artifact.NeutralRelic};
      }

      const attackBuff = Modifier.createContextObjectWithAttributeBuffs(attack,0);
      attackBuff.appliedName = "Forged";
      artifactModifiers.push(attackBuff);

      cardDataToEquip.targetModifiersContextObjects = artifactModifiers;
      cardDataToEquip.additionalInherentModifiersContextObjects = [ModifierForgedArtifactDescription.createContextObject(faction, attack)];

      const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), x, y, cardDataToEquip);
      playCardAction.setSource(this);
      return this.getGameSession().executeAction(playCardAction);
    }
  }
}
SpellForgeArtifact.initClass();

module.exports = SpellForgeArtifact;
