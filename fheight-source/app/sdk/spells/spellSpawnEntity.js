/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const UtilsJavascript = require('app/common/utils/utils_javascript');
const SpellApplyEntityToBoard =   require('./spellApplyEntityToBoard');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const _ = require('underscore');

class SpellSpawnEntity extends SpellApplyEntityToBoard {
  static initClass() {
  
    this.prototype.targetType = CardType.Entity;
    this.prototype.spellFilterType = SpellFilterType.None;
    this.prototype.cardDataOrIndexToSpawn = null; // id of card to spawn
    this.prototype.spawnSilently = false;
     // whether entity should be spawned silently
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);
    p.targetsSpace = true; // does not target any unit directly
    return p;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn(x, y);
    const spawnAction = this.getSpawnAction(x, y, cardDataOrIndexToSpawn);
    if (spawnAction != null) {
      return this.getGameSession().executeAction(spawnAction);
    }
  }

  getCardDataOrIndexToSpawn(x, y) {
    let {
      cardDataOrIndexToSpawn
    } = this;
    if ((cardDataOrIndexToSpawn != null) && _.isObject(cardDataOrIndexToSpawn)) { cardDataOrIndexToSpawn = UtilsJavascript.fastExtend({}, cardDataOrIndexToSpawn); }
    return cardDataOrIndexToSpawn;
  }

  getSpawnAction(x, y, cardDataOrIndexToSpawn) {
    let spawnEntityAction;
    const targetPosition = {x, y};
    if ((cardDataOrIndexToSpawn == null)) { cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn(x, y); }
    const entity = this.getEntityToSpawn(cardDataOrIndexToSpawn);
    if (entity && !this.getGameSession().getBoard().getObstructionAtPositionForEntity(targetPosition, entity)) {
      if (this.spawnSilently) {
        spawnEntityAction = new PlayCardSilentlyAction(this.getGameSession(), this.getOwnerId(), x, y, cardDataOrIndexToSpawn);
      } else {
        spawnEntityAction = new PlayCardAction(this.getGameSession(), this.getOwnerId(), x, y, cardDataOrIndexToSpawn);
      }
    }
    return spawnEntityAction;
  }

  getEntityToSpawn(cardDataOrIndexToSpawn) {
    if ((cardDataOrIndexToSpawn == null)) { ({
      cardDataOrIndexToSpawn
    } = this); }
    if (cardDataOrIndexToSpawn != null) {
      const entity = this.getGameSession().getExistingCardFromIndexOrCreateCardFromData(cardDataOrIndexToSpawn);
      if (entity != null) {
        entity.setOwnerId(this.getOwnerId());
        return entity;
      }
    }
  }
}
SpellSpawnEntity.initClass();

module.exports = SpellSpawnEntity;
