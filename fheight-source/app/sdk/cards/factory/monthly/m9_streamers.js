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

const Modifier =           require('app/sdk/modifiers/modifier');
const ModifierEndTurnWatchApplyModifiers = require('app/sdk/modifiers/modifierEndTurnWatchApplyModifiers');
const ModifierEnvyBaer = require('app/sdk/modifiers/modifierEnvyBaer');
const ModifierOpeningGambitGrincher = require('app/sdk/modifiers/modifierOpeningGambitGrincher');
const ModifierSpellWatchScientist = require('app/sdk/modifiers/modifierSpellWatchScientist');

const i18next = require('i18next');
if (i18next.t() === undefined) {
  i18next.t = text => text;
}

class CardFactory_Monthly_M9_Streamers {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let card = null;

    if (identifier === Cards.Neutral.Shiro) {
      card = new Unit(gameSession);
      card.setAvailableAt(1467331200000);
      card.factionId = Factions.Neutral;
      card.name = i18next.t("cards.neutral_shiro_puppydragon_name");
      card.setDescription(i18next.t("cards.neutral_shiro_puppydragon_desc"));
      card.setFXResource(["FX.Cards.Neutral.Shiro"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_neutral_prophetofthewhite_hit.audio,
        walk : RSX.sfx_neutral_songweaver_attack_swing.audio,
        attack : RSX.sfx_neutral_spiritscribe_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_spiritscribe_hit.audio,
        attackDamage : RSX.sfx_neutral_spiritscribe_impact.audio,
        death : RSX.sfx_neutral_spiritscribe_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralShiroBreathing.name,
        idle : RSX.neutralShiroIdle.name,
        walk : RSX.neutralShiroRun.name,
        attack : RSX.neutralShiroAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.2,
        damage : RSX.neutralShiroHit.name,
        death : RSX.neutralShiroDeath.name
      });
      card.atk = 1;
      card.maxHP = 4;
      card.manaCost = 2;
      card.rarityId = Rarity.Common;
      const buffContextObject = Modifier.createContextObjectWithAttributeBuffs(1);
      buffContextObject.appliedName = i18next.t("modifiers.neutral_shiro_puppydragon_modifier");
      card.setInherentModifiersContextObjects([
        ModifierEndTurnWatchApplyModifiers.createContextObject([buffContextObject], false, true, false, 1, false, "give each nearby friendly minion +1 Attack"),
      ]);
    }

    if (identifier === Cards.Neutral.TheScientist) {
      card = new Unit(gameSession);
      card.setIsLegacy(true);
      card.setAvailableAt(1467331200000);
      card.factionId = Factions.Neutral;
      card.raceId = Races.Arcanyst;
      card.name = i18next.t("cards.neutral_the_scientist_name");
      card.setDescription(i18next.t("cards.neutral_the_scientist_desc"));
      card.setFXResource(["FX.Cards.Neutral.TheScientist"]);
      card.setBoundingBoxWidth(70);
      card.setBoundingBoxHeight(105);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_fractalreplication.audio,
        walk : RSX.sfx_unit_run_magical_3.audio,
        attack : RSX.sfx_neutral_prophetofthewhite_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_alcuinloremaster_hit.audio,
        attackDamage : RSX.sfx_neutral_alcuinloremaster_attack_impact.audio,
        death : RSX.sfx_neutral_alcuinloremaster_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralTheScientistBreathing.name,
        idle : RSX.neutralTheScientistIdle.name,
        walk : RSX.neutralTheScientistRun.name,
        attack : RSX.neutralTheScientistAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.2,
        damage : RSX.neutralTheScientistHit.name,
        death : RSX.neutralTheScientistDeath.name
      });
      card.atk = 6;
      card.maxHP = 6;
      card.manaCost = 6;
      card.rarityId = Rarity.Epic;
      card.setInherentModifiersContextObjects([ModifierSpellWatchScientist.createContextObject()]);
    }

    if (identifier === Cards.Neutral.Envybaer) {
      card = new Unit(gameSession);
      card.setIsLegacy(true);
      card.setAvailableAt(1467331200000);
      card.factionId = Factions.Neutral;
      card.name = i18next.t("cards.neutral_envybaer_name");
      card.setDescription(i18next.t("cards.neutral_envybaer_desc"));
      card.setFXResource(["FX.Cards.Neutral.Envybaer"]);
      card.setBoundingBoxWidth(80);
      card.setBoundingBoxHeight(105);
      card.setBaseSoundResource({
        apply : RSX.sfx_summonlegendary.audio,
        walk : RSX.sfx_neutral_arakiheadhunter_hit.audio,
        attack : RSX.sfx_f6_boreanbear_attack_swing.audio,
        receiveDamage : RSX.sfx_f6_boreanbear_hit.audio,
        attackDamage : RSX.sfx_f6_boreanbear_attack_impact.audio,
        death : RSX.sfx_f6_boreanbear_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralEnvybaerBreathing.name,
        idle : RSX.neutralEnvybaerIdle.name,
        walk : RSX.neutralEnvybaerRun.name,
        attack : RSX.neutralEnvybaerAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.2,
        damage : RSX.neutralEnvybaerHit.name,
        death : RSX.neutralEnvybaerDeath.name
      });
      card.atk = 3;
      card.maxHP = 10;
      card.manaCost = 5;
      card.setInherentModifiersContextObjects([ModifierEnvyBaer.createContextObject()]);
      card.rarityId = Rarity.Legendary;
    }

    if (identifier === Cards.Neutral.Grincher) {
      card = new Unit(gameSession);
      card.setAvailableAt(1467331200000);
      card.factionId = Factions.Neutral;
      card.name = i18next.t("cards.neutral_grincher_name");
      card.setDescription(i18next.t("cards.neutral_grincher_desc"));
      card.setFXResource(["FX.Cards.Neutral.Grincher"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_blindscorch.audio,
        walk : RSX.sfx_neutral_prophetofthewhite_hit.audio,
        attack : RSX.sfx_neutral_sai_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_grimrock_hit.audio,
        attackDamage : RSX.sfx_neutral_sai_attack_impact.audio,
        death : RSX.sfx_neutral_sai_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralGrincherBreathing.name,
        idle : RSX.neutralGrincherIdle.name,
        walk : RSX.neutralGrincherRun.name,
        attack : RSX.neutralGrincherAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.2,
        damage : RSX.neutralGrincherHit.name,
        death : RSX.neutralGrincherDeath.name
      });
      card.atk = 5;
      card.maxHP = 4;
      card.manaCost = 5;
      card.rarityId = Rarity.Rare;
      card.setInherentModifiersContextObjects([ModifierOpeningGambitGrincher.createContextObject()]);
    }

    return card;
  }
}

module.exports = CardFactory_Monthly_M9_Streamers;
