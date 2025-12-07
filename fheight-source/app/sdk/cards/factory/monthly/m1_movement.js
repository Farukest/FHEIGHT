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

const SpellFilterType = require('app/sdk/spells/spellFilterType');

const Modifier =           require('app/sdk/modifiers/modifier');
const ModifierOpeningGambit =     require('app/sdk/modifiers/modifierOpeningGambit');
const ModifierFlying = require('app/sdk/modifiers/modifierFlying');
const ModifierMyMoveWatchSpawnEntity = require('app/sdk/modifiers/modifierMyMoveWatchSpawnEntity');
const ModifierMyMoveWatchApplyModifiers = require('app/sdk/modifiers/modifierMyMoveWatchApplyModifiers');
const ModifierMyMoveWatchDrawCard = require('app/sdk/modifiers/modifierMyMoveWatchDrawCard');

const i18next = require('i18next');
if (i18next.t() === undefined) {
  i18next.t = text => text;
}

class CardFactory_Monthly_M1_Movement {

  /**
   * Returns a card that matches the identifier.
   * @param {Number|String} identifier
   * @param {GameSession} gameSession
   * @returns {Card}
   */
  static cardForIdentifier(identifier,gameSession) {
    let card = null;

    if (identifier === Cards.Neutral.BlackLocust) {
      card = new Unit(gameSession);
      card.factionId = Factions.Neutral;
      card.setAvailableAt(1446336000000);
      card.name = i18next.t("cards.neutral_black_locust_name");
      card.setDescription(i18next.t("cards.neutral_black_locust_desc"));
      card.setFXResource(["FX.Cards.Neutral.BlackLocust"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_summonlegendary.audio,
        walk : RSX.sfx_neutral_zurael_death.audio,
        attack : RSX.sfx_neutral_stormatha_attack_swing.audio,
        receiveDamage :  RSX.sfx_neutral_stormatha_hit.audio,
        attackDamage : RSX.sfx_neutral_stormatha_attack_impact.audio,
        death : RSX.sfx_neutral_stormatha_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralBlackLocustBreathing.name,
        idle : RSX.neutralBlackLocustIdle.name,
        walk : RSX.neutralBlackLocustRun.name,
        attack : RSX.neutralBlackLocustAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 1.2,
        damage : RSX.neutralBlackLocustHit.name,
        death : RSX.neutralBlackLocustDeath.name
      });
      card.atk = 2;
      card.maxHP = 2;
      card.manaCost = 4;
      card.rarityId = Rarity.Legendary;
      card.setInherentModifiersContextObjects([ModifierFlying.createContextObject(), ModifierMyMoveWatchSpawnEntity.createContextObject({id: Cards.Neutral.BlackLocust}, "Black Locust")]);
    }

    if (identifier === Cards.Neutral.WindRunner) {
      card = new Unit(gameSession);
      card.setIsLegacy(true);
      card.factionId = Factions.Neutral;
      card.setAvailableAt(1446336000000);
      card.name = i18next.t("cards.neutral_wind_runner_name");
      card.setDescription(i18next.t("cards.neutral_wind_runner_desc"));
      card.setFXResource(["FX.Cards.Neutral.WindRunner"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_nethersummoning.audio,
        walk : RSX.sfx_neutral_ubo_attack_swing.audio,
        attack : RSX.sfx_neutral_ubo_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_gro_hit.audio,
        attackDamage : RSX.sfx_neutral_ubo_attack_impact.audio,
        death : RSX.sfx_neutral_amu_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralWindRunnerBreathing.name,
        idle : RSX.neutralWindRunnerIdle.name,
        walk : RSX.neutralWindRunnerRun.name,
        attack : RSX.neutralWindRunnerAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.7,
        damage : RSX.neutralWindRunnerHit.name,
        death : RSX.neutralWindRunnerDeath.name
      });
      card.atk = 3;
      card.maxHP = 3;
      card.manaCost = 3;
      card.rarityId = Rarity.Rare;
      const statContextObject = Modifier.createContextObjectWithAttributeBuffs(1,1);
      statContextObject.appliedName = i18next.t("modifiers.neutral_wind_runner_modifier");
      card.setInherentModifiersContextObjects([
        ModifierMyMoveWatchApplyModifiers.createContextObject([statContextObject], false, true, false, 1, false, "After this minion moves, give all friendly minions around it +1/+1")
      ]);
    }

    if (identifier === Cards.Neutral.Mogwai) {
      card = new Unit(gameSession);
      card.setIsLegacy(true);
      card.factionId = Factions.Neutral;
      card.setAvailableAt(1446336000000);
      card.name = i18next.t("cards.neutral_mogwai_name");
      card.setDescription(i18next.t("cards.neutral_mogwai_desc"));
      card.setFXResource(["FX.Cards.Neutral.Mogwai"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_diretidefrenzy.audio,
        walk : RSX.sfx_neutral_sai_attack_impact.audio,
        attack : RSX.sfx_neutral_sai_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_gro_hit.audio,
        attackDamage : RSX.sfx_neutral_sai_attack_impact.audio,
        death : RSX.sfx_neutral_yun_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralMogwaiBreathing.name,
        idle : RSX.neutralMogwaiIdle.name,
        walk : RSX.neutralMogwaiRun.name,
        attack : RSX.neutralMogwaiAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.9,
        damage : RSX.neutralMogwaiHit.name,
        death : RSX.neutralMogwaiDeath.name
      });
      card.atk = 2;
      card.maxHP = 3;
      card.manaCost = 3;
      card.rarityId = Rarity.Epic;
      card.setInherentModifiersContextObjects([ModifierMyMoveWatchDrawCard.createContextObject()]);
    }

    if (identifier === Cards.Neutral.GhostLynx) {
      card = new Unit(gameSession);
      card.factionId = Factions.Neutral;
      card.setAvailableAt(1446336000000);
      card.name = i18next.t("cards.neutral_ghost_lynx_name");
      card.setDescription(i18next.t("cards.neutral_ghost_lynx_desc"));
      card.setFXResource(["FX.Cards.Neutral.GhostLynx"]);
      card.setBaseSoundResource({
        apply : RSX.sfx_spell_diretidefrenzy.audio,
        walk : RSX.sfx_neutral_grimrock_hit.audio,
        attack : RSX.sfx_neutral_xho_attack_swing.audio,
        receiveDamage : RSX.sfx_neutral_xho_hit.audio,
        attackDamage : RSX.sfx_neutral_xho_attack_impact.audio,
        death : RSX.sfx_neutral_xho_death.audio
      });
      card.setBaseAnimResource({
        breathing : RSX.neutralGhostLynxBreathing.name,
        idle : RSX.neutralGhostLynxIdle.name,
        walk : RSX.neutralGhostLynxRun.name,
        attack : RSX.neutralGhostLynxAttack.name,
        attackReleaseDelay: 0.0,
        attackDelay: 0.9,
        damage : RSX.neutralGhostLynxHit.name,
        death : RSX.neutralGhostLynxDeath.name
      });
      card.atk = 2;
      card.maxHP = 1;
      card.manaCost = 2;
      card.rarityId = Rarity.Common;
      card.addKeywordClassToInclude(ModifierOpeningGambit);
      card.setFollowups([
        {
          id: Cards.Spell.FollowupRandomTeleport,
          spellFilterType: SpellFilterType.NeutralDirect,
          _private: {
            followupSourcePattern: CONFIG.PATTERN_3x3
          }
        }
      ]);
    }

    return card;
  }
}

module.exports = CardFactory_Monthly_M1_Movement;
