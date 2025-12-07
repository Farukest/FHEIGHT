/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierDyingWish = require('./modifierDyingWish');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Factions = require('app/sdk/cards/factionsLookup.js');
const Races = require('app/sdk/cards/racesLookup.js');
const i18next = require('i18next');

class ModifierInkhornGaze extends ModifierDyingWish {
  static initClass() {
  
    this.prototype.type ="ModifierInkhornGaze";
    this.type ="ModifierInkhornGaze";
  
    //@isKeyworded: false
    this.modifierName =i18next.t("modifiers.inkhorn_gaze_name");
    this.description =i18next.t("modifiers.inkhorn_gaze_def");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierDyingWish", "FX.Modifiers.ModifierGenericSpawn"];
    this.prototype.spawnOwnerId = null;
     // dying wish spawn entity will spawn for player with this ID
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnOwnerId, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.spawnOwnerId = spawnOwnerId;
    return contextObject;
  }

  onDyingWish() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      // pull faction battle pets + neutral token battle pets
      const factionBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction4).getRace(Races.BattlePet).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      const neutralBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getRace(Races.BattlePet).getIsToken(true).getIsPrismatic(false).getIsSkinned(false).getCards();
      const battlePetCards = [].concat(factionBattlePetCards, neutralBattlePetCards);

      const card = battlePetCards[this.getGameSession().getRandomIntegerForExecution(battlePetCards.length)];
      const a = new PutCardInHandAction(this.getGameSession(), this.spawnOwnerId, card.createNewCardData() );
      return this.getGameSession().executeAction(a);
    }
  }
}
ModifierInkhornGaze.initClass();

module.exports = ModifierInkhornGaze;
