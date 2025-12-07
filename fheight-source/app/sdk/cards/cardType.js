/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class CardType {
  static initClass() {
  
    this.Card =1;
    this.Entity =2;
    this.Unit =3;
    this.Spell =4;
    this.Tile =5;
    this.Artifact =6;
  }

  static getIsEntityCardType(cardType) {
    return (cardType === CardType.Entity) || (cardType === CardType.Unit) || (cardType === CardType.Tile);
  }

  static getIsUnitCardType(cardType) {
    return cardType === CardType.Unit;
  }

  static getIsTileCardType(cardType) {
    return cardType === CardType.Tile;
  }

  static getIsSpellCardType(cardType) {
    return cardType === CardType.Spell;
  }

  static getIsArtifactCardType(cardType) {
    return cardType === CardType.Artifact;
  }

  static getAreCardTypesEqual(cardTypeA, cardTypeB) {
    if (cardTypeA === cardTypeB) {
      return true;
    } else if (cardTypeA === CardType.Entity) {
      return (cardTypeB === CardType.Unit) || (cardTypeB === CardType.Tile);
    } else if (cardTypeB === CardType.Entity) {
      return (cardTypeA === CardType.Unit) || (cardTypeA === CardType.Tile);
    }
  }

  static getNameForCardType(cardType) {
    if (this.getIsArtifactCardType(cardType)) {
      return "Artifact";
    } else if (this.getIsSpellCardType(cardType)) {
      return "Spell";
    } else if (this.getIsTileCardType(cardType)) {
      return "Tile";
    } else if (this.getIsUnitCardType(cardType)) {
      return "Unit";
    } else if (this.getIsEntityCardType(cardType)) {
      return "Entity";
    } else {
      return "Card";
    }
  }
}
CardType.initClass();

module.exports = CardType;
