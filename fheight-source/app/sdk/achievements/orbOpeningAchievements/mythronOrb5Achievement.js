/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const CardSet = require('app/sdk/cards/cardSetLookup');
const i18next = require('i18next');

class MythronOrb5Achievement extends Achievement {
  static initClass() {
    this.id = "mythron5";
    this.title = "Fifth Trial";
    this.description = "You've opened 41 Mythron Orbs, here's a brand new Mythron card. You'll get another after opening 10 more orbs.";
    this.progressRequired = 41;
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
MythronOrb5Achievement.initClass();

module.exports = MythronOrb5Achievement;
