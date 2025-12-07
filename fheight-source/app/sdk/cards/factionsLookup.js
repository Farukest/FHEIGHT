/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class Factions {
  static initClass() {
  
    this.Faction1 =   1;
    this.Faction2 =   2;
    this.Faction3 =   3;
    this.Faction4 =   4;
    this.Faction5 =   5;
    this.Faction6 =   6;
    this.Neutral =  100;
    this.Tutorial = 200;
    this.Boss = 300;
  
    // by name
  
    this.Lyonar =     1;
    this.Songhai =   2;
    this.Vetruvian = 3;
    this.Abyssian =  4;
    this.Magmar =     5;
    this.Vanar =     6;
  }
}
Factions.initClass();

module.exports = Factions;
