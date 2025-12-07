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

const Modifier = require('app/sdk/modifiers/modifier');
const ModifierOpeningGambit = require('app/sdk/modifiers/modifierOpeningGambit');
const ModifierOpeningGambitApplyPlayerModifiers = require('app/sdk/modifiers/modifierOpeningGambitApplyPlayerModifiers');
const ModifierOpeningGambitApplyModifiersRandomly = require('app/sdk/modifiers/modifierOpeningGambitApplyModifiersRandomly');
const ModifierSummonWatchFromActionBarByOpeningGambitBuffSelf = require('app/sdk/modifiers/modifierSummonWatchFromActionBarByOpeningGambitBuffSelf');
const PlayerModifierPreventSpellDamage = require('app/sdk/playerModifiers/playerModifierPreventSpellDamage');

const i18next = require('i18next');
if (i18next.t() === undefined) {
  i18next.t = text => text;
}

class CardFactory_Monthly_M3_OpeningGambitBuff {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let card = null;

    if (identifier === Cards.Neutral.SunElemental) {
      card = new Unit(gameSession);
      card.factionId = Factions.Neutral;
      card.setAvailableAt(1451606400000);
      card.name = i18next.t("cards.neutral_sun_elemental_name");
      card.setDescription(i18next.t("cards.neutral_sun_elemental_desc"));
      card.setFXResource(["FX.Cards.Neutral.SunElemental"]);
      card.setBoundingBoxWidth(50);
      card.setBoundingBoxHeight(90);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_blindscorch.audio,
        walk : RSX.sfx_neutral_sunelemental_impact.audio,
        attack : RSX.sfx_neutral_sunelemental_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_sunelemental_hit.audio,
        attackDamage : RSX.sfx_neutral_sunelemental_impact.audio,
        death : RSX.sfx_neutral_sunelemental_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralSunElementalBreathing.name,
        idle : RSX.neutralSunElementalIdle.name,
        walk : RSX.neutralSunElementalRun.name,
        attack : RSX.neutralSunElementalAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.0,
        damage : RSX.neutralSunElementalHit.name,
        death : RSX.neutralSunElementalDeath.name
      });
      card.atk = 3;
      card.maxHP = 3;
      card.manaCost = 4;
      card.rarityId = Rarity.Common;
      const statContextObject = Modifier.createContextObjectWithAttributeBuffs(0,2);
      statContextObject.appliedName = i18next.t("modifiers.neutral_sun_elemental_modifier");
      card.setInherentModifiersContextObjects([
        ModifierOpeningGambitApplyModifiersRandomly.createContextObject([statContextObject],
          false, false, true, false, false, CONFIG.WHOLE_BOARD_RADIUS, 2, "Give two random friendly minions +2 Health")
      ]);
    }

    if (identifier === Cards.Neutral.ProphetWhitePalm) {
      card = new Unit(gameSession);
      card.setIsLegacy(true);
      card.factionId = Factions.Neutral;
      card.setAvailableAt(1451606400000);
      card.name = i18next.t("cards.neutral_prophet_of_the_white_palm_name");
      card.setDescription(i18next.t("cards.neutral_prophet_of_the_white_palm_desc"));
      card.setFXResource(["FX.Cards.Neutral.ProphetWhitePalm"]);
      card.setBoundingBoxWidth(55);
      card.setBoundingBoxHeight(115);
      card.setBaseSoundResource({
        apply : RSX.sfx_neutral_ubo_attack_swing.audio,
        walk : RSX.sfx_neutral_ubo_attack_swing.audio,
        attack : RSX.sfx_neutral_prophetofthewhite_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_prophetofthewhite_hit.audio,
        attackDamage : RSX.sfx_neutral_prophetofthewhite_impact.audio,
        death : RSX.sfx_neutral_prophetofthewhite_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralProphetWhitePalmBreathing.name,
        idle : RSX.neutralProphetWhitePalmIdle.name,
        walk : RSX.neutralProphetWhitePalmRun.name,
        attack : RSX.neutralProphetWhitePalmAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.0,
        damage : RSX.neutralProphetWhitePalmHit.name,
        death : RSX.neutralProphetWhitePalmDeath.name
      });
      card.atk = 1;
      card.maxHP = 1;
      card.manaCost = 1;
      const immunityContextObject = PlayerModifierPreventSpellDamage.createContextObject();
      immunityContextObject.durationEndTurn = 2;
      card.setInherentModifiersContextObjects([
        ModifierOpeningGambitApplyPlayerModifiers.createContextObjectToTargetOwnPlayer([immunityContextObject], false, "Prevent ALL spell damage until your next turn")
      ]);
      card.rarityId = Rarity.Rare;
    }

    if (identifier === Cards.Neutral.ArakiHeadhunter) {
      card = new Unit(gameSession);
      card.factionId = Factions.Neutral;
      card.setAvailableAt(1451606400000);
      card.name = i18next.t("cards.neutral_araki_headhunter_name");
      card.setDescription(i18next.t("cards.neutral_araki_headhunter_desc"));
      card.setFXResource(["FX.Cards.Neutral.ArakiHeadhunter"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_neutral_fog_attack_swing.audio,
        walk : RSX.sfx_neutral_earthwalker_death.audio,
        attack : RSX.sfx_neutral_arakiheadhunter_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_arakiheadhunter_hit.audio,
        attackDamage : RSX.sfx_neutral_arakiheadhunter_impact.audio,
        death : RSX.sfx_neutral_arakiheadhunter_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralArakiHeadhunterBreathing.name,
        idle : RSX.neutralArakiHeadhunterIdle.name,
        walk : RSX.neutralArakiHeadhunterRun.name,
        attack : RSX.neutralArakiHeadhunterAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.2,
        damage : RSX.neutralArakiHeadhunterHit.name,
        death : RSX.neutralArakiHeadhunterDeath.name
      });
      card.atk = 1;
      card.maxHP = 3;
      card.manaCost = 2;
      card.rarityId = Rarity.Epic;
      card.setInherentModifiersContextObjects([ModifierSummonWatchFromActionBarByOpeningGambitBuffSelf.createContextObject(2)]);
    }

    if (identifier === Cards.Neutral.KeeperOfTheVale) {
      card = new Unit(gameSession);
      card.factionId = Factions.Neutral;
      card.setAvailableAt(1451606400000);
      card.name = i18next.t("cards.neutral_keeper_of_the_vale_name");
      card.setDescription(i18next.t("cards.neutral_keeper_of_the_vale_desc"));
      card.setFXResource(["FX.Cards.Neutral.KeeperOfTheVale"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_summonlegendary.audio,
        walk : RSX.sfx_neutral_ladylocke_attack_impact.audio,
        attack : RSX.sfx_neutral_keeperofthevale_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_keeperofthevale_hit.audio,
        attackDamage : RSX.sfx_neutral_keeperofthevale_impact.audio,
        death : RSX.sfx_neutral_keeperofthevale_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralKeeperOfTheValeBreathing.name,
        idle : RSX.neutralKeeperOfTheValeIdle.name,
        walk : RSX.neutralKeeperOfTheValeRun.name,
        attack : RSX.neutralKeeperOfTheValeAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.0,
        damage : RSX.neutralKeeperOfTheValeHit.name,
        death : RSX.neutralKeeperOfTheValeDeath.name
      });
      card.atk = 3;
      card.maxHP = 4;
      card.manaCost = 5;
      card.rarityId = Rarity.Legendary;
//      card.setFollowupNameAndDescription(ModifierOpeningGambit.modifierName,"Summon a friendly non-token minion destroyed this game nearby")
      card.addKeywordClassToInclude(ModifierOpeningGambit);
      card.setFollowups([
        {
          id: Cards.Spell.FollowupKeeper
        }
      ]);
    }

    return card;
  }
}

module.exports = CardFactory_Monthly_M3_OpeningGambitBuff;
