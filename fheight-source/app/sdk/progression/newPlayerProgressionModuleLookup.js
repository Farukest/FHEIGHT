/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class Modules {
  static initClass() {
    this.Core = "core";
    this.Quest = "quest";
    this.Matchmaking = "matchmaking";
    this.Collection = "collection";
    this.BoosterUnlock = "booster_unlock";
    this.GameGoldTips = "game_gold_tips";
    this.StarterDeckTab = "starter_decks_tab";
    this.AiDecksTab = "ai_decks_tab";
    this.SinglePlayerPlayed = "single_player_played";
    this.SpiritOrbOpened = "spirit_orb_opened";
    this.CraftedCard = "crafted_card";
    this.Monetized = "monetized";
    this.BloodbornSpellInfo = "bloodborn_spell_info";
    this.BattlePetInfo = "battle_pet_info";
    this.BattlePetReminder = "battle_pet_reminder";
    this.BattlePetActionNotification = "battle_pet_action_notification";
    this.ReceivedCrate = "received_crate";
    this.RiftUpgradeUsed = "rift_upgrade_used";
  }
}
Modules.initClass();

module.exports = Modules;
