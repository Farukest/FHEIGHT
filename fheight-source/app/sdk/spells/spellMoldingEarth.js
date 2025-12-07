/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const SpellSpawnEntity = require('./spellSpawnEntity.js');
const CardType = require('app/sdk/cards/cardType');
const SpellFilterType = require('./spellFilterType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const UtilsGameSession = require('../../common/utils/utils_game_session.js');
const CONFIG = require('app/common/config');
const ModifierBackstab = require('app/sdk/modifiers/modifierBackstab');
const ModifierBlastAttack = require('app/sdk/modifiers/modifierBlastAttack');
const ModifierTranscendance = require('app/sdk/modifiers/modifierTranscendance');
const ModifierFlying = require('app/sdk/modifiers/modifierFlying');
const ModifierForcefield = require('app/sdk/modifiers/modifierForcefield');
const ModifierFrenzy = require('app/sdk/modifiers/modifierFrenzy');
const ModifierGrow = require('app/sdk/modifiers/modifierGrow');
const ModifierProvoke = require('app/sdk/modifiers/modifierProvoke');
const ModifierRanged = require('app/sdk/modifiers/modifierRanged');
const ModifierRebirth = require('app/sdk/modifiers/modifierRebirth');
const ModifierFirstBlood = require('app/sdk/modifiers/modifierFirstBlood');

class SpellMoldingEarth extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.spawnSilently = true;
    this.prototype.numUnits = 3;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {

    const modifiersToObtain = [
      ModifierFrenzy.createContextObject(),
      ModifierFlying.createContextObject(),
      ModifierTranscendance.createContextObject(),
      ModifierProvoke.createContextObject(),
      ModifierRanged.createContextObject(),
      ModifierFirstBlood.createContextObject(),
      ModifierRebirth.createContextObject(),
      ModifierForcefield.createContextObject()
    ];

    const modifierContextObject = modifiersToObtain[this.getGameSession().getRandomIntegerForExecution(modifiersToObtain.length)];

    this.cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = [modifierContextObject];

    return super.onApplyEffectToBoardTile(board,x,y,sourceAction);
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

  _postFilterPlayPositions(validPositions) {
    return validPositions;
  }
}
SpellMoldingEarth.initClass();

module.exports = SpellMoldingEarth;
