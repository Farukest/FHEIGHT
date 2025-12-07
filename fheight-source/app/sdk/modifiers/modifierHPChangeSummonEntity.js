/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const UtilsPosition = require('app/common/utils/utils_position');
const ModifierHPChange = require('app/sdk/modifiers/modifierHPChange');
const _ = require('underscore');

class ModifierHPChangeSummonEntity extends ModifierHPChange {
  static initClass() {
  
    this.prototype.type ="ModifierHPChangeSummonEntity";
    this.type ="ModifierHPChangeSummonEntity";
  
    this.modifierName ="Modifier HP Change Summon Entity";
    this.description = "When this falls below %X health, summon %Y on a random space";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierBuffSelfOnReplace"];
  }

  static createContextObject(cardDataOrIndexToSpawn,healthThreshold,spawnDescription,spawnCount, spawnSilently,options) {
    if (spawnCount == null) { spawnCount = 1; }
    if (spawnSilently == null) { spawnSilently = true; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.healthThreshold = healthThreshold;
    contextObject.spawnDescription = spawnDescription;
    contextObject.spawnCount = spawnCount;
    contextObject.spawnSilently = spawnSilently;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const descriptionText = this.description.replace(/%Y/, modifierContextObject.spawnDescription);
      return descriptionText.replace(/%X/, modifierContextObject.healthThreshold);
    } else {
      return this.description;
    }
  }

  onHPChange(action) {
    super.onHPChange(action);

    const hp = this.getCard().getHP();

    if (hp <= this.healthThreshold) {
      if (this.getGameSession().getIsRunningAsAuthoritative()) {
        const ownerId = this.getSpawnOwnerId(action);
        const wholeBoardPattern = CONFIG.ALL_BOARD_POSITIONS;
        const card = this.getGameSession().getExistingCardFromIndexOrCachedCardFromData(this.cardDataOrIndexToSpawn);
        const thisEntityPosition = this.getCard().getPosition();
        const validPositions = _.reject(wholeBoardPattern, position => UtilsPosition.getPositionsAreEqual(position, thisEntityPosition));
        const spawnLocations = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, validPositions, card, this.getCard(), this.spawnCount);

        for (var position of Array.from(spawnLocations)) {
          var playCardAction;
          if (!this.spawnSilently) {
            playCardAction = new PlayCardAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, this.cardDataOrIndexToSpawn);
          } else {
            playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), position.x, position.y, this.cardDataOrIndexToSpawn);
          }
          playCardAction.setSource(this.getCard());
          this.getGameSession().executeAction(playCardAction);
        }
        // remove modifier so it doesn't trigger again
        return this.getGameSession().removeModifier(this);
      }
    }
  }

  getCardDataOrIndexToSpawn() {
    return this.cardDataOrIndexToSpawn;
  }

  getSpawnOwnerId(action) {
    return this.getCard().getOwnerId();
  }
}
ModifierHPChangeSummonEntity.initClass();

module.exports = ModifierHPChangeSummonEntity;
