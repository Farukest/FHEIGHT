/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const _ = require('underscore');
const ModifierSurviveDamageWatch =  require('./modifierSurviveDamageWatch');
const PlayCardAsTransformAction = require('app/sdk/actions/playCardAsTransformAction');
const RemoveAction = require('app/sdk/actions/removeAction');
const Factions = require('app/sdk/cards/factionsLookup.js');
const Races = require('app/sdk/cards/racesLookup.js');

class ModifierSurviveDamageWatchBur extends ModifierSurviveDamageWatch {
  static initClass() {
  
    this.prototype.type ="ModifierSurviveDamageWatchBur";
    this.type ="ModifierSurviveDamageWatchBur";
  
    this.modifierName = "";
    this.description = "When this minion survives damage, transform it into a different Battle Pet";
  
    this.prototype.triggeredOnActionIndex = -1;
     // only trigger one time (since we will transform this minion after it survives damage, don't keep transforming on extra damage instances)
  }

  onSurviveDamage(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative() && (this.triggeredOnActionIndex === -1)) {
      this.triggeredOnActionIndex = action.getIndex();
      const originalEntityId = this.getCard().getBaseCardId();

      // remove unit from board
      const removeOriginalEntityAction = new RemoveAction(this.getGameSession());
      removeOriginalEntityAction.setOwnerId(this.getCard().getOwnerId());
      removeOriginalEntityAction.setTarget(this.getCard());
      this.getGameSession().executeAction(removeOriginalEntityAction);

      // pull faction battle pets + neutral token battle pets
      const factionBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Faction6).getRace(Races.BattlePet).getIsToken(false).getIsPrismatic(false).getIsSkinned(false).getCards();
      const neutralBattlePetCards = this.getGameSession().getCardCaches().getFaction(Factions.Neutral).getRace(Races.BattlePet).getIsToken(true).getIsPrismatic(false).getIsSkinned(false).getCards();
      const battlePetCards = _.reject([].concat(factionBattlePetCards, neutralBattlePetCards), card => card.getBaseCardId() === originalEntityId);
      const battlePetCard = battlePetCards[this.getGameSession().getRandomIntegerForExecution(battlePetCards.length)];

      // transform into a new minion
      const playCardAction = new PlayCardAsTransformAction(this.getGameSession(), this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, battlePetCard.createNewCardData());
      return this.getGameSession().executeAction(playCardAction);
    }
  }
}
ModifierSurviveDamageWatchBur.initClass();

module.exports = ModifierSurviveDamageWatchBur;
