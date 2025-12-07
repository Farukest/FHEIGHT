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

const SpellFilterType = require('app/sdk/spells/spellFilterType');
const SpellTectonicSpikes = require('app/sdk/spells/spellTectonicSpikes');
const SpellDamageEnemyGeneralBothDrawCard = require('app/sdk/spells/spellDamageEnemyGeneralBothDrawCard');
const SpellSpawnEntity = require('app/sdk/spells/spellSpawnEntity');

const Modifier = require('app/sdk/modifiers/modifier');
const ModifierSynergizeApplyModifiersToGeneral = require('app/sdk/modifiers/modifierSynergizeApplyModifiersToGeneral');
const ModifierDoubleAttackStat = require('app/sdk/modifiers/modifierDoubleAttackStat');
const ModifierSynergizeApplyModifiers = require('app/sdk/modifiers/modifierSynergizeApplyModifiers');
const ModifierMyGeneralDamagedWatchBuffSelfAttackForSame = require('app/sdk/modifiers/modifierMyGeneralDamagedWatchBuffSelfAttackForSame');
const ModifierOnSpawnCopyMyGeneral = require('app/sdk/modifiers/modifierOnSpawnCopyMyGeneral');
const ModifierEgg = require('app/sdk/modifiers/modifierEgg');
const ModifierToken = require('app/sdk/modifiers/modifierToken');
const ModifierTokenCreator = require('app/sdk/modifiers/modifierTokenCreator');

const i18next = require('i18next');

class CardFactory_BloodstormSet_Faction5 {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let card = null;

    if (identifier === Cards.Faction5.Drogon) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.name = i18next.t("cards.faction_5_unit_drogon_name");
      card.setDescription(i18next.t("cards.faction_5_unit_drogon_desc"));
      card.setFXResource(["FX.Cards.Faction5.EarthWalker"]);
      card.setBoundingBoxWidth(70);
      card.setBoundingBoxHeight(75);
      card.setBaseSoundResource({
        apply : RSX.sfx_screenshake.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_earthwalker_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_earthwalker_hit.audio,
        attackDamage : RSX.sfx_neutral_earthwalker_attack_impact.audio,
        death : RSX.sfx_neutral_earthwalker_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f5DrogonBreathing.name,
        idle : RSX.f5DrogonIdle.name,
        walk : RSX.f5DrogonRun.name,
        attack : RSX.f5DrogonAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.9,
        damage : RSX.f5DrogonHit.name,
        death : RSX.f5DrogonDeath.name
      });
      card.atk = 5;
      card.maxHP = 4;
      card.manaCost = 4;
      card.rarityId = Rarity.Legendary;
      const doubleAttackModifierContextObject = ModifierDoubleAttackStat.createContextObject();
      doubleAttackModifierContextObject.durationEndTurn = 1;
      doubleAttackModifierContextObject.appliedName = i18next.t("modifiers.faction_5_drogon_buff_name");
      card.setInherentModifiersContextObjects([ModifierSynergizeApplyModifiersToGeneral.createContextObject([doubleAttackModifierContextObject], true, false, "Double your General\'s Attack this turn")]);
    }

    if (identifier === Cards.Faction5.Thraex) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.name = i18next.t("cards.faction_5_unit_thraex_name");
      card.setDescription(i18next.t("cards.faction_5_unit_thraex_desc"));
      card.setFXResource(["FX.Cards.Neutral.Thraex"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_diretidefrenzy.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_bluetipscorpion_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_silitharveteran_death.audio,
        attackDamage : RSX.sfx_f1windbladecommanderattack_impact.audio,
        death : RSX.sfx_f6_waterelemental_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f5ThraexBreathing.name,
        idle : RSX.f5ThraexIdle.name,
        walk : RSX.f5ThraexRun.name,
        attack : RSX.f5ThraexAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.0,
        damage : RSX.f5ThraexHit.name,
        death : RSX.f5ThraexDeath.name
      });
      card.atk = 2;
      card.maxHP = 4;
      card.manaCost = 3;
      card.rarityId = Rarity.Common;
      const buffContextObject = Modifier.createContextObjectWithAttributeBuffs(1);
      buffContextObject.appliedName = i18next.t("modifiers.faction_5_thraex_buff_name");
      card.setInherentModifiersContextObjects([
        ModifierSynergizeApplyModifiers.createContextObjectForAllAlliesAndSelf([buffContextObject], false, "All friendly minions gain +1 Attack (including itself)")
      ]);
    }

    if (identifier === Cards.Faction5.Rancour) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.name = i18next.t("cards.faction_5_unit_rancour_name");
      card.setDescription(i18next.t("cards.faction_5_unit_rancour_desc"));
      card.setFXResource(["FX.Cards.Faction5.PrimordialGazer"]);
      card.setBoundingBoxWidth(90);
      card.setBoundingBoxHeight(75);
      card.setBaseSoundResource({
        apply : RSX.sfx_screenshake.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_primordialgazer_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_primordialgazer_hit.audio,
        attackDamage : RSX.sfx_neutral_primordialgazer_attack_impact.audio,
        death : RSX.sfx_neutral_primordialgazer_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f5RancourBreathing.name,
        idle : RSX.f5RancourIdle.name,
        walk : RSX.f5RancourRun.name,
        attack : RSX.f5RancourAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.6,
        damage : RSX.f5RancourHit.name,
        death : RSX.f5RancourDeath.name
      });
      card.atk = 1;
      card.maxHP = 3;
      card.manaCost = 2;
      card.rarityId = Rarity.Rare;
      card.setInherentModifiersContextObjects([ModifierMyGeneralDamagedWatchBuffSelfAttackForSame.createContextObject("Rancour\'s Rage")]);
    }
      //card.setInherentModifiersContextObjects([ModifierMyGeneralDamagedWatchBuffSelfAttackForSame.createContextObject(i18next.t("modifiers.faction_5_rancour_buff_name"))])

    if (identifier === Cards.Spell.TectonicSpikes) {
      card = new SpellTectonicSpikes(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.id = Cards.Spell.TectonicSpikes;
      card.name = i18next.t("cards.faction_5_spell_tectonic_spikes_name");
      card.setDescription(i18next.t("cards.faction_5_spell_tectonic_spikes_desc"));
      card.manaCost = 3;
      card.damageAmount = 3;
      card.cardsToDraw = 3;
      card.rarityId = Rarity.Rare;
      card.setFXResource(["FX.Cards.Spell.TectonicSpikes"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_flashreincarnation.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconTectonicSpikesIdle.name,
        active : RSX.iconTectonicSpikesActive.name
      });
    }

    if (identifier === Cards.Spell.EntropicGaze) {
      card = new SpellDamageEnemyGeneralBothDrawCard(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.id = Cards.Spell.EntropicGaze;
      card.name = i18next.t("cards.faction_5_spell_entropic_gaze_name");
      card.setDescription(i18next.t("cards.faction_5_spell_entropic_gaze_desc"));
      card.id = Cards.Spell.EntropicGaze;
      card.manaCost = 2;
      card.damageAmount = 2;
      card.rarityId = Rarity.Common;
      card.spellFilterType = SpellFilterType.NeutralIndirect;
      card.radius = CONFIG.WHOLE_BOARD_RADIUS;
      card.canTargetGeneral = true;
      card.setFXResource(["FX.Cards.Spell.EntropicGaze"]);
      card.setBaseAnimResource({
        idle : RSX.iconEntropicGazeIdle.name,
        active : RSX.iconEntropicGazeActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_neutral_spelljammer_attack_swing.audio
      });
    }

    if (identifier === Cards.Faction5.SpiritOfValknu) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.setIsHiddenInCollection(true);
      card.factionId = Factions.Faction5;
      card.name = i18next.t("cards.faction_5_unit_valknu_spirit_name");
      card.setFXResource(["FX.Cards.Faction5.SpiritOfValknu"]);
      card.setBoundingBoxWidth(115);
      card.setBoundingBoxHeight(80);
      card.setBaseSoundResource({
        apply : RSX.sfx_neutral_jaxtruesight_attack_impact.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f5_unstableleviathan_attack_swing.audio,
        receiveDamage : RSX.sfx_f5_unstableleviathan_hit.audio,
        attackDamage : RSX.sfx_f5_unstableleviathan_attack_impact.audio,
        death : RSX.sfx_f5_unstableleviathan_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f5ValknuSpiritBreathing.name,
        idle : RSX.f5ValknuSpiritIdle.name,
        walk : RSX.f5ValknuSpiritRun.name,
        attack : RSX.f5ValknuSpiritAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.6,
        damage : RSX.f5ValknuSpiritHit.name,
        death : RSX.f5ValknuSpiritDeath.name
      });
      card.atk = 2;
      card.maxHP = 25;
      card.manaCost = 6;
      card.setInherentModifiersContextObjects([ModifierOnSpawnCopyMyGeneral.createContextObject()]);
      card.rarityId = Rarity.TokenUnit;
      card.addKeywordClassToInclude(ModifierToken);
    }

    if (identifier === Cards.Spell.ValknusSeal) {
      card = new SpellSpawnEntity(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.id = Cards.Spell.ValknusSeal;
      card.name = i18next.t("cards.faction_5_spell_valknus_seal_name");
      card.setDescription(i18next.t("cards.faction_5_spell_valknus_seal_desc"));
      card.manaCost = 4;
      card.rarityId = Rarity.Epic;
      card.cardDataOrIndexToSpawn = {id: Cards.Faction5.Egg};
      card.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = [ModifierEgg.createContextObject({id: Cards.Faction5.SpiritOfValknu}, "copy of your General")];
      card.spellFilterType = SpellFilterType.SpawnSource;
      card.addKeywordClassToInclude(ModifierTokenCreator);
      card.setFXResource(["FX.Cards.Spell.MindSteal"]);
      card.setBaseAnimResource({
        idle : RSX.iconValknuSealIdle.name,
        active : RSX.iconValknuSealActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_neutral_crossbones_death.audio
      });
    }

    return card;
  }
}

module.exports = CardFactory_BloodstormSet_Faction5;
