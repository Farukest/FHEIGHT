/*
 * decaffeinate suggestions:
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// do not add this file to a package
// it is specifically parsed by the package generation script

const _ = require('underscore');
const moment = require('moment');

const Logger = require('app/common/logger');

const CONFIG = require('app/common/config');
const RSX = require('app/data/resources');

const Card = require('app/sdk/cards/card');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const Factions = require('app/sdk/cards/factionsLookup');
const FactionFactory = require('app/sdk/cards/factionFactory');
const Races = require('app/sdk/cards/racesLookup');
const Rarity = require('app/sdk/cards/rarityLookup');
const Unit = require('app/sdk/entities/unit');
const Artifact = require('app/sdk/artifacts/artifact');
const CardSet = require('app/sdk/cards/cardSetLookup');

const SpellFilterType = require('app/sdk/spells/spellFilterType');
const SpellInklingSurge = require('app/sdk/spells/spellInklingSurge');
const SpellShadows = require('app/sdk/spells/spellShadows');
const SpellApplyModifiersToGeneral = require('app/sdk/spells/spellApplyModifiersToGeneral');
const SpellRequireUnoccupiedFriendlyCreep = require('app/sdk/spells/spellRequireUnoccupiedFriendlyCreep');
const SpellKillEnemyOnFriendlyCreep = require('app/sdk/spells/spellKillEnemyOnFriendlyCreep');
const SpellCurseOfShadows = require('app/sdk/spells/spellCurseOfShadows');

const Modifier = require('app/sdk/modifiers/modifier');
const ModifierOpponentSummonWatchBuffMinionInHand = require('app/sdk/modifiers/modifierOpponentSummonWatchBuffMinionInHand');
const ModifierDyingWishDrawMinionsWithDyingWish = require('app/sdk/modifiers/modifierDyingWishDrawMinionsWithDyingWish');
const ModifierDealDamageWatchControlEnemyMinionUntilEOT = require('app/sdk/modifiers/modifierDealDamageWatchControlEnemyMinionUntilEOT');
const ModifierOpeningGambitStealEnemyGeneralHealth = require('app/sdk/modifiers/modifierOpeningGambitStealEnemyGeneralHealth');
const ModifierDoomed3 = require('app/sdk/modifiers/modifierDoomed3');
const ModifierSentinelSetup = require('app/sdk/modifiers/modifierSentinelSetup');
const ModifierSentinelOpponentGeneralAttack = require('app/sdk/modifiers/modifierSentinelOpponentGeneralAttack');
const ModifierCardControlledPlayerModifiers = require('app/sdk/modifiers/modifierCardControlledPlayerModifiers');
const ModifierSentinelOpponentSummonCopyIt = require('app/sdk/modifiers/modifierSentinelOpponentSummonCopyIt');
const ModifierSentinelOpponentSpellCast = require('app/sdk/modifiers/modifierSentinelOpponentSpellCast');
const ModifierEnemySpellWatchPutCardInHand = require('app/sdk/modifiers/modifierEnemySpellWatchPutCardInHand');
const ModifierDyingWishPutCardInHand = require('app/sdk/modifiers/modifierDyingWishPutCardInHand');
const ModifierSentinel = require('app/sdk/modifiers/modifierSentinel');
const ModifierStackingShadows = require('app/sdk/modifiers/modifierStackingShadows');
const ModifierToken = require('app/sdk/modifiers/modifierToken');
const ModifierTokenCreator = require('app/sdk/modifiers/modifierTokenCreator');

const i18next = require('i18next');
if (i18next.t() === undefined) {
  i18next.t = text => text;
}

class CardFactory_FirstWatchSet_Faction4 {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let sentinelData;
    let card = null;

    if (identifier === Cards.Faction4.Phantasm) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.name = i18next.t("cards.faction_4_unit_phantasm_name");
      card.setDescription(i18next.t("cards.faction_4_unit_phantasm_desc"));
      card.setFXResource(["FX.Cards.Faction4.DarkSiren"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_f4_blacksolus_attack_swing.audio,
        walk : RSX.sfx_unit_run_magical_4.audio,
        attack : RSX.sfx_f4_siren_attack_swing.audio,
        receiveDamage : RSX.sfx_f4_siren_hit.audio,
        attackDamage : RSX.sfx_f4_siren_attack_impact.audio,
        death : RSX.sfx_f4_siren_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4PhantasmBreathing.name,
        idle : RSX.f4PhantasmIdle.name,
        walk : RSX.f4PhantasmRun.name,
        attack : RSX.f4PhantasmAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.5,
        damage : RSX.f4PhantasmHit.name,
        death : RSX.f4PhantasmDeath.name
      });
      card.atk = 3;
      card.maxHP = 2;
      card.manaCost = 2;
      card.rarityId = Rarity.Common;
      card.setInherentModifiersContextObjects([ModifierOpponentSummonWatchBuffMinionInHand.createContextObject(1,0,i18next.t("modifiers.faction_4_phantasm"))]);
    }

    if (identifier === Cards.Faction4.Nekomata) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.name = i18next.t("cards.faction_4_unit_nekomata_name");
      card.setDescription(i18next.t("cards.faction_4_unit_nekomata_desc"));
      card.setFXResource(["FX.Cards.Neutral.PutridMindflayer"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_1.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f4_daemondeep_attack_swing.audio,
        receiveDamage : RSX.sfx_f4_daemondeep_hit.audio,
        attackDamage : RSX.sfx_f4_daemondeep_attack_impact.audio,
        death : RSX.sfx_f4_daemondeep_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4ArachneBreathing.name,
        idle : RSX.f4ArachneIdle.name,
        walk : RSX.f4ArachneRun.name,
        attack : RSX.f4ArachneAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.9,
        damage : RSX.f4ArachneHit.name,
        death : RSX.f4ArachneDeath.name
      });
      card.atk = 4;
      card.maxHP = 2;
      card.manaCost = 4;
      card.rarityId = Rarity.Epic;
      card.setInherentModifiersContextObjects([ModifierDyingWishDrawMinionsWithDyingWish.createContextObject(2)]);
    }

    if (identifier === Cards.Spell.InklingSurge) {
      card = new SpellInklingSurge(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.FirstWatch);
      card.id = Cards.Spell.InklingSurge;
      card.name = i18next.t("cards.faction_4_spell_inkling_surge_name");
      card.setDescription(i18next.t("cards.faction_4_spell_inkling_surge_desc"));
      card.manaCost = 1;
      card.rarityId = Rarity.Common;
      card.cardDataOrIndexToSpawn = {id: Cards.Faction4.Wraithling};
      card.spellFilterType = SpellFilterType.SpawnSource;
      card.addKeywordClassToInclude(ModifierTokenCreator);
      card.setFXResource(["FX.Cards.Spell.InklingSurge"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_entropicdecay.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconInklingSurgeIdle.name,
        active : RSX.iconInklingSurgeActive.name
      });
    }

    if (identifier === Cards.Spell.Shadowstalk) {
      card = new SpellShadows(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.FirstWatch);
      card.id = Cards.Spell.Shadowstalk;
      card.name = i18next.t("cards.faction_4_spell_shadowstalk_name");
      card.setDescription(i18next.t("cards.faction_4_spell_shadowstalk_desc"));
      card.manaCost = 2;
      card.rarityId = Rarity.Rare;
      card.addKeywordClassToInclude(ModifierTokenCreator);
      card.setFXResource(["FX.Cards.Spell.Shadowstalk"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_starsfury.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconShadowstalkIdle.name,
        active : RSX.iconShadowstalkActive.name
      });
    }

    if (identifier === Cards.Artifact.Mindlathe) {
      card = new Artifact(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.id = Cards.Artifact.Mindlathe;
      card.name = i18next.t("cards.faction_4_artifact_mindlathe_name");
      card.setDescription(i18next.t("cards.faction_4_artifact_mindlathe_desc"));
      card.manaCost = 3;
      card.rarityId = Rarity.Legendary;
      card.durability = 3;
      card.setTargetModifiersContextObjects([
        ModifierDealDamageWatchControlEnemyMinionUntilEOT.createContextObject()
      ]);
      card.setFXResource(["FX.Cards.Artifact.Mindlathe"]);
      card.setBaseAnimResource({
        idle: RSX.iconMindlatheIdle.name,
        active: RSX.iconMindlatheActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_victory_crest.audio
      });
    }

    if (identifier === Cards.Faction4.Desolator) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.name = i18next.t("cards.faction_4_unit_desolator_name");
      card.setDescription(i18next.t("cards.faction_4_unit_desolator_desc"));
      card.setFXResource(["FX.Cards.Neutral.Moebius"]);
      card.setBoundingBoxWidth(95);
      card.setBoundingBoxHeight(75);
      card.setBaseSoundResource({
        apply : RSX.sfx_ui_booster_packexplode.audio,
        walk : RSX.sfx_unit_run_magical_4.audio,
        attack : RSX.sfx_spell_entropicdecay.audio,
        receiveDamage : RSX.sfx_f3_dunecaster_hit.audio,
        attackDamage : RSX.sfx_f3_dunecaster_impact.audio,
        death : RSX.sfx_neutral_spelljammer_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4DesolaterBreathing.name,
        idle : RSX.f4DesolaterIdle.name,
        walk : RSX.f4DesolaterRun.name,
        attack : RSX.f4DesolaterAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.2,
        damage : RSX.f4DesolaterHit.name,
        death : RSX.f4DesolaterDeath.name
      });
      card.atk = 2;
      card.maxHP = 1;
      card.manaCost = 4;
      card.rarityId = Rarity.Legendary;
      card.setInherentModifiersContextObjects([
        ModifierOpeningGambitStealEnemyGeneralHealth.createContextObject(2),
        ModifierDyingWishPutCardInHand.createContextObject({id: Cards.Faction4.Desolator}, "Desolator")
      ]);
    }

    if (identifier === Cards.Spell.Doom) {
      card = new SpellApplyModifiersToGeneral(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.id = Cards.Spell.Doom;
      card.name = i18next.t("cards.faction_4_spell_doom_name");
      card.setDescription(i18next.t("cards.faction_4_spell_doom_desc"));
      card.manaCost = 9;
      card.rarityId = Rarity.Legendary;
      card.spellFilterType = SpellFilterType.None;
      card.applyToOpponentGeneral = true;
      const doomedContextObject = ModifierDoomed3.createContextObject();
      doomedContextObject.appliedName = i18next.t("modifiers.faction_4_spell_doom_1");
      card.setTargetModifiersContextObjects([
        doomedContextObject
      ]);
      card.setFXResource(["FX.Cards.Spell.Doom"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_flashreincarnation.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconDoomIdle.name,
        active : RSX.iconDoomActive.name
      });
    }

    if (identifier === Cards.Faction4.AbyssSentinel) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.setIsHiddenInCollection(true);
      card.name = i18next.t("cards.faction_4_unit_watchful_sentinel_name");
      card.setDescription(i18next.t("cards.faction_4_unit_watchful_sentinel_desc"));
      card.setFXResource(["FX.Cards.Faction4.ShadowWatcher"]);
      card.setBoundingBoxWidth(55);
      card.setBoundingBoxHeight(80);
      card.setBaseSoundResource({
        apply : RSX.sfx_f4_blacksolus_attack_swing.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f4_engulfingshadow_attack_swing.audio,
        receiveDamage : RSX.sfx_f4_engulfingshadow_attack_impact.audio,
        attackDamage : RSX.sfx_f4_engulfingshadow_hit.audio,
        death : RSX.sfx_f4_engulfingshadow_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4AbyssianSentinelBreathing.name,
        idle : RSX.f4AbyssianSentinelIdle.name,
        walk : RSX.f4AbyssianSentinelRun.name,
        attack : RSX.f4AbyssianSentinelAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.5,
        damage : RSX.f4AbyssianSentinelHit.name,
        death : RSX.f4AbyssianSentinelDeath.name
      });
      card.atk = 3;
      card.maxHP = 3;
      card.manaCost = 3;
      card.rarityId = Rarity.TokenUnit;
      card.addKeywordClassToInclude(ModifierToken);
    }

    if (identifier === Cards.Faction4.SkullProphet) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.name = i18next.t("cards.faction_4_unit_skullprophet_name");
      card.setDescription(i18next.t("cards.faction_4_unit_skullprophet_desc"));
      card.setFXResource(["FX.Cards.Faction4.SkullCaster"]);
      card.setBoundingBoxWidth(60);
      card.setBoundingBoxHeight(90);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_2.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_dragonlark_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_dragonlark_hit.audio,
        attackDamage : RSX.sfx_neutral_dragonlark_attack_impact.audio,
        death : RSX.sfx_neutral_dragonlark_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4SkullcasterBreathing.name,
        idle : RSX.f4SkullcasterIdle.name,
        walk : RSX.f4SkullcasterRun.name,
        attack : RSX.f4SkullcasterAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.4,
        damage : RSX.f4SkullcasterHit.name,
        death : RSX.f4SkullcasterDeath.name
      });
      card.atk = 2;
      card.maxHP = 4;
      card.manaCost = 3;
      card.rarityId = Rarity.Rare;
      sentinelData = {id: Cards.Faction4.AbyssSentinel};
      if (sentinelData.additionalModifiersContextObjects == null) { sentinelData.additionalModifiersContextObjects = []; }
      sentinelData.additionalModifiersContextObjects.push(ModifierSentinelOpponentGeneralAttack.createContextObject("transform.", {id: Cards.Faction4.SkullProphet}));
      const contextObject = Modifier.createContextObjectWithAttributeBuffs(-1);
      contextObject.appliedName = i18next.t("modifiers.faction_4_skullprophet");
      contextObject.activeInHand = (contextObject.activeInDeck = (contextObject.activeInSignatureCards = false));
      contextObject.activeOnBoard = true;
      card.setInherentModifiersContextObjects([
        ModifierCardControlledPlayerModifiers.createContextObjectOnBoardToTargetEnemyPlayer([contextObject], "The enemy General has -1 Attack"),
        ModifierSentinelSetup.createContextObject(sentinelData)
      ]);
      card.addKeywordClassToInclude(ModifierSentinel);
      card.addKeywordClassToInclude(ModifierTokenCreator);
    }

    if (identifier === Cards.Faction4.BoundTormentor) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.name = i18next.t("cards.faction_4_unit_bound_tormentor_name");
      card.setDescription(i18next.t("cards.faction_4_unit_bound_tormentor_desc"));
      card.setFXResource(["FX.Cards.Faction2.JadeOgre"]);
      card.setBoundingBoxWidth(65);
      card.setBoundingBoxHeight(90);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_deathstrikeseal.audio,
        walk : RSX.sfx_unit_physical_4.audio,
        attack : RSX.sfx_f2_jadeogre_attack_swing.audio,
        receiveDamage : RSX.sfx_f2_jadeogre_hit.audio,
        attackDamage : RSX.sfx_f2_jadeogre_attack_impact.audio,
        death : RSX.sfx_f2_jadeogre_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4MistressOfCommandsBreathing.name,
        idle : RSX.f4MistressOfCommandsIdle.name,
        walk : RSX.f4MistressOfCommandsRun.name,
        attack : RSX.f4MistressOfCommandsAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.8,
        damage : RSX.f4MistressOfCommandsHit.name,
        death : RSX.f4MistressOfCommandsDeath.name
      });
      card.atk = 2;
      card.maxHP = 3;
      card.manaCost = 3;
      card.rarityId = Rarity.Common;
      sentinelData = {id: Cards.Faction4.AbyssSentinel};
      if (sentinelData.additionalModifiersContextObjects == null) { sentinelData.additionalModifiersContextObjects = []; }
      sentinelData.additionalModifiersContextObjects.push(ModifierSentinelOpponentSummonCopyIt.createContextObject("transform.", {id: Cards.Faction4.BoundTormentor}));
      card.setInherentModifiersContextObjects([ ModifierSentinelSetup.createContextObject(sentinelData) ]);
      card.addKeywordClassToInclude(ModifierSentinel);
      card.addKeywordClassToInclude(ModifierTokenCreator);
    }

    if (identifier === Cards.Faction4.Xerroloth) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.name = i18next.t("cards.faction_4_unit_xerroloth_name");
      card.setDescription(i18next.t("cards.faction_4_unit_xerroloth_desc"));
      card.setBoundingBoxWidth(60);
      card.setBoundingBoxHeight(90);
      card.setFXResource(["FX.Cards.Faction2.CelestialPhantom"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_deathstrikeseal.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f2_celestialphantom_attack_swing.audio,
        receiveDamage :  RSX.sfx_f2_celestialphantom_hit.audio,
        attackDamage : RSX.sfx_f2_celestialphantom_attack_impact.audio,
        death : RSX.sfx_f2_celestialphantom_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4MegaFiendBreathing.name,
        idle : RSX.f4MegaFiendIdle.name,
        walk : RSX.f4MegaFiendRun.name,
        attack : RSX.f4MegaFiendAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.6,
        damage : RSX.f4MegaFiendHit.name,
        death : RSX.f4MegaFiendDeath.name
      });
      card.atk = 3;
      card.maxHP = 2;
      card.manaCost = 3;
      sentinelData = {id: Cards.Faction4.AbyssSentinel};
      if (sentinelData.additionalModifiersContextObjects == null) { sentinelData.additionalModifiersContextObjects = []; }
      sentinelData.additionalModifiersContextObjects.push(ModifierSentinelOpponentSpellCast.createContextObject("transform.", {id: Cards.Faction4.Xerroloth}));
      card.setInherentModifiersContextObjects([ModifierEnemySpellWatchPutCardInHand.createContextObject({id: Cards.Faction4.Fiend}), ModifierSentinelSetup.createContextObject(sentinelData) ]);
      card.rarityId = Rarity.Rare;
      card.addKeywordClassToInclude(ModifierSentinel);
      card.addKeywordClassToInclude(ModifierTokenCreator);
    }

    if (identifier === Cards.Spell.Nethermeld) {
      card = new SpellRequireUnoccupiedFriendlyCreep(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.id = Cards.Spell.CreepMeld;
      card.name = i18next.t("cards.faction_4_spell_nethermeld_name");
      card.setDescription(i18next.t("cards.faction_4_spell_nethermeld_desc"));
      card.manaCost = 1;
      card.rarityId = Rarity.Epic;
      card.spellFilterType = SpellFilterType.NeutralDirect;
      card.addKeywordClassToInclude(ModifierStackingShadows);
      card.setFollowups([{
        id: Cards.Spell.FollowupTeleportToFriendlyCreep
      }]);
      card.setFXResource(["FX.Cards.Spell.Nethermeld"]);
      card.setBaseAnimResource({
        idle: RSX.iconNethermeldIdle.name,
        active: RSX.iconNethermeldActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_naturalselection.audio
      });
    }

    if (identifier === Cards.Spell.ChokingTendrils) {
      card = new SpellKillEnemyOnFriendlyCreep(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.id = Cards.Spell.CreepingTendrils;
      card.name = i18next.t("cards.faction_4_spell_choking_tendrils_name");
      card.setDescription(i18next.t("cards.faction_4_spell_choking_tendrils_desc"));
      card.manaCost = 2;
      card.rarityId = Rarity.Common;
      card.spellFilterType = SpellFilterType.EnemyDirect;
      card.addKeywordClassToInclude(ModifierStackingShadows);
      card.setFXResource(["FX.Cards.Spell.ChokingTendrils"]);
      card.setBaseAnimResource({
        idle: RSX.iconCreepingTendrilsIdle.name,
        active: RSX.iconCreepingTendrilsActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_icepillar.audio
      });
    }

    if (identifier === Cards.Spell.CorporealCadence) {
      card = new SpellCurseOfShadows(gameSession);
      card.setCardSetId(CardSet.FirstWatch);
      card.factionId = Factions.Faction4;
      card.id = Cards.Spell.CurseOfShadows;
      card.name = i18next.t("cards.faction_4_spell_corporeal_cadence_name");
      card.setDescription(i18next.t("cards.faction_4_spell_corporeal_cadence_desc"));
      card.manaCost = 5;
      card.rarityId = Rarity.Epic;
      card.spellFilterType = SpellFilterType.AllyDirect;
      card.setFXResource(["FX.Cards.Spell.CorporealCadence"]);
      card.setBaseAnimResource({
        idle: RSX.iconCorporealCadenceIdle.name,
        active: RSX.iconCorporealCadenceActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_darkfiresacrifice.audio
      });
    }

    return card;
  }
}

module.exports = CardFactory_FirstWatchSet_Faction4;
