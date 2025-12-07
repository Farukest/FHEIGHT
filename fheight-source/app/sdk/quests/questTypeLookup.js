/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class QuestType {
  static initClass() {
  
    /**
     * Use this flag to exclude a quest from getting generated.
     * @public
     */
    this.Promotional = -5;
    this.Seasonal = -4;
    this.CatchUp = -3;
    this.Beginner = -2;
    this.ExcludeFromSystem = -1;
  
    this.Participation = 0;
    this.Win =           1;
    this.Social =         2;
    this.Challenge =     3;
  
    this.ShortQuest =     101;
    this.LongQuest =     102;
  }
}
QuestType.initClass();

module.exports = QuestType;
