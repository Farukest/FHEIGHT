/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('../../common/config');
const SpellSpawnEntity = require('./spellSpawnEntity.js');
const CardType = require('./../cards/cardType.js');
const Cards = require('../cards/cardsLookupComplete.js');
const UtilsGameSession = require('../../common/utils/utils_game_session.js');
const _ = require('underscore');

class SpellSpawnEntityRandomlyAroundTarget extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spawnSilently = true;
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Faction3.Dervish};
     // spawns dervishes
  }

  _findApplyEffectPositions(position, sourceAction) {
    const card = this.getEntityToSpawn();
    const generalPosition = this.getGameSession().getGeneralForPlayerId(this.ownerId).getPosition();
    const applyEffectPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), position, CONFIG.PATTERN_3x3, card, this, 1);

    applyEffectPositions.push(position);

    return applyEffectPositions;
  }

  // Wind Shroud picks its apply location by itself, so don't set limits on where it can be cast
  _postFilterPlayPositions(validPositions) {
    return validPositions;
  }
}
SpellSpawnEntityRandomlyAroundTarget.initClass();

module.exports = SpellSpawnEntityRandomlyAroundTarget;
