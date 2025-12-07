// do not add this file to a package
// it is specifically parsed by the package generation script

const _ = require('underscore');
const moment = require('moment');

const Logger = require('app/common/logger');

const CONFIG = require('app/common/config');
const RSX = require('app/data/resources');

const Card = require('app/sdk/cards/card');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardSet = require('app/sdk/cards/cardSetLookup');
const CardType = require('app/sdk/cards/cardType');
const Factions = require('app/sdk/cards/factionsLookup');
const FactionFactory = require('app/sdk/cards/factionFactory');
const Races = require('app/sdk/cards/racesLookup');
const Rarity = require('app/sdk/cards/rarityLookup');

const Unit = require('app/sdk/entities/unit');
const Artifact = require('app/sdk/artifacts/artifact');

const Spell = require('app/sdk/spells/spell');
const SpellFilterType = require('app/sdk/spells/spellFilterType');
const SpellApplyModifiers = require('app/sdk/spells/spellApplyModifiers');

const Modifier = require('app/sdk/modifiers/modifier');
const ModifierBondApplyModifiers = require('app/sdk/modifiers/modifierBondApplyModifiers');
const ModifierDoubleHealthStat = require('app/sdk/modifiers/modifierDoubleHealthStat');
const ModifierBandingApplyModifiers = require('app/sdk/modifiers/modifierBandingApplyModifiers');
const ModifierForcefield = require('app/sdk/modifiers/modifierForcefield');
const ModifierAirdrop = require('app/sdk/modifiers/modifierAirdrop');
const ModifierFrenzy = require('app/sdk/modifiers/modifierFrenzy');
const ModifierTranscendance = require('app/sdk/modifiers/modifierTranscendance');
const ModifierProvoke = require('app/sdk/modifiers/modifierProvoke');
const ModifierHealWatchDamageRandomEnemy = require('app/sdk/modifiers/modifierHealWatchDamageRandomEnemy');

const i18next = require('i18next');
if (i18next.t() === undefined) {
  i18next.t = text => text;
}


class CardFactory_UnitySet_Faction1 {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let card = null;

    if (identifier === Cards.Faction1.Warblade) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction1;
      card.name = i18next.t("cards.faction_1_unit_warblade_name");
      card.setDescription(i18next.t("cards.faction_1_unit_warblade_desc"));
      card.raceId = Races.Golem;
      card.setFXResource(["FX.Cards.Neutral.SkyrockGolem"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f6_icebeetle_attack_impact.audio,
        receiveDamage : RSX.sfx_neutral_golembloodshard_hit.audio,
        attackDamage : RSX.sfx_neutral_golembloodshard_attack_impact.audio,
        death : RSX.sfx_neutral_golembloodshard_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f1WarbladeBreathing.name,
        idle : RSX.f1WarbladeIdle.name,
        walk : RSX.f1WarbladeRun.name,
        attack : RSX.f1WarbladeAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.4,
        damage : RSX.f1WarbladeHit.name,
        death : RSX.f1WarbladeDeath.name
      });
      card.atk = 1;
      card.maxHP = 4;
      card.manaCost = 2;
      card.rarityId = Rarity.Common;
      const buffContextObject = Modifier.createContextObjectWithAttributeBuffs(1,1);
      buffContextObject.appliedName = i18next.t("modifiers.faction_1_warblade_applied_name");
      card.setInherentModifiersContextObjects([ModifierBondApplyModifiers.createContextObjectForAllAllies([buffContextObject], false, "Other friendly minions gain +1/+1")]);
    }

    if (identifier === Cards.Spell.LifeCoil) {
      card = new SpellApplyModifiers(gameSession);
      card.factionId = Factions.Faction1;
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.id = Cards.Spell.LifeCoil;
      card.name = i18next.t("cards.faction_1_spell_life_coil_name");
      card.setDescription(i18next.t("cards.faction_1_spell_life_coil_desc"));
      card.manaCost = 3;
      card.rarityId = Rarity.Common;
      card.spellFilterType = SpellFilterType.NeutralDirect;
      card.setTargetModifiersContextObjects([
        ModifierDoubleHealthStat.createContextObject()
      ]);
      card.setFXResource(["FX.Cards.Spell.LifeCoil"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_forcebarrier.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconLifecoilIdle.name,
        active : RSX.iconLifecoilActive.name
      });
    }

    if (identifier === Cards.Faction1.SolPontiff) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction1;
      card.raceId = Races.Golem;
      card.name = i18next.t("cards.faction_1_unit_sol_pontiff_name");
      card.setDescription(i18next.t("cards.faction_1_unit_sol_pontiff_desc"));
      card.setFXResource(["FX.Cards.Neutral.BloodshardGolem"]);
      card.setBoundingBoxWidth(80);
      card.setBoundingBoxHeight(90);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_1.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_golembloodshard_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_golembloodshard_hit.audio,
        attackDamage : RSX.sfx_neutral_golembloodshard_attack_impact.audio,
        death : RSX.sfx_neutral_golembloodshard_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f1SolPontiffBreathing.name,
        idle : RSX.f1SolPontiffIdle.name,
        walk : RSX.f1SolPontiffRun.name,
        attack : RSX.f1SolPontiffAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.3,
        damage : RSX.f1SolPontiffHit.name,
        death : RSX.f1SolPontiffDeath.name
      });
      card.atk = 1;
      card.maxHP = 4;
      card.manaCost = 3;
      card.rarityId = Rarity.Epic;
      const statBuffContextObject = Modifier.createContextObjectWithAttributeBuffs(2);
      statBuffContextObject.appliedName = i18next.t("modifiers.faction_1_sol_pontiff_applied_name_1");
      const zealBuffContextObject = Modifier.createContextObjectWithAuraForAllAlliesAndSelf([statBuffContextObject], [Races.Golem], null, null, "Your Golems have +2 Attack");
      zealBuffContextObject.appliedName = i18next.t("modifiers.faction_1_sol_pontiff_applied_name_2");
      card.setInherentModifiersContextObjects([ModifierBandingApplyModifiers.createContextObject([zealBuffContextObject], "Your Golems have +2 Attack")]);
    }

    if (identifier === Cards.Faction1.Peacekeeper) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction1;
      card.raceId = Races.Golem;
      card.name = i18next.t("cards.faction_1_unit_peacekeeper_name");
      card.setDescription(i18next.t("cards.faction_1_unit_peacekeeper_desc"));
      card.setFXResource(["FX.Cards.Neutral.GolemVanquisher"]);
      card.setBoundingBoxWidth(45);
      card.setBoundingBoxHeight(80);
      card.setBaseSoundResource({
        apply : RSX.sfx_summonlegendary.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f1_oserix_attack_swing.audio,
        receiveDamage : RSX.sfx_f1_oserix_hit.audio,
        attackDamage : RSX.sfx_f1_oserix_attack_impact.audio,
        death : RSX.sfx_f1_oserix_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f1PeacekeeperBreathing.name,
        idle : RSX.f1PeacekeeperIdle.name,
        walk : RSX.f1PeacekeeperRun.name,
        attack : RSX.f1PeacekeeperAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.5,
        damage : RSX.f1PeacekeeperHit.name,
        death : RSX.f1PeacekeeperDeath.name
      });
      card.atk = 6;
      card.maxHP = 6;
      card.manaCost = 7;
      card.rarityId = Rarity.Legendary;
      card.setInherentModifiersContextObjects([
        ModifierFrenzy.createContextObject(),
        ModifierForcefield.createContextObject(),
        ModifierAirdrop.createContextObject(),
        ModifierTranscendance.createContextObject(),
        ModifierProvoke.createContextObject()]);
    }

    if (identifier === Cards.Artifact.GoldVitriol) {
      card = new Artifact(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction1;
      card.id = Cards.Artifact.GoldVitriol;
      card.name = i18next.t("cards.faction_1_artifact_gold_vitriol_name");
      card.setDescription(i18next.t("cards.faction_1_artifact_gold_vitriol_description"));
      card.manaCost = 2;
      card.rarityId = Rarity.Rare;
      card.durability = 3;
      card.setTargetModifiersContextObjects([
        ModifierHealWatchDamageRandomEnemy.createContextObject(2, {
          name: i18next.t("cards.faction_1_artifact_gold_vitriol_name"),
          description: i18next.t("cards.faction_1_artifact_gold_vitriol_description")
        })
      ]);
      card.setFXResource(["FX.Cards.Artifact.SunstoneBracers"]);
      card.setBaseAnimResource({
        idle: RSX.iconGoldVitriolIdle.name,
        active: RSX.iconGoldVitriolActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_victory_crest.audio
      });
    }

    return card;
  }
}

module.exports = CardFactory_UnitySet_Faction1;
