/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit = require('./modifierOpeningGambit');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class ModifierOpeningGambitEquipArtifact extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitEquipArtifact";
    this.type ="ModifierOpeningGambitEquipArtifact";
  
    this.description ="Equip an artifact to you General";
  
    this.prototype.cardDataOrIndexToEquip = 0;
  }

  static createContextObject(cardDataOrIndexToEquip, options) {
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToEquip = cardDataOrIndexToEquip;
    return contextObject;
  }

  onOpeningGambit(action) {
    super.onOpeningGambit(action);
    
    const gameSession = this.getGameSession();
    const playCardAction = new PlayCardSilentlyAction(gameSession, this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, this.cardDataOrIndexToEquip);
    playCardAction.setSource(this.getCard());
    return gameSession.executeAction(playCardAction);
  }
}
ModifierOpeningGambitEquipArtifact.initClass();

module.exports = ModifierOpeningGambitEquipArtifact;