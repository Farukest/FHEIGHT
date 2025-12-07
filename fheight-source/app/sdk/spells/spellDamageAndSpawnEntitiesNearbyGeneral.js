/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellSpawnEntity = require('./spellSpawnEntity.js');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const DamageAction = require('app/sdk/actions/damageAction');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const UtilsGameSession = require('../../common/utils/utils_game_session.js');
const CONFIG = require('app/common/config');

class SpellDamageAndSpawnEntitiesNearbyGeneral extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spellFilterType = SpellFilterType.EnemyDirect;
    this.prototype.damageAmount = 2;
    this.prototype.spawnSilently = true;
    this.prototype.numUnits = 2;
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Neutral.Spellspark};
     // spawns wraithlings
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    super.onApplyEffectToBoardTile(board,x,y,sourceAction);

    const target = board.getCardAtPosition({x, y}, this.targetType);

    if ((target != null) && (target.getOwnerId() !== this.getOwnerId())) {
      const damageAction = new DamageAction(this.getGameSession());
      damageAction.setOwnerId(this.ownerId);
      damageAction.setTarget(target);
      damageAction.setDamageAmount(this.damageAmount);
      return this.getGameSession().executeAction(damageAction);
    }
  }

  _findApplyEffectPositions(position, sourceAction) {
    let applyEffectPositions;
    const card = this.getEntityToSpawn();
    const generalPosition = this.getGameSession().getGeneralForPlayerId(this.ownerId).getPosition();
    const numberOfApplyPositions = this.numUnits;

    if (numberOfApplyPositions > 0) {
      applyEffectPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), generalPosition, CONFIG.PATTERN_3x3, card, this, numberOfApplyPositions);
    } else {
      applyEffectPositions = [];
    }

    applyEffectPositions.push(position);

    return applyEffectPositions;
  }

  // Wind Shroud picks its apply location by itself, so don't set limits on where it can be cast
  _postFilterPlayPositions(validPositions) {
    return validPositions;
  }
}
SpellDamageAndSpawnEntitiesNearbyGeneral.initClass();

module.exports = SpellDamageAndSpawnEntitiesNearbyGeneral;
