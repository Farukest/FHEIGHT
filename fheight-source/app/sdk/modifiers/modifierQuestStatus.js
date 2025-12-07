/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierQuestStatus extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierQuestStatus";
    this.type ="ModifierQuestStatus";
  
    this.prototype.maxStacks = 1;
    this.prototype.isRemovable = false;
  }
}
ModifierQuestStatus.initClass();

module.exports = ModifierQuestStatus;