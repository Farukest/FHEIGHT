/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const Action = require('./action');
const DamageAction = require('./damageAction');
const DamageAsAttackAction = require('./damageAsAttackAction');
const AttackAction = require('./attackAction');
const DieAction = require('./dieAction');
const MoveAction = require('./moveAction');
const ApplyCardToBoardAction = require('./applyCardToBoardAction');
const PlayCardAction = require('./playCardAction');
const PlayCardSilentlyAction = require('./playCardSilentlyAction');
const PlayCardAsTransformAction = require('./playCardAsTransformAction');
const PlayCardFromHandAction = require('./playCardFromHandAction');
const PlaySignatureCardAction = require('./playSignatureCardAction');
const CloneEntityAction = require('./cloneEntityAction');
const CloneEntityAsTransformAction = require('./cloneEntityAsTransformAction');
const ReplaceCardFromHandAction = require('./replaceCardFromHandAction');
const TeleportAction = require('./teleportAction');
const SwapUnitsAction = require('./swapUnitsAction');
const RemoveAction = require('./removeAction');
const HealAction = require('./healAction');
const RefreshExhaustionAction = require('./refreshExhaustionAction');
const SwapGeneralAction =   require('./swapGeneralAction');
const SwapUnitAllegianceAction =   require('./swapUnitAllegianceAction');
const DrawStartingHandAction =   require('./drawStartingHandAction');
const ResignAction = require('./resignAction');
const StartTurnAction = require('./startTurnAction');
const EndTurnAction = require('./endTurnAction');
const BonusManaAction = require('./bonusManaAction');
const StopBufferingEventsAction = require('./stopBufferingEventsAction');
const EndFollowupAction = require('./endFollowupAction');
const PutCardInHandAction = require('./putCardInHandAction');
const RefreshArtifactChargesAction = require('./refreshArtifactChargesAction');
const ApplyExhaustionAction = require('./applyExhaustionAction');
const RemoveArtifactsAction = require('./removeArtifactsAction');
const RemoveRandomArtifactAction = require('./removeRandomArtifactAction');
const KillAction = require('./killAction');
const DrawCardAction = require('./drawCardAction');
const GenerateSignatureCardAction = require('./generateSignatureCardAction');
const RollbackToSnapshotAction = require('./rollbackToSnapshotAction');
const PutCardInDeckAction = require('./putCardInDeckAction');
const TakeAnotherTurnAction = require('./takeAnotherTurnAction');
const SetExhaustionAction = require('./setExhaustionAction');
const BonusManaCoreAction = require('./bonusManaCoreAction');
const RemoveCardFromHandAction = require('./removeCardFromHandAction');
const TrueDamageAction = require('./trueDamageAction');
const HurtingDamageAction = require('./hurtingDamageAction');
const TeleportInFrontOfUnitAction = require('./teleportInFrontOfUnitAction');
const RandomTeleportAction = require('./randomTeleportAction');
const RandomDamageAction = require('./randomDamageAction');
const DrawToXCardsAction = require('./drawToXCardsAction');
const ApplyModifierAction = require('./applyModifierAction');
const RemoveModifierAction = require('./removeModifierAction');
const RemoveCardFromDeckAction = require('./removeCardFromDeckAction');
const RandomPlayCardSilentlyAction = require('./randomPlayCardSilentlyAction');
const ActivateSignatureCardAction = require('./activateSignatureCardAction');
const TeleportBehindUnitAction = require('./teleportBehindUnitAction');
const RevealHiddenCardAction = require('./revealHiddenCardAction');
const SetDamageAction = require('./setDamageAction');
const RestoreManaAction = require('./restoreManaAction');
const FightAction = require('./fightAction');
const RemoveManaCoreAction = require('./removeManaCoreAction');
const ForcedAttackAction = require('./forcedAttackAction');
const RestoreChargeToAllArtifactsAction = require('./restoreChargeToAllArtifactsAction');
const BurnCardAction = require('./burnCardAction');

const Colors = require('colors'); // used for console message coloring

class ActionFactory {

  static actionForType(actionType,gameSession) {
    if (actionType === Action.type) {
      return new Action(gameSession);
    }
    if (actionType === ApplyModifierAction.type) {
      return new ApplyModifierAction(gameSession);
    }
    if (actionType === RemoveModifierAction.type) {
      return new RemoveModifierAction(gameSession);
    }
    if (actionType === DamageAction.type) {
      return new DamageAction(gameSession);
    }
    if (actionType === AttackAction.type) {
      return new AttackAction(gameSession);
    }
    if (actionType === DieAction.type) {
      return new DieAction(gameSession);
    }
    if (actionType === MoveAction.type) {
      return new MoveAction(gameSession);
    }
    if (actionType === ApplyCardToBoardAction.type) {
      return new ApplyCardToBoardAction(gameSession);
    }
    if (actionType === PlayCardAction.type) {
      return new PlayCardAction(gameSession);
    }
    if (actionType === PlayCardFromHandAction.type) {
      return new PlayCardFromHandAction(gameSession);
    }
    if (actionType === PlaySignatureCardAction.type) {
      return new PlaySignatureCardAction(gameSession);
    }
    if (actionType === PlayCardSilentlyAction.type) {
      return new PlayCardSilentlyAction(gameSession);
    }
    if (actionType === PlayCardAsTransformAction.type) {
      return new PlayCardAsTransformAction(gameSession);
    }
    if (actionType === CloneEntityAction.type) {
      return new CloneEntityAction(gameSession);
    }
    if (actionType === CloneEntityAsTransformAction.type) {
      return new CloneEntityAsTransformAction(gameSession);
    }
    if (actionType === ReplaceCardFromHandAction.type) {
      return new ReplaceCardFromHandAction(gameSession);
    }
    if (actionType === TeleportAction.type) {
      return new TeleportAction(gameSession);
    }
    if (actionType === SwapUnitsAction.type) {
      return new SwapUnitsAction(gameSession);
    }
    if (actionType === RemoveAction.type) {
      return new RemoveAction(gameSession);
    }
    if (actionType === HealAction.type) {
      return new HealAction(gameSession);
    }
    if (actionType === RefreshExhaustionAction.type) {
      return new RefreshExhaustionAction(gameSession);
    }
    if (actionType === SwapUnitAllegianceAction.type) {
      return new SwapUnitAllegianceAction(gameSession);
    }
    if (actionType === SwapGeneralAction.type) {
      return new SwapGeneralAction(gameSession);
    }
    if (actionType === DrawStartingHandAction.type) {
      return new DrawStartingHandAction(gameSession);
    }
    if (actionType === ResignAction.type) {
      return new ResignAction(gameSession);
    }
    if (actionType === StartTurnAction.type) {
      return new StartTurnAction(gameSession);
    }
    if (actionType === EndTurnAction.type) {
      return new EndTurnAction(gameSession);
    }
    if (actionType === BonusManaAction.type) {
      return new BonusManaAction(gameSession);
    }
    if (actionType === StopBufferingEventsAction.type) {
      return new StopBufferingEventsAction(gameSession);
    }
    if (actionType === EndFollowupAction.type) {
      return new EndFollowupAction(gameSession);
    }
    if (actionType === PutCardInHandAction.type) {
      return new PutCardInHandAction(gameSession);
    }
    if (actionType === RefreshArtifactChargesAction.type) {
      return new RefreshArtifactChargesAction(gameSession);
    }
    if (actionType === ApplyExhaustionAction.type) {
      return new ApplyExhaustionAction(gameSession);
    }
    if (actionType === RemoveArtifactsAction.type) {
      return new RemoveArtifactsAction(gameSession);
    }
    if (actionType === RemoveRandomArtifactAction.type) {
      return new RemoveRandomArtifactAction(gameSession);
    }
    if (actionType === KillAction.type) {
      return new KillAction(gameSession);
    }
    if (actionType === DrawCardAction.type) {
      return new DrawCardAction(gameSession);
    }
    if (actionType === GenerateSignatureCardAction.type) {
      return new GenerateSignatureCardAction(gameSession);
    }
    if (actionType === RollbackToSnapshotAction.type) {
      return new RollbackToSnapshotAction(gameSession);
    }
    if (actionType === PutCardInDeckAction.type) {
      return new PutCardInDeckAction(gameSession);
    }
    if (actionType === TakeAnotherTurnAction.type) {
      return new TakeAnotherTurnAction(gameSession);
    }
    if (actionType === SetExhaustionAction.type) {
      return new SetExhaustionAction(gameSession);
    }
    if (actionType === BonusManaCoreAction.type) {
      return new BonusManaCoreAction(gameSession);
    }
    if (actionType === RemoveCardFromHandAction.type) {
      return new RemoveCardFromHandAction(gameSession);
    }
    if (actionType === TrueDamageAction.type) {
      return new TrueDamageAction(gameSession);
    }
    if (actionType === HurtingDamageAction.type) {
      return new HurtingDamageAction(gameSession);
    }
    if (actionType === TeleportInFrontOfUnitAction.type) {
      return new TeleportInFrontOfUnitAction(gameSession);
    }
    if (actionType === RandomTeleportAction.type) {
      return new RandomTeleportAction(gameSession);
    }
    if (actionType === RandomDamageAction.type) {
      return new RandomDamageAction(gameSession);
    }
    if (actionType === DamageAsAttackAction.type) {
      return new DamageAsAttackAction(gameSession);
    }
    if (actionType === DrawToXCardsAction.type) {
      return new DrawToXCardsAction(gameSession);
    }
    if (actionType === RemoveCardFromDeckAction.type) {
      return new RemoveCardFromDeckAction(gameSession);
    }
    if (actionType === RandomPlayCardSilentlyAction.type) {
      return new RandomPlayCardSilentlyAction(gameSession);
    }
    if (actionType === ActivateSignatureCardAction.type) {
      return new ActivateSignatureCardAction(gameSession);
    }
    if (actionType === TeleportBehindUnitAction.type) {
      return new TeleportBehindUnitAction(gameSession);
    }
    if (actionType === RevealHiddenCardAction.type) {
      return new RevealHiddenCardAction(gameSession);
    }
    if (actionType === SetDamageAction.type) {
      return new SetDamageAction(gameSession);
    }
    if (actionType === RestoreManaAction.type) {
      return new RestoreManaAction(gameSession);
    }
    if (actionType === FightAction.type) {
      return new FightAction(gameSession);
    }
    if (actionType === RemoveManaCoreAction.type) {
      return new RemoveManaCoreAction(gameSession);
    }
    if (actionType === ForcedAttackAction.type) {
      return new ForcedAttackAction(gameSession);
    }
    if (actionType === RestoreChargeToAllArtifactsAction.type) {
      return new RestoreChargeToAllArtifactsAction(gameSession);
    }
    if (actionType === BurnCardAction.type) {
      return new BurnCardAction(gameSession);
    }

    Logger.module("SDK").debug(`[G:${gameSession.gameId}]`, "Error: ActionFactory:actionForType - Unknown Action Type: " + actionType);
    return console.error(`ActionFactory:actionForType - Unknown Action Type: ${actionType}`.red);
  }
}

module.exports = ActionFactory;
