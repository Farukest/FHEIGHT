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
const CardSet = require('app/sdk/cards/cardSetLookup');
const Artifact = require('app/sdk/artifacts/artifact');
const SpellFilterType = require('app/sdk/spells/spellFilterType');

const SpellDejaVu = require('app/sdk/spells/spellDejaVu');
const SpellDamage = require('app/sdk/spells/spellDamage');
const SpellSummonHighestCostMinion = require('app/sdk/spells/spellSummonHighestCostMinion');
const SpellPandaJail = require('app/sdk/spells/spellPandaJail');
const SpellCopyMinionToHand = require('app/sdk/spells/spellCopyMinionToHand');
const SpellIntensifyDealDamage = require('app/sdk/spells/spellIntensifyDealDamage');
const SpellDamageAndPutCardInHand = require('app/sdk/spells/spellDamageAndPutCardInHand');
const SpellApplyPlayerModifiers = require('app/sdk/spells/spellApplyPlayerModifiers');

const Modifier = require('app/sdk/modifiers/modifier');
const ModifierRanged = require('app/sdk/modifiers/modifierRanged');
let ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const ModifierMyMoveWatchAnyReasonDrawCard = require('app/sdk/modifiers/modifierMyMoveWatchAnyReasonDrawCard');
const ModifierBackstab = require('app/sdk/modifiers/modifierBackstab');
const ModifierBackstabWatchSummonBackstabMinion = require('app/sdk/modifiers/modifierBackstabWatchSummonBackstabMinion');
const ModifierMyAttackWatchApplyModifiers = require('app/sdk/modifiers/modifierMyAttackWatchApplyModifiers');
const ModifierBackstabWatchApplyPlayerModifiers = require('app/sdk/modifiers/modifierBackstabWatchApplyPlayerModifiers');
const ModifierFlying = require('app/sdk/modifiers/modifierFlying');
const ModifierSummonWatchApplyModifiersToRanged = require('app/sdk/modifiers/modifierSummonWatchApplyModifiersToRanged');
const ModifierFirstBlood = require('app/sdk/modifiers/modifierFirstBlood');
const ModifierStartsInHand = require('app/sdk/modifiers/modifierStartsInHand');
ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const ModifierSpellWatchAnywhereApplyModifiers = require('app/sdk/modifiers/modifierSpellWatchAnywhereApplyModifiers');
const ModifierDamageBothGeneralsOnReplace = require('app/sdk/modifiers/modifierDamageBothGeneralsOnReplace');
const ModifierIntensifyTempBuffNearbyMinion = require('app/sdk/modifiers/modifierIntensifyTempBuffNearbyMinion');
const ModifierOnSummonFromHandApplyEmblems = require('app/sdk/modifiers/modifierOnSummonFromHandApplyEmblems');
ModifierManaCostChange = require('app/sdk/modifiers/modifierManaCostChange');
const ModifierTokenCreator = require('app/sdk/modifiers/modifierTokenCreator');
const ModifierFateSonghaiMinionQuest = require('app/sdk/modifiers/modifierFateSonghaiMinionQuest');
const ModifierCannotBeReplaced = require('app/sdk/modifiers/modifierCannotBeReplaced');
const ModifierIntensify = require('app/sdk/modifiers/modifierIntensify');
const ModifierCounterIntensify = require('app/sdk/modifiers/modifierCounterIntensify');
const ModifierCannotBeRemovedFromHand = require('app/sdk/modifiers/modifierCannotBeRemovedFromHand');

const PlayerModifierTeamAlwaysBackstabbed = require('app/sdk/playerModifiers/playerModifierTeamAlwaysBackstabbed');
const PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatchSonghaiMeltdownQuest');
const PlayerModifierSpellWatchHollowVortex = require('app/sdk/playerModifiers/playerModifierSpellWatchHollowVortex');

const i18next = require('i18next');
if (i18next.t() === undefined) {
  i18next.t = text => text;
}

class CardFactory_CoreshatterSet_Faction2 {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let card = null;

    if (identifier === Cards.Faction2.DarkHeart) {
      card = new Unit(gameSession);
      card.factionId = Factions.Faction2;
      card.setCardSetId(CardSet.Coreshatter);
      card.name = "Hideatsu the Ebon Ox";
      card.setDescription("Trial: Summon 7 minions from your action bar with different costs.\nDestiny: Summon friendly minions to deal their cost as damage to an enemy.");
      card.atk = 5;
      card.maxHP = 5;
      card.manaCost = 0;
      card.rarityId = Rarity.Mythron;
      const emblemContextObject = PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest.createContextObject();
      emblemContextObject.appliedName = "Storm of the Ebon Ox";
      emblemContextObject.appliedDescription = "Whenever you summon a minion, deal damage equal to its cost to an enemy.";
      card.setInherentModifiersContextObjects([
        ModifierStartsInHand.createContextObject(),
        ModifierCannotBeReplaced.createContextObject(),
        ModifierOnSummonFromHandApplyEmblems.createContextObject([emblemContextObject], true, false),
        ModifierFateSonghaiMinionQuest.createContextObject(7),
        ModifierCannotBeRemovedFromHand.createContextObject()
      ]);
      card.setFXResource(["FX.Cards.Neutral.DarkHeart"]);
      card.setBoundingBoxWidth(100);
      card.setBoundingBoxHeight(90);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_deathstrikeseal.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f2_chakriavatar_attack_swing.audio,
        receiveDamage : RSX.sfx_f2_chakriavatar_hit.audio,
        attackDamage : RSX.sfx_f2_chakriavatar_attack_impact.audio,
        death : RSX.sfx_f2_chakriavatar_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f2HeartOfTheSonghaiBreathing.name,
        idle : RSX.f2HeartOfTheSonghaiIdle.name,
        walk : RSX.f2HeartOfTheSonghaiRun.name,
        attack : RSX.f2HeartOfTheSonghaiAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.4,
        damage : RSX.f2HeartOfTheSonghaiHit.name,
        death : RSX.f2HeartOfTheSonghaiDeath.name
      });
    }

    if (identifier === Cards.Faction2.MoveMan) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.name = "Bakezori";
      card.setDescription("Whenever this minion is moved for any reason, draw a card.");
      card.atk = 2;
      card.maxHP = 6;
      card.manaCost = 4;
      card.rarityId = Rarity.Epic;
      card.setInherentModifiersContextObjects([ModifierMyMoveWatchAnyReasonDrawCard.createContextObject(1)]);
      card.setFXResource(["FX.Cards.Neutral.SunSeer"]);
      card.setBoundingBoxWidth(45);
      card.setBoundingBoxHeight(80);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_2.audio,
        walk : RSX.sfx_unit_run_magical_4.audio,
        attack : RSX.sfx_neutral_sunseer_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_sunseer_hit.audio,
        attackDamage : RSX.sfx_neutral_sunseer_attack_impact.audio,
        death : RSX.sfx_neutral_sunseer_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f2PaperDropperBreathing.name,
        idle : RSX.f2PaperDropperIdle.name,
        walk : RSX.f2PaperDropperRun.name,
        attack : RSX.f2PaperDropperAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.8,
        damage : RSX.f2PaperDropperHit.name,
        death : RSX.f2PaperDropperDeath.name
      });
    }

    if (identifier === Cards.Spell.DejaVu) {
      card = new SpellDejaVu(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.id = Cards.Spell.DejaVu;
      card.name = "Meditate";
      card.setDescription("Shuffle five copies of the spell you cast most recently into your deck (excluding Meditate).");
      card.rarityId = Rarity.Rare;
      card.manaCost = 0;
      card.spellFilterType = SpellFilterType.NeutralIndirect;
      card.setFXResource(["FX.Cards.Spell.Meditate"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_fountainofyouth.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconDejaVuIdle.name,
        active : RSX.iconDejaVuActive.name
      });
    }

    if (identifier === Cards.Spell.Kindle) {
      card = new SpellIntensifyDealDamage(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.id = Cards.Spell.Kindle;
      card.name = "Knucklestorm";
      card.setDescription("Intensify: Deal 1 damage to an enemy.");
      card.rarityId = Rarity.Common;
      card.manaCost = 1;
      card.spellFilterType = SpellFilterType.EnemyDirect;
      card.canTargetGeneral = true;
      card.damageAmount = 1;
      card.addKeywordClassToInclude(ModifierIntensify);
      card.setInherentModifiersContextObjects([ModifierCounterIntensify.createContextObject()]);
      card.setFXResource(["FX.Cards.Spell.Knucklestorm"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_neutral_bluetipscorpion_attack_impact.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconKindleIdle.name,
        active : RSX.iconKindleActive.name
      });
    }

    if (identifier === Cards.Artifact.BackstabGloves) {
      card = new Artifact(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.id = Cards.Artifact.BackstabGloves;
      card.name = "Horned Mask";
      card.setDescription("Your General gains +1 Attack.\nAfter a friendly minion with Backstab attacks, it gains +1/+1.");
      card.manaCost = 1;
      card.rarityId = Rarity.Epic;
      card.durability = 3;
      const attackBuffContextObject = Modifier.createContextObjectWithAttributeBuffs(1,1);
      attackBuffContextObject.appliedName = "Growing Charge";
      const auraContextObject = ModifierMyAttackWatchApplyModifiers.createContextObject([attackBuffContextObject]);
      auraContextObject.appliedName = "Poised to Strike";
      auraContextObject.appliedDescription = "After this minion attacks, it gains +1/+1.";
      card.setTargetModifiersContextObjects([
        Modifier.createContextObjectWithAttributeBuffs(1,0),
        Modifier.createContextObjectWithAuraForAllAllies([auraContextObject], null, null, [ModifierBackstab.type])
      ]);
      card.addKeywordClassToInclude(ModifierBackstab);
      card.setFXResource(["FX.Cards.Artifact.EnergyAmulet"]);
      card.setBaseAnimResource({
        idle: RSX.iconGorehornMaskIdle.name,
        active: RSX.iconGorehornMaskActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_victory_crest.audio
      });
    }

    if (identifier === Cards.Faction2.ShadowSummoner) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.name = "Kaido Expert";
      card.setDescription("Backstab: (1).\nWhenever this minion backstabs, summon a minion with Backstab that costs 2 or less from your deck nearby.");
      card.atk = 2;
      card.maxHP = 2;
      card.manaCost = 3;
      card.rarityId = Rarity.Rare;
      card.setInherentModifiersContextObjects([ModifierBackstab.createContextObject(1), ModifierBackstabWatchSummonBackstabMinion.createContextObject(2)]);
      card.setFXResource(["FX.Cards.Neutral.VineEntangler"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_komodocharger_attack_swing.audio,
        receiveDamage : RSX.sfx_f6_ancientgrove_hit.audio,
        attackDamage : RSX.sfx_f6_ancientgrove_attack_impact.audio,
        death : RSX.sfx_f6_ancientgrove_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f2ShadowSummonerBreathing.name,
        idle : RSX.f2ShadowSummonerIdle.name,
        walk : RSX.f2ShadowSummonerRun.name,
        attack : RSX.f2ShadowSummonerAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.6,
        damage : RSX.f2ShadowSummonerHit.name,
        death : RSX.f2ShadowSummonerDeath.name
      });
    }

    if (identifier === Cards.Faction2.Backbreaker) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.name = "Massacre Artist";
      card.setDescription("Backstab: (2).\nAfter this minion attacks and backstabs, all attacks are backstabs this turn.");
      card.atk = 2;
      card.maxHP = 5;
      card.manaCost = 4;
      card.rarityId = Rarity.Legendary;
      const teamAlwaysBackstabbedModifier = PlayerModifierTeamAlwaysBackstabbed.createContextObject("Massacred", "Backstabbed from any angle!");
      teamAlwaysBackstabbedModifier.durationEndTurn = 1;
      card.setInherentModifiersContextObjects([
        ModifierBackstab.createContextObject(2),
        ModifierBackstabWatchApplyPlayerModifiers.createContextObjectToTargetEnemyPlayer([teamAlwaysBackstabbedModifier], false)
      ]);
      card.setFXResource(["FX.Cards.Neutral.BloodshardGolem"]);
      card.setBoundingBoxWidth(80);
      card.setBoundingBoxHeight(90);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_deathstrikeseal.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_redsynja_attack_swing.audio,
        receiveDamage : RSX.sfx_f2_kaidoassassin_hit.audio,
        attackDamage : RSX.sfx_neutral_syvrel_attack_impact.audio,
        death : RSX.sfx_neutral_syvrel_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f2SupekutaBreathing.name,
        idle : RSX.f2SupekutaIdle.name,
        walk : RSX.f2SupekutaRun.name,
        attack : RSX.f2SupekutaAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.3,
        damage : RSX.f2SupekutaHit.name,
        death : RSX.f2SupekutaDeath.name
      });
    }

    if (identifier === Cards.Faction2.CraneWalker) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.name = "Orizuru";
      card.setDescription("Flying");
      card.atk = 3;
      card.maxHP = 4;
      card.manaCost = 3;
      card.rarityId = Rarity.Common;
      card.setInherentModifiersContextObjects([ModifierFlying.createContextObject()]);
      card.setFXResource(["FX.Cards.Neutral.PutridMindflayer"]);
      card.setBoundingBoxWidth(100);
      card.setBoundingBoxHeight(90);
      card.setBaseSoundResource({
        apply : RSX.sfx_summonlegendary.audio,
        walk : RSX.sfx_neutral_zurael_death.audio,
        attack : RSX.sfx_neutral_zurael_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_zurael_hit.audio,
        attackDamage : RSX.sfx_neutral_zurael_attack_impact.audio,
        death : RSX.sfx_neutral_zurael_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f2OrizuruBreathing.name,
        idle : RSX.f2OrizuruIdle.name,
        walk : RSX.f2OrizuruRun.name,
        attack : RSX.f2OrizuruAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.4,
        damage : RSX.f2OrizuruHit.name,
        death : RSX.f2OrizuruDeath.name
      });
    }

    if (identifier === Cards.Faction2.Flareslinger) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.name = "Xenkai Cannoneer";
      card.setDescription("Ranged\nWhenever you summon a minion with Ranged, that minion gains Rush.");
      card.atk = 4;
      card.maxHP = 4;
      card.manaCost = 5;
      card.rarityId = Rarity.Legendary;
      card.setInherentModifiersContextObjects([ModifierRanged.createContextObject(), ModifierSummonWatchApplyModifiersToRanged.createContextObject([ModifierFirstBlood.createContextObject()])]);
      card.addKeywordClassToInclude(ModifierFirstBlood);
      card.setFXResource(["FX.Cards.Faction2.FlareSlinger"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_1.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_firespitter_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_firespitter_hit.audio,
        attackDamage : RSX.sfx_neutral_firespitter_attack_impact.audio,
        death : RSX.sfx_neutral_firespitter_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f2FlareSlingerBreathing.name,
        idle : RSX.f2FlareSlingerIdle.name,
        walk : RSX.f2FlareSlingerRun.name,
        attack : RSX.f2FlareSlingerAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.4,
        damage : RSX.f2FlareSlingerHit.name,
        death : RSX.f2FlareSlingerDeath.name
      });
    }

    if (identifier === Cards.Faction2.PandaPuncher) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.name = "Coalfist";
      card.setDescription("Intensify: Give a random nearby friendly minion +2 Attack this turn.");
      card.atk = 5;
      card.maxHP = 4;
      card.manaCost = 4;
      card.rarityId = Rarity.Common;
      card.setInherentModifiersContextObjects([
        ModifierIntensifyTempBuffNearbyMinion.createContextObject(2, 0, "Ignition Fist"),
        ModifierCounterIntensify.createContextObject()
      ]);
      card.setFXResource(["FX.Cards.Neutral.DeathBlighter"]);
      card.setBoundingBoxWidth(105);
      card.setBoundingBoxHeight(75);
      card.setBaseSoundResource({
        apply : RSX.sfx_neutral_chaoselemental_hit.audio,
        walk : RSX.sfx_neutral_chaoselemental_death.audio,
        attack : RSX.sfx_f4_blacksolus_attack_swing.audio,
        receiveDamage : RSX.sfx_f4_blacksolus_hit.audio,
        attackDamage : RSX.sfx_f4_blacksolus_attack_impact.audio,
        death : RSX.sfx_f4_blacksolus_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f2PandaPuncherBreathing.name,
        idle : RSX.f2PandaPuncherIdle.name,
        walk : RSX.f2PandaPuncherRun.name,
        attack : RSX.f2PandaPuncherAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.6,
        damage : RSX.f2PandaPuncherHit.name,
        death : RSX.f2PandaPuncherDeath.name
      });
    }

    if (identifier === Cards.Spell.HollowVortex) {
      card = new SpellApplyPlayerModifiers(gameSession);
      card.factionId = Factions.Faction2;
      card.setCardSetId(CardSet.Coreshatter);
      card.id = Cards.Spell.HollowVortex;
      card.name = "Kensho Vortex";
      card.setDescription("Costs 1 less for each spell you cast this game. Whenever you cast a spell this turn, summon a minion that costs up to 2 more nearby your General.");
      card.manaCost = 11;
      card.rarityId = Rarity.Legendary;
      const customContextObject = PlayerModifierSpellWatchHollowVortex.createContextObject(2);
      customContextObject.durationEndTurn = 1;
      customContextObject.appliedName = "Kensho Unleashed";
      customContextObject.appliedDescription = "Casting spells summons minions.";
      card.applyToOwnGeneral = true;
      card.setTargetModifiersContextObjects([customContextObject]);
      const manaChangeContextObject = ModifierManaCostChange.createContextObject(-1);
      const manaSpellWatch = ModifierSpellWatchAnywhereApplyModifiers.createContextObject([manaChangeContextObject]);
      card.setInherentModifiersContextObjects([manaSpellWatch]);
      card.spellFilterType = SpellFilterType.None;
      card.setFXResource(["FX.Cards.Spell.KenshoVortex"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_scionsfirstwish.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconHollowVortexIdle.name,
        active : RSX.iconHollowVortexActive.name
      });
    }

    if (identifier === Cards.Spell.PandaJail) {
      card = new SpellPandaJail(gameSession);
      card.factionId = Factions.Faction2;
      card.setCardSetId(CardSet.Coreshatter);
      card.id = Cards.Spell.PandaJail;
      card.name = "Pandatentiary";
      card.setDescription("Surround the enemy General with friendly Panddo that disappear at the start of your next turn.");
      card.manaCost = 3;
      card.rarityId = Rarity.Epic;
      card.spellFilterType = SpellFilterType.None;
      card.addKeywordClassToInclude(ModifierTokenCreator);
      card.setFXResource(["FX.Cards.Spell.Pandatentiary"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_onyxbearseal.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconPandaJailIdle.name,
        active : RSX.iconPandaJailActive.name
      });
    }

    if (identifier === Cards.Spell.GreaterPhoenixFire) {
      card = new SpellDamageAndPutCardInHand(gameSession);
      card.factionId = Factions.Faction2;
      card.setCardSetId(CardSet.Coreshatter);
      card.id = Cards.Spell.GreaterPhoenixFire;
      card.name = "Phoenix Barrage";
      card.setDescription("Deal 3 damage to anything.\nPut a Phoenix Fire into your action bar.");
      card.manaCost = 5;
      card.rarityId = Rarity.Common;
      card.spellFilterType = SpellFilterType.NeutralDirect;
      card.damageAmount = 3;
      card.cardDataOrIndexToPutInHand = {id: Cards.Spell.PhoenixFire};
      card.canTargetGeneral = true;
      card.setFXResource(["FX.Cards.Spell.PhoenixBarrage"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_phoenixfire.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconPhoenixBarrageIdle.name,
        active : RSX.iconPhoenixBarrageActive.name
      });
    }

    if (identifier === Cards.Spell.BootyProjection) {
      card = new SpellCopyMinionToHand(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction2;
      card.id = Cards.Spell.BootyProjection;
      card.name = "Second Self";
      card.setDescription("Put an EXACT copy of a friendly minion into your action bar.");
      card.rarityId = Rarity.Rare;
      card.manaCost = 2;
      card.spellFilterType = SpellFilterType.AllyDirect;
      card.canTargetGeneral = false;
      card.setFXResource(["FX.Cards.Spell.SecondSelf"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_drainmorale.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconProjectionIdle.name,
        active : RSX.iconProjectionActive.name
      });
    }

    return card;
  }
}

module.exports = CardFactory_CoreshatterSet_Faction2;
