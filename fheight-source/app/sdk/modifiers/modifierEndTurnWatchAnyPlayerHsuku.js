/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const ModifierEndTurnWatchAnyPlayer = require('./modifierEndTurnWatchAnyPlayer');
const ModifierFrenzy = require('./modifierFrenzy');
const ModifierTranscendance = require('./modifierTranscendance');
const ModifierFlying = require('./modifierFlying');
const ModifierProvoke = require('./modifierProvoke');
const Modifier = require('./modifier');

class ModifierEndTurnWatchAnyPlayerHsuku extends ModifierEndTurnWatchAnyPlayer {
  static initClass() {
  
    this.prototype.type ="ModifierEndTurnWatchAnyPlayerHsuku";
    this.type ="ModifierEndTurnWatchAnyPlayerHsuku";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierGenericBuff"];
  
    this.prototype.possibleBuffs = null;
    this.prototype.possibleAbilities = null;
    this.prototype.buffName = null;
  }

  static createContextObject(buffName, options) {
    const contextObject = super.createContextObject(options);
    contextObject.buffName = buffName;
    contextObject.possibleBuffs = [
      Modifier.createContextObjectWithAttributeBuffs(2,0),
      Modifier.createContextObjectWithAttributeBuffs(1,1),
      Modifier.createContextObjectWithAttributeBuffs(0,2)
    ];
    contextObject.possibleAbilities = [
      ModifierFrenzy.createContextObject(),
      ModifierTranscendance.createContextObject(),
      ModifierProvoke.createContextObject(),
      ModifierFlying.createContextObject()
    ];
    return contextObject;
  }

  onTurnWatch() {
    super.onTurnWatch();

    if (this.getGameSession().getIsRunningAsAuthoritative()) {

      const general = this.getCard().getGameSession().getGeneralForPlayerId(this.getGameSession().getCurrentPlayer().getPlayerId());
      const friendlyUnits = this.getGameSession().getBoard().getFriendlyEntitiesForEntity(general);
      if (friendlyUnits != null) {
        const possibleMinions = [];
        for (var minion of Array.from(friendlyUnits)) {
          if (minion && !(minion === this.getCard())) {
            possibleMinions.push(minion);
          }
        }
        if (possibleMinions.length > 0) {
          const minionToBuff = possibleMinions[this.getGameSession().getRandomIntegerForExecution(possibleMinions.length)];
          const statBuff = this.possibleBuffs[this.getGameSession().getRandomIntegerForExecution(this.possibleBuffs.length)];
          statBuff.appliedName = this.buffName;
          const ability = this.possibleAbilities[this.getGameSession().getRandomIntegerForExecution(this.possibleAbilities.length)];
          this.getGameSession().applyModifierContextObject(statBuff, minionToBuff);
          return this.getGameSession().applyModifierContextObject(ability, minionToBuff);
        }
      }
    }
  }
}
ModifierEndTurnWatchAnyPlayerHsuku.initClass();

module.exports = ModifierEndTurnWatchAnyPlayerHsuku;
