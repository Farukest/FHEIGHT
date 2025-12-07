/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const RandomTeleportAction = require('app/sdk/actions/randomTeleportAction');
const CardType = require('app/sdk/cards/cardType');
const _ = require('underscore');

class OpeningGambitTeleportAllNearby extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "OpeningGambitTeleportAllNearby";
    this.type = "OpeningGambitTeleportAllNearby";
  
    this.modifierName = "Opening Gambit";
    this.description = " Push ALL nearby minions and Generals to random spaces";
  
    this.prototype.damageAmount = 0;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit() {
    const entities = this.getGameSession().getBoard().getEntitiesAroundEntity(this.getCard(), CardType.Unit, 1);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        var randomTeleportAction = new RandomTeleportAction(this.getGameSession());
        randomTeleportAction.setOwnerId(this.getCard().getOwnerId());
        randomTeleportAction.setSource(entity);
        randomTeleportAction.setFXResource(_.union(randomTeleportAction.getFXResource(), this.getFXResource()));
        result.push(this.getGameSession().executeAction(randomTeleportAction));
      }
      return result;
    })();
  }
}
OpeningGambitTeleportAllNearby.initClass();

module.exports = OpeningGambitTeleportAllNearby;
