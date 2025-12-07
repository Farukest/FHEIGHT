/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const UtilsGameSession = require('app/common/utils/utils_game_session');
const ModifierDealDamageWatch = require('./modifierDealDamageWatch');
const PutCardInHandAction = require('app/sdk/actions/putCardInHandAction');
const Factions = require('app/sdk/cards/factionsLookup.js');
const Races = require('app/sdk/cards/racesLookup.js');
const i18next = require('i18next');

class ModifierSnowRippler extends ModifierDealDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSnowRippler";
    this.type ="ModifierSnowRippler";
  
    this.modifierName =i18next.t("modifiers.snow_rippler_name");
    this.description =i18next.t("modifiers.snow_rippler_def");
  }

  onDealDamage(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      if (action.getTarget().getIsGeneral()) { // if damaging a general
        // pull faction battle pets + neutral token battle pets
        const factionBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction6).getRace(Races.BattlePet).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
        const neutralBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getRace(Races.BattlePet).getIsToken(true).getIsPrismatic(false).getIsSkinned(false).getCards();
        const battlePetCards = [].concat(factionBattlePetCards, neutralBattlePetCards);
        const battlePetCard = battlePetCards[this.getGameSession().getRandomIntegerForExecution(battlePetCards.length)];
        const a = new PutCardInHandAction(this.getGameSession(), this.getCard().getOwnerId(), battlePetCard.createNewCardData() );
        return this.getGameSession().executeAction(a);
      }
    }
  }
}
ModifierSnowRippler.initClass();

module.exports = ModifierSnowRippler;
