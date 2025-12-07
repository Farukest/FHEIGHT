/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class CardLocation {
  static initClass() {
  
    this.Deck = 1;
    this.Hand = 2;
    this.Board = 3;
    this.SignatureCards = 4;
    this.Void = 5;
  }
}
CardLocation.initClass();

module.exports = CardLocation;
