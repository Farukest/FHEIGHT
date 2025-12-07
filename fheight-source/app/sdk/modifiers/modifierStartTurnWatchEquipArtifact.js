/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const DamageAction = require('app/sdk/actions/damageAction');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const CardType = require('app/sdk/cards/cardType');
const CONFIG = require('app/common/config');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Factions = require('app/sdk/cards/factionsLookup.js');
const _ = require('underscore');
const i18next = require('i18next');

class ModifierStartTurnWatchEquipArtifact extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchEquipArtifact";
    this.type ="ModifierStartTurnWatchEquipArtifact";
  
    this.description =i18next.t("modifiers.start_turn_watch_equip_artifact_def");
  
    this.prototype.amount = 1;
     // number of artifacts to equip
  }

  static createContextObject(amount, includedCards, options) {
    if (amount == null) { amount = 1; }
    const contextObject = super.createContextObject(options);
    contextObject.amount = amount;
    contextObject.includedCards = includedCards;
    return contextObject;
  }

  onTurnWatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      return (() => {
        const result = [];
        for (let i = 0, end = this.amount, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          var artifactCard = this.includedCards[this.getGameSession().getRandomIntegerForExecution(this.includedCards.length)]; // random artifact
          var cardDataOrIndexToPutInHand = artifactCard;
          var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, cardDataOrIndexToPutInHand);
          playCardAction.setSource(this.getCard());
          result.push(this.getGameSession().executeAction(playCardAction));
        }
        return result;
      })();
    }
  }
}
ModifierStartTurnWatchEquipArtifact.initClass();

module.exports = ModifierStartTurnWatchEquipArtifact;
