/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class Rarity {
  static initClass() {
  
    this.Fixed = 0;
    this.Common = 1;
    this.Rare = 2;
    this.Epic = 3;
    this.Legendary = 4;
    this.TokenUnit = 5;
    this.Mythron = 6;
  }
}
Rarity.initClass();

module.exports = Rarity;
