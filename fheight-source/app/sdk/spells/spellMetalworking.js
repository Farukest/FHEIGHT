/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Spell =   require('./spell');
const CardType = require('app/sdk/cards/cardType');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');

class SpellMetalworking extends Spell {
  static initClass() {
  
    this.prototype.numArtifacts = 1;
  }

  _findApplyEffectPositions(position, sourceAction) {
    return [this.getGameSession().getGeneralForPlayerId(this.getOwnerId()).getPosition()];
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const potentialArtifacts = [];
    const artifactsPlayed = this.getGameSession().getArtifactsPlayed(this.getOwnerId());
    const myGeneral = this.getGameSession().getGeneralForPlayerId(this.getOwnerId());
    // check all played artifact cards
    for (var artifact of Array.from(artifactsPlayed)) {
      var modifiersGroupedByArtifactCard = myGeneral.getArtifactModifiersGroupedByArtifactCard();
      // if no artifact modifiers are stil on the general, all played artifacts are valid to retrieve
      if (modifiersGroupedByArtifactCard.length === 0) {
        potentialArtifacts.push(artifact);
      } else {
        var skipThisArtifact = false;
        // if general still has any artifacts, do NOT retrieve those exact artifacts
        for (var artifactMods of Array.from(modifiersGroupedByArtifactCard)) {
          // skip any played artifacts that are still active on the General
          if (artifactMods[0].getSourceCard().getIndex() === artifact.getIndex()) {
            skipThisArtifact = true;
            break;
          }
        }
        if (!skipThisArtifact) {
          potentialArtifacts.push(artifact);
        }
      }
    }
    if (potentialArtifacts.length > 0) {
      const artifactToPlay = potentialArtifacts[this.getGameSession().getRandomIntegerForExecution(potentialArtifacts.length)];

      if (artifactToPlay != null) {
        const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), x, y, artifactToPlay.createNewCardData());
        playCardAction.setSource(this);
        return this.getGameSession().executeAction(playCardAction);
      }
    }
  }
}
SpellMetalworking.initClass();

module.exports = SpellMetalworking;
