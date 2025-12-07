/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS103: Rewrite code to no longer use __guard__, or convert again using --optional-chaining
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const FactionFactory = require('app/sdk/cards/factionFactory');
const _ = require('underscore');
const i18next = require('i18next');

class WorldExplorerAchievement extends Achievement {
  static initClass() {
    this.id = "worldExplorer";
    this.title = i18next.t("achievements.world_explorer_title");
    this.description = i18next.t("achievements.world_explorer_desc");
    this.progressRequired = 1;
    this.rewards =
      {factionLegendaryCard: 1};
  }


  // returns progress made by reaching a state of faction progression
  static progressForFactionProgression(factionProgressionData) {
    // Check all factions for having at least 1 match played
    const playableFactions = FactionFactory.getAllPlayableFactions();
    const playableFactionIds = _.map(playableFactions, faction => faction.id);
    for (var playableFactionId of Array.from(playableFactionIds)) {
      var factionData = factionProgressionData[playableFactionId];
      var factionGameCount = __guard__(factionData != null ? factionData.stats : undefined, x => x.game_count) || 0;
      // If player has no game count or a 0 game count for any playable faction: return with no progress
      if (factionGameCount === 0) {
        // No games for this faction yet means no progress
        return 0;
      }
    }

    // If all playable factions have at least 1 game played, return 1 progress which completes the achievement
    return 1;
  }
}
WorldExplorerAchievement.initClass();


module.exports = WorldExplorerAchievement;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}