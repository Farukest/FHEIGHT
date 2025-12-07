/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = 'app/common/config';
const UtilsJavascript = require('app/common/utils/utils_javascript');
const ModifierDyingWishSpawnEntity = require('./modifierDyingWishSpawnEntity');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const ModifierEgg = require('app/sdk/modifiers/modifierEgg');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const _ = require("underscore");

class ModifierDyingWishSpawnEgg extends ModifierDyingWishSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierDyingWishSpawnEgg";
    this.type ="ModifierDyingWishSpawnEgg";
  
    this.isKeyworded = false;
    this.keywordDefinition = "When this dies, it leaves behind a 0/1 Egg that hatches into %X";
  
    this.modifierName ="Rebirth: Serpenti";
    this.description = "Will leave behind a Serpenti egg when killed";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierRebirth"];
  }

  static createContextObject(cardDataOrIndexToSpawnAsEgg, spawnDescription, options) {
    let spawnCount, spawnPattern, spawnSilently;
    const contextObject = super.createContextObject({id: Cards.Faction5.Egg}, (spawnDescription = ""), (spawnCount=1), (spawnPattern=CONFIG.PATTERN_1x1), (spawnSilently=true),options);
    contextObject.cardDataOrIndexToSpawnAsEgg = cardDataOrIndexToSpawnAsEgg;
    contextObject.spawnDescription = spawnDescription;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      const replaceText = "a "+modifierContextObject.spawnDescription;
      return this.description.replace(/%X/, replaceText);
    } else {
      return this.description;
    }
  }

  onDyingWish(action) {
    //when this unit dies, if there isn't already a new unit queued to be spawned on the same tile where this unit died
    if (!this.getGameSession().getBoard().getCardAtPosition(this.getCard().getPosition(), CardType.Unit, false, true)) {
      // add modifier so egg will hatch correct unit
      let {
        cardDataOrIndexToSpawn
      } = this;

      if (cardDataOrIndexToSpawn != null) {
        if (_.isObject(cardDataOrIndexToSpawn)) {
          cardDataOrIndexToSpawn = UtilsJavascript.fastExtend({}, cardDataOrIndexToSpawn);
        } else {
          cardDataOrIndexToSpawn = this.getGameSession().getCardByIndex(cardDataOrIndexToSpawn).createNewCardData();
        }

        let {
          cardDataOrIndexToSpawnAsEgg
        } = this;
        if (cardDataOrIndexToSpawnAsEgg != null) {
          if (_.isObject(cardDataOrIndexToSpawnAsEgg)) {
            cardDataOrIndexToSpawnAsEgg = UtilsJavascript.fastExtend({}, cardDataOrIndexToSpawnAsEgg);
          } else {
            cardDataOrIndexToSpawnAsEgg = this.getGameSession().getCardByIndex(cardDataOrIndexToSpawnAsEgg).createNewCardData();
          }
        }

        if (cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
        cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierEgg.createContextObject(cardDataOrIndexToSpawnAsEgg, "Serpenti"));
        //cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierEgg.createContextObject(cardDataOrIndexToSpawnAsEgg, cardDataOrIndexToSpawnAsEgg.getName()))

        // spawn an egg
        const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, cardDataOrIndexToSpawn);
        return this.getGameSession().executeAction(playCardAction);
      }
    }
  }
}
ModifierDyingWishSpawnEgg.initClass();


module.exports = ModifierDyingWishSpawnEgg;
