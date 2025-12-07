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

class ModifierOpeningGambitTeleportMinionsToThis extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type = "ModifierOpeningGambitTeleportMinionsToThis";
    this.type = "ModifierOpeningGambitTeleportMinionsToThis";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierOpeningGambit"];
  }

  onOpeningGambit() {
    const entities = this.getGameSession().getBoard().getUnits(true);
    return (() => {
      const result = [];
      for (var entity of Array.from(entities)) {
        if (!entity.getIsGeneral() && (entity !== this.getCard())) {
          var randomTeleportAction = new RandomTeleportAction(this.getGameSession());
          randomTeleportAction.setOwnerId(this.getCard().getOwnerId());
          randomTeleportAction.setSource(entity);
          randomTeleportAction.setFXResource(_.union(randomTeleportAction.getFXResource(), this.getFXResource()));
          randomTeleportAction.setPatternSourcePosition(this.getCard().getPosition());
          randomTeleportAction.setTeleportPattern(CONFIG.PATTERN_3x3);
          result.push(this.getGameSession().executeAction(randomTeleportAction));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierOpeningGambitTeleportMinionsToThis.initClass();

module.exports = ModifierOpeningGambitTeleportMinionsToThis;
