/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierQuestStatus = require('./modifierQuestStatus');

const i18next = require('i18next');

class ModifierQuestStatusVanar extends ModifierQuestStatus {
  static initClass() {
  
    this.prototype.type ="ModifierQuestStatusVanar";
    this.type ="ModifierQuestStatusVanar";
  }

  static createContextObject(questCompleted, numTokensFound) {
    const contextObject = super.createContextObject();
    contextObject.questCompleted = questCompleted;
    contextObject.numTokensFound = numTokensFound;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      if (modifierContextObject.questCompleted) {
        return i18next.t("modifiers.quest_completed_applied_desc");
      } else {
        return i18next.t("modifiers.vanarquest_counter_applied_desc",{token_count: modifierContextObject.numTokensFound});
      }
    }
  }

  static getName(modifierContextObject) {
    return i18next.t("modifiers.vanarquest_counter_applied_name");
  }
}
ModifierQuestStatusVanar.initClass();

module.exports = ModifierQuestStatusVanar;
