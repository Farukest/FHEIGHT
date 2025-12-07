/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = 'app/common/config';
const UtilsJavascript = require('app/common/utils/utils_javascript');
const ModifierOnDyingSpawnEntity = require('./modifierOnDyingSpawnEntity');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const CardType = require('app/sdk/cards/cardType');
const ModifierEgg = require('app/sdk/modifiers/modifierEgg');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const _ = require("underscore");

const i18next = require('i18next');

class ModifierRebirth extends ModifierOnDyingSpawnEntity {
  static initClass() {
  
    this.prototype.type ="ModifierRebirth";
    this.type ="ModifierRebirth";
  
    this.isKeyworded = true;
    this.keywordDefinition = i18next.t("modifiers.rebirth_def");
  
    this.modifierName =i18next.t("modifiers.rebirth_name");
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierRebirth"];
  }

  static createContextObject(options) {
    let spawnCount, spawnPattern, spawnSilently;
    const contextObject = super.createContextObject({id: Cards.Faction5.Egg}, (spawnCount=1), (spawnPattern=CONFIG.PATTERN_1x1), (spawnSilently=true),options);
    return contextObject;
  }

  onDying(action) {
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

        if (cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects == null) { cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects = []; }
        cardDataOrIndexToSpawn.additionalInherentModifiersContextObjects.push(ModifierEgg.createContextObject(this.getCard().createNewCardData(), null));

        // spawn an egg
        const playCardAction = new PlayCardSilentlyAction(this.getGameSession(), this.getCard().getOwnerId(), this.getCard().getPosition().x, this.getCard().getPosition().y, cardDataOrIndexToSpawn);
        return this.getGameSession().executeAction(playCardAction);
      }
    }
  }
}
ModifierRebirth.initClass();


module.exports = ModifierRebirth;
