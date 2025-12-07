/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class IntentType {
  static initClass() {
  
    this.NeutralIntent =1; // use when nothing else fits or intent should not be entirely clear
    this.DamageIntent =2;
    this.HealIntent =3;
    this.BuffIntent =4;
    this.NerfIntent =5;
    this.MoveIntent =6;
    this.DeckIntent =7;
    this.GameIntent =8; // game action such as ending turn
    this.InspectIntent =9;
  }

  static getIsAggroIntentType(intentType) {
    // general check for aggresive intent types
    return (intentType === IntentType.DamageIntent) || (intentType === IntentType.NerfIntent);
  }

  static getIsAssistIntentType(intentType) {
    // general check for helpful intent types
    return (intentType === IntentType.HealIntent) || (intentType === IntentType.BuffIntent);
  }
}
IntentType.initClass();

module.exports = IntentType;
