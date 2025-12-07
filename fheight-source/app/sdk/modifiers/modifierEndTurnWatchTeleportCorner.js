/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatch = require('./modifierEndTurnWatch.js');
const RandomTeleportAction = require('app/sdk/actions/randomTeleportAction');
const CONFIG = require('app/common/config');
const _ = require('underscore');

class ModifierEndTurnWatchTeleportCorner extends ModifierEndTurnWatch {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchTeleportCorner";
    this.type ="ModifierEndTurnWatchTeleportCorner";
  
    this.modifierName ="Turn Watch";
    this.description ="At the end of your turn, teleport to a random corner";
  
    this.prototype.isHiddenToUI = true; // don't show this modifier by default
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierEndTurnWatch"];
  }

  onTurnWatch(action) {
    super.onTurnWatch(action);

    const randomTeleportAction = new RandomTeleportAction(this.getGameSession());
    randomTeleportAction.setOwnerId(this.getCard().getOwnerId());
    randomTeleportAction.setSource(this.getCard());
    randomTeleportAction.setTeleportPattern(CONFIG.PATTERN_CORNERS);
    randomTeleportAction.setFXResource(_.union(randomTeleportAction.getFXResource(), this.getFXResource()));
    return this.getGameSession().executeAction(randomTeleportAction);
  }
}
ModifierEndTurnWatchTeleportCorner.initClass();

module.exports = ModifierEndTurnWatchTeleportCorner;
