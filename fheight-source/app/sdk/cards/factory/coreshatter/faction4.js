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

const Modifier = require('app/sdk/modifiers/modifier');
const ModifierDyingWishApplyModifiersToGenerals = require('app/sdk/modifiers/modifierDyingWishApplyModifiersToGenerals');
const ModifierStartTurnWatchDamageMyGeneral = require('app/sdk/modifiers/modifierStartTurnWatchDamageMyGeneral');
const ModifierOpeningGambit = require('app/sdk/modifiers/modifierOpeningGambit');
const ModifierDyingWishReduceManaCostOfDyingWish = require('app/sdk/modifiers/modifierDyingWishReduceManaCostOfDyingWish');
const ModifierStackingShadows = require('app/sdk/modifiers/modifierStackingShadows');
const ModifierIntensifyBuffSelf = require('app/sdk/modifiers/modifierIntensifyBuffSelf');
const ModifierOpeningGambitMoveEnemyGeneralForward = require('app/sdk/modifiers/modifierOpeningGambitMoveEnemyGeneralForward');
const ModifierSynergizeSpawnEntityFromDeck = require('app/sdk/modifiers/modifierSynergizeSpawnEntityFromDeck');
const ModifierStartsInHand = require('app/sdk/modifiers/modifierStartsInHand');
const ModifierStackingShadowsBonusDamageEqualNumberTiles = require('app/sdk/modifiers/modifierStackingShadowsBonusDamageEqualNumberTiles');
const ModifierOnSummonFromHandApplyEmblems = require('app/sdk/modifiers/modifierOnSummonFromHandApplyEmblems');
const ModifierFlying = require('app/sdk/modifiers/modifierFlying');
const ModifierFirstBlood = require('app/sdk/modifiers/modifierFirstBlood');
const ModifierProvoke = require('app/sdk/modifiers/modifierProvoke');
const ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace = require('app/sdk/modifiers/modifierMyAttackMinionWatchKillTargetSummonThisOnSpace');
const ModifierFateAbyssianDyingQuest = require('app/sdk/modifiers/modifierFateAbyssianDyingQuest');
const ModifierFrenzy = require('app/sdk/modifiers/modifierFrenzy');
const ModifierCannotBeReplaced = require('app/sdk/modifiers/modifierCannotBeReplaced');
const ModifierIntensify = require('app/sdk/modifiers/modifierIntensify');
const ModifierCounterIntensify = require('app/sdk/modifiers/modifierCounterIntensify');
const ModifierCannotBeRemovedFromHand = require('app/sdk/modifiers/modifierCannotBeRemovedFromHand');
const ModifierQuestBuffAbyssian = require('app/sdk/modifiers/modifierQuestBuffAbyssian');

const PlayerModifierEmblemSummonWatchAbyssUndyingQuest = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatchAbyssUndyingQuest');

const Spell = require('app/sdk/spells/spell');
const SpellEvilXerox = require('app/sdk/spells/spellEvilXerox');
const SpellFilterType = require('app/sdk/spells/spellFilterType');
const SpellFillHandFromOpponentsDeck = require('app/sdk/spells/spellFillHandFromOpponentsDeck');
const SpellTickleTendril = require('app/sdk/spells/spellTickleTendril');
const SpellTwoForMe = require('app/sdk/spells/spellTwoForMe');
const SpellIntensifyShadowBlossom = require('app/sdk/spells/spellIntensifyShadowBlossom');
const SpellDrawCardsIfHaveFriendlyTiles = require('app/sdk/spells/spellDrawCardsIfHaveFriendlyTiles');

const i18next = require('i18next');
if (i18next.t() === undefined) {
  i18next.t = text => text;
}

class CardFactory_CoreshatterSet_Faction4 {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let card = null;

    if (identifier === Cards.Faction4.DemonOfEternity) {
      card = new Unit(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.name = "Underlord Xor'Xuul";
      card.setDescription("Trial: Cast 6 spells that destroy a friendly minion.\nDestiny: Whenever a friendly minion dies, re-summon it on a random space.");
      card.atk = 6;
      card.maxHP = 1;
      card.manaCost = 6;
      card.rarityId = Rarity.Mythron;
      const dyingWishModifier = ModifierQuestBuffAbyssian.createContextObject();
      dyingWishModifier.appliedName = "Will of the Undying";
      dyingWishModifier.appliedDescription = "Whenever this minion dies, re-summon it on a random space.";
      const emblemModifier = PlayerModifierEmblemSummonWatchAbyssUndyingQuest.createContextObject([dyingWishModifier]);
      emblemModifier.appliedName = "Underlord's Decree";
      emblemModifier.appliedDescription = "Whenever a friendly minion dies, re-summon it on a random space.";
      card.setInherentModifiersContextObjects([
        ModifierStartsInHand.createContextObject(),
        ModifierCannotBeReplaced.createContextObject(),
        ModifierOnSummonFromHandApplyEmblems.createContextObject([emblemModifier], true, false),
        ModifierFateAbyssianDyingQuest.createContextObject(6),
        ModifierCannotBeRemovedFromHand.createContextObject()
      ]);
      card.setFXResource(["FX.Cards.Faction4.HuntingHorror"]);
      card.setBoundingBoxWidth(85);
      card.setBoundingBoxHeight(90);
      card.setBaseSoundResource({
        apply : RSX.sfx_summonlegendary.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f1ironcliffeguardian_attack_swing.audio,
        receiveDamage : RSX.sfx_f1ironcliffeguardian_hit.audio,
        attackDamage : RSX.sfx_f1ironcliffeguardian_attack_impact.audio,
        death : RSX.sfx_f1ironcliffeguardian_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4DemonEternityBreathing.name,
        idle : RSX.f4DemonEternityIdle.name,
        walk : RSX.f4DemonEternityRun.name,
        attack : RSX.f4DemonEternityAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.8,
        damage : RSX.f4DemonEternityHit.name,
        death : RSX.f4DemonEternityDeath.name
      });
    }

    if (identifier === Cards.Faction4.CurseMonger) {
      card = new Unit(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.name = "Hexclaw";
      card.setDescription("Dying Wish: The enemy General gains, \"At the start of your turn, take 1 damage.\"");
      card.atk = 7;
      card.maxHP = 2;
      card.manaCost = 5;
      card.rarityId = Rarity.Legendary;
      const damageSelf = ModifierStartTurnWatchDamageMyGeneral.createContextObject(1);
      damageSelf.appliedName = "Curse";
      damageSelf.appliedDescription = "At the start of your turn, your General takes 1 damage.";
      card.setInherentModifiersContextObjects([ModifierDyingWishApplyModifiersToGenerals.createContextObject([damageSelf],false,true)]);
      card.setFXResource(["FX.Cards.Neutral.Necroseer"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_bloodtearalchemist_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_bloodtearalchemist_hit.audio,
        attackDamage : RSX.sfx_neutral_bloodtearalchemist_attack_impact.audio,
        death : RSX.sfx_neutral_bloodtearalchemist_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4FallenAspectBreathing.name,
        idle : RSX.f4FallenAspectIdle.name,
        walk : RSX.f4FallenAspectRun.name,
        attack : RSX.f4FallenAspectAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.3,
        damage : RSX.f4FallenAspectHit.name,
        death : RSX.f4FallenAspectDeath.name
      });
    }

    if (identifier === Cards.Artifact.WraithlingAmulet) {
      card = new Artifact(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction4;
      card.id = Cards.Artifact.WraithlingAmulet;
      card.name = "Wraithcrown";
      card.setDescription("Friendly Wraithlings have +2/+2.");
      card.manaCost = 4;
      card.rarityId = Rarity.Epic;
      card.durability = 3;
      const attackBuffContextObject = Modifier.createContextObjectWithAttributeBuffs(2,2);
      attackBuffContextObject.appliedName = "Crown of the Meek";
      const wraithlingId = [
        Cards.Faction4.Wraithling
      ];
      card.setTargetModifiersContextObjects([
        Modifier.createContextObjectWithAuraForAllAllies([attackBuffContextObject], null, wraithlingId, null, "Crown of the Meek")
      ]);
      card.setFXResource(["FX.Cards.Artifact.Mindlathe"]);
      card.setBaseAnimResource({
        idle: RSX.iconWraithRingIdle.name,
        active: RSX.iconWraithRingActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_victory_crest.audio
      });
    }

    if (identifier === Cards.Faction4.DyingWishReducer) {
      card = new Unit(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.name = "Carrion Collector";
      card.setDescription("Dying Wish: Lower the cost of all minions with Dying Wish in your deck and action bar by 1.");
      card.atk = 1;
      card.maxHP = 1;
      card.manaCost = 2;
      card.rarityId = Rarity.Epic;
      card.setInherentModifiersContextObjects([ModifierDyingWishReduceManaCostOfDyingWish.createContextObject(1)]);
      card.setFXResource(["FX.Cards.Neutral.SilvertongueCorsair"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_3.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f2_kaidoassassin_attack_swing.audio,
        receiveDamage : RSX.sfx_f1elyxstormblade_hit.audio,
        attackDamage : RSX.sfx_f1elyxstormblade_attack_impact.audio,
        death : RSX.sfx_f6_icedryad_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4PlagueDoctorBreathing.name,
        idle : RSX.f4PlagueDoctorIdle.name,
        walk : RSX.f4PlagueDoctorRun.name,
        attack : RSX.f4PlagueDoctorAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.4,
        damage : RSX.f4PlagueDoctorHit.name,
        death : RSX.f4PlagueDoctorDeath.name
      });
    }

    if (identifier === Cards.Spell.ShadowBlossom) {
      card = new SpellIntensifyShadowBlossom(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.id = Cards.Spell.ShadowBlossom;
      card.name = "Painful Pluck";
      card.setDescription("Intensify: Turn 1 random space into Shadow Creep, prioritizing spaces under enemy minions.");
      card.manaCost = 1;
      card.rarityId = Rarity.Common;
      card.spellFilterType = SpellFilterType.None;
      card.spawnCount = 1;
      card.addKeywordClassToInclude(ModifierStackingShadows);
      card.addKeywordClassToInclude(ModifierIntensify);
      card.setInherentModifiersContextObjects([ModifierCounterIntensify.createContextObject()]);
      card.setFXResource(["FX.Cards.Spell.PainfulPluck"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_disintegrate.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconShadowBlossomIdle.name,
        active : RSX.iconShadowBlossomActive.name
      });
    }

    if (identifier === Cards.Spell.Triggered) {
      card = new SpellDrawCardsIfHaveFriendlyTiles(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.id = Cards.Spell.Triggered;
      card.name = "Yielding Depths";
      card.setDescription("If you have three or more Shadow Creep, draw 2 cards.");
      card.manaCost = 2;
      card.rarityId = Rarity.Rare;
      card.spellFilterType = SpellFilterType.None;
      card.numCardsToDraw = 2;
      card.numTilesRequired = 3;
      card.tileId = Cards.Tile.Shadow;
      card.addKeywordClassToInclude(ModifierStackingShadows);
      card.setFXResource(["FX.Cards.Spell.YieldingDepths"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_immolation_a.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconPerilousFootingIdle.name,
        active : RSX.iconPerilousFootingActive.name
      });
    }

    if (identifier === Cards.Faction4.CreepDemon) {
      card = new Unit(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.name = "Abyssal Tormentor";
      card.setDescription("Provoke\nYour Shadow Creep deals damage equal to the number of friendly Shadow Creep.");
      card.atk = 6;
      card.maxHP = 6;
      card.manaCost = 6;
      card.rarityId = Rarity.Legendary;
      const auraContextObject = Modifier.createContextObjectWithAuraForAllAllies([ModifierStackingShadowsBonusDamageEqualNumberTiles.createContextObject()], null, [Cards.Tile.Shadow]);
      auraContextObject.auraFilterByCardType = CardType.Tile;
      card.setInherentModifiersContextObjects([
        ModifierProvoke.createContextObject(),
        auraContextObject
      ]);
      card.addKeywordClassToInclude(ModifierStackingShadows);
      card.setFXResource(["FX.Cards.Neutral.LightningBeetle"]);
      card.setBoundingBoxWidth(85);
      card.setBoundingBoxHeight(65);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_3.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_stormatha_attack_swing.audio,
        receiveDamage :  RSX.sfx_neutral_stormatha_hit.audio,
        attackDamage : RSX.sfx_neutral_stormatha_attack_impact.audio,
        death : RSX.sfx_neutral_stormatha_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4CreepDemonBreathing.name,
        idle : RSX.f4CreepDemonIdle.name,
        walk : RSX.f4CreepDemonRun.name,
        attack : RSX.f4CreepDemonAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.2,
        damage : RSX.f4CreepDemonHit.name,
        death : RSX.f4CreepDemonDeath.name
      });
    }

    if (identifier === Cards.Spell.GateToDudesHouse) {
      card = new SpellFillHandFromOpponentsDeck(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.id = Cards.Spell.GateToDudesHouse;
      card.name = "Unfathomable Rite";
      card.setDescription("Draw cards from your opponent's deck to fill your action bar.");
      card.manaCost = 6;
      card.rarityId = Rarity.Epic;
      card.setFXResource(["FX.Cards.Spell.UnfathomableRite"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_manavortex.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconGateOthervaultIdle.name,
        active : RSX.iconGateOthervaultActive.name
      });
    }

    if (identifier === Cards.Spell.TickleTendril) {
      card = new SpellTickleTendril(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.id = Cards.Spell.TickleTendril;
      card.name = "Munch";
      card.setDescription("Steal Health from an enemy minion for each friendly Shadow Creep (but not more than its Health).");
      card.manaCost = 3;
      card.rarityId = Rarity.Rare;
      card.spellFilterType = SpellFilterType.EnemyDirect;
      card.canTargetGeneral = false;
      card.setFXResource(["FX.Cards.Spell.Munch"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_voidpulse02.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconMunchIdle.name,
        active : RSX.iconMunchActive.name
      });
    }

    if (identifier === Cards.Faction4.ShadowBrute) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction4;
      card.name = "Bonecrusher";
      card.setDescription("Intensify: This minion gains +5 Attack.");
      card.atk = 0;
      card.maxHP = 3;
      card.manaCost = 3;
      card.rarityId = Rarity.Common;
      card.setInherentModifiersContextObjects([
        ModifierIntensifyBuffSelf.createContextObject(5, 0, "Shadow Strength"),
        ModifierCounterIntensify.createContextObject()
      ]);
      card.setFXResource(["FX.Cards.Neutral.SilhoutteTracer"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_3.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f3_dunecaster_attack_swing.audio,
        receiveDamage : RSX.sfx_f3_dunecaster_hit.audio,
        attackDamage : RSX.sfx_f3_dunecaster_impact.audio,
        death : RSX.sfx_f3_dunecaster_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4UnderworldBruteBreathing.name,
        idle : RSX.f4UnderworldBruteIdle.name,
        walk : RSX.f4UnderworldBruteRun.name,
        attack : RSX.f4UnderworldBruteAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.6,
        damage : RSX.f4UnderworldBruteHit.name,
        death : RSX.f4UnderworldBruteDeath.name
      });
    }

    if (identifier === Cards.Faction4.WhistlingHarvester) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction4;
      card.name = "Chittering Tiller";
      card.setDescription("Frenzy\nOpening Gambit: Teleport the enemy General one space forward.");
      card.atk = 4;
      card.maxHP = 3;
      card.manaCost = 3;
      card.rarityId = Rarity.Common;
      card.setInherentModifiersContextObjects([
        ModifierOpeningGambitMoveEnemyGeneralForward.createContextObject(),
        ModifierFrenzy.createContextObject()
      ]);
      card.setFXResource(["FX.Cards.Neutral.FrostboneNaga"]);
      card.setBoundingBoxWidth(50);
      card.setBoundingBoxHeight(85);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_2.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_f4_siren_attack_swing.audio,
        receiveDamage : RSX.sfx_f4_siren_hit.audio,
        attackDamage : RSX.sfx_f6_ancientgrove_attack_impact.audio,
        death : RSX.sfx_f4_siren_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4WhistlingHarvesterBreathing.name,
        idle : RSX.f4WhistlingHarvesterIdle.name,
        walk : RSX.f4WhistlingHarvesterRun.name,
        attack : RSX.f4WhistlingHarvesterAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.5,
        damage : RSX.f4WhistlingHarvesterHit.name,
        death : RSX.f4WhistlingHarvesterDeath.name
      });
    }

    if (identifier === Cards.Faction4.MiniMinion) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.Coreshatter);
      card.factionId = Factions.Faction4;
      card.name = "Gibbet";
      card.setDescription("Whenever this attacks an enemy minion, destroy that minion and summon a Gibbet on that space.");
      card.atk = 1;
      card.maxHP = 2;
      card.manaCost = 2;
      card.rarityId = Rarity.Rare;
      card.setInherentModifiersContextObjects([
        ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace.createContextObject()
      ]);
      card.setFXResource(["FX.Cards.Neutral.Fog"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_diretidefrenzy.audio,
        walk : RSX.sfx_neutral_valehunter_attack_impact.audio,
        attack : RSX.sfx_neutral_fog_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_fog_hit.audio,
        attackDamage : RSX.sfx_neutral_fog_attack_impact.audio,
        death : RSX.sfx_neutral_fog_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f4MiniMinionBreathing.name,
        idle : RSX.f4MiniMinionIdle.name,
        walk : RSX.f4MiniMinionRun.name,
        attack : RSX.f4MiniMinionAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.2,
        damage : RSX.f4MiniMinionHit.name,
        death : RSX.f4MiniMinionDeath.name
      });
    }

    if (identifier === Cards.Spell.TwoForMe) {
      card = new SpellTwoForMe(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.id = Cards.Spell.TwoForMe;
      card.name = "Demonic Conversion";
      card.setDescription("Draw a minion from your opponent\'s deck. It gains +1/+1.");
      card.manaCost = 1;
      card.rarityId = Rarity.Common;
      card.spellFilterType = SpellFilterType.None;
      card.buffName = "Demonic Persuasion";
      card.setFXResource(["FX.Cards.Spell.DemonicConversion"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_voidpulse02.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconDarkPersuasionIdle.name,
        active : RSX.iconDarkPersuasionActive.name
      });
    }

    if (identifier === Cards.Spell.EvilXerox) {
      card = new SpellEvilXerox(gameSession);
      card.factionId = Factions.Faction4;
      card.setCardSetId(CardSet.Coreshatter);
      card.id = Cards.Spell.EvilXerox;
      card.name = "Unleash the Evil";
      card.setDescription("Summon a copy of the minion your opponent most recently summoned from their action bar. It gains Rush and Flying.");
      card.manaCost = 8;
      card.rarityId = Rarity.Legendary;
      card.spellFilterType = SpellFilterType.SpawnSource;
      card.addKeywordClassToInclude(ModifierFirstBlood);
      card.addKeywordClassToInclude(ModifierFlying);
      card.setFXResource(["FX.Cards.Spell.UnleashTheEvil"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_flashreincarnation.audio
      });
      card.setBaseAnimResource({
        idle : RSX.iconEvilXeroxIdle.name,
        active : RSX.iconEvilXeroxActive.name
      });
    }

    return card;
  }
}

module.exports = CardFactory_CoreshatterSet_Faction4;
