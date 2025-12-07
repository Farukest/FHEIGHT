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
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const Races = require('app/sdk/cards/racesLookup');
const _ = require('underscore');

class ModifierOpeningGambitDeathKnell extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitDeathKnell";
    this.type ="ModifierOpeningGambitDeathKnell";
  
    this.description = "Resummon all friendly Arcanysts destroyed this game nearby";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambitDeathKnell"];
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.deadUnits = null;

    return p;
  }

  getDeadUnits() {
    if ((this._private.deadUnits == null)) {
      this._private.deadUnits = this.getGameSession().getDeadUnits(this.getOwnerId());
    }
    return this._private.deadUnits;
  }

  onOpeningGambit() {
    super.onOpeningGambit();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      const deadArcanystIds = [];
      for (var unit of Array.from(this.getDeadUnits())) {
        if (unit.getBelongsToTribe(Races.Arcanyst)) {
          deadArcanystIds.push(unit.getId());
        }
      }

      if (deadArcanystIds.length > 0) {
        let i;
        let asc, end;
        const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData({id: this.getCard().getId()});
        const spawnLocations = [];
        _.shuffle(deadArcanystIds);
        const validSpawnLocations = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, this.getCard());
        for (i = 0, end = deadArcanystIds.length, asc = 0 <= end; asc ? i < end : i > end; asc ? i++ : i--) {
          if (validSpawnLocations.length > 0) {
            spawnLocations.push(validSpawnLocations.splice(this.getGameSession().getRandomIntegerForExecution(validSpawnLocations.length), 1)[0]);
          } else {
            break;
          }
        }

        return (() => {
          const result = [];
          for (i = 0; i < spawnLocations.length; i++) {
            var position = spawnLocations[i];
            var playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, {id: deadArcanystIds[i]});
            playCardAction.setSource(this.getCard());
            result.push(this.getGameSession().executeAction(playCardAction));
          }
          return result;
        })();
      }
    }
  }
}
ModifierOpeningGambitDeathKnell.initClass();

module.exports = ModifierOpeningGambitDeathKnell;
