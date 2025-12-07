/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierStartTurnWatchSpawnEntity = require('./modifierStartTurnWatchSpawnEntity');
const Cards = require('app/sdk/cards/cardsLookupComplete');

const i18next = require('i18next');

class ModifierStartTurnWatchSummonDervish extends ModifierStartTurnWatchSpawnEntity {
  static initClass() {
  
    // This is pretty much just a wrapper for startTurnWatchSpawnEntity with a Dervish minion. The Obelysks'
    // description text was getting super long, so broke this part out into a keyworded modifier instead.
  
    this.prototype.type ="ModifierStartTurnWatchSummonDervish";
    this.type ="ModifierStartTurnWatchSummonDervish";
  
    this.isKeyworded = true;
    this.keywordDefinition =i18next.t("modifiers.summon_dervish_def");
  
    this.modifierName =i18next.t("modifiers.summon_dervish_name");
    this.description ="";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierStartTurnWatch", "FX.Modifiers.ModifierGenericSpawn"];
  }

  static createContextObject() {
    const contextObject = super.createContextObject({id: Cards.Faction3.Dervish});
    return contextObject;
  }
}
ModifierStartTurnWatchSummonDervish.initClass();

module.exports = ModifierStartTurnWatchSummonDervish;
