/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const DieAction = require('app/sdk/actions/dieAction');
const DamageAction = require('app/sdk/actions/damageAction');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const PlayCardSilentlyAction = require('app/sdk/actions/playCardSilentlyAction');
const PlayCardAction = require('app/sdk/actions/playCardAction');
const KillAction = require('app/sdk/actions/killAction');
const SwapGeneralAction = require('app/sdk/actions/swapGeneralAction');
const UtilsGameSession = require('app/common/utils/utils_game_session');
const CONFIG = require('app/common/config');

class ModifierDieSpawnNewGeneral extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierDieSpawnNewGeneral";
    this.type ="ModifierDieSpawnNewGeneral";
  
    this.modifierName ="Die Spawn New General";
    this.description = "When this reaches low HP, watch out!";
  
    this.prototype.activeInDeck = false;
    this.prototype.activeInHand = false;
    this.prototype.activeInSignatureCards = false;
    this.prototype.activeOnBoard = true;
  
    this.prototype.maxStacks = 1;
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierSecondWind"];
  }

  static createContextObject(cardDataOrIndexToSpawn, spawnDescription, spawnCount, spawnPattern, spawnSilently, options) {
    if (spawnDescription == null) { spawnDescription = ""; }
    if (spawnCount == null) { spawnCount = 1; }
    if (spawnPattern == null) { spawnPattern = CONFIG.PATTERN_3x3; }
    if (spawnSilently == null) { spawnSilently = false; }
    const contextObject = super.createContextObject(options);
    contextObject.cardDataOrIndexToSpawn = cardDataOrIndexToSpawn;
    contextObject.spawnDescription = spawnDescription;
    contextObject.spawnCount = spawnCount;
    contextObject.spawnPattern = spawnPattern;
    contextObject.spawnSilently = spawnSilently;
    return contextObject;
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.summonNewGeneralAtActionIndex = -1; // index of action triggering second wind

    return p;
  }

  onAfterCleanupAction(event) {
    super.onAfterCleanupAction(event);

    const {
      action
    } = event;

    if (this.getGameSession().getIsRunningAsAuthoritative() && (this._private.summonNewGeneralAtActionIndex === action.getIndex())) {
      // after cleaning up action, trigger second wind
      return this.onSummonNewGeneral(action);
    }
  }

  onValidateAction(event) {
    super.onValidateAction(event);

    const {
      action
    } = event;

    // when our entity would die, invalidate the action until second wind executes
    if (action instanceof DieAction && (action.getTarget() === this.getCard()) && action.getParentAction() instanceof DamageAction) {
      // record index of parent action of die action, so we know when to trigger second wind
      this._private.summonNewGeneralAtActionIndex = action.getParentAction().getIndex();
      return this.invalidateAction(action, this.getCard().getPosition(), this.getCard().getName() + " combines to form D3cepticle!");
    }
  }

  getCardDataOrIndexToSpawn() {
    return this.cardDataOrIndexToSpawn;
  }

  onSummonNewGeneral(action) {
    // silence self to remove all existing buffs/debuffs
    // set this modifier as not removable until we complete second wind
    let spawnAction;
    this.isRemovable = false;
    this.getCard().silence();

    const card = this.getCard();

    // summon the new unit
    const ownerId = this.getCard().getOwnerId();
    const spawnPositions = UtilsGameSession.getRandomNonConflictingSmartSpawnPositionsForModifier(this, ModifierDieSpawnNewGeneral);
    for (var spawnPosition of Array.from(spawnPositions)) {
      var cardDataOrIndexToSpawn = this.getCardDataOrIndexToSpawn();
      if (this.spawnSilently) {
        spawnAction = new PlayCardSilentlyAction(this.getGameSession(), ownerId, spawnPosition.x, spawnPosition.y, cardDataOrIndexToSpawn);
      } else {
        spawnAction = new PlayCardAction(this.getGameSession(), ownerId, spawnPosition.x, spawnPosition.y, cardDataOrIndexToSpawn);
      }
      spawnAction.setSource(this.getCard());
      this.getGameSession().executeAction(spawnAction);
    }

    // make sure to remove self to prevent triggering this modifier again
    this.getGameSession().removeModifier(this);

    // turn the new unit into your general
    if ((spawnAction != null) && card.getIsGeneral()) {
      const oldGeneral = this.getGameSession().getGeneralForPlayerId(card.getOwnerId());
      const newGeneral = spawnAction.getCard();
      const swapGeneralAction = new SwapGeneralAction(this.getGameSession());
      swapGeneralAction.setIsDepthFirst(false);
      swapGeneralAction.setSource(oldGeneral);
      swapGeneralAction.setTarget(newGeneral);
      this.getGameSession().executeAction(swapGeneralAction);
    }

    // kill the old unit
    const dieAction = new DieAction(this.getGameSession());
    dieAction.setOwnerId(card.getOwnerId());
    dieAction.setTarget(card);
    return this.getGameSession().executeAction(dieAction);
  }
}
ModifierDieSpawnNewGeneral.initClass();

module.exports = ModifierDieSpawnNewGeneral;
