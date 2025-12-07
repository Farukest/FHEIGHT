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
let UtilsGameSession = require('app/common/utils/utils_game_session');
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const DieAction = require('app/sdk/actions/dieAction');
const CardType = require('app/sdk/cards/cardType');
const Rarity = require('app/sdk/cards/rarityLookup');
UtilsGameSession = require('app/common/utils/utils_game_session');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const _ = require('underscore');

class ModifierOpeningGambitLifeGive extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitLifeGive";
    this.type ="ModifierOpeningGambitLifeGive";
  
    this.modifierName ="Opening Gambit";
    this.description = "Summon all friendly non-token minions destroyed on your opponent\'s last turn on random spaces";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit", "FX.Modifiers.ModifierGenericSpawn"];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.deadUnitIds = null;

    return p;
  }

  getAllActionsFromParentAction(action) {
    let actions = [action];

    const subActions = action.getSubActions();
    if ((subActions != null) && (subActions.length > 0)) {
      for (let i = 0; i < subActions.length; i++) {
        action = subActions[i];
        actions = actions.concat(this.getAllActionsFromParentAction(subActions[i]));
      }
    }
    return actions;
  }

  getdeadUnitIds() {
    let deadUnitIds;
    if ((this._private.deadUnitIds == null)) {
      let turn;
      deadUnitIds = [];
      const turnsToCheck = [];
      // find opponent's last turn
      const iterable = this.getGameSession().getTurns();
      for (let i = iterable.length - 1; i >= 0; i--) {
        turn = iterable[i];
        if (turn.playerId !== this.getCard().getOwnerId()) {
          turnsToCheck.push(turn);
          break;
        }
      }

      let actions = [];
      for (turn of Array.from(turnsToCheck)) {
        for (var step of Array.from(turn.steps)) {
          actions = actions.concat(this.getAllActionsFromParentAction(step.getAction()));
        }
      }

      for (var action of Array.from(actions)) {
        if (action.type === DieAction.type) {
          var card = action.getTarget();
          // find all friendly non-token units that died
          if (((card != null ? card.getOwnerId() : undefined) === this.getCard().getOwnerId()) && ((card != null ? card.getType() : undefined) === CardType.Unit) && card.getIsRemoved() && !(card.getRarityId() === Rarity.TokenUnit) && !card.getWasGeneral()) {
            deadUnitIds.push(card.getId());
          }
        }
      }
      this._private.deadUnitIds = deadUnitIds;
      return deadUnitIds;
    } else {
      return this._private.deadUnitIds;
    }
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const deadUnitIds = this.getdeadUnitIds();
      if (deadUnitIds.length > 0) {
        let i;
        let asc, end;
        const wholeBoardPattern = CONFIG.ALL_BOARD_POSITIONS;
        // use first dead unit as entity to test valid positions for spawns
        const cardId = deadUnitIds[0];

        // create one random spawn location per dead unit
        const spawnLocations = [];
        const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData({id: this.getCard().getId()});
        const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, wholeBoardPattern, card);
        _.shuffle(deadUnitIds);
        for (i = 0, end = deadUnitIds.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          if (validSpawnLocations.length > 0) {
            spawnLocations.push(validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0]);
          }
        }

        return (() => {
          const result = [];
          for (i = 0; i < spawnLocations.length; i++) {
          // respawn each dead unit as a fresh copy
            var position = spawnLocations[i];
            var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, {id: deadUnitIds[i]});
            playCardAction.setSource(this.getCard());
            result.push(this.getGameSession().executeAction(playCardAction));
          }
          return result;
        })();
      }
    }
  }
}
ModifierOpeningGambitLifeGive.initClass();

module.exports = ModifierOpeningGambitLifeGive;
