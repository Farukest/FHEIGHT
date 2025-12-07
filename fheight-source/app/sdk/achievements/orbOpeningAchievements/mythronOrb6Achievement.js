/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const CardSet = require('app/sdk/cards/cardSetLookup');
const i18next = require('i18next');

class MythronOrb6Achievement extends Achievement {
  static initClass() {
    this.id = "mythron6";
    this.title = "Sixth Trial";
    this.description = "You've opened 51 Mythron Orbs, here's a brand new Mythron card. You'll get another after opening 10 more orbs.";
    this.progressRequired = 51;
    this.rewards =
      {mythronCard: 1};
  }

  static progressForOpeningSpiritOrb(orbSet) {
    if (orbSet === CardSet.Coreshatter) {
      return 1;
    } else {
      return 0;
    }
  }
}
MythronOrb6Achievement.initClass();

module.exports = MythronOrb6Achievement;
