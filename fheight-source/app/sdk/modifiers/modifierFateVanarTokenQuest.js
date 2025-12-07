/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierFate = require('./modifierFate');
const CardType = require('app/sdk/cards/cardType');
const Cards = require('app/sdk/cards/cardsLookupComplete');
const Rarity = require('app/sdk/cards/rarityLookup');
const ApplyCardToBoardAction = require('app/sdk/actions/applyCardToBoardAction');
const CloneEntityAction = require('app/sdk/actions/cloneEntityAction');
const SwapUnitAllegianceAction = require('app/sdk/actions/swapUnitAllegianceAction');
const RemoveAction = require('app/sdk/actions/removeAction');
const PlayerModifierEmblemSummonWatchVanarTokenQuest = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatchVanarTokenQuest');
const ModifierQuestStatusVanar = require('./modifierQuestStatusVanar');

const i18next = require('i18next');

class ModifierFateVanarTokenQuest extends ModifierFate {
  static initClass() {
  
    this.prototype.type ="ModifierFateVanarTokenQuest";
    this.type ="ModifierFateVanarTokenQuest";
  
    this.prototype.numTokensRequired = 1;
    this.prototype.numTokensFound = 0;
  }

  static createContextObject(numTokensRequired, options) {
    const contextObject = super.createContextObject(options);
    contextObject.numTokensRequired = numTokensRequired;
    return contextObject;
  }

  onActivate() {
    const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    this.numTokensFound = this.getTokenCount();
    if (((general != null) && general.hasActiveModifierClass(PlayerModifierEmblemSummonWatchVanarTokenQuest)) || (this.numTokensFound >= this.numTokensRequired)) {
      this._private.fateFulfilled = true;
      this.unlockFateCard();
      if (!general.hasActiveModifierClass(ModifierQuestStatusVanar)) {
        return this.applyQuestStatusModifier(true);
      }
    } else {
      if (!general.hasActiveModifierClass(ModifierQuestStatusVanar)) {
        return this.applyQuestStatusModifier(false);
      }
    }
  }

  updateFateCondition(action) {
    if (this.getIsActionRelevant(action)) {
      this.removeQuestStatusModifier();
      this.numTokensFound = this.getTokenCount();
      if (this.numTokensFound >= this.numTokensRequired) {
        this._private.fateFulfilled = true;
        super.updateFateCondition();
        const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
        return this.applyQuestStatusModifier(true);
      } else {
        return this.applyQuestStatusModifier(false);
      }
    }
  }

  getTokenCount(action) {

    const uniqueTokenIds = [];
    let numTokensFound = 0;
    let foundBuildingToken = false;
    const units = this.getGameSession().getBoard().getFriendlyEntitiesForEntity(this.getCard(), CardType.Unit);
    for (var unit of Array.from(units)) {
      if ((unit != null) && !unit.getIsGeneral() && (unit.getRarityId() === Rarity.TokenUnit)) {
        var unitId = unit.getBaseCardId();
        var tokenAlreadyCounted = false;
        for (var tokenId of Array.from(uniqueTokenIds)) {
          if (unitId === tokenId) {
            tokenAlreadyCounted = true;
            break;
          }
        }
        if (!tokenAlreadyCounted) {
          if (this.unitIsABuildingToken(unitId)) {
            foundBuildingToken = true;
          } else {
            uniqueTokenIds.push(unitId);
          }
          numTokensFound = uniqueTokenIds.length;
          if (foundBuildingToken) {
            numTokensFound++;
          }
        }
      }
    }
    return numTokensFound;
  }

  unitIsABuildingToken(unitId) {
    return (unitId === Cards.Faction1.VigilatorBuilding) ||
    (unitId === Cards.Faction1.MonumentBuilding) ||
    (unitId === Cards.Faction2.ManakiteBuilding) ||
    (unitId === Cards.Faction2.PenumbraxxBuilding) ||
    (unitId === Cards.Faction3.ShrikeBuilding) ||
    (unitId === Cards.Faction3.SimulacraBuilding) ||
    (unitId === Cards.Faction4.VoidTalonBuilding) ||
    (unitId === Cards.Faction4.GateBuilding) ||
    (unitId === Cards.Faction5.HulkBuilding) ||
    (unitId === Cards.Faction5.GigalothBuilding) ||
    (unitId === Cards.Faction6.ProtosensorBuilding) ||
    (unitId === Cards.Faction6.EyolithBuilding) ||
    (unitId === Cards.Neutral.RescueRXBuilding) ||
    (unitId === Cards.Neutral.ArchitectBuilding);
  }

  getIsActionRelevant(action) {
    if (action instanceof ApplyCardToBoardAction || action instanceof CloneEntityAction || action instanceof SwapUnitAllegianceAction || action instanceof RemoveAction) {
      return true;
    }
    return false;
  }

  removeQuestStatusModifier() {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    if (general.hasActiveModifierClass(ModifierQuestStatusVanar)) {
      return Array.from(general.getModifiersByClass(ModifierQuestStatusVanar)).map((mod) =>
        this.getGameSession().removeModifier(mod));
    }
  }

  applyQuestStatusModifier(questCompleted) {
    const general = this.getGameSession().getGeneralForPlayerId(this.getCard().getOwnerId());
    const countModifier = ModifierQuestStatusVanar.createContextObject(questCompleted, this.numTokensFound);
    return this.getGameSession().applyModifierContextObject(countModifier, general);
  }
}
ModifierFateVanarTokenQuest.initClass();

module.exports = ModifierFateVanarTokenQuest;
