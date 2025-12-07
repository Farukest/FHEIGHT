/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierOpeningGambit =   require('./modifierOpeningGambit');
const ModifierSilence = require('./modifierSilence');
const RemoveArtifactsAction =  require('app/sdk/actions/removeArtifactsAction');

class ModifierOpeningGambitGoleminate extends ModifierOpeningGambit {
  static initClass() {
  
    this.prototype.type ="ModifierOpeningGambitGoleminate";
    this.type ="ModifierOpeningGambitGoleminate";
  
    this.modifierName ="Opening Gambit";
    this.description ="Dispel EVERYTHING and destroy ALL artifacts.";
  }

  onOpeningGambit() {
    return (() => {
      const result = [];
      for (var entity of Array.from(this.getGameSession().getBoard().getEntities())) { // dispel every entity on the board
        if (!(entity === this.getCard())) { // don't dispel self though
          this.getGameSession().applyModifierContextObject(ModifierSilence.createContextObject(), entity);
          if (entity.getIsGeneral()) { // if entity is a General, remove all Artifacts
            var removeArtifactsAction = new RemoveArtifactsAction(this.getGameSession());
            removeArtifactsAction.setTarget(entity);
            result.push(this.getGameSession().executeAction(removeArtifactsAction));
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
ModifierOpeningGambitGoleminate.initClass();

module.exports = ModifierOpeningGambitGoleminate;
