/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS202: Simplify dynamic range loops
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const PlayCardFromHandAction = require('app/sdk/actions/playCardFromHandAction');
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const Races = require('app/sdk/cards/racesLookup');
const Cards = require('app/sdk/cards/cardsLookupComplete');

class ModifierOpeningGambitSirocco extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitSirocco";
    this.type ="ModifierOpeningGambitSirocco";
  
    this.modifierName ="Opening Gambit";
    this.description = "Summon a 3/2 Skyrock Golem on random spaces for each Golem you've summoned this game";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambitSirocco"];
  }

  getIsActionRelevant(a) {
    // triggers once for each Golem tribe minion this card's owner summoned previously
    if (a instanceof PlayCardFromHandAction && (a.getOwnerId() === this.getCard().getOwnerId())) {
      const card = a.getCard();
      return (card != null) && (card.type === CardType.Unit) && card.getBelongsToTribe(Races.Golem) && (card !== this.getCard());
    }
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const summonActions = this.getGameSession().filterActions(this.getIsActionRelevant.bind(this));

      const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData({id: Cards.Neutral.SkyrockGolem});
      const spawnLocations = [];
      const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, CONFIG.PATTERN_WHOLE_BOARD, card);
      for (let i = 0, end = summonActions.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
        if (validSpawnLocations.length > 0) {
          spawnLocations.push(validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0]);
        }
      }

      return (() => {
        const result = [];
        for (var position of Array.from(spawnLocations)) {
          var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, {id: Cards.Neutral.SkyrockGolem});
          playCardAction.setSource(this.getCard());
          result.push(this.getGameSession().executeAction(playCardAction));
        }
        return result;
      })();
    }
  }
}
ModifierOpeningGambitSirocco.initClass();

module.exports = ModifierOpeningGambitSirocco;
