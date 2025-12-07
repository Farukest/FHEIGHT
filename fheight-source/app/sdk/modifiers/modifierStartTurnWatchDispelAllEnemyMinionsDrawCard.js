/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatch = require('./modifierStartTurnWatch');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const CardType = require('app/sdk/cards/cardType');
const CONFIG = require('app/common/config');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Factions = require('app/sdk/cards/factionsLookup.js');
const DrawCardAction = require('app/sdk/actions/drawCardAction');
const ModifierSilence = require('./modifierSilence');
const _ = require('underscore');

class ModifierStartTurnWatchDispelAllEnemyMinionsDrawCard extends ModifierStartTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierStartTurnWatchDispelAllEnemyMinionsDrawCard";
    this.type ="ModifierStartTurnWatchDispelAllEnemyMinionsDrawCard";
  
    this.description = "At the start of your turn, dispel all enemy minions and draw a card";
  }

  onTurnWatch(action) {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      for (var enemyUnit of Array.from(this.getGameSession().getBoard().getEnemyEntitiesForEntity(this.getCard(), CardType.Unit))) {
        if (!enemyUnit.getIsGeneral()) {
          this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), enemyUnit);
        }
      }
      const a = new DrawCardAction(this.getGameSession(), this.getCard().getOwnerId());
      return this.getGameSession().executeAction(a);
    }
  }
}
ModifierStartTurnWatchDispelAllEnemyMinionsDrawCard.initClass();

module.exports = ModifierStartTurnWatchDispelAllEnemyMinionsDrawCard;
