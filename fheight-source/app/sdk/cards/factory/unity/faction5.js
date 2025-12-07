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
const SpellMoltenRebirth = require('app/sdk/spells/spellMoltenRebirth');

const Modifier = require('app/sdk/modifiers/modifier');
const ModifierBond = require('app/sdk/modifiers/modifierBond');
const ModifierGrow = require('app/sdk/modifiers/modifierGrow');
const ModifierGrowPermanent = require('app/sdk/modifiers/modifierGrowPermanent');
const ModifierBondHealMyGeneral = require('app/sdk/modifiers/modifierBondHealMyGeneral');
const ModifierRebirth = require('app/sdk/modifiers/modifierRebirth');
const ModifierTakeDamageWatchJuggernaut = require('app/sdk/modifiers/modifierTakeDamageWatchJuggernaut');
const ModifierCardControlledPlayerModifiers = require('app/sdk/modifiers/modifierCardControlledPlayerModifiers');
const ModifierOpeningGambit = require('app/sdk/modifiers/modifierOpeningGambit');
const ModifierTokenCreator = require('app/sdk/modifiers/modifierTokenCreator');

const PlayerModifierManaModifier = require('app/sdk/playerModifiers/playerModifierManaModifier');

const i18next = require('i18next');
if (i18next.t() === undefined) {
  i18next.t = text => text;
}

class CardFactory_UnitySet_Faction5 {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let card = null;

    if (identifier === Cards.Faction5.Lavaslasher) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.name = i18next.t("cards.faction_5_unit_lavaslasher_name");
      card.setDescription(i18next.t("cards.faction_5_unit_lavaslasher_desc"));
      card.raceId = Races.Golem;
      card.setFXResource(["FX.Cards.Neutral.Yun"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy_1.audio,
        walk : RSX.sfx_singe2.audio,
        attack : RSX.sfx_neutral_golembloodshard_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_golembloodshard_hit.audio,
        attackDamage : RSX.sfx_neutral_golembloodshard_attack_impact.audio,
        death : RSX.sfx_neutral_golembloodshard_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f5LavaslasherBreathing.name,
        idle : RSX.f5LavaslasherIdle.name,
        walk : RSX.f5LavaslasherRun.name,
        attack : RSX.f5LavaslasherAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.1,
        damage : RSX.f5LavaslasherHit.name,
        death : RSX.f5LavaslasherDeath.name
      });
      card.atk = 4;
      card.maxHP = 7;
      card.manaCost = 5;
      card.rarityId = Rarity.Epic;
      card.addKeywordClassToInclude(ModifierOpeningGambit);
      card.setFollowups([
        {
          id: Cards.Spell.FollowupFight,
          spellFilterType: SpellFilterType.EnemyDirect,
          _private: {
            followupSourcePattern: CONFIG.PATTERN_3x3
          }
        }
      ]);
    }

    if (identifier === Cards.Artifact.GrowthBangle) {
      card = new Artifact(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.id = Cards.Artifact.GrowthBangle;
      card.name = i18next.t("cards.faction_5_artifact_godhammer_name");
      card.setDescription(i18next.t("cards.faction_5_artifact_godhammer_description"));
      card.manaCost = 1;
      card.rarityId = Rarity.Rare;
      card.durability = 3;
      card.setTargetModifiersContextObjects([
        Modifier.createContextObjectWithAuraForAllAlliesAndSelf([ModifierGrowPermanent.createContextObject(1)], null, null, null, "Your minions have \"Grow: +1/+1.\"")
      ]);
      card.setFXResource(["FX.Cards.Artifact.SunstoneBracers"]);
      card.setBaseAnimResource({
        idle: RSX.iconGodhammerIdle.name,
        active: RSX.iconGodhammerActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_victory_crest.audio
      });
    }

    if (identifier === Cards.Faction5.Ragebinder) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.raceId = Races.Golem;
      card.name = i18next.t("cards.faction_5_unit_ragebinder_name");
      card.setDescription(i18next.t("cards.faction_5_unit_ragebinder_desc"));
      card.setFXResource(["FX.Cards.Neutral.BrightmossGolem"]);
      card.setBoundingBoxWidth(85);
      card.setBoundingBoxHeight(85);
      card.setBaseSoundResource({
        apply : RSX.sfx_unit_deploy.audio,
        walk : RSX.sfx_unit_physical_4.audio,
        attack : RSX.sfx_f4_blacksolus_attack_impact.audio,
        receiveDamage : RSX.sfx_neutral_brightmossgolem_hit.audio,
        attackDamage : RSX.sfx_neutral_brightmossgolem_attack_impact.audio,
        death : RSX.sfx_neutral_brightmossgolem_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.f5RagebinderBreathing.name,
        idle : RSX.f5RagebinderIdle.name,
        walk : RSX.f5RagebinderRun.name,
        attack : RSX.f5RagebinderAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.4,
        damage : RSX.f5RagebinderHit.name,
        death : RSX.f5RagebinderDeath.name
      });
      card.atk = 3;
      card.maxHP = 4;
      card.manaCost = 3;
      card.rarityId = Rarity.Common;
      card.setInherentModifiersContextObjects([
        ModifierRebirth.createContextObject(),
        ModifierBondHealMyGeneral.createContextObject(3)
        ]);
    }

    if (identifier === Cards.Faction5.Juggernaut) {
      card = new Unit(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.name = i18next.t("cards.faction_5_unit_juggernaut_name");
      card.setDescription(i18next.t("cards.faction_5_unit_juggernaut_desc"));
      card.raceId = Races.Golem;
      card.setFXResource(["FX.Cards.Faction5.UnstableLeviathan"]);
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
        breathing : RSX.f5JuggernautBreathing.name,
        idle : RSX.f5JuggernautIdle.name,
        walk : RSX.f5JuggernautRun.name,
        attack : RSX.f5JuggernautAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.6,
        damage : RSX.f5JuggernautHit.name,
        death : RSX.f5JuggernautDeath.name
      });
      card.atk = 4;
      card.maxHP = 10;
      card.manaCost = 8;
      card.setInherentModifiersContextObjects([ModifierGrow.createContextObject(5), ModifierTakeDamageWatchJuggernaut.createContextObject()]);
      card.rarityId = Rarity.Legendary;
      card.addKeywordClassToInclude(ModifierTokenCreator);
    }

    if (identifier === Cards.Spell.MoltenRebirth) {
      card = new Spell(gameSession);
      card.setCardSetId(CardSet.CombinedUnlockables);
      card.factionId = Factions.Faction5;
      card.id = Cards.Spell.MoltenRebirth;
      card.name = i18next.t("cards.faction_5_spell_cascading_rebirth_name");
      card.setDescription(i18next.t("cards.faction_5_spell_cascading_rebirth_desc"));
      card.manaCost = 2;
      card.rarityId = Rarity.Common;
      card.spellFilterType = SpellFilterType.AllyDirect;
      card.setFollowups([
        {
          id: Cards.Spell.MoltenRebirthFollowup,
          _private: {
            followupSourcePattern: CONFIG.PATTERN_3x3
          }
        }
      ]);
      card.setFXResource(["FX.Cards.Spell.CascadingRebirth"]);
      card.setBaseAnimResource({
        idle: RSX.iconCascadingRebirthIdle.name,
        active: RSX.iconCascadingRebirthActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_darktransformation.audio
      });
    }

    if (identifier === Cards.Spell.MoltenRebirthFollowup) {
      card = new SpellMoltenRebirth(gameSession);
      card.setIsHiddenInCollection(true);
      card.factionId = Factions.Faction5;
      card.id = Cards.Spell.MoltenRebirthFollowup;
      card.name = i18next.t("cards.faction_5_spell_cascading_rebirth_name");
      card.setDescription(i18next.t("cards.faction_5_spell_cascading_rebirth_desc"));
      card.manaCost = 0;
      card.rarityId = Rarity.Common;
      card.setFXResource(["FX.Cards.Spell.MoltenRebirth"]);
      card.setBaseAnimResource({
        idle: RSX.iconCascadingRebirthIdle.name,
        active: RSX.iconCascadingRebirthActive.name
      });
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_darktransformation.audio
      });
    }

    return card;
  }
}

module.exports = CardFactory_UnitySet_Faction5;
