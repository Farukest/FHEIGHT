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

class SpellShadowspawn extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.targetType = CardType.Unit;
    this.prototype.spawnSilently = true;
    this.prototype.numUnits = 2;
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Faction4.Wraithling};
     // spawns wraithlings
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

    return applyEffectPositions;
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }

  // Shadowspawn picks its apply locations by itself, so don't set limits on where it can be cast
  _postFilterPlayPositions(validPositions) {
    return validPositions;
  }
}
SpellShadowspawn.initClass();

module.exports = SpellShadowspawn;
