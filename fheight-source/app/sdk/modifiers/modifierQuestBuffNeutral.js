/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');

class ModifierQuestBuffNeutral extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierQuestBuffNeutral";
    this.type ="ModifierQuestBuffNeutral";
  
    this.prototype.maxStacks = 1;
  }
}
ModifierQuestBuffNeutral.initClass();

module.exports = ModifierQuestBuffNeutral;