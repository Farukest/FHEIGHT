/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellDamage = require('./spellDamage');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const PlayerModifierCardDrawModifier = require('app/sdk/playerModifiers/playerModifierCardDrawModifier');

class SpellTwinStrike extends SpellDamage {

  onApplyOneEffectToBoard(board,x,y,sourceAction) {
    super.onApplyOneEffectToBoard(board, x, y, sourceAction);

    const ownerId = this.getOwnerId();
    const general = this.getGameSession().getGeneralForPlayerId(ownerId);
    return this.getGameSession().applyModifierContextObject(PlayerModifierCardDrawModifier.createContextObject(1,1), general);
  }

  _findApplyEffectPositions(position, sourceAction) {
    // pick 2 targets from all potential targets
    const potentialPositions = super._findApplyEffectPositions(position, sourceAction);
    const applyEffectPositions = [];
    for (let i = 0; i <= 1; i++) {
      if (potentialPositions.length > 0) {
        var index = this.getGameSession().getRandomIntegerForExecution(potentialPositions.length);
        applyEffectPositions.push(potentialPositions.splice(index, 1)[0]);
      }
    }

    return applyEffectPositions;
  }

  _filterPlayPositions(spellPositions) {
    // there must be at least 2 enemy minions on the board to play this spell
    const enemyMinions = [];
    const board = this.getGameSession().getBoard();
    for (var enemy of Array.from(board.getEnemyEntitiesForEntity(this.getGameSession().getGeneralForPlayerId(this.getOwnerId()), CardType.Unit))) {
      if (!enemy.getIsGeneral()) {
        enemyMinions.push(enemy);
      }
    }

    if (enemyMinions.length < 2) {
      return [];
    } else {
      return super._filterPlayPositions(spellPositions);
    }
  }
}

module.exports = SpellTwinStrike;
