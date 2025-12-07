/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const ModifierBuilding = require('./modifierBuilding');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const UtilsGameSession = require('app/common/utils/utils_game_session');

class ModifierBuildCompleteReplicateAndSummonDervish extends ModifierBuilding {
  static initClass() {
  
    this.prototype.type ="ModifierBuildCompleteReplicateAndSummonDervish";
    this.type ="ModifierBuildCompleteReplicateAndSummonDervish";
  
    this.prototype.buildingMinion = null;
  }

  onBuildComplete() {
    super.onBuildComplete(); // finish build

    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      // and create another replicator obelysk
      const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.buildingMinion);
      const spawnPositions = UtilsGameSession.getSmartSpawnPositionsFromPattern(this.getGameSession(), this.getCard().getPosition(), CONFIG.PATTERN_3x3, card);
      if ((spawnPositions != null ? spawnPositions.length : undefined) > 0) {
        const obelyskSpawnPosition = spawnPositions.splice(this.getGameSession().getRandomIntegerForExecution(spawnPositions.length), 1)[0];
        const cardDataOrIndexToSpawn = this.buildingMinion;
        const buildingModifier = ModifierBuildCompleteReplicateAndSummonDervish.createContextObject(this.description, {id: Cards.Faction3.SimulacraObelysk}, 2);
        buildingModifier.buildingMinion = {id: Cards.Faction3.SimulacraBuilding};
        if (cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
        cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(buildingModifier);
        const spawnAction1 = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), obelyskSpawnPosition.x, obelyskSpawnPosition.y, cardDataOrIndexToSpawn);
        spawnAction1.setSource(this.getCard());
        this.getGameSession().executeAction(spawnAction1);
      }

      // and summon a dervish
      if ((spawnPositions != null ? spawnPositions.length : undefined) > 0) {
        const dervish = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData({id: Cards.Faction3.Dervish});
        const dervishSpawnPosition = spawnPositions[this.getGameSession().getRandomIntegerForExecution(spawnPositions.length)];
        const spawnAction2 = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), dervishSpawnPosition.x, dervishSpawnPosition.y, {id: Cards.Faction3.Dervish});
        spawnAction2.setSource(this.getCard());
        return this.getGameSession().executeAction(spawnAction2);
      }
    }
  }
}
ModifierBuildCompleteReplicateAndSummonDervish.initClass();

module.exports = ModifierBuildCompleteReplicateAndSummonDervish;
