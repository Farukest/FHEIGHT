/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Spell = require('./spell');
const SpellSpawnEntity = require('./spellSpawnEntity');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CONFIG = require('app/common/config');
const ModifierStartTurnWatchRemoveEntity = require('app/sdk/modifiers/modifierStartTurnWatchRemoveEntity');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const _ = require('underscore');

class SpellPandaJail extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Faction2.OnyxBear};
  }

  getCardDataOrIndexToSpawn(x, y) {
    let cardDataOrIndexToSpawn = super.getCardDataOrIndexToSpawn(x,y);
    if ((cardDataOrIndexToSpawn != null) && !_.isObject(cardDataOrIndexToSpawn)) { cardDataOrIndexToSpawn = this.getGameSession().getCardByIndex(cardDataOrIndexToSpawn).createNewCardData(); }
    if (cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
    const removalModifierContextObject = ModifierStartTurnWatchRemoveEntity.createContextObject();
    removalModifierContextObject.isHiddenToUI = true;
    cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(removalModifierContextObject);
    return cardDataOrIndexToSpawn;
  }

  _findApplyEffectPositions(position, sourceAction) {
    const card = this.getEntityToSpawn();
    const applyEffectPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), this.getGameSession().getGeneralForOpponentOfPlayerId(this.getOwnerId()).getPosition(), CONFIG.PATTERN_3x3, card, this, 8);

    return applyEffectPositions;
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }
}
SpellPandaJail.initClass();

module.exports = SpellPandaJail;
