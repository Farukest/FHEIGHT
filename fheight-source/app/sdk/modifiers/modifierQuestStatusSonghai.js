/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierQuestStatus = require('./modifierQuestStatus');
const _ = require('underscore');

const i18next = require('i18next');

class ModifierQuestStatusSonghai extends ModifierQuestStatus {
  static initClass() {
  
    this.prototype.type ="ModifierQuestStatusSonghai";
    this.type ="ModifierQuestStatusSonghai";
  }

  static createContextObject(questCompleted, minionCostsSummoned) {
    const contextObject = super.createContextObject();
    contextObject.questCompleted = questCompleted;
    contextObject.minionCostsSummoned = minionCostsSummoned;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      if (modifierContextObject.questCompleted) {
        return i18next.t("modifiers.quest_completed_applied_desc");
      } else {
        const sortedCosts = _.sortBy(modifierContextObject.minionCostsSummoned, num => num);
        let costsSummoned = "";
        for (var cost of Array.from(sortedCosts)) {
          if (costsSummoned !== "") {
            costsSummoned = costsSummoned + ",";
          }
          costsSummoned = costsSummoned + cost;
        }
        return i18next.t("modifiers.songhaiquest_counter_applied_desc",{summon_count: modifierContextObject.minionCostsSummoned.length, manacost_list: costsSummoned});
      }
    }
  }

  static getName(modifierContextObject) {
    return i18next.t("modifiers.songhaiquest_counter_applied_name");
  }
}
ModifierQuestStatusSonghai.initClass();

module.exports = ModifierQuestStatusSonghai;
