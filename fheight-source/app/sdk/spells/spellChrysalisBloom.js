/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const SpellSpawnEntity =   require('./spellSpawnEntity');
const SpellFilterType = require('./spellFilterType');
const ModifierEgg = require('app/sdk/modifiers/modifierEgg');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Factions = require('app/sdk/cards/factionsLookup');
const Rarity = require('app/sdk/cards/rarityLookup');
const CardType = require('app/sdk/cards/cardType');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const GameFormat = require('app/sdk/gameFormat');
const _ = require("underscore");

class SpellChrysalisBloom extends SpellSpawnEntity {
  static initClass() {
  
    this.prototype.cardDataOrIndexToSpawn = {id: Cards.Faction5.Egg};
    this.prototype.numEggs = 4;
  
    this.prototype.timesApplied = 0; // we'll increment this each time we apply an egg to board, so that we can apply different egg types
  
    this.prototype.spellFilterType = SpellFilterType.None;
  }

  onApplyEffectToBoardTile(board,x,y,sourceAction) {
    // get 1 common, 1 rare, 1 epic, and 1 legendary Magmar unit to put in the eggs
    let cardCache = [];
    let cards = [];

    if (this.getGameSession().getGameFormat() === GameFormat.Standard) {
      cardCache = this.getGameSession().getCardCaches().getIsLegacy(false).getFaction(Factions.Faction5).getIsHiddenInCollection(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getType(CardType.Unit);
    } else {
      cardCache = this.getGameSession().getCardCaches().getFaction(Factions.Faction5).getIsHiddenInCollection(false).getIsGeneral(false).getIsPrismatic(false).getIsSkinned(false).getType(CardType.Unit);
    }

    switch (this.timesApplied) {
      case 0:
        cards = cardCache.getRarity(Rarity.Common).getCards();
        break;
      case 1:
        cards = cardCache.getRarity(Rarity.Rare).getCards();
        break;
      case 2:
        cards = cardCache.getRarity(Rarity.Epic).getCards();
        break;
      case 3:
        cards = cardCache.getRarity(Rarity.Legendary).getCards();
        break;
    }

    if ((cards != null ? cards.length : undefined) > 0) {
      // get random card to spawn from egg
      const card = cards[this.getGameSession().getRandomIntegerForExecution(cards.length)];

      // add modifiers to card data
      let cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn(x, y);
      if ((cardDataOrIndexToSpawn != null) && !_.isObject(cardDataOrIndexToSpawn)) { cardDataOrIndexToSpawn = this.getGameSession().getCardByIndex(cardDataOrIndexToSpawn).createNewCardData(); }
      if (cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
      cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierEgg.createContextObject(card.createNewCardData(), card.getName()));

      // spawn next egg
      const spawnAction = this.getSpawnAction(x, y, cardDataOrIndexToSpawn);
      if (spawnAction != null) {
        this.getGameSession().executeAction(spawnAction);
      }
    }

    // increment
    return this.timesApplied++;
  }

  _findApplyEffectPositions(position, sourceAction) {
    const wholeBoardPattern = CONFIG.ALL_BOARD_POSITIONS;
    const card = this.getEntityToSpawn();
    const applyEffectPositions = UtilsGameSession.getRandomSmartSpawnPositionsFromPattern(this.getGameSession(), {x:0, y:0}, wholeBoardPattern, card, this, this.numEggs);

    return applyEffectPositions;
  }

  getAppliesSameEffectToMultipleTargets() {
    return true;
  }
}
SpellChrysalisBloom.initClass();

module.exports = SpellChrysalisBloom;
