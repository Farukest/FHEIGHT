/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =           require('./modifier');
const ModifierDestructible = require('./modifierDestructible');
const ModifierRanged = require('./modifierRanged');
const ModifierSilence =       require('./modifierSilence');
const ModifierBanded =     require('./modifierBanded');
const ModifierBandedHeal =     require('./modifierBandedHeal');
const ModifierBandedRanged =     require('./modifierBandedRanged');
const ModifierObstructing = require('./modifierObstructing');
const ModifierUntargetable = require('./modifierUntargetable');
const ModifierStackingShadows = require('./modifierStackingShadows');
const ModifierProvoked = require('./modifierProvoked');
const ModifierAttackEqualsHealth = require('./modifierAttackEqualsHealth');
const ModifierManaCostChange = require('./modifierManaCostChange');
const ModifierPortal = require('./modifierPortal');
const ModifierImmune = require('./modifierImmune');
const ModifierImmuneToAttacks = require('./modifierImmuneToAttacks');
const ModifierImmuneToAttacksByGeneral = require('./modifierImmuneToAttacksByGeneral');
const ModifierImmuneToAttacksByRanged = require('./modifierImmuneToAttacksByRanged');
const ModifierImmuneToDamage =   require('./modifierImmuneToDamage');
const ModifierImmuneToDamageByGeneral =   require('./modifierImmuneToDamageByGeneral');
const ModifierImmuneToDamageByRanged =   require('./modifierImmuneToDamageByRanged');
const ModifierImmuneToDamageBySpells = require('./modifierImmuneToDamageBySpells');
const ModifierImmuneToSpellsByEnemy = require('./modifierImmuneToSpellsByEnemy');
const ModifierImmuneToSpells = require('./modifierImmuneToSpells');
const ModifierFirstBlood =     require('./modifierFirstBlood');
const ModifierProvoke =       require('./modifierProvoke');
const ModifierSituationalBuffSelf =     require('./modifierSituationalBuffSelf');
const ModifierBanding =   require('./modifierBanding');
const ModifierBandingAttack =   require('./modifierBandingAttack');
const ModifierBandingAttackAndHealth = require('./modifierBandingAttackAndHealth');
const ModifierBandingHeal =     require('./modifierBandingHeal');
const ModifierBandingRanged =     require('./modifierBandingRanged');
const ModifierAirdrop =       require('./modifierAirdrop');
const ModifierStrikeback =     require('./modifierStrikeback');
const ModifierFrenzy =     require('./modifierFrenzy');
const ModifierOpeningGambit =     require('./modifierOpeningGambit');
const ModifierOpeningGambitDispel = require('./modifierOpeningGambitDispel');
const ModifierOpeningGambitDamageMyGeneral = require('./modifierOpeningGambitDamageMyGeneral');
const ModifierOpeningGambitDamageBothGenerals = require('./modifierOpeningGambitDamageBothGenerals');
const ModifierOpeningGambitDamageNearby = require('./modifierOpeningGambitDamageNearby');
const ModifierDeathWatch = require('./modifierDeathWatch');
const ModifierDeathWatchBuffSelf = require('./modifierDeathWatchBuffSelf');
const ModifierDeathWatchDamageEnemyGeneralHealMyGeneral = require('./modifierDeathWatchDamageEnemyGeneralHealMyGeneral');
const ModifierFlying = require('./modifierFlying');
const ModifierOpeningGambitSpawnEntity = require('./modifierOpeningGambitSpawnEntity');
const ModifierDeathWatchSpawnEntity = require('./modifierDeathWatchSpawnEntity');
const ModifierOpeningGambitSacrificeNearbyBuffSelf = require('./modifierOpeningGambitSacrificeNearbyBuffSelf');
const ModifierKillWatchSpawnEntity = require('./modifierKillWatchSpawnEntity');
const ModifierDyingWishBonusMana = require('./modifierDyingWishBonusMana');
const ModifierDyingWishDrawCard = require('./modifierDyingWishDrawCard');
const ModifierDyingWishSpawnEntity = require('./modifierDyingWishSpawnEntity');
const ModifierCollectableBonusMana = require('./modifierCollectableBonusMana');
const ModifierSpellWatchSpawnEntity = require('./modifierSpellWatchSpawnEntity');
const ModifierSpellWatch = require('./modifierSpellWatch');
const ModifierSpellWatchDamageGeneral = require('./modifierSpellWatchDamageGeneral');
const ModifierOpeningGambitRetrieveMostRecentSpell = require('./modifierOpeningGambitRetrieveMostRecentSpell');
const ModifierOpeningGambitRetrieveRandomSpell = require('./modifierOpeningGambitRetrieveRandomSpell');
const ModifierDispelOnAttack = require('./modifierDispelOnAttack');
const ModifierSummonWatchHealSelf = require('./modifierSummonWatchHealSelf');
const ModifierDamageGeneralOnAttack = require('./modifierDamageGeneralOnAttack');
const ModifierStartTurnWatchSpawnEntity = require('./modifierStartTurnWatchSpawnEntity');
const ModifierStartTurnWatchDamageMyGeneral = require('./modifierStartTurnWatchDamageMyGeneral');
const ModifierBlastAttack = require('./modifierBlastAttack');
const ModifierBlastAttackStrong = require('./modifierBlastAttackStrong');
const ModifierBackstab = require('./modifierBackstab');
const ModifierTranscendance = require('./modifierTranscendance');
const ModifierMyAttackWatch = require('./modifierMyAttackWatch');
const ModifierMyAttackWatchBuffSelf = require('./modifierMyAttackWatchBuffSelf');
const ModifierDyingWishDamageGeneral = require('./modifierDyingWishDamageGeneral');
const ModifierDyingWishDamageEnemyGeneralHealGeneral = require('./modifierDyingWishDamageEnemyGeneralHealGeneral');
const ModifierOpeningGambitRefreshArtifacts = require('./modifierOpeningGambitRefreshArtifacts');
const ModifierDealDamageWatchKillTargetAndSelf = require('./modifierDealDamageWatchKillTargetAndSelf');
const ModifierDealDamageWatchKillTarget = require('./modifierDealDamageWatchKillTarget');
const ModifierSpellWatchBloodLeech = require('./modifierSpellWatchBloodLeech');
const ModifierSummonWatchPutCardInHand = require('./modifierSummonWatchPutCardInHand');
const ModifierSpellWatchBuffAlliesByRace = require('./modifierSpellWatchBuffAlliesByRace');
const ModifierCardControlledPlayerModifiers = require('./modifierCardControlledPlayerModifiers');
const ModifierOpeningGambitApplyModifiers = require('./modifierOpeningGambitApplyModifiers');
const ModifierOpeningGambitApplyModifiersToDeck = require('./modifierOpeningGambitApplyModifiersToDeck');
const ModifierOpeningGambitApplyPlayerModifier = require('./modifierOpeningGambitApplyPlayerModifiers');
const ModifierOpeningGambitApplyMechazorPlayerModifiers = require('./modifierOpeningGambitApplyMechazorPlayerModifiers');
const ModifierRangedProvoked = require('./modifierRangedProvoked');
const ModifierRangedProvoke = require('./modifierRangedProvoke');
const ModifierDealDamageWatchModifyTarget = require('./modifierDealDamageWatchModifyTarget');
const ModifierDyingWishSpawnEntityAnywhere = require('./modifierDyingWishSpawnEntityAnywhere');
const ModifierStartTurnWatchDamageEnemyGeneralBuffSelf = require('./modifierStartTurnWatchDamageEnemyGeneralBuffSelf');
const ModifierStunned = require('./modifierStunned');
const ModifierGrow = require('./modifierGrow');
const ModifierRebirth = require('./modifierRebirth');
const ModifierEgg = require('./modifierEgg');
const ModifierEndTurnWatchSpawnEgg = require('./modifierEndTurnWatchSpawnEgg');
const ModifierEndTurnWatchSpawnEntity = require('./modifierEndTurnWatchSpawnEntity');
const ModifierEndTurnWatchDamageAllMinions = require('./modifierEndTurnWatchDamageAllMinions');
const ModifierForcefield = require('./modifierForcefield');
const ModifierAntiMagicField = require('./modifierAntiMagicField');
const ModifierDyingWishApplyModifiers = require('./modifierDyingWishApplyModifiers');
const ModifierOpeningGambitDamageInFront = require('./modifierOpeningGambitDamageInFront');
const ModifierMyGeneralDamagedWatch = require('./modifierMyGeneralDamagedWatch');
const ModifierMyGeneralDamagedWatchBuffSelf = require('./modifierMyGeneralDamagedWatchBuffSelf');
const ModifierMyGeneralDamagedWatchHealSelf = require('./modifierMyGeneralDamagedWatchHealSelf');
const ModifierMyGeneralDamagedWatchDamageNearby = require('./modifierMyGeneralDamagedWatchDamageNearby');
const ModifierSummonWatchByEntityBuffSelf = require('./modifierSummonWatchByEntityBuffSelf');
const ModifierStartTurnWatchSummonDervish = require('./modifierStartTurnWatchSummonDervish');
const ModifierEphemeral = require('./modifierEphemeral');
const ModifierInfiltrate = require('./modifierInfiltrate');
const ModifierCannot = require('./modifierCannot');
const ModifierCannotAttackGeneral = require('./modifierCannotAttackGeneral');
const ModifierCannotStrikeback = require('./modifierCannotStrikeback');
const ModifierSummonWatchByRaceBuffSelf = require('./modifierSummonWatchByRaceBuffSelf');
const ModifierSummonWatchSpawnEntity = require('./modifierSummonWatchSpawnEntity');
const ModifierTakeDamageWatch = require('./modifierTakeDamageWatch');
const ModifierTakeDamageWatchHealMyGeneral = require('./modifierTakeDamageWatchHealMyGeneral');
const ModifierStartTurnWatchDamageRandom = require('./modifierStartTurnWatchDamageRandom');
const ModifierSummonWatchByRaceDamageEnemyMinion = require('./modifierSummonWatchByRaceDamageEnemyMinion');
const ModifierEndTurnWatch = require('./modifierEndTurnWatch');
const ModifierEndTurnWatchDamageNearbyEnemy = require('./modifierEndTurnWatchDamageNearbyEnemy');
const ModifierBandingDoubleAttack = require('./modifierBandingDoubleAttack');
const ModifierBandedDoubleAttack = require('./modifierBandedDoubleAttack');
const ModifierOpeningGambitHealMyGeneral = require('./modifierOpeningGambitHealMyGeneral');
const ModifierDoubleDamageToMinions = require('./modifierDoubleDamageToMinions');
const ModifierOpeningGambitBuffSelfByShadowTileCount = require('./modifierOpeningGambitBuffSelfByShadowTileCount');
const ModifierDealDamageWatchHealMyGeneral = require('./modifierDealDamageWatchHealMyGeneral');
const ModifierOpponentSummonWatch = require('./modifierOpponentSummonWatch');
const ModifierOpponentSummonWatchBuffSelf = require('./modifierOpponentSummonWatchBuffSelf');
const ModifierStartTurnWatchBounceToActionBar = require('./modifierStartTurnWatchBounceToActionBar');
const ModifierTakeDamageWatchDamageEnemy = require('./modifierTakeDamageWatchDamageEnemy');
const ModifierOpeningGambitDamageNearbyMinions = require('./modifierOpeningGambitDamageNearbyMinions');
const ModifierDestroyAtEndOfTurn = require('./modifierDestroyAtEndOfTurn');
const ModifierMyMinionOrGeneralDamagedWatch = require('./modifierMyMinionOrGeneralDamagedWatch');
const ModifierMyMinionOrGeneralDamagedWatchBuffSelf = require('./modifierMyMinionOrGeneralDamagedWatchBuffSelf');
const ModifierAbsorbDamage = require('./modifierAbsorbDamage');
const ModifierDyingWishSpawnUnitFromOpponentsDeck = require('./modifierDyingWishSpawnUnitFromOpponentsDeck');
const ModifierTransformed = require('./modifierTransformed');
const ModifierStunWhenAttacked = require('./modifierStunWhenAttacked');
const ModifierWall = require('./modifierWall');
const ModifierOpeningGambitSpawnCopiesOfEntityAnywhere = require('./modifierOpeningGambitSpawnCopiesOfEntityAnywhere');
const ModifierSummonWatchBuffSelf = require('./modifierSummonWatchBuffSelf');
const ModifierOpponentSummonWatchDamageEnemyGeneral = require('./modifierOpponentSummonWatchDamageEnemyGeneral');
const ModifierDyingWishEquipArtifactFromDeck = require('./modifierDyingWishEquipArtifactFromDeck');
const ModifierOpeningGambitDrawArtifactFromDeck = require('./modifierOpeningGambitDrawArtifactFromDeck');
const ModifierSummonWatchApplyModifiers = require('./modifierSummonWatchApplyModifiers');
const ModifierSummonWatchNearbyApplyModifiers = require('./modifierSummonWatchNearbyApplyModifiers');
const ModifierTakeDamageWatchRandomTeleport = require('./modifierTakeDamageWatchRandomTeleport');
const ModifierOpeningGambitSpawnEntityInEachCorner = require('./modifierOpeningGambitSpawnEntityInEachCorner');
const ModifierDyingWishBonusManaCrystal = require('./modifierDyingWishBonusManaCrystal');
const ModifierOpeningGambitMindwarp = require('./modifierOpeningGambitMindwarp');
const ModifierReduceCostOfMinionsAndDamageThem = require('./modifierReduceCostOfMinionsAndDamageThem');
const ModifierStunnedVanar = require('./modifierStunnedVanar');
const ModifierEndTurnWatchSpawnRandomEntity = require('./modifierEndTurnWatchSpawnRandomEntity');
const ModifierDealDamageWatchSpawnEntity = require('./modifierDealDamageWatchSpawnEntity');
const ModifierSpellDamageWatch = require('./modifierSpellDamageWatch');
const ModifierSpellDamageWatchPutCardInHand = require('./modifierSpellDamageWatchPutCardInHand');
const ModifierOpeningGambitRemoveRandomArtifact = require('./modifierOpeningGambitRemoveRandomArtifact');
const ModifierEndTurnWatchHealNearby = require('./modifierEndTurnWatchHealNearby');
const ModifierDealDamageWatchTeleportToMe = require('./modifierDealDamageWatchTeleportToMe');
const ModifierWraithlingFury = require('./modifierWraithlingFury');
const ModifierOpeningGambitRazorback = require('./modifierOpeningGambitRazorback');
const ModifierDyingWishSpawnEntityNearbyGeneral = require('./modifierDyingWishSpawnEntityNearbyGeneral');
const ModifierSummonWatchFromActionBarSpawnEntity = require('./modifierSummonWatchFromActionBarSpawnEntity');
const ModifierOpeningGambitBuffSelfByOpponentHandCount = require('./modifierOpeningGambitBuffSelfByOpponentHandCount');
const ModifierTakeDamageWatchDamageEnemyGeneralForSame = require('./modifierTakeDamageWatchDamageEnemyGeneralForSame');
const ModifierDealDamageWatchBuffSelf = require('./modifierDealDamageWatchBuffSelf');
const ModifierDyingWishDamageNearbyAllies = require('./modifierDyingWishDamageNearbyAllies');
const ModifierKillWatchHealSelf = require('./modifierKillWatchHealSelf');
const ModifierBandingDealDamageWatchDrawCard = require('./modifierBandingDealDamageWatchDrawCard');
const ModifierDealDamageWatchDrawCard = require('./modifierDealDamageWatchDrawCard');
const ModifierStartTurnWatchSwapStats = require('./modifierStartTurnWatchSwapStats');
const ModifierHealSelfWhenDealingDamage = require('./modifierHealSelfWhenDealingDamage');
const ModifierDealDamageWatchHealorDamageGeneral = require('./modifierDealDamageWatchHealorDamageGeneral');
const ModifierDyingWishPutCardInHand = require('./modifierDyingWishPutCardInHand');
const ModifierDyingWishPutCardInHandClean = require('./modifierDyingWishPutCardInHandClean');
const ModifierOpeningGambitLifeGive = require('./modifierOpeningGambitLifeGive');
const ModifierOpeningGambitTeleportAllNearby = require('./modifierOpeningGambitTeleportAllNearby');
const ModifierRook = require('./modifierRook');
const ModifierEndTurnWatchHealSelfAndGeneral = require('./modifierEndTurnWatchHealSelfAndGeneral');
const ModifierEndTurnWatchHealSelf = require('./modifierEndTurnWatchHealSelf');
const ModifierBandingHealSelfAndGeneral = require('./modifierBandingHealSelfAndGeneral');
const ModifierDeathWatchDrawToXCards = require('./modifierDeathWatchDrawToXCards');
const ModifierDyingWishSpawnTile = require('./modifierDyingWishSpawnTile');
const ModifierDyingWishReSpawnEntityAnywhere = require('./modifierDyingWishReSpawnEntityAnywhere');
const ModifierSummonWatchNearbyApplyModifiersOncePerTurn = require('./modifierSummonWatchNearbyApplyModifiersOncePerTurn');
const ModifierHealWatch = require('./modifierHealWatch');
const ModifierHealWatchBuffSelf = require('./modifierHealWatchBuffSelf');
const ModifierHealWatchDamageNearbyEnemies = require('./modifierHealWatchDamageNearbyEnemies');
const ModifierRemoveAndReplaceEntity = require('./modifierRemoveAndReplaceEntity');
const ModifierMyMoveWatch = require('./modifierMyMoveWatch');
const ModifierMyMoveWatchSpawnEntity = require('./modifierMyMoveWatchSpawnEntity');
const ModifierMyMoveWatchApplyModifiers = require('./modifierMyMoveWatchApplyModifiers');
const ModifierMyMoveWatchDrawCard = require('./modifierMyMoveWatchDrawCard');
const ModifierDyingWishSpawnEntityInCorner = require('./modifierDyingWishSpawnEntityInCorner');
const ModifierSpiritScribe = require('./modifierSpiritScribe');
const ModifierTakeDamageWatchSpawnRandomToken = require('./modifierTakeDamageWatchSpawnRandomToken');
const ModifierBackupGeneral = require('./modifierBackupGeneral');
const ModifierSummonWatchFromActionBarByOpeningGambitBuffSelf = require('./modifierSummonWatchFromActionBarByOpeningGambitBuffSelf');
const ModifierOpeningGambitApplyModifiersRandomly = require('./modifierOpeningGambitApplyModifiersRandomly');
const ModifierImmuneToSpellDamage = require('app/sdk/modifiers/modifierImmuneToSpellDamage');
const ModifierReplaceWatchDamageEnemy = require('./../../sdk/modifiers/modifierReplaceWatchDamageEnemy');
const ModifierReplaceWatchBuffSelf = require('./../../sdk/modifiers/modifierReplaceWatchBuffSelf');
const ModifierBuffSelfOnReplace = require('./../../sdk/modifiers/modifierBuffSelfOnReplace');
const ModifierSummonSelfOnReplace = require('./../../sdk/modifiers/modifierSummonSelfOnReplace');
const ModifierTakeDamageWatchDispel = require('./../../sdk/modifiers/modifierTakeDamageWatchDispel');
const ModifierTakeDamageWatchPutCardInHand = require('./../../sdk/modifiers/modifierTakeDamageWatchPutCardInHand');
const ModifierOpeningGambitDrawCardBothPlayers = require('./../../sdk/modifiers/modifierOpeningGambitDrawCardBothPlayers');
const ModifierSurviveDamageWatchReturnToHand = require('./../../sdk/modifiers/modifierSurviveDamageWatchReturnToHand');
const ModifierOpeningGambitDamageNearbyForAttack = require('./../../sdk/modifiers/modifierOpeningGambitDamageNearbyForAttack');
const ModifierMyAttackOrAttackedWatchDrawCard = require('./../../sdk/modifiers/modifierMyAttackOrAttackedWatchDrawCard');
const ModifierForcefieldAbsorb = require('./../../sdk/modifiers/modifierForcefieldAbsorb');
const ModifierUnseven = require('./modifierUnseven');
const ModifierDoubleDamageToGenerals = require('./../../sdk/modifiers/modifierDoubleDamageToGenerals');
const ModifierShadowScar = require('app/sdk/modifiers/modifierShadowScar');
const ModifierStackingShadowsDebuff = require('app/sdk/modifiers/modifierStackingShadowsDebuff');
const ModifierEndTurnWatchApplyModifiers = require('app/sdk/modifiers/modifierEndTurnWatchApplyModifiers');
const ModifierOpeningGambitApplyModifiersToDeckAndHand = require('./modifierOpeningGambitApplyModifiersToDeckAndHand');
const ModifierOpeningGambitApplyModifiersToHand = require('./modifierOpeningGambitApplyModifiersToHand');
const ModifierMechazorWatchPutMechazorInHand = require('./modifierMechazorWatchPutMechazorInHand.js');
const ModifierHealWatchPutCardInHand = require('./modifierHealWatchPutCardInHand');
const ModifierEnemyCannotHeal = require('./modifierEnemyCannotHeal');
const ModifierEnemyTakeDamageWatchHealMyGeneral = require('./modifierEnemyTakeDamageWatchHealMyGeneral');
const ModifierTakeDamageWatchDamageNearbyForSame = require('./modifierTakeDamageWatchDamageNearbyEnemiesForSame');
const ModifierImmuneToDamageFromEnemyMinions = require('./modifierImmuneToDamageFromEnemyMinions');
const ModifierDoubleDamageToEnemyMinions = require('./modifierDoubleDamageToEnemyMinions');
const ModifierOpeningGambitDrawFactionCards = require('./modifierOpeningGambitDrawFactionCards');
const ModifierOpeningGambitHealBothGenerals = require('./modifierOpeningGambitHealBothGenerals');
const ModifierOpponentDrawCardWatchBuffSelf = require('./modifierOpponentDrawCardWatchBuffSelf');
const ModifierEnvyBaer = require('./modifierEnvyBaer');
const ModifierOpeningGambitGrincher = require('./modifierOpeningGambitGrincher');
const ModifierSpellWatchScientist = require('./modifierSpellWatchScientist');
const ModifierOpeningGambitDamageEverything = require('./modifierOpeningGambitDamageEverything');
const ModifierCostChangeIfMyGeneralDamagedLastTurn = require('./modifierCostChangeIfMyGeneralDamagedLastTurn');
const ModifierMyGeneralDamagedWatchBuffSelfAndDrawACard = require('./modifierMyGeneralDamagedWatchBuffSelfAndDrawACard');
const ModifierDynamicCountModifySelf = require('./modifierDynamicCountModifySelf');
const ModifierCostEqualGeneralHealth = require('./modifierCostEqualGeneralHealth');
const ModifierStackingShadowsBonusDamage = require('./modifierStackingShadowsBonusDamage');
const ModifierDynamicCountModifySelfByShadowTilesOnBoard = require('./modifierDynamicCountModifySelfByShadowTilesOnBoard');
const ModifierBattlePet = require('app/sdk/modifiers/modifierBattlePet');
const ModifierCannotMove = require('app/sdk/modifiers/modifierCannotMove');
const ModifierOpeningGambitDrawRandomBattlePet = require('app/sdk/modifiers/modifierOpeningGambitDrawRandomBattlePet');
const ModifierDyingWishDamageNearbyEnemies = require('app/sdk/modifiers/modifierDyingWishDamageNearbyEnemies');
const ModifierDealDamageWatchKillNeutralTarget = require('app/sdk/modifiers/modifierDealDamageWatchKillNeutralTarget');
const ModifierTakeDamageWatchSpawnRandomBattlePet = require('app/sdk/modifiers/modifierTakeDamageWatchSpawnRandomBattlePet');
const ModifierDyingWishDrawMechazorCard = require('app/sdk/modifiers/modifierDyingWishDrawMechazorCard');
const ModifierOpeningGambitApplyModifiersByRaceId = require('app/sdk/modifiers/modifierOpeningGambitApplyModifiersByRaceId');
const ModifierOpeningGambitApplyModifiersToGeneral = require('app/sdk/modifiers/modifierOpeningGambitApplyModifiersToGeneral');
const ModifierOpeningGambitDrawCard = require('app/sdk/modifiers/modifierOpeningGambitDrawCard');
const ModifierEndTurnWatchApplyModifiersRandomly = require('app/sdk/modifiers/modifierEndTurnWatchApplyModifiersRandomly');
const ModifierBandingChangeCardDraw = require('app/sdk/modifiers/modifierBandingChangeCardDraw');
const ModifierTakeDamageWatchDamageAllEnemies = require('app/sdk/modifiers/modifierTakeDamageWatchDamageAllEnemies');
const ModifierDyingWishXho = require('app/sdk/modifiers/modifierDyingWishXho');
const ModifierDyingWishDrawRandomBattlePet = require('app/sdk/modifiers/modifierDyingWishDrawRandomBattlePet');
const ModifierAnyDrawCardWatchBuffSelf = require('app/sdk/modifiers/modifierAnyDrawCardWatchBuffSelf');
const ModifierTakeDamageWatchDestroy = require('app/sdk/modifiers/modifierTakeDamageWatchDestroy');
const ModifierDyingWishSpawnRandomEntity = require('app/sdk/modifiers/modifierDyingWishSpawnRandomEntity');
const ModifierTakeDamageWatchSpawnEntity = require('app/sdk/modifiers/modifierTakeDamageWatchSpawnEntity');
const ModifierPantheran = require('app/sdk/modifiers/modifierPantheran');
const ModifierEndTurnWatchSwapAllegiance = require('app/sdk/modifiers/modifierEndTurnWatchSwapAllegiance');
const ModifierDyingWishCorpseCombustion = require('app/sdk/modifiers/modifierDyingWishCorpseCombustion');
const ModifierOpeningGambitApplyModifiersToWraithlings = require('app/sdk/modifiers/modifierOpeningGambitApplyModifiersToWraithlings');
const ModifierInkhornGaze = require('app/sdk/modifiers/modifierInkhornGaze');
const ModifierDeathWatchBuffRandomMinionInHand = require('app/sdk/modifiers/modifierDeathWatchBuffRandomMinionInHand');
const ModifierOpeningGambitHatchFriendlyEggs = require('app/sdk/modifiers/modifierOpeningGambitHatchFriendlyEggs');
const ModifierGrowOnBothTurns = require('app/sdk/modifiers/modifierGrowOnBothTurns');
const ModifierSummonWatchFromEggApplyModifiers = require('app/sdk/modifiers/modifierSummonWatchFromEggApplyModifiers');
const ModifierAnySummonWatchFromActionBarApplyModifiersToSelf = require('app/sdk/modifiers/modifierAnySummonWatchFromActionBarApplyModifiersToSelf');
const ModifierSnowRippler = require('app/sdk/modifiers/modifierSnowRippler');
const ModifierSurviveDamageWatchBur = require('app/sdk/modifiers/modifierSurviveDamageWatchBur');
const ModifierSummonWatchByRaceHealToFull = require('app/sdk/modifiers/modifierSummonWatchByRaceHealToFull');
const ModifierSummonWatchByCardBuffTarget = require('app/sdk/modifiers/modifierSummonWatchByCardBuffTarget');
const ModifierOpeningGambitDamageEnemiesNearShadowCreep = require('app/sdk/modifiers/modifierOpeningGambitDamageEnemiesNearShadowCreep');
const ModifierMyAttackOrAttackedWatchSpawnMinionNearby = require('app/sdk/modifiers/modifierMyAttackOrAttackedWatchSpawnMinionNearby');
const ModifierSummonWatchDreadnaught = require('app/sdk/modifiers/modifierSummonWatchDreadnaught');
const ModifierReplaceWatchSpawnEntity = require('app/sdk/modifiers/modifierReplaceWatchSpawnEntity');
const ModifierDynamicCountModifySelfCostByBattlePetsOnBoard = require('app/sdk/modifiers/modifierDynamicCountModifySelfCostByBattlePetsOnBoard');
const ModifierApplyMinionToBoardWatchApplyModifiersToTarget = require('app/sdk/modifiers/modifierApplyMinionToBoardWatchApplyModifiersToTarget');
const ModifierKillWatchSpawnEnemyEntity = require('app/sdk/modifiers/modifierKillWatchSpawnEnemyEntity');
const ModifierEndEveryTurnWatchDamageOwner = require('app/sdk/modifiers/modifierEndEveryTurnWatchDamageOwner');
const ModifierMyTeamMoveWatchAnyReason = require('app/sdk/modifiers/modifierMyTeamMoveWatchAnyReason');
const ModifierMyTeamMoveWatchAnyReasonBuffTarget = require('app/sdk/modifiers/modifierMyTeamMoveWatchAnyReasonBuffTarget');
const ModifierEndTurnWatchRefreshArtifacts = require('app/sdk/modifiers/modifierEndTurnWatchRefreshArtifacts');
const ModifierGainAttackWatchBuffSelfBySameThisTurn = require('app/sdk/modifiers/modifierGainAttackWatchBuffSelfBySameThisTurn');
const ModifierInquisitorKron = require('app/sdk/modifiers/modifierInquisitorKron');
const ModifierTakeDamageWatchSpawnShadowCreep = require('app/sdk/modifiers/modifierTakeDamageWatchSpawnShadowCreep');
const ModifierDyingWishApplyModifiersRandomly = require('app/sdk/modifiers/modifierDyingWishApplyModifiersRandomly');
const ModifierOpeningGambitBuffSelfByBattlePetsHandStats = require('app/sdk/modifiers/modifierOpeningGambitBuffSelfByBattlePetsHandStats');
const ModifierHealWatchBuffGeneral = require('app/sdk/modifiers/modifierHealWatchBuffGeneral');
const ModifierDealDamageWatchHatchEggs = require('app/sdk/modifiers/modifierDealDamageWatchHatchEggs');
const ModifierDyingWishDispelNearestEnemy = require('app/sdk/modifiers/modifierDyingWishDispelNearestEnemy');
const ModifierSpawnedFromEgg = require('app/sdk/modifiers/modifierSpawnedFromEgg');
const ModifierTamedBattlePet = require('app/sdk/modifiers/modifierTamedBattlePet');
const ModifierFriendlyDeathWatchForBattlePetDrawCard = require('app/sdk/modifiers/modifierFriendlyDeathWatchForBattlePetDrawCard');
const ModifierDyingWishSpawnTileAnywhere = require('app/sdk/modifiers/modifierDyingWishSpawnTileAnywhere');
const ModifierElkowl = require('./modifierElkowl');
const ModifierOpeningGambitPutCardInOpponentHand = require('./modifierOpeningGambitPutCardInOpponentHand');
const ModifierEndTurnWatchSpawnTile = require('./modifierEndTurnWatchSpawnTile');
const ModifierMyMinionAttackWatchHealGeneral = require('./modifierMyMinionAttackWatchHealGeneral');
const ModifierImmuneToDamageFromMinionsAndGenerals = require('./modifierImmuneToDamageFromMinionsAndGenerals');
const ModifierOpeningGambitDamageInFrontRow = require('./modifierOpeningGambitDamageInFrontRow');
const ModifierInvalidateRush = require('./modifierInvalidateRush');
const ModifierStartTurnWatchEquipArtifact = require('./modifierStartTurnWatchEquipArtifact');
const ModifierStartTurnWatchPlaySpell = require('./modifierStartTurnWatchPlaySpell');
const ModifierOpeningGambitSpawnCopiesOfEntityNearby = require('./modifierOpeningGambitSpawnCopiesOfEntityNearby');
const ModifierDyingWishDispelAllEnemyMinions = require('./modifierDyingWishDispelAllEnemyMinions');
const ModifierOpponentDrawCardWatchDamageEnemyGeneral = require('./modifierOpponentDrawCardWatchDamageEnemyGeneral');
const ModifierAttacksDealNoDamage = require('./modifierAttacksDealNoDamage');
const ModifierOpeningGambitRefreshSignatureCard = require('./modifierOpeningGambitRefreshSignatureCard');
const ModifierSynergizeSpawnVanarToken = require('./modifierSynergizeSpawnVanarToken');
const ModifierOpeningGambitChangeSignatureCard = require('./modifierOpeningGambitChangeSignatureCard');
const ModifierDoubleAttackStat = require('./modifierDoubleAttackStat');
const ModifierSynergizeApplyModifiers = require('./modifierSynergizeApplyModifiers');
const ModifierMyGeneralDamagedWatchBuffSelfAttackForSame = require('./modifierMyGeneralDamagedWatchBuffSelfAttackForSame');
const ModifierKillWatchRefreshExhaustion = require('./modifierKillWatchRefreshExhaustion');
const ModifierHasBackstab = require('./modifierHasBackstab');
const ModifierDealDamageWatchRefreshSignatureCard = require('./modifierDealDamageWatchRefreshSignatureCard');
const ModifierOpeningGambitGrandmasterVariax = require('./modifierOpeningGambitGrandmasterVariax');
const ModifierSynergizeRefreshSpell = require('./modifierSynergizeRefreshSpell');
const ModifierImmuneToDamageOnEnemyTurn = require('./modifierImmuneToDamageOnEnemyTurn');
const ModifierOpeningGambitDestroyNearbyMinions = require('./modifierOpeningGambitDestroyNearbyMinions');
const ModifierSynergizeHealMyGeneral = require('./modifierSynergizeHealMyGeneral');
const ModifierSynergizeDamageEnemyGeneral = require('./modifierSynergizeDamageEnemyGeneral');
const ModifierSynergizeApplyModifiersToGeneral = require('./modifierSynergizeApplyModifiersToGeneral');
const ModifierSynergizeDamageEnemy = require('./modifierSynergizeDamageEnemy');
const ModifierSynergizeApplyModifiersToWraithlings = require('./modifierSynergizeApplyModifiersToWraithlings');
const ModifierOpeningGambitSpawnVanarTokensAroundGeneral = require('./modifierOpeningGambitSpawnVanarTokensAroundGeneral');
const ModifierDyingWishTransformRandomMinion = require('./modifierDyingWishTransformRandomMinion');
const ModifierOnSpawnCopyMyGeneral = require('./modifierOnSpawnCopyMyGeneral');
const ModifierTakesDoubleDamage = require('./modifierTakesDoubleDamage');
const ModifierMyHealWatchAnywhereBuffSelf = require('./modifierMyHealWatchAnywhereBuffSelf');
const ModifierToggleStructure = require('./modifierToggleStructure');
const ModifierSynergizeTeleportRandomEnemy = require('./modifierSynergizeTeleportRandomEnemy');
const ModifierStartTurnWatchDispelAllEnemyMinionsDrawCard = require('./modifierStartTurnWatchDispelAllEnemyMinionsDrawCard');
const ModifierAbsorbDamageGolems = require('./modifierAbsorbDamageGolems');
const ModifierExpireApplyModifiers = require('./modifierExpireApplyModifiers');
const ModifierSecondWind = require('./modifierSecondWind');
const ModifierKillWatchRespawnEntity = require('./modifierKillWatchRespawnEntity');
const ModifierOpponentSummonWatchSpawn1HealthClone = require('./modifierOpponentSummonWatchSpawn1HealthClone');
const ModifierDealOrTakeDamageWatch = require('./modifierDealOrTakeDamageWatch');
const ModifierDealOrTakeDamageWatchRandomTeleportOther = require('./modifierDealOrTakeDamageWatchRandomTeleportOther');
const ModifierEndTurnWatchTeleportCorner = require('./modifierEndTurnWatchTeleportCorner');
const ModifierDieSpawnNewGeneral = require('./modifierDieSpawnNewGeneral');
const ModifierEndTurnWatchDealDamageToSelfAndNearbyEnemies = require('./modifierEndTurnWatchDealDamageToSelfAndNearbyEnemies');
const ModifierBond = require('./modifierBond');
const ModifierBondApplyModifiers = require('./modifierBondApplyModifiers');
const ModifierDoubleHealthStat = require('./modifierDoubleHealthStat');
const ModifierBandingApplyModifiers = require('./modifierBandingApplyModifiers');
const ModifierBondApplyModifiersByRaceId = require('./modifierBondApplyModifiersByRaceId');
const ModifierBelongsToAllRaces = require('./modifierBelongsToAllRaces');
const ModifierOpeningGambitGoleminate = require('./modifierOpeningGambitGoleminate');
const ModifierSpellWatchDrawRandomArcanyst = require('./modifierSpellWatchDrawRandomArcanyst');
const ModifierOpeningGambitSpawnTribal = require('./modifierOpeningGambitSpawnTribal');
const ModifierDyingWishSpawnTribal = require('./modifierDyingWishSpawnTribal');
const ModifierDrawCardWatchCopySpell = require('./modifierDrawCardWatchCopySpell');
const ModifierBondPutCardsInHand = require('./modifierBondPutCardsInHand');
const ModifierSpellWatchBuffAllies = require('./modifierSpellWatchBuffAllies');
const ModifierBondDrawCards = require('./modifierBondDrawCards');
const ModifierMyAttackWatchGetSonghaiSpells = require('app/sdk/modifiers/modifierMyAttackWatchGetSonghaiSpells');
const ModifierBondSpawnEntity = require('app/sdk/modifiers/modifierBondSpawnEntity');
const ModifierHealWatchDamageRandomEnemy = require('app/sdk/modifiers/modifierHealWatchDamageRandomEnemy');
const ModifierOpeningGambitSirocco = require('app/sdk/modifiers/modifierOpeningGambitSirocco');
const ModifierBondNightshroud = require('app/sdk/modifiers/modifierBondNightshroud');
const ModifierSpellWatchPutCardInHand = require('app/sdk/modifiers/modifierSpellWatchPutCardInHand');
const ModifierNocturne = require('app/sdk/modifiers/modifierNocturne');
const ModifierOpeningGambitDeathKnell = require('app/sdk/modifiers/modifierOpeningGambitDeathKnell');
const ModifierBondHealMyGeneral = require('app/sdk/modifiers/modifierBondHealMyGeneral');
const ModifierTakeDamageWatchJuggernaut = require('app/sdk/modifiers/modifierTakeDamageWatchJuggernaut');
let ModifierKillWatchSpawnCopyNearby = require('app/sdk/modifiers/modifierKillWatchSpawnCopyNearby');
const ModifierOnRemoveSpawnRandomDeadEntity = require('app/sdk/modifiers/modifierOnRemoveSpawnRandomDeadEntity');
const ModifierGrowPermanent = require('app/sdk/modifiers/modifierGrowPermanent');
const ModifierShatteringHeart = require('app/sdk/modifiers/modifierShatteringHeart');
const ModifierOpeningGambitEquipArtifact = require('app/sdk/modifiers/modifierOpeningGambitEquipArtifact');
const ModifierFeralu = require('app/sdk/modifiers/modifierFeralu');
ModifierKillWatchSpawnCopyNearby = require('app/sdk/modifiers/modifierKillWatchSpawnCopyNearby');
const ModifierDispelAreaAttack = require('app/sdk/modifiers/modifierDispelAreaAttack');
const ModifierSelfDamageAreaAttack = require('app/sdk/modifiers/modifierSelfDamageAreaAttack');
let ModifierSummonWatchAnyPlayer = require('app/sdk/modifiers/modifierSummonWatchAnyPlayer');
const ModifierSummonWatchAnyPlayerApplyModifiers = require('app/sdk/modifiers/modifierSummonWatchAnyPlayerApplyModifiers');
const ModifierSummonWatchNearbyAnyPlayerApplyModifiers = require('app/sdk/modifiers/modifierSummonWatchNearbyAnyPlayerApplyModifiers');
const ModifierOpponentSummonWatchOpponentDrawCard = require('app/sdk/modifiers/modifierOpponentSummonWatchOpponentDrawCard');
const ModifierOpponentDrawCardWatchOverdrawSummonEntity = require('app/sdk/modifiers/modifierOpponentDrawCardWatchOverdrawSummonEntity');
const ModifierEndTurnWatchDamagePlayerBasedOnRemainingMana = require('app/sdk/modifiers/modifierEndTurnWatchDamagePlayerBasedOnRemainingMana');
const ModifierHPChange = require('app/sdk/modifiers/modifierHPChange');
const ModifierHPThresholdGainModifiers = require('app/sdk/modifiers/modifierHPThresholdGainModifiers');
const ModifierExtraDamageOnCounterattack = require('app/sdk/modifiers/modifierExtraDamageOnCounterattack');
const ModifierOnOpponentDeathWatch = require('app/sdk/modifiers/modifierOnOpponentDeathWatch');
const ModifierOnOpponentDeathWatchSpawnEntityOnSpace = require('app/sdk/modifiers/modifierOnOpponentDeathWatchSpawnEntityOnSpace');
const ModifierDyingWishSpawnEgg = require('app/sdk/modifiers/modifierDyingWishSpawnEgg');
const ModifierSummonWatchFromActionBarApplyModifiers = require('app/sdk/modifiers/modifierSummonWatchFromActionBarApplyModifiers');
const ModifierTakeDamageWatchSpawnWraithlings = require('app/sdk/modifiers/modifierTakeDamageWatchSpawnWraithlings');
const ModifierTakeDamageWatchDamageAttacker = require('app/sdk/modifiers/modifierTakeDamageWatchDamageAttacker');
const ModifierStartTurnWatchTeleportRandomSpace = require('app/sdk/modifiers/modifierStartTurnWatchTeleportRandomSpace');
const ModifierSummonWatchFromActionBarAnyPlayerApplyModifiers = require('app/sdk/modifiers/modifierSummonWatchFromActionBarAnyPlayerApplyModifiers');
const ModifierSummonWatchFromActionBarAnyPlayer = require('app/sdk/modifiers/modifierSummonWatchFromActionBarAnyPlayer');
const ModifierStartTurnWatchDamageGeneralEqualToMinionsOwned = require('app/sdk/modifiers/modifierStartTurnWatchDamageGeneralEqualToMinionsOwned');
const ModifierHPChangeSummonEntity = require('app/sdk/modifiers/modifierHPChangeSummonEntity');
const ModifierStartTurnWatchDamageAndBuffSelf = require('app/sdk/modifiers/modifierStartTurnWatchDamageAndBuffSelf');
const ModifierEnemyTeamMoveWatch = require('app/sdk/modifiers/modifierEnemyTeamMoveWatch');
const ModifierEnemyTeamMoveWatchSummonEntityBehind = require('app/sdk/modifiers/modifierEnemyTeamMoveWatchSummonEntityBehind');
const ModifierDyingWishLoseGame = require('app/sdk/modifiers/modifierDyingWishLoseGame');
const ModifierAttacksDamageAllEnemyMinions = require('app/sdk/modifiers/modifierAttacksDamageAllEnemyMinions');
const ModifierATKThresholdDie = require('app/sdk/modifiers/modifierATKThresholdDie');
const ModifierOverwatchHidden = require('./modifierOverwatchHidden');
const ModifierOverwatchAttackedBuffSelf = require('./modifierOverwatchAttackedBuffSelf');
const ModifierOverwatchMovedNearbyAttack = require('./modifierOverwatchMovedNearbyAttack');
const ModifierOverwatchMovedNearbyMoveBothToCorners = require('./modifierOverwatchMovedNearbyMoveBothToCorners');
const ModifierOverwatchMovedNearbyDispelAndProvoke = require('./modifierOverwatchMovedNearbyDispelAndProvoke');
const ModifierOverwatchDestroyedResummonAndDestroyOther = require('./modifierOverwatchDestroyedResummonAndDestroyOther');
const ModifierOverwatchMovedNearbyMiniImmolation = require('./modifierOverwatchMovedNearbyMiniImmolation');
const ModifierOverwatchDestroyedPutCardInHand = require('./modifierOverwatchDestroyedPutCardInHand');
const ModifierOverwatchAttackedDamageEnemyGeneralForSame = require('./modifierOverwatchAttackedDamageEnemyGeneralForSame');
const ModifierOverwatchDestroyedPutMagmarCardsInHand = require('./modifierOverwatchDestroyedPutMagmarCardsInHand');
const ModifierEnemyMinionAttackWatchGainKeyword = require('./modifierEnemyMinionAttackWatchGainKeyword');
const ModifierOpeningGambitSpawnEnemyMinionNearOpponent = require('./modifierOpeningGambitSpawnEnemyMinionNearOpponent');
const ModifierEnemyDealDamageWatch = require('./modifierEnemyDealDamageWatch');
const ModifierEnemySpellWatch = require('./modifierEnemySpellWatch');
const ModifierEnemySpellWatchBuffSelf = require('./modifierEnemySpellWatchBuffSelf');
const ModifierOpponentDrawCardWatchGainKeyword = require('./modifierOpponentDrawCardWatchGainKeyword');
const ModifierOpponentSummonWatchSummonEgg = require('./modifierOpponentSummonWatchSummonEgg');
const ModifierOpponentSummonWatchBuffMinionInHand = require('./modifierOpponentSummonWatchBuffMinionInHand');
ModifierSummonWatchAnyPlayer = require('./modifierSummonWatchAnyPlayer');
const ModifierEndTurnWatchTransformNearbyEnemies = require('./modifierEndTurnWatchTransformNearbyEnemies');
const ModifierBackstabWatch = require('./modifierBackstabWatch');
const ModifierBackstabWatchStealSpellFromDeck = require('./modifierBackstabWatchStealSpellFromDeck');
const ModifierDyingWishDrawMinionsWithDyingWish = require('./modifierDyingWishDrawMinionsWithDyingWish');
const ModifierOverwatchSpellTarget = require('./modifierOverwatchSpellTarget');
const ModifierOverwatchEndTurn = require('./modifierOverwatchEndTurn');
const ModifierOverwatchSpellTargetDamageEnemies = require('./modifierOverwatchSpellTargetDamageEnemies');
const ModifierOverwatchEndTurnPutCardInHand = require('./modifierOverwatchEndTurnPutCardInHand');
const ModifierDealDamageWatchControlEnemyMinionUntilEOT = require('./modifierDealDamageWatchControlEnemyMinionUntilEOT');
const ModifierStartTurnWatchDamageEnemiesInRow = require('./modifierStartTurnWatchDamageEnemiesInRow');
const ModifierStartTurnWatchDestroySelfAndEnemies = require('./modifierStartTurnWatchDestroySelfAndEnemies');
const ModifierSentinelHidden = require('./modifierSentinelHidden');
const ModifierSentinelSetup = require('./modifierSentinelSetup');
const ModifierSentinelOpponentSummonDamageIt = require('./modifierSentinelOpponentSummonDamageIt');
const ModifierSentinelOpponentGeneralAttack = require('./modifierSentinelOpponentGeneralAttack');
const ModifierSummonWatchIfLowAttackSummonedBuffSelf = require('./modifierSummonWatchIfLowAttackSummonedBuffSelf');
const ModifierMyAttackWatchBonusManaCrystal = require('./modifierMyAttackWatchBonusManaCrystal');
const ModifierEnemySpellWatchCopySpell = require('./modifierEnemySpellWatchCopySpell');
const ModifierOpeningGambitPutCardInHand = require('./modifierOpeningGambitPutCardInHand');
const ModifierSentinelOpponentSpellCast = require('./modifierSentinelOpponentSpellCast');
const ModifierStartTurnWatchPutCardInHand = require('./modifierStartTurnWatchPutCardInHand');
const ModifierHallowedGround = require('./modifierHallowedGround');
const ModifierHallowedGroundBuff = require('./modifierHallowedGroundBuff');
const ModifierSandPortal = require('./modifierSandPortal');
const ModifierDoomed = require('./modifierDoomed');
const ModifierOpeningGambitRemoveArtifactToDrawArtifactFromFaction = require('./modifierOpeningGambitRemoveArtifactToDrawArtifactFromFaction');
const ModifierSentinelOpponentSummonCopyIt = require('./modifierSentinelOpponentSummonCopyIt');
const ModifierDealDamageWatchTeleportEnemyToYourSide = require('./modifierDealDamageWatchTeleportEnemyToYourSide');
const ModifierEnemySpellWatchPutCardInHand = require('./modifierEnemySpellWatchPutCardInHand');
const ModifierSpellWatchDamageAllMinions = require('./modifierSpellWatchDamageAllMinions');
const ModifierSentinelOpponentSummonSwapPlaces = require('./modifierSentinelOpponentSummonSwapPlaces');
const ModifierMyAttackWatchSpawnMinionNearby = require('./modifierMyAttackWatchSpawnMinionNearby');
const ModifierDyingWishDrawWishCard = require('./modifierDyingWishDrawWishCard');
const ModifierEnemyAttackWatch = require('./modifierEnemyAttackWatch');
const ModifierWildTahr = require('./modifierWildTahr');
const ModifierEndTurnWatchGainTempBuff = require('./modifierEndTurnWatchGainTempBuff');
const ModifierImmuneToAttacksByMinions = require('./modifierImmuneToAttacksByMinions');
const ModifierOpeningGambitAlabasterTitan = require('./modifierOpeningGambitAlabasterTitan');
const ModifierPrimalTile = require('./modifierPrimalTile');
const ModifierPrimalProtection = require('./modifierPrimalProtection');
const ModifierSummonWatchFromActionBar = require('./modifierSummonWatchFromActionBar');
const ModifierMyMoveWatchAnyReason = require('./modifierMyMoveWatchAnyReason');
const ModifierMyMoveWatchAnyReasonDamageNearbyEnemyMinions = require('./modifierMyMoveWatchAnyReasonDamageNearbyEnemyMinions');
const ModifierCannotCastSpellsByCost = require('./modifierCannotCastSpellsByCost');
const ModifierKillWatchBounceEnemyToActionBar = require('./modifierKillWatchBounceEnemyToActionBar');
const ModifierMyGeneralAttackWatch = require('./modifierMyGeneralAttackWatch');
const ModifierMyGeneralAttackWatchSpawnEntity = require('./modifierMyGeneralAttackWatchSpawnEntity');
const ModifierOpeningGambitReplaceHand = require('./modifierOpeningGambitReplaceHand');
const ModifierDealDamageWatchDamageJoinedEnemies = require('./modifierDealDamageWatchDamageJoinedEnemies');
const ModifierEternalHeart = require('./modifierEternalHeart');
const ModifierOpeningGambitSpawnPartyAnimals = require('./modifierOpeningGambitSpawnPartyAnimals');
const ModifierSprigginDiesBuffSelf = require('./modifierSprigginDiesBuffSelf');
const ModifierSituationalBuffSelfIfSpriggin = require('./modifierSituationalBuffSelfIfSpriggin');
const ModifierMirage = require('./modifierMirage');
const ModifierCustomSpawn = require('./modifierCustomSpawn');
const ModifierCustomSpawnOnOtherUnit = require('./modifierCustomSpawnOnOtherUnit');
const ModifierOpeningGambitDagona = require('./modifierOpeningGambitDagona');
const ModifierDyingWishDagona = require('./modifierDyingWishDagona');
const ModifierMyAttackWatchGamble = require('./modifierMyAttackWatchGamble');
const ModifierOpeningGambitStealEnemyGeneralHealth = require('./modifierOpeningGambitStealEnemyGeneralHealth');
const ModifierDoomed2 = require('./modifierDoomed2');
const ModifierDoomed3 = require('./modifierDoomed3');
const ModifierDeathWatchDamageRandomMinionHealMyGeneral = require('./modifierDeathWatchDamageRandomMinionHealMyGeneral');
const ModifierStartTurnWatchSpawnTile = require('./modifierStartTurnWatchSpawnTile');
const ModifierDealDamageWatchIfMinionHealMyGeneral = require('./modifierDealDamageWatchIfMinionHealMyGeneral');
const ModifierSynergizeSummonMinionNearGeneral = require('./modifierSynergizeSummonMinionNearGeneral');
const ModifierSpellWatchApplyModifiers = require('./modifierSpellWatchApplyModifiers');
const ModifierOpeningGambitProgenitor = require('./modifierOpeningGambitProgenitor');
const ModifierSpellWatchDrawCard = require('./modifierSpellWatchDrawCard');
const ModifierSynergizeDrawBloodboundSpell = require('./modifierSynergizeDrawBloodboundSpell');
const ModifierOpeningGambitDrawCopyFromDeck = require('./modifierOpeningGambitDrawCopyFromDeck');
let ModifierBandedProvoke = require('./modifierBandedProvoke');
let ModifierBandingProvoke = require('./modifierBandingProvoke');
const ModifierKillWatchDeceptibot = require('./modifierKillWatchDeceptibot');
const ModifierDeathWatchBuffMinionsInHand = require('./modifierDeathWatchBuffMinionsInHand');
const ModifierDyingWishDestroyRandomEnemyNearby = require('./modifierDyingWishDestroyRandomEnemyNearby');
const ModifierSynergizeSummonMinionNearby = require('./modifierSynergizeSummonMinionNearby');
const ModifierBuilding = require('./modifierBuilding');
const ModifierBuild = require('./modifierBuild');
const ModifierBeforeMyAttackWatch = require('./modifierBeforeMyAttackWatch');
const ModifierMyAttackWatchApplyModifiersToAllies = require('./modifierMyAttackWatchApplyModifiersToAllies');
const ModifierSummonWatchFromActionBarByRaceBothPlayersDraw = require('./modifierSummonWatchFromActionBarByRaceBothPlayersDraw');
const ModifierSummonWatchApplyModifiersToBoth = require('./modifierSummonWatchApplyModifiersToBoth');
const ModifierSummonWatchNearbyApplyModifiersToBoth = require('./modifierSummonWatchNearbyApplyModifiersToBoth');
const ModifierSummonWatchTransform = require('./modifierSummonWatchTransform');
const ModifierSummonWatchNearbyTransform = require('./modifierSummonWatchNearbyTransform');
const ModifierSynergizePutCardInHand = require('./modifierSynergizePutCardInHand');
const ModifierSynergizeBuffSelf = require('./modifierSynergizeBuffSelf');
const ModifierSentinelOpponentGeneralAttackHealEnemyGeneralDrawCard = require('./modifierSentinelOpponentGeneralAttackHealEnemyGeneralDrawCard');
const ModifierSentinelOpponentSummonBuffItDrawCard = require('./modifierSentinelOpponentSummonBuffItDrawCard');
const ModifierSentinelOpponentSpellCastRefundManaDrawCard = require('./modifierSentinelOpponentSpellCastRefundManaDrawCard');
const ModifierTakeDamageWatchSpawnRandomHaunt = require('./modifierTakeDamageWatchSpawnRandomHaunt');
const ModifierCannotCastBBS = require('./modifierCannotCastBBS');
const ModifierStartTurnWatchPutCardInOpponentsHand = require('./modifierStartTurnWatchPutCardInOpponentsHand');
const ModifierOpeningGambitRemoveCardsFromDecksByCost = require('./modifierOpeningGambitRemoveCardsFromDecksByCost');
const ModifierDyingWishAddCardToDeck = require('./modifierDyingWishAddCardToDeck');
const ModifierOnDyingInfest = require('./modifierOnDyingInfest');
const ModifierDyingWishDrawEnemyLegendaryArtifact = require('./modifierDyingWishDrawEnemyLegendaryArtifact');
const ModifierSynergizeDamageClosestEnemy = require('./modifierSynergizeDamageClosestEnemy');
const ModifierSynergizeRazorArchitect = require('./modifierSynergizeRazorArchitect');
const ModifierDeathWatchSpawnRandomDemon = require('./modifierDeathWatchSpawnRandomDemon');
const ModifierWhenAttackedDestroyThis = require('./modifierWhenAttackedDestroyThis');
const ModifierSituationalBuffSelfIfFullHealth = require('./modifierSituationalBuffSelfIfFullHealth');
const ModifierEnemyAttackWatchGainAttack = require('./modifierEnemyAttackWatchGainAttack');
const ModifierDeathWatchFriendlyMinionSwapAllegiance = require('./modifierDeathWatchFriendlyMinionSwapAllegiance');
const ModifierOpeningGambitSniperZen = require('./modifierOpeningGambitSniperZen');
const ModifierDoubleDamageToStunnedEnemies = require('./modifierDoubleDamageToStunnedEnemies');
const ModifierStartTurnWatchRespawnClones = require('./modifierStartTurnWatchRespawnClones');
const ModifierMyAttackOrCounterattackWatchApplyModifiersToFriendlyMinions = require('./modifierMyAttackOrCounterattackWatchApplyModifiersToFriendlyMinions');
const ModifierMyAttackOrCounterattackWatchDamageRandomEnemy = require('./modifierMyAttackOrCounterattackWatchDamageRandomEnemy');
const ModifierMyAttackWatchSummonDeadMinions = require('./modifierMyAttackWatchSummonDeadMinions');
const ModifierMyAttackMinionWatchStealGeneralHealth = require('./modifierMyAttackMinionWatchStealGeneralHealth');
const ModifierDyingWishRespawnEntity = require('./modifierDyingWishRespawnEntity');
const ModifierBuildWatch = require('./modifierBuildWatch');
const ModifierBuildCompleteApplyModifiersToNearbyAllies = require('./modifierBuildCompleteApplyModifiersToNearbyAllies');
const ModifierBuildCompleteGainTempMana = require('./modifierBuildCompleteGainTempMana');
const ModifierBuildCompleteHealGeneral = require('./modifierBuildCompleteHealGeneral');
const ModifierMyBuildWatchDrawCards = require('./modifierMyBuildWatchDrawCards');
const ModifierMyBuildWatch = require('./modifierMyBuildWatch');
const ModifierBuildingSlowEnemies = require('./modifierBuildingSlowEnemies');
const ModifierMyAttackOrCounterattackWatch = require('./modifierMyAttackOrCounterattackWatch');
const ModifierMyAttackOrCounterattackWatchTransformIntoEgg = require('./modifierMyAttackOrCounterattackWatchTransformIntoEgg');
const ModifierCannotDamageGenerals = require('./modifierCannotDamageGenerals');
const ModifierBackstabWatchAddCardToHand = require('./modifierBackstabWatchAddCardToHand');
const ModifierBuildCompleteReplicateAndSummonDervish = require('./modifierBuildCompleteReplicateAndSummonDervish');
const ModifierBackstabWatchTransformToBuilding = require('./modifierBackstabWatchTransformToBuilding');
const ModifierOpeningGambitProgressBuild = require('./modifierOpeningGambitProgressBuild');
const ModifierAlwaysInfiltrated = require('./modifierAlwaysInfiltrated');
const ModifierSummonWatchMechsShareKeywords = require('./modifierSummonWatchMechsShareKeywords');
const ModifierSituationalBuffSelfIfHaveMech = require('./modifierSituationalBuffSelfIfHaveMech');
const ModifierStartTurnWatchApplyTempArtifactModifier = require('./modifierStartTurnWatchApplyTempArtifactModifier');
const ModifierSummonWatchByRaceSummonCopy = require('./modifierSummonWatchByRaceSummonCopy');
const ModifierAuraAboveAndBelow = require('./modifierAuraAboveAndBelow');
const ModifierDealDamageWatchApplyModifiersToAllies = require('./modifierDealDamageWatchApplyModifiersToAllies');
const ModifierKillWatchSpawnEgg = require('./modifierKillWatchSpawnEgg');
let ModifierCannotBeReplaced = require('./modifierCannotBeReplaced');
const ModifierMyAttackMinionWatch = require('./modifierMyAttackMinionWatch');
const ModifierProvidesAlwaysInfiltrated = require('./modifierProvidesAlwaysInfiltrated');
const ModifierInvulnerable = require('./modifierInvulnerable');
const ModifierForgedArtifactDescription = require('./modifierForgedArtifactDescription');
const ModifierOnDying = require('./modifierOnDying');
const ModifierOnDyingSpawnEntity = require('./modifierOnDyingSpawnEntity');
const ModifierCounter = require('./modifierCounter');
const ModifierCounterBuildProgress = require('./modifierCounterBuildProgress');
const ModifierCounterMechazorBuildProgress = require('./modifierCounterMechazorBuildProgress');
const ModifierCounterShadowCreep = require('./modifierCounterShadowCreep');
const ModifierSummonWatchAnywhereByRaceBuffSelf = require('./modifierSummonWatchAnywhereByRaceBuffSelf');
const ModifierSwitchAllegiancesGainAttack = require('./modifierSwitchAllegiancesGainAttack');
const ModifierOpponentSummonWatchRandomTransform = require('./modifierOpponentSummonWatchRandomTransform');
const ModifierOnSpawnKillMyGeneral = require('./modifierOnSpawnKillMyGeneral');
const ModifierDeathWatchGainAttackEqualToEnemyAttack = require('./modifierDeathWatchGainAttackEqualToEnemyAttack');
const ModifierDyingWishBuffEnemyGeneral = require('./modifierDyingWishBuffEnemyGeneral');
ModifierBandedProvoke = require('./modifierBandedProvoke');
ModifierBandingProvoke = require('./modifierBandingProvoke');
ModifierCannotBeReplaced = require('./modifierCannotBeReplaced');
const ModifierOpponentSummonWatchSwapGeneral = require('./modifierOpponentSummonWatchSwapGeneral');
const ModifierDyingWishPutCardInOpponentHand = require('./modifierDyingWishPutCardInOpponentHand');
const ModifierEnemySpellWatchGainRandomKeyword = require('./modifierEnemySpellWatchGainRandomKeyword');
const ModifierAnySummonWatchGainGeneralKeywords = require('./modifierAnySummonWatchGainGeneralKeywords');
const ModifierMyMoveWatchAnyReasonDrawCard = require('./modifierMyMoveWatchAnyReasonDrawCard');
const ModifierCounterBuildProgressDescription = require('./modifierCounterBuildProgressDescription');
const ModifierCounterMechazorBuildProgressDescription = require('./modifierCounterMechazorBuildProgressDescription');
const ModifierCounterShadowCreepDescription = require('./modifierCounterShadowCreepDescription');
const ModifierOpeningGambitDestroyManaCrystal = require('./modifierOpeningGambitDestroyManaCrystal');
const ModifierDyingWishDestroyManaCrystal = require('./modifierDyingWishDestroyManaCrystal');
const ModifierIntensify = require('./modifierIntensify');
const ModifierIntensifyOneManArmy = require('./modifierIntensifyOneManArmy');
const ModifierCollectableCard = require('./modifierCollectableCard');
const ModifierDyingWishReduceManaCostOfDyingWish = require('./modifierDyingWishReduceManaCostOfDyingWish');
const ModifierIntensifyBuffSelf = require('./modifierIntensifyBuffSelf');
const ModifierBandingFlying = require('./modifierBandingFlying');
const ModifierBandedFlying = require('./modifierBandedFlying');
const ModifierDyingWishApplyModifiersToGenerals = require('./modifierDyingWishApplyModifiersToGenerals');
const ModifierEnemySpellWatchHealMyGeneral = require('./modifierEnemySpellWatchHealMyGeneral');
const ModifierMyAttackWatchAreaAttack = require('./modifierMyAttackWatchAreaAttack');
const ModifierReplaceWatchApplyModifiersToReplaced = require('./modifierReplaceWatchApplyModifiersToReplaced');
const ModifierImmuneToDamageByWeakerEnemies = require('./modifierImmuneToDamageByWeakerEnemies');
const ModifierMyOtherMinionsDamagedWatch = require('./modifierMyOtherMinionsDamagedWatch');
const ModifierMyOtherMinionsDamagedWatchDamagedMinionGrows = require('./modifierMyOtherMinionsDamagedWatchDamagedMinionGrows');
const ModifierBackstabWatchSummonBackstabMinion = require('./modifierBackstabWatchSummonBackstabMinion');
const ModifierStartOpponentsTurnWatch = require('./modifierStartOpponentsTurnWatch');
const ModifierStartOpponentsTurnWatchRemoveEntity = require('./modifierStartOpponentsTurnWatchRemoveEntity');
const ModifierMyAttackWatchApplyModifiers = require('./modifierMyAttackWatchApplyModifiers');
const ModifierAlwaysBackstabbed = require('./modifierAlwaysBackstabbed');
const ModifierFriendsguard = require('./modifierFriendsguard');
const ModifierMyGeneralAttackWatchSpawnRandomEntityFromDeck = require('./modifierMyGeneralAttackWatchSpawnRandomEntityFromDeck');
const ModifierStackingShadowsBonusDamageUnique = require('./modifierStackingShadowsBonusDamageUnique');
const ModifierEnemyCannotCastBBS = require('./modifierEnemyCannotCastBBS');
const ModifierEntersBattlefieldWatch = require('./modifierEntersBattlefieldWatch');
const ModifierEntersBattlefieldWatchApplyModifiers = require('./modifierEntersBattlefieldWatchApplyModifiers');
const ModifierSummonWatchApplyModifiersToRanged = require('./modifierSummonWatchApplyModifiersToRanged');
const ModifierStartsInHand = require('./modifierStartsInHand');
const ModifierStartTurnWatchRestoreChargeToArtifacts = require('./modifierStartTurnWatchRestoreChargeToArtifacts');
const ModifierIntensifyDamageEnemyGeneral = require('./modifierIntensifyDamageEnemyGeneral');
const ModifierOpeningGambitMoveEnemyGeneralForward = require('./modifierOpeningGambitMoveEnemyGeneralForward');
const ModifierBackstabWatchApplyPlayerModifiers = require('./modifierBackstabWatchApplyPlayerModifiers');
const ModifierOpeningGambitBonusManaCrystal = require('./modifierOpeningGambitBonusManaCrystal');
const ModifierSynergizeSpawnEntityFromDeck = require('./modifierSynergizeSpawnEntityFromDeck');
const ModifierSpellWatchAnywhereApplyModifiers = require('./modifierSpellWatchAnywhereApplyModifiers');
const ModifierDamageBothGeneralsOnReplace = require('./modifierDamageBothGeneralsOnReplace');
const ModifierStackingShadowsBonusDamageEqualNumberTiles = require('./modifierStackingShadowsBonusDamageEqualNumberTiles');
const ModifierPseudoRush = require('./modifierPseudoRush');
const ModifierIntensifyDamageNearby = require('./modifierIntensifyDamageNearby');
const ModifierStartTurnWatchRemoveEntity = require('./modifierStartTurnWatchRemoveEntity');
const ModifierOnSummonFromHand = require('./modifierOnSummonFromHand');
const ModifierReplaceWatchShuffleCardIntoDeck = require('./modifierReplaceWatchShuffleCardIntoDeck');
const ModifierEnemyStunWatch = require('./modifierEnemyStunWatch');
const ModifierEnemyStunWatchTransformThis = require('./modifierEnemyStunWatchTransformThis');
const ModifierEnemyStunWatchDamageNearbyEnemies = require('./modifierEnemyStunWatchDamageNearbyEnemies');
const ModifierIntensifySpawnEntitiesNearby = require('./modifierIntensifySpawnEntitiesNearby');
const ModifierStartTurnWatchImmolateDamagedMinions = require('./modifierStartTurnWatchImmolateDamagedMinions');
const ModifierTakeDamageWatchOpponentDrawCard = require('./modifierTakeDamageWatchOpponentDrawCard');
const ModifierMyAttackWatchScarabBlast = require('./modifierMyAttackWatchScarabBlast');
const ModifierEquipFriendlyArtifactWatch = require('./modifierEquipFriendlyArtifactWatch');
const ModifierEquipFriendlyArtifactWatchGainAttackEqualToCost = require('./modifierEquipFriendlyArtifactWatchGainAttackEqualToCost');
const ModifierOpponentSummonWatchSummonMinionInFront = require('./modifierOpponentSummonWatchSummonMinionInFront');
const ModifierIntensifyTempBuffNearbyMinion = require('./modifierIntensifyTempBuffNearbyMinion');
const ModifierEndTurnWatchGainLastSpellPlayedThisTurn = require('./modifierEndTurnWatchGainLastSpellPlayedThisTurn');
const ModifierKillWatchRefreshExhaustionIfTargetStunned = require('./modifierKillWatchRefreshExhaustionIfTargetStunned');
const ModifierEnemyGeneralAttackedWatch = require('./modifierEnemyGeneralAttackedWatch');
const ModifierOnSummonFromHandApplyEmblems = require('./modifierOnSummonFromHandApplyEmblems');
const ModifierOnDyingResummonAnywhere = require('./modifierOnDyingResummonAnywhere');
const ModifierSummonWatchBurnOpponentCards = require('./modifierSummonWatchBurnOpponentCards');
const ModifierEnemyStunWatchFullyHeal = require('./modifierEnemyStunWatchFullyHeal');
const ModifierOpeningGambitChangeSignatureCardForThisTurn = require('./modifierOpeningGambitChangeSignatureCardForThisTurn');
const ModifierDyingWishGoldenGuide = require('./modifierDyingWishGoldenGuide');
const ModifierKillWatchAndSurvive = require('./modifierKillWatchAndSurvive');
const ModifierKillWatchAndSurviveScarzig = require('./modifierKillWatchAndSurviveScarzig');
const ModifierMyGeneralDamagedWatchMiniMinion = require('./modifierMyGeneralDamagedWatchMiniMinion');
const ModifierEndTurnWatchAnyPlayer = require('./modifierEndTurnWatchAnyPlayer');
const ModifierEndTurnWatchAnyPlayerPullRandomUnits = require('./modifierEndTurnWatchAnyPlayerPullRandomUnits');
const ModifierFate = require('./modifierFate');
const ModifierFateSingleton = require('./modifierFateSingleton');
const ModifierToken = require('./modifierToken');
const ModifierTokenCreator = require('./modifierTokenCreator');
const ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace = require('./modifierMyAttackMinionWatchKillTargetSummonThisOnSpace');
const ModifierFateAbyssianDyingQuest = require('./modifierFateAbyssianDyingQuest');
const ModifierFateSonghaiMinionQuest = require('./modifierFateSonghaiMinionQuest');
const ModifierFateMagmarBuffQuest = require('./modifierFateMagmarBuffQuest');
const ModifierFateLyonarSmallMinionQuest = require('./modifierFateLyonarSmallMinionQuest');
const ModifierOpeningGambitTransformHandIntoLegendaries = require('./modifierOpeningGambitTransformHandIntoLegendaries');
const ModifierFateVanarTokenQuest = require('./modifierFateVanarTokenQuest');
const ModifierFateVetruvianMovementQuest = require('./modifierFateVetruvianMovementQuest');
const ModifierEndTurnWatchAnyPlayerHsuku = require('./modifierEndTurnWatchAnyPlayerHsuku');
const ModifierCounterIntensify = require('./modifierCounterIntensify');
const ModifierCounterIntensifyDescription = require('./modifierCounterIntensifyDescription');
const ModifierCannotBeRemovedFromHand = require('./modifierCannotBeRemovedFromHand');
const ModifierQuestBuffAbyssian = require('./modifierQuestBuffAbyssian');
const ModifierQuestBuffNeutral = require('./modifierQuestBuffNeutral');
const ModifierQuestBuffVanar = require('./modifierQuestBuffVanar');
const ModifierQuestStatusLyonar = require('./modifierQuestStatusLyonar');
const ModifierQuestStatusSonghai = require('./modifierQuestStatusSonghai');
const ModifierQuestStatusAbyssian = require('./modifierQuestStatusAbyssian');
const ModifierQuestStatusVetruvian = require('./modifierQuestStatusVetruvian');
const ModifierQuestStatusMagmar = require('./modifierQuestStatusMagmar');
const ModifierQuestStatusVanar = require('./modifierQuestStatusVanar');
const ModifierQuestStatusNeutral = require('./modifierQuestStatusNeutral');

const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');
const PlayerModifierManaModifier = require('app/sdk/playerModifiers/playerModifierManaModifier');
const PlayerModifierManaModifierSingleUse = require('app/sdk/playerModifiers/playerModifierManaModifierSingleUse');
const PlayerModifierAncestralPact = require('app/sdk/playerModifiers/playerModifierAncestralPact');
const PlayerModifierMechazorBuildProgress = require('app/sdk/playerModifiers/playerModifierMechazorBuildProgress');
const PlayerModifierMechazorSummoned = require('app/sdk/playerModifiers/playerModifierMechazorSummoned');
const PlayerModifierSpellDamageModifier = require('app/sdk/playerModifiers/playerModifierSpellDamageModifier');
const PlayerModifierDamageNextUnitPlayedFromHand = require('app/sdk/playerModifiers/playerModifierDamageNextUnitPlayedFromHand');
const PlayerModifierCardDrawModifier = require('app/sdk/playerModifiers/playerModifierCardDrawModifier');
const PlayerModiferCanSummonAnywhere = require('app/sdk/playerModifiers/playerModiferCanSummonAnywhere');
const PlayerModifierSummonWatchApplyModifiers = require('app/sdk/playerModifiers/playerModifierSummonWatchApplyModifiers');
const PlayerModifierReplaceCardModifier = require('app/sdk/playerModifiers/playerModifierReplaceCardModifier');
const PlayerModifierEndTurnRespawnEntityWithBuff = require('app/sdk/playerModifiers/playerModifierEndTurnRespawnEntityWithBuff');
const PlayerModifierPreventSpellDamage = require('app/sdk/playerModifiers/playerModifierPreventSpellDamage');
const PlayerModifierManaModifierOncePerTurn = require('app/sdk/playerModifiers/playerModifierManaModifierOncePerTurn');
const PlayerModifierMyDeathwatchDrawCard = require('app/sdk/playerModifiers/playerModifierMyDeathwatchDrawCard');
const PlayerModifierBattlePetManager = require('app/sdk/playerModifiers/playerModifierBattlePetManager.js');
const PlayerModifierCannotReplace = require('app/sdk/playerModifiers/playerModifierCannotReplace');
const PlayerModifierChangeSignatureCard = require('app/sdk/playerModifiers/playerModifierChangeSignatureCard');
const PlayerModifierSignatureCardAlwaysReady = require('app/sdk/playerModifiers/playerModifierSignatureCardAlwaysReady');
const PlayerModifierManaModifierNextCard = require('app/sdk/playerModifiers/playerModifierManaModifierNextCard');
const PlayerModifierFlashReincarnation = require('app/sdk/playerModifiers/playerModifierFlashReincarnation');
const PlayerModifierFriendlyAttackWatch = require('app/sdk/playerModifiers/playerModifierFriendlyAttackWatch');
const PlayerModifierSummonWatch = require('app/sdk/playerModifiers/playerModifierSummonWatch');
const PlayerModifierSummonWatchIfFlyingDrawFlyingMinion = require('app/sdk/playerModifiers/playerModifierSummonWatchIfFlyingDrawFlyingMinion');
const PlayerModifierOpponentSummonWatch = require('app/sdk/playerModifiers/playerModifierOpponentSummonWatch');
const PlayerModifierOpponentSummonWatchSwapGeneral = require('app/sdk/playerModifiers/playerModifierOpponentSummonWatchSwapGeneral');
const PlayerModifierSummonWatchFromActionBar = require('app/sdk/playerModifiers/playerModifierSummonWatchFromActionBar');
const PlayerModifierEndTurnRespawnEntityAnywhere = require('app/sdk/playerModifiers/playerModifierEndTurnRespawnEntityAnywhere');
const PlayerModifierTeamAlwaysBackstabbed = require('app/sdk/playerModifiers/playerModifierTeamAlwaysBackstabbed');
const PlayerModifierEmblem = require('app/sdk/playerModifiers/playerModifierEmblem');
const PlayerModifierEmblemSummonWatch = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatch');
const PlayerModifierEmblemSummonWatchSingletonQuest = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatchSingletonQuest');
const PlayerModifierEmblemEndTurnWatch = require('app/sdk/playerModifiers/playerModifierEmblemEndTurnWatch');
const PlayerModifierEmblemEndTurnWatchLyonarSmallMinionQuest = require('app/sdk/playerModifiers/playerModifierEmblemEndTurnWatchLyonarSmallMinionQuest');
const PlayerModifierSpellWatch = require('app/sdk/playerModifiers/playerModifierSpellWatch');
const PlayerModifierSpellWatchHollowVortex = require('app/sdk/playerModifiers/playerModifierSpellWatchHollowVortex');
const PlayerModifierEmblemSummonWatchVanarTokenQuest = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatchVanarTokenQuest');
const PlayerModifierEmblemSituationalVetQuestFrenzy = require('app/sdk/playerModifiers/playerModifierEmblemSituationalVetQuestFrenzy');
const PlayerModifierEmblemSituationalVetQuestFlying = require('app/sdk/playerModifiers/playerModifierEmblemSituationalVetQuestFlying');
const PlayerModifierEmblemSituationalVetQuestCelerity = require('app/sdk/playerModifiers/playerModifierEmblemSituationalVetQuestCelerity');
const PlayerModifierEndTurnWatchRevertBBS = require('app/sdk/playerModifiers/playerModifierEndTurnWatchRevertBBS');
const PlayerModifierEmblemSummonWatchFromHandMagmarBuffQuest = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatchFromHandMagmarBuffQuest');
const PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatchSonghaiMeltdownQuest');
const PlayerModifierEmblemSummonWatchAbyssUndyingQuest = require('app/sdk/playerModifiers/playerModifierEmblemSummonWatchAbyssUndyingQuest');
const PlayerModifierEmblemGainMinionOrLoseControlWatch = require('app/sdk/playerModifiers/playerModifierEmblemGainMinionOrLoseControlWatch');

const GameSessionModifier = require('app/sdk/gameSessionModifiers/gameSessionModifier');
const GameSessionModifierFestiveSpirit = require('app/sdk/gameSessionModifiers/gameSessionModifierFestiveSpirit');

const _ = require('underscore');

class ModifierFactory {

  static modifierForType(modifierType,gameSession) {
    const modifierClass = ModifierFactory.modifierClassForType(modifierType);
    if (modifierClass) {
      return new modifierClass(gameSession);
    } else {
      throw new Error("Tried to create an unknown modifier from type: " + modifierType);
    }
  }

  static modifierClassForType(modifierType) {
    if (modifierType === Modifier.type) {
      return Modifier;
    }
    if (modifierType === ModifierOpeningGambit.type) {
      return ModifierOpeningGambit;
    }
    if (modifierType === ModifierFirstBlood.type) {
      return ModifierFirstBlood;
    }
    if (modifierType === ModifierProvoke.type) {
      return ModifierProvoke;
    }
    if (modifierType === ModifierDestructible.type) {
      return ModifierDestructible;
    }
    if (modifierType === ModifierSituationalBuffSelf.type) {
      return ModifierSituationalBuffSelf;
    }
    if (modifierType === ModifierBanding.type) {
      return ModifierBanding;
    }
    if (modifierType === ModifierBandingAttack.type) {
      return ModifierBandingAttack;
    }
    if (modifierType === ModifierBandingAttackAndHealth.type) {
      return ModifierBandingAttackAndHealth;
    }
    if (modifierType === ModifierBandingHeal.type) {
      return ModifierBandingHeal;
    }
    if (modifierType === ModifierAirdrop.type) {
      return ModifierAirdrop;
    }
    if (modifierType === ModifierBandingRanged.type) {
      return ModifierBandingRanged;
    }
    if (modifierType === ModifierStrikeback.type) {
      return ModifierStrikeback;
    }
    if (modifierType === ModifierFrenzy.type) {
      return ModifierFrenzy;
    }
    if (modifierType === ModifierOpeningGambitDispel.type) {
      return ModifierOpeningGambitDispel;
    }
    if (modifierType === ModifierDeathWatch.type) {
      return ModifierDeathWatch;
    }
    if (modifierType === ModifierDeathWatchBuffSelf.type) {
      return ModifierDeathWatchBuffSelf;
    }
    if (modifierType === ModifierDeathWatchDamageEnemyGeneralHealMyGeneral.type) {
      return ModifierDeathWatchDamageEnemyGeneralHealMyGeneral;
    }
    if (modifierType === ModifierFlying.type) {
      return ModifierFlying;
    }
    if (modifierType === ModifierOpeningGambitSpawnEntity.type) {
      return ModifierOpeningGambitSpawnEntity;
    }
    if (modifierType === ModifierDeathWatchSpawnEntity.type) {
      return ModifierDeathWatchSpawnEntity;
    }
    if (modifierType === ModifierOpeningGambitSacrificeNearbyBuffSelf.type) {
      return ModifierOpeningGambitSacrificeNearbyBuffSelf;
    }
    if (modifierType === ModifierOpeningGambitDamageMyGeneral.type) {
      return ModifierOpeningGambitDamageMyGeneral;
    }
    if (modifierType === ModifierOpeningGambitDamageBothGenerals.type) {
      return ModifierOpeningGambitDamageBothGenerals;
    }
    if (modifierType === ModifierKillWatchSpawnEntity.type) {
      return ModifierKillWatchSpawnEntity;
    }
    if (modifierType === ModifierDyingWishBonusMana.type) {
      return ModifierDyingWishBonusMana;
    }
    if (modifierType === ModifierDyingWishDrawCard.type) {
      return ModifierDyingWishDrawCard;
    }
    if (modifierType === ModifierCollectableBonusMana.type) {
      return ModifierCollectableBonusMana;
    }
    if (modifierType === ModifierImmune.type) {
      return ModifierImmune;
    }
    if (modifierType === ModifierImmuneToAttacks.type) {
      return ModifierImmuneToAttacks;
    }
    if (modifierType === ModifierImmuneToDamage.type) {
      return ModifierImmuneToDamage;
    }
    if (modifierType === ModifierImmuneToDamageByRanged.type) {
      return ModifierImmuneToDamageByRanged;
    }
    if (modifierType === ModifierImmuneToDamageByGeneral.type) {
      return ModifierImmuneToDamageByGeneral;
    }
    if (modifierType === ModifierImmuneToSpellsByEnemy.type) {
      return ModifierImmuneToSpellsByEnemy;
    }
    if (modifierType === ModifierImmuneToAttacksByGeneral.type) {
      return ModifierImmuneToAttacksByGeneral;
    }
    if (modifierType === ModifierImmuneToAttacksByRanged.type) {
      return ModifierImmuneToAttacksByRanged;
    }
    if (modifierType === ModifierImmuneToSpells.type) {
      return ModifierImmuneToSpells;
    }
    if (modifierType === ModifierImmuneToDamageBySpells.type) {
      return ModifierImmuneToDamageBySpells;
    }
    if (modifierType === ModifierSpellWatchSpawnEntity.type) {
      return ModifierSpellWatchSpawnEntity;
    }
    if (modifierType === ModifierSpellWatch.type) {
      return ModifierSpellWatch;
    }
    if (modifierType === ModifierSpellWatchDamageGeneral.type) {
      return ModifierSpellWatchDamageGeneral;
    }
    if (modifierType === ModifierOpeningGambitRetrieveMostRecentSpell.type) {
      return ModifierOpeningGambitRetrieveMostRecentSpell;
    }
    if (modifierType === ModifierOpeningGambitRetrieveRandomSpell.type) {
      return ModifierOpeningGambitRetrieveRandomSpell;
    }
    if (modifierType === ModifierDispelOnAttack.type) {
      return ModifierDispelOnAttack;
    }
    if (modifierType === ModifierSummonWatchHealSelf.type) {
      return ModifierSummonWatchHealSelf;
    }
    if (modifierType === ModifierDamageGeneralOnAttack.type) {
      return ModifierDamageGeneralOnAttack;
    }
    if (modifierType === ModifierDyingWishSpawnEntity.type) {
      return ModifierDyingWishSpawnEntity;
    }
    if (modifierType === ModifierStartTurnWatchSpawnEntity.type) {
      return ModifierStartTurnWatchSpawnEntity;
    }
    if (modifierType === ModifierStartTurnWatchDamageMyGeneral.type) {
      return ModifierStartTurnWatchDamageMyGeneral;
    }
    if (modifierType === ModifierBlastAttack.type) {
      return ModifierBlastAttack;
    }
    if (modifierType === ModifierBlastAttackStrong.type) {
      return ModifierBlastAttackStrong;
    }
    if (modifierType === ModifierBackstab.type) {
      return ModifierBackstab;
    }
    if (modifierType === ModifierTranscendance.type) {
      return ModifierTranscendance;
    }
    if (modifierType === ModifierMyAttackWatch.type) {
      return ModifierMyAttackWatch;
    }
    if (modifierType === ModifierMyAttackWatchBuffSelf.type) {
      return ModifierMyAttackWatchBuffSelf;
    }
    if (modifierType === ModifierDyingWishDamageGeneral.type) {
      return ModifierDyingWishDamageGeneral;
    }
    if (modifierType === ModifierDyingWishDamageEnemyGeneralHealGeneral.type) {
      return ModifierDyingWishDamageEnemyGeneralHealGeneral;
    }
    if (modifierType === Modifier.type) {
      return Modifier;
    }
    if (modifierType === ModifierRanged.type) {
      return ModifierRanged;
    }
    if (modifierType === ModifierSilence.type) {
      return ModifierSilence;
    }
    if (modifierType === ModifierBanded.type) {
      return ModifierBanded;
    }
    if (modifierType === ModifierBandedHeal.type) {
      return ModifierBandedHeal;
    }
    if (modifierType === ModifierBandedRanged.type) {
      return ModifierBandedRanged;
    }
    if (modifierType === ModifierObstructing.type) {
      return ModifierObstructing;
    }
    if (modifierType === ModifierUntargetable.type) {
      return ModifierUntargetable;
    }
    if (modifierType === ModifierStackingShadows.type) {
      return ModifierStackingShadows;
    }
    if (modifierType === ModifierProvoked.type) {
      return ModifierProvoked;
    }
    if (modifierType === ModifierAttackEqualsHealth.type) {
      return ModifierAttackEqualsHealth;
    }
    if (modifierType === ModifierManaCostChange.type) {
      return ModifierManaCostChange;
    }
    if (modifierType === ModifierPortal.type) {
      return ModifierPortal;
    }
    if (modifierType === ModifierOpeningGambitRefreshArtifacts.type) {
      return ModifierOpeningGambitRefreshArtifacts;
    }
    if (modifierType === ModifierDealDamageWatchKillTargetAndSelf.type) {
      return ModifierDealDamageWatchKillTargetAndSelf;
    }
    if (modifierType === ModifierDealDamageWatchModifyTarget.type) {
      return ModifierDealDamageWatchModifyTarget;
    }
    if (modifierType === ModifierSpellWatchBloodLeech.type) {
      return ModifierSpellWatchBloodLeech;
    }
    if (modifierType === ModifierSummonWatchPutCardInHand.type) {
      return ModifierSummonWatchPutCardInHand;
    }
    if (modifierType === ModifierSpellWatchBuffAlliesByRace.type) {
      return ModifierSpellWatchBuffAlliesByRace;
    }
    if (modifierType === ModifierCardControlledPlayerModifiers.type) {
      return ModifierCardControlledPlayerModifiers;
    }
    if (modifierType === ModifierOpeningGambitApplyModifiers.type) {
      return ModifierOpeningGambitApplyModifiers;
    }
    if (modifierType === ModifierOpeningGambitApplyModifiersToDeck.type) {
      return ModifierOpeningGambitApplyModifiersToDeck;
    }
    if (modifierType === ModifierOpeningGambitApplyPlayerModifier.type) {
      return ModifierOpeningGambitApplyPlayerModifier;
    }
    if (modifierType === ModifierOpeningGambitApplyMechazorPlayerModifiers.type) {
      return ModifierOpeningGambitApplyMechazorPlayerModifiers;
    }
    if (modifierType === ModifierRangedProvoke.type) {
      return ModifierRangedProvoke;
    }
    if (modifierType === ModifierRangedProvoked.type) {
      return ModifierRangedProvoked;
    }
    if (modifierType === ModifierOpeningGambitDamageNearby.type) {
      return ModifierOpeningGambitDamageNearby;
    }
    if (modifierType === ModifierDyingWishSpawnEntityAnywhere.type) {
      return ModifierDyingWishSpawnEntityAnywhere;
    }
    if (modifierType === ModifierStartTurnWatchDamageEnemyGeneralBuffSelf.type) {
      return ModifierStartTurnWatchDamageEnemyGeneralBuffSelf;
    }
    if (modifierType === ModifierStunned.type) {
      return ModifierStunned;
    }
    if (modifierType === ModifierGrow.type) {
      return ModifierGrow;
    }
    if (modifierType === ModifierRebirth.type) {
      return ModifierRebirth;
    }
    if (modifierType === ModifierEgg.type) {
      return ModifierEgg;
    }
    if (modifierType === ModifierEndTurnWatchSpawnEgg.type) {
      return ModifierEndTurnWatchSpawnEgg;
    }
    if (modifierType === ModifierEndTurnWatchSpawnEntity.type) {
      return ModifierEndTurnWatchSpawnEntity;
    }
    if (modifierType === ModifierEndTurnWatchDamageAllMinions.type) {
      return ModifierEndTurnWatchDamageAllMinions;
    }
    if (modifierType === ModifierForcefield.type) {
      return ModifierForcefield;
    }
    if (modifierType === ModifierAntiMagicField.type) {
      return ModifierAntiMagicField;
    }
    if (modifierType === ModifierDyingWishApplyModifiers.type) {
      return ModifierDyingWishApplyModifiers;
    }
    if (modifierType === ModifierOpeningGambitDamageInFront.type) {
      return ModifierOpeningGambitDamageInFront;
    }
    if (modifierType === ModifierMyGeneralDamagedWatch.type) {
      return ModifierMyGeneralDamagedWatch;
    }
    if (modifierType === ModifierMyGeneralDamagedWatchBuffSelf.type) {
      return ModifierMyGeneralDamagedWatchBuffSelf;
    }
    if (modifierType === ModifierMyGeneralDamagedWatchHealSelf.type) {
      return ModifierMyGeneralDamagedWatchHealSelf;
    }
    if (modifierType === ModifierMyGeneralDamagedWatchDamageNearby.type) {
      return ModifierMyGeneralDamagedWatchDamageNearby;
    }
    if (modifierType === ModifierSummonWatchByEntityBuffSelf.type) {
      return ModifierSummonWatchByEntityBuffSelf;
    }
    if (modifierType === ModifierStartTurnWatchSummonDervish.type) {
      return ModifierStartTurnWatchSummonDervish;
    }
    if (modifierType === ModifierEphemeral.type) {
      return ModifierEphemeral;
    }
    if (modifierType === ModifierInfiltrate.type) {
      return ModifierInfiltrate;
    }
    if (modifierType === ModifierCannot.type) {
      return ModifierCannot;
    }
    if (modifierType === ModifierCannotAttackGeneral.type) {
      return ModifierCannotAttackGeneral;
    }
    if (modifierType === ModifierCannotStrikeback.type) {
      return ModifierCannotStrikeback;
    }
    if (modifierType === ModifierSummonWatchByRaceBuffSelf.type) {
      return ModifierSummonWatchByRaceBuffSelf;
    }
    if (modifierType === ModifierSummonWatchSpawnEntity.type) {
      return ModifierSummonWatchSpawnEntity;
    }
    if (modifierType === ModifierTakeDamageWatch.type) {
      return ModifierTakeDamageWatch;
    }
    if (modifierType === ModifierTakeDamageWatchHealMyGeneral.type) {
      return ModifierTakeDamageWatchHealMyGeneral;
    }
    if (modifierType === ModifierStartTurnWatchDamageRandom.type) {
      return ModifierStartTurnWatchDamageRandom;
    }
    if (modifierType === ModifierSummonWatchByRaceDamageEnemyMinion.type) {
      return ModifierSummonWatchByRaceDamageEnemyMinion;
    }
    if (modifierType === ModifierEndTurnWatch.type) {
      return ModifierEndTurnWatch;
    }
    if (modifierType === ModifierEndTurnWatchDamageNearbyEnemy.type) {
      return ModifierEndTurnWatchDamageNearbyEnemy;
    }
    if (modifierType === ModifierBandingDoubleAttack.type) {
      return ModifierBandingDoubleAttack;
    }
    if (modifierType === ModifierBandedDoubleAttack.type) {
      return ModifierBandedDoubleAttack;
    }
    if (modifierType === ModifierOpeningGambitHealMyGeneral.type) {
      return ModifierOpeningGambitHealMyGeneral;
    }
    if (modifierType === ModifierDoubleDamageToMinions.type) {
      return ModifierDoubleDamageToMinions;
    }
    if (modifierType === ModifierOpeningGambitBuffSelfByShadowTileCount.type) {
      return ModifierOpeningGambitBuffSelfByShadowTileCount;
    }
    if (modifierType === ModifierDealDamageWatchHealMyGeneral.type) {
      return ModifierDealDamageWatchHealMyGeneral;
    }
    if (modifierType === ModifierDealDamageWatchKillTarget.type) {
      return ModifierDealDamageWatchKillTarget;
    }
    if (modifierType === ModifierOpponentSummonWatch.type) {
      return ModifierOpponentSummonWatch;
    }
    if (modifierType === ModifierOpponentSummonWatchBuffSelf.type) {
      return ModifierOpponentSummonWatchBuffSelf;
    }
    if (modifierType === ModifierStartTurnWatchBounceToActionBar.type) {
      return ModifierStartTurnWatchBounceToActionBar;
    }
    if (modifierType === ModifierTakeDamageWatchDamageEnemy.type) {
      return ModifierTakeDamageWatchDamageEnemy;
    }
    if (modifierType === ModifierOpeningGambitDamageNearbyMinions.type) {
      return ModifierOpeningGambitDamageNearbyMinions;
    }
    if (modifierType === ModifierDestroyAtEndOfTurn.type) {
      return ModifierDestroyAtEndOfTurn;
    }
    if (modifierType === ModifierMyMinionOrGeneralDamagedWatch.type) {
      return ModifierMyMinionOrGeneralDamagedWatch;
    }
    if (modifierType === ModifierMyMinionOrGeneralDamagedWatchBuffSelf.type) {
      return ModifierMyMinionOrGeneralDamagedWatchBuffSelf;
    }
    if (modifierType === ModifierAbsorbDamage.type) {
      return ModifierAbsorbDamage;
    }
    if (modifierType === ModifierDyingWishSpawnUnitFromOpponentsDeck.type) {
      return ModifierDyingWishSpawnUnitFromOpponentsDeck;
    }
    if (modifierType === ModifierTransformed.type) {
      return ModifierTransformed;
    }
    if (modifierType === ModifierStunWhenAttacked.type) {
      return ModifierStunWhenAttacked;
    }
    if (modifierType === ModifierWall.type) {
      return ModifierWall;
    }
    if (modifierType === ModifierOpeningGambitSpawnCopiesOfEntityAnywhere.type) {
      return ModifierOpeningGambitSpawnCopiesOfEntityAnywhere;
    }
    if (modifierType === ModifierSummonWatchBuffSelf.type) {
      return ModifierSummonWatchBuffSelf;
    }
    if (modifierType === ModifierOpponentSummonWatchDamageEnemyGeneral.type) {
      return ModifierOpponentSummonWatchDamageEnemyGeneral;
    }
    if (modifierType === ModifierDyingWishEquipArtifactFromDeck.type) {
      return ModifierDyingWishEquipArtifactFromDeck;
    }
    if (modifierType === ModifierOpeningGambitDrawArtifactFromDeck.type) {
      return ModifierOpeningGambitDrawArtifactFromDeck;
    }
    if (modifierType === ModifierSummonWatchApplyModifiers.type) {
      return ModifierSummonWatchApplyModifiers;
    }
    if (modifierType === ModifierSummonWatchNearbyApplyModifiers.type) {
      return ModifierSummonWatchNearbyApplyModifiers;
    }
    if (modifierType === ModifierTakeDamageWatchRandomTeleport.type) {
      return ModifierTakeDamageWatchRandomTeleport;
    }
    if (modifierType === ModifierOpeningGambitSpawnEntityInEachCorner.type) {
      return ModifierOpeningGambitSpawnEntityInEachCorner;
    }
    if (modifierType === ModifierDyingWishBonusManaCrystal.type) {
      return ModifierDyingWishBonusManaCrystal;
    }
    if (modifierType === ModifierOpeningGambitMindwarp.type) {
      return ModifierOpeningGambitMindwarp;
    }
    if (modifierType === ModifierReduceCostOfMinionsAndDamageThem.type) {
      return ModifierReduceCostOfMinionsAndDamageThem;
    }
    if (modifierType === ModifierStunnedVanar.type) {
      return ModifierStunnedVanar;
    }
    if (modifierType === ModifierEndTurnWatchSpawnRandomEntity.type) {
      return ModifierEndTurnWatchSpawnRandomEntity;
    }
    if (modifierType === ModifierDealDamageWatchSpawnEntity.type) {
      return ModifierDealDamageWatchSpawnEntity;
    }
    if (modifierType === ModifierSpellDamageWatch.type) {
      return ModifierSpellDamageWatch;
    }
    if (modifierType === ModifierSpellDamageWatchPutCardInHand.type) {
      return ModifierSpellDamageWatchPutCardInHand;
    }
    if (modifierType === ModifierOpeningGambitRemoveRandomArtifact.type) {
      return ModifierOpeningGambitRemoveRandomArtifact;
    }
    if (modifierType === ModifierEndTurnWatchHealNearby.type) {
      return ModifierEndTurnWatchHealNearby;
    }
    if (modifierType === ModifierDealDamageWatchTeleportToMe.type) {
      return ModifierDealDamageWatchTeleportToMe;
    }
    if (modifierType === ModifierWraithlingFury.type) {
      return ModifierWraithlingFury;
    }
    if (modifierType === ModifierOpeningGambitRazorback.type) {
      return ModifierOpeningGambitRazorback;
    }
    if (modifierType === ModifierDyingWishSpawnEntityNearbyGeneral.type) {
      return ModifierDyingWishSpawnEntityNearbyGeneral;
    }
    if (modifierType === ModifierSummonWatchFromActionBarSpawnEntity.type) {
      return ModifierSummonWatchFromActionBarSpawnEntity;
    }
    if (modifierType === ModifierOpeningGambitBuffSelfByOpponentHandCount.type) {
      return ModifierOpeningGambitBuffSelfByOpponentHandCount;
    }
    if (modifierType === ModifierTakeDamageWatchDamageEnemyGeneralForSame.type) {
      return ModifierTakeDamageWatchDamageEnemyGeneralForSame;
    }
    if (modifierType === ModifierDealDamageWatchBuffSelf.type) {
      return ModifierDealDamageWatchBuffSelf;
    }
    if (modifierType === ModifierDyingWishDamageNearbyAllies.type) {
      return ModifierDyingWishDamageNearbyAllies;
    }
    if (modifierType === ModifierKillWatchHealSelf.type) {
      return ModifierKillWatchHealSelf;
    }
    if (modifierType === ModifierBandingDealDamageWatchDrawCard.type) {
      return ModifierBandingDealDamageWatchDrawCard;
    }
    if (modifierType === ModifierDealDamageWatchDrawCard.type) {
      return ModifierDealDamageWatchDrawCard;
    }
    if (modifierType === ModifierStartTurnWatchSwapStats.type) {
      return ModifierStartTurnWatchSwapStats;
    }
    if (modifierType === ModifierHealSelfWhenDealingDamage.type) {
      return ModifierHealSelfWhenDealingDamage;
    }
    if (modifierType === ModifierDealDamageWatchHealorDamageGeneral.type) {
      return ModifierDealDamageWatchHealorDamageGeneral;
    }
    if (modifierType === ModifierDyingWishPutCardInHand.type) {
      return ModifierDyingWishPutCardInHand;
    }
    if (modifierType === ModifierDyingWishPutCardInHandClean.type) {
      return ModifierDyingWishPutCardInHandClean;
    }
    if (modifierType === ModifierOpeningGambitLifeGive.type) {
      return ModifierOpeningGambitLifeGive;
    }
    if (modifierType === ModifierOpeningGambitTeleportAllNearby.type) {
      return ModifierOpeningGambitTeleportAllNearby;
    }
    if (modifierType === ModifierRook.type) {
      return ModifierRook;
    }
    if (modifierType === ModifierEndTurnWatchHealSelfAndGeneral.type) {
      return ModifierEndTurnWatchHealSelfAndGeneral;
    }
    if (modifierType === ModifierEndTurnWatchHealSelf.type) {
      return ModifierEndTurnWatchHealSelf;
    }
    if (modifierType === ModifierBandingHealSelfAndGeneral.type) {
      return ModifierBandingHealSelfAndGeneral;
    }
    if (modifierType === ModifierDeathWatchDrawToXCards.type) {
      return ModifierDeathWatchDrawToXCards;
    }
    if (modifierType === ModifierDyingWishSpawnTile.type) {
      return ModifierDyingWishSpawnTile;
    }
    if (modifierType === ModifierDyingWishReSpawnEntityAnywhere.type) {
      return ModifierDyingWishReSpawnEntityAnywhere;
    }
    if (modifierType === ModifierSummonWatchNearbyApplyModifiersOncePerTurn.type) {
      return ModifierSummonWatchNearbyApplyModifiersOncePerTurn;
    }
    if (modifierType === ModifierHealWatch.type) {
      return ModifierHealWatch;
    }
    if (modifierType === ModifierHealWatchBuffSelf.type) {
      return ModifierHealWatchBuffSelf;
    }
    if (modifierType === ModifierHealWatchDamageNearbyEnemies.type) {
      return ModifierHealWatchDamageNearbyEnemies;
    }
    if (modifierType === ModifierRemoveAndReplaceEntity.type) {
      return   ModifierRemoveAndReplaceEntity;
    }
    if (modifierType === ModifierMyMoveWatch.type) {
      return   ModifierMyMoveWatch;
    }
    if (modifierType === ModifierMyMoveWatchSpawnEntity.type) {
      return   ModifierMyMoveWatchSpawnEntity;
    }
    if (modifierType === ModifierMyMoveWatchApplyModifiers.type) {
      return   ModifierMyMoveWatchApplyModifiers;
    }
    if (modifierType === ModifierMyMoveWatchDrawCard.type) {
      return ModifierMyMoveWatchDrawCard;
    }
    if (modifierType === ModifierDyingWishSpawnEntityInCorner.type) {
      return   ModifierDyingWishSpawnEntityInCorner;
    }
    if (modifierType === ModifierSpiritScribe.type) {
      return   ModifierSpiritScribe;
    }
    if (modifierType === ModifierTakeDamageWatchSpawnRandomToken.type) {
      return   ModifierTakeDamageWatchSpawnRandomToken;
    }
    if (modifierType === ModifierSummonWatchFromActionBarByOpeningGambitBuffSelf.type) {
      return   ModifierSummonWatchFromActionBarByOpeningGambitBuffSelf;
    }
    if (modifierType === ModifierOpeningGambitApplyModifiersRandomly.type) {
      return   ModifierOpeningGambitApplyModifiersRandomly;
    }
    if (modifierType === ModifierImmuneToSpellDamage.type) {
      return ModifierImmuneToSpellDamage;
    }
    if (modifierType === ModifierReplaceWatchDamageEnemy.type) {
      return ModifierReplaceWatchDamageEnemy;
    }
    if (modifierType === ModifierReplaceWatchBuffSelf.type) {
      return ModifierReplaceWatchBuffSelf;
    }
    if (modifierType === ModifierBuffSelfOnReplace.type) {
      return ModifierBuffSelfOnReplace;
    }
    if (modifierType === ModifierSummonSelfOnReplace.type) {
      return ModifierSummonSelfOnReplace;
    }
    if (modifierType === ModifierTakeDamageWatchDispel.type) {
      return ModifierTakeDamageWatchDispel;
    }
    if (modifierType === ModifierTakeDamageWatchPutCardInHand.type) {
      return ModifierTakeDamageWatchPutCardInHand;
    }
    if (modifierType === ModifierOpeningGambitDrawCardBothPlayers.type) {
      return ModifierOpeningGambitDrawCardBothPlayers;
    }
    if (modifierType === ModifierSurviveDamageWatchReturnToHand.type) {
      return ModifierSurviveDamageWatchReturnToHand;
    }
    if (modifierType === ModifierOpeningGambitDamageNearbyForAttack.type) {
      return ModifierOpeningGambitDamageNearbyForAttack;
    }
    if (modifierType === ModifierMyAttackOrAttackedWatchDrawCard.type) {
      return ModifierMyAttackOrAttackedWatchDrawCard;
    }
    if (modifierType === ModifierForcefieldAbsorb.type) {
      return ModifierForcefieldAbsorb;
    }
    if (modifierType === ModifierUnseven.type) {
      return ModifierUnseven;
    }
    if (modifierType === ModifierDoubleDamageToGenerals.type) {
      return ModifierDoubleDamageToGenerals;
    }
    if (modifierType === ModifierShadowScar.type) {
      return ModifierShadowScar;
    }
    if (modifierType === ModifierStackingShadowsDebuff.type) {
      return ModifierStackingShadowsDebuff;
    }
    if (modifierType === ModifierEndTurnWatchApplyModifiers.type) {
      return ModifierEndTurnWatchApplyModifiers;
    }
    if (modifierType === ModifierOpeningGambitApplyModifiersToDeckAndHand.type) {
      return ModifierOpeningGambitApplyModifiersToDeckAndHand;
    }
    if (modifierType === ModifierOpeningGambitApplyModifiersToHand.type) {
      return ModifierOpeningGambitApplyModifiersToHand;
    }
    if (modifierType === ModifierMechazorWatchPutMechazorInHand.type) {
      return ModifierMechazorWatchPutMechazorInHand;
    }
    if (modifierType === ModifierHealWatchPutCardInHand.type) {
      return ModifierHealWatchPutCardInHand;
    }
    if (modifierType === ModifierEnemyCannotHeal.type) {
      return ModifierEnemyCannotHeal;
    }
    if (modifierType === ModifierEnemyTakeDamageWatchHealMyGeneral.type) {
      return ModifierEnemyTakeDamageWatchHealMyGeneral;
    }
    if (modifierType === ModifierTakeDamageWatchDamageNearbyForSame.type) {
      return ModifierTakeDamageWatchDamageNearbyForSame;
    }
    if (modifierType === ModifierImmuneToDamageFromEnemyMinions.type) {
      return ModifierImmuneToDamageFromEnemyMinions;
    }
    if (modifierType === ModifierDoubleDamageToEnemyMinions.type) {
      return ModifierDoubleDamageToEnemyMinions;
    }
    if (modifierType === ModifierOpeningGambitDrawFactionCards.type) {
      return ModifierOpeningGambitDrawFactionCards;
    }
    if (modifierType === ModifierOpeningGambitHealBothGenerals.type) {
      return ModifierOpeningGambitHealBothGenerals;
    }
    if (modifierType === ModifierOpponentDrawCardWatchBuffSelf.type) {
      return ModifierOpponentDrawCardWatchBuffSelf;
    }
    if (modifierType === ModifierEnvyBaer.type) {
      return ModifierEnvyBaer;
    }
    if (modifierType === ModifierOpeningGambitGrincher.type) {
      return ModifierOpeningGambitGrincher;
    }
    if (modifierType === ModifierSpellWatchScientist.type) {
      return ModifierSpellWatchScientist;
    }
    if (modifierType === ModifierOpeningGambitDamageEverything.type) {
      return ModifierOpeningGambitDamageEverything;
    }
    if (modifierType === ModifierCostChangeIfMyGeneralDamagedLastTurn.type) {
      return ModifierCostChangeIfMyGeneralDamagedLastTurn;
    }
    if (modifierType === ModifierMyGeneralDamagedWatchBuffSelfAndDrawACard.type) {
      return ModifierMyGeneralDamagedWatchBuffSelfAndDrawACard;
    }
    if (modifierType === ModifierDynamicCountModifySelf.type) {
      return ModifierDynamicCountModifySelf;
    }
    if (modifierType === ModifierCostEqualGeneralHealth.type) {
      return ModifierCostEqualGeneralHealth;
    }
    if (modifierType === ModifierStackingShadowsBonusDamage.type) {
      return ModifierStackingShadowsBonusDamage;
    }
    if (modifierType === ModifierDynamicCountModifySelfByShadowTilesOnBoard.type) {
      return ModifierDynamicCountModifySelfByShadowTilesOnBoard;
    }
    if (modifierType === ModifierBattlePet.type) {
      return ModifierBattlePet;
    }
    if (modifierType === ModifierCannotMove.type) {
      return ModifierCannotMove;
    }
    if (modifierType === ModifierOpeningGambitDrawRandomBattlePet.type) {
      return ModifierOpeningGambitDrawRandomBattlePet;
    }
    if (modifierType === ModifierDyingWishDamageNearbyEnemies.type) {
      return ModifierDyingWishDamageNearbyEnemies;
    }
    if (modifierType === ModifierDealDamageWatchKillNeutralTarget.type) {
      return ModifierDealDamageWatchKillNeutralTarget;
    }
    if (modifierType === ModifierTakeDamageWatchSpawnRandomBattlePet.type) {
      return ModifierTakeDamageWatchSpawnRandomBattlePet;
    }
    if (modifierType === ModifierDyingWishDrawMechazorCard.type) {
      return ModifierDyingWishDrawMechazorCard;
    }
    if (modifierType === ModifierOpeningGambitApplyModifiersByRaceId.type) {
      return ModifierOpeningGambitApplyModifiersByRaceId;
    }
    if (modifierType === ModifierOpeningGambitApplyModifiersToGeneral.type) {
      return ModifierOpeningGambitApplyModifiersToGeneral;
    }
    if (modifierType === ModifierOpeningGambitDrawCard.type) {
      return ModifierOpeningGambitDrawCard;
    }
    if (modifierType === ModifierEndTurnWatchApplyModifiersRandomly.type) {
      return ModifierEndTurnWatchApplyModifiersRandomly;
    }
    if (modifierType === ModifierBandingChangeCardDraw.type) {
      return ModifierBandingChangeCardDraw;
    }
    if (modifierType === ModifierTakeDamageWatchDamageAllEnemies.type) {
      return ModifierTakeDamageWatchDamageAllEnemies;
    }
    if (modifierType === ModifierDyingWishXho.type) {
      return ModifierDyingWishXho;
    }
    if (modifierType === ModifierDyingWishDrawRandomBattlePet.type) {
      return ModifierDyingWishDrawRandomBattlePet;
    }
    if (modifierType === ModifierAnyDrawCardWatchBuffSelf.type) {
      return ModifierAnyDrawCardWatchBuffSelf;
    }
    if (modifierType === ModifierTakeDamageWatchDestroy.type) {
      return ModifierTakeDamageWatchDestroy;
    }
    if (modifierType === ModifierDyingWishSpawnRandomEntity.type) {
      return ModifierDyingWishSpawnRandomEntity;
    }
    if (modifierType === ModifierTakeDamageWatchSpawnEntity.type) {
      return ModifierTakeDamageWatchSpawnEntity;
    }
    if (modifierType === ModifierPantheran.type) {
      return ModifierPantheran;
    }
    if (modifierType === ModifierEndTurnWatchSwapAllegiance.type) {
      return ModifierEndTurnWatchSwapAllegiance;
    }
    if (modifierType === ModifierDyingWishCorpseCombustion.type) {
      return ModifierDyingWishCorpseCombustion;
    }
    if (modifierType === ModifierOpeningGambitApplyModifiersToWraithlings.type) {
      return ModifierOpeningGambitApplyModifiersToWraithlings;
    }
    if (modifierType === ModifierInkhornGaze.type) {
      return ModifierInkhornGaze;
    }
    if (modifierType === ModifierDeathWatchBuffRandomMinionInHand.type) {
      return ModifierDeathWatchBuffRandomMinionInHand;
    }
    if (modifierType === ModifierOpeningGambitHatchFriendlyEggs.type) {
      return ModifierOpeningGambitHatchFriendlyEggs;
    }
    if (modifierType === ModifierGrowOnBothTurns.type) {
      return   ModifierGrowOnBothTurns;
    }
    if (modifierType === ModifierSummonWatchFromEggApplyModifiers.type) {
      return   ModifierSummonWatchFromEggApplyModifiers;
    }
    if (modifierType === ModifierAnySummonWatchFromActionBarApplyModifiersToSelf.type) {
      return ModifierAnySummonWatchFromActionBarApplyModifiersToSelf;
    }
    if (modifierType === ModifierSnowRippler.type) {
      return ModifierSnowRippler;
    }
    if (modifierType === ModifierSurviveDamageWatchBur.type) {
      return ModifierSurviveDamageWatchBur;
    }
    if (modifierType === ModifierSummonWatchByRaceHealToFull.type) {
      return ModifierSummonWatchByRaceHealToFull;
    }
    if (modifierType === ModifierSummonWatchByCardBuffTarget.type) {
      return ModifierSummonWatchByCardBuffTarget;
    }
    if (modifierType === ModifierOpeningGambitDamageEnemiesNearShadowCreep.type) {
      return ModifierOpeningGambitDamageEnemiesNearShadowCreep;
    }
    if (modifierType === ModifierMyAttackOrAttackedWatchSpawnMinionNearby.type) {
      return ModifierMyAttackOrAttackedWatchSpawnMinionNearby;
    }
    if (modifierType === ModifierSummonWatchDreadnaught.type) {
      return ModifierSummonWatchDreadnaught;
    }
    if (modifierType === ModifierReplaceWatchSpawnEntity.type) {
      return ModifierReplaceWatchSpawnEntity;
    }
    if (modifierType === ModifierDynamicCountModifySelfCostByBattlePetsOnBoard.type) {
      return ModifierDynamicCountModifySelfCostByBattlePetsOnBoard;
    }
    if (modifierType === ModifierApplyMinionToBoardWatchApplyModifiersToTarget.type) {
      return ModifierApplyMinionToBoardWatchApplyModifiersToTarget;
    }
    if (modifierType === ModifierKillWatchSpawnEnemyEntity.type) {
      return ModifierKillWatchSpawnEnemyEntity;
    }
    if (modifierType === ModifierEndEveryTurnWatchDamageOwner.type) {
      return ModifierEndEveryTurnWatchDamageOwner;
    }
    if (modifierType === ModifierMyTeamMoveWatchAnyReason.type) {
      return ModifierMyTeamMoveWatchAnyReason;
    }
    if (modifierType === ModifierMyTeamMoveWatchAnyReasonBuffTarget.type) {
      return ModifierMyTeamMoveWatchAnyReasonBuffTarget;
    }
    if (modifierType === ModifierEndTurnWatchRefreshArtifacts.type) {
      return ModifierEndTurnWatchRefreshArtifacts;
    }
    if (modifierType === ModifierGainAttackWatchBuffSelfBySameThisTurn.type) {
      return ModifierGainAttackWatchBuffSelfBySameThisTurn;
    }
    if (modifierType === ModifierInquisitorKron.type) {
      return ModifierInquisitorKron;
    }
    if (modifierType === ModifierTakeDamageWatchSpawnShadowCreep.type) {
      return ModifierTakeDamageWatchSpawnShadowCreep;
    }
    if (modifierType === ModifierDyingWishApplyModifiersRandomly.type) {
      return ModifierDyingWishApplyModifiersRandomly;
    }
    if (modifierType === ModifierOpeningGambitBuffSelfByBattlePetsHandStats.type) {
      return ModifierOpeningGambitBuffSelfByBattlePetsHandStats;
    }
    if (modifierType === ModifierHealWatchBuffGeneral.type) {
      return ModifierHealWatchBuffGeneral;
    }
    if (modifierType === ModifierDealDamageWatchHatchEggs.type) {
      return ModifierDealDamageWatchHatchEggs;
    }
    if (modifierType === ModifierDyingWishDispelNearestEnemy.type) {
      return ModifierDyingWishDispelNearestEnemy;
    }
    if (modifierType === ModifierSpawnedFromEgg.type) {
      return ModifierSpawnedFromEgg;
    }
    if (modifierType === ModifierTamedBattlePet.type) {
      return ModifierTamedBattlePet;
    }
    if (modifierType === ModifierFriendlyDeathWatchForBattlePetDrawCard.type) {
      return ModifierFriendlyDeathWatchForBattlePetDrawCard;
    }
    if (modifierType === ModifierDyingWishSpawnTileAnywhere.type) {
      return ModifierDyingWishSpawnTileAnywhere;
    }
    if (modifierType === ModifierElkowl.type) {
      return ModifierElkowl;
    }
    if (modifierType === ModifierOpeningGambitPutCardInOpponentHand.type) {
      return ModifierOpeningGambitPutCardInOpponentHand;
    }
    if (modifierType === ModifierEndTurnWatchSpawnTile.type) {
      return ModifierEndTurnWatchSpawnTile;
    }
    if (modifierType === ModifierMyMinionAttackWatchHealGeneral.type) {
      return ModifierMyMinionAttackWatchHealGeneral;
    }
    if (modifierType === ModifierImmuneToDamageFromMinionsAndGenerals.type) {
      return ModifierImmuneToDamageFromMinionsAndGenerals;
    }
    if (modifierType === ModifierOpeningGambitDamageInFrontRow.type) {
      return ModifierOpeningGambitDamageInFrontRow;
    }
    if (modifierType === ModifierInvalidateRush.type) {
      return ModifierInvalidateRush;
    }
    if (modifierType === ModifierStartTurnWatchEquipArtifact.type) {
      return ModifierStartTurnWatchEquipArtifact;
    }
    if (modifierType === ModifierStartTurnWatchPlaySpell.type) {
      return ModifierStartTurnWatchPlaySpell;
    }
    if (modifierType === ModifierOpeningGambitSpawnCopiesOfEntityNearby.type) {
      return ModifierOpeningGambitSpawnCopiesOfEntityNearby;
    }
    if (modifierType === ModifierDyingWishDispelAllEnemyMinions.type) {
      return ModifierDyingWishDispelAllEnemyMinions;
    }
    if (modifierType === ModifierOpponentDrawCardWatchDamageEnemyGeneral.type) {
      return ModifierOpponentDrawCardWatchDamageEnemyGeneral;
    }
    if (modifierType === ModifierAttacksDealNoDamage.type) {
      return ModifierAttacksDealNoDamage;
    }
    if (modifierType === ModifierOpeningGambitRefreshSignatureCard.type) {
      return ModifierOpeningGambitRefreshSignatureCard;
    }
    if (modifierType === ModifierSynergizeSpawnVanarToken.type) {
      return ModifierSynergizeSpawnVanarToken;
    }
    if (modifierType === ModifierOpeningGambitChangeSignatureCard.type) {
      return ModifierOpeningGambitChangeSignatureCard;
    }
    if (modifierType === ModifierDoubleAttackStat.type) {
      return ModifierDoubleAttackStat;
    }
    if (modifierType === ModifierSynergizeApplyModifiers.type) {
      return ModifierSynergizeApplyModifiers;
    }
    if (modifierType === ModifierMyGeneralDamagedWatchBuffSelfAttackForSame.type) {
      return ModifierMyGeneralDamagedWatchBuffSelfAttackForSame;
    }
    if (modifierType === ModifierKillWatchRefreshExhaustion.type) {
      return ModifierKillWatchRefreshExhaustion;
    }
    if (modifierType === ModifierHasBackstab.type) {
      return ModifierHasBackstab;
    }
    if (modifierType === ModifierDealDamageWatchRefreshSignatureCard.type) {
      return ModifierDealDamageWatchRefreshSignatureCard;
    }
    if (modifierType === ModifierOpeningGambitGrandmasterVariax.type) {
      return ModifierOpeningGambitGrandmasterVariax;
    }
    if (modifierType === ModifierSynergizeRefreshSpell.type) {
      return ModifierSynergizeRefreshSpell;
    }
    if (modifierType === ModifierImmuneToDamageOnEnemyTurn.type) {
      return ModifierImmuneToDamageOnEnemyTurn;
    }
    if (modifierType === ModifierOpeningGambitDestroyNearbyMinions.type) {
      return ModifierOpeningGambitDestroyNearbyMinions;
    }
    if (modifierType === ModifierSynergizeHealMyGeneral.type) {
      return ModifierSynergizeHealMyGeneral;
    }
    if (modifierType === ModifierSynergizeDamageEnemyGeneral.type) {
      return ModifierSynergizeDamageEnemyGeneral;
    }
    if (modifierType === ModifierSynergizeApplyModifiersToGeneral.type) {
      return ModifierSynergizeApplyModifiersToGeneral;
    }
    if (modifierType === ModifierSynergizeDamageEnemy.type) {
      return ModifierSynergizeDamageEnemy;
    }
    if (modifierType === ModifierSynergizeApplyModifiersToWraithlings.type) {
      return ModifierSynergizeApplyModifiersToWraithlings;
    }
    if (modifierType === ModifierOpeningGambitSpawnVanarTokensAroundGeneral.type) {
      return ModifierOpeningGambitSpawnVanarTokensAroundGeneral;
    }
    if (modifierType === ModifierDyingWishTransformRandomMinion.type) {
      return ModifierDyingWishTransformRandomMinion;
    }
    if (modifierType === ModifierOnSpawnCopyMyGeneral.type) {
      return ModifierOnSpawnCopyMyGeneral;
    }
    if (modifierType === ModifierTakesDoubleDamage.type) {
      return ModifierTakesDoubleDamage;
    }
    if (modifierType === ModifierMyHealWatchAnywhereBuffSelf.type) {
      return ModifierMyHealWatchAnywhereBuffSelf;
    }
    if (modifierType === ModifierToggleStructure.type) {
      return ModifierToggleStructure;
    }
    if (modifierType === ModifierSynergizeTeleportRandomEnemy.type) {
      return ModifierSynergizeTeleportRandomEnemy;
    }
    if (modifierType === ModifierStartTurnWatchDispelAllEnemyMinionsDrawCard.type) {
      return ModifierStartTurnWatchDispelAllEnemyMinionsDrawCard;
    }
    if (modifierType === ModifierAbsorbDamageGolems.type) {
      return ModifierAbsorbDamageGolems;
    }
    if (modifierType === ModifierExpireApplyModifiers.type) {
      return ModifierExpireApplyModifiers;
    }
    if (modifierType === ModifierSecondWind.type) {
      return ModifierSecondWind;
    }
    if (modifierType === ModifierKillWatchRespawnEntity.type) {
      return ModifierKillWatchRespawnEntity;
    }
    if (modifierType === ModifierOpponentSummonWatchSpawn1HealthClone.type) {
      return ModifierOpponentSummonWatchSpawn1HealthClone;
    }
    if (modifierType === ModifierDealOrTakeDamageWatch.type) {
      return ModifierDealOrTakeDamageWatch;
    }
    if (modifierType === ModifierDealOrTakeDamageWatchRandomTeleportOther.type) {
      return ModifierDealOrTakeDamageWatchRandomTeleportOther;
    }
    if (modifierType === ModifierEndTurnWatchTeleportCorner.type) {
      return ModifierEndTurnWatchTeleportCorner;
    }
    if (modifierType === ModifierDieSpawnNewGeneral.type) {
      return ModifierDieSpawnNewGeneral;
    }
    if (modifierType === ModifierEndTurnWatchDealDamageToSelfAndNearbyEnemies.type) {
      return ModifierEndTurnWatchDealDamageToSelfAndNearbyEnemies;
    }
    if (modifierType === ModifierBond.type) {
      return ModifierBond;
    }
    if (modifierType === ModifierBondApplyModifiers.type) {
      return ModifierBondApplyModifiers;
    }
    if (modifierType === ModifierDoubleHealthStat.type) {
      return ModifierDoubleHealthStat;
    }
    if (modifierType === ModifierBandingApplyModifiers.type) {
      return ModifierBandingApplyModifiers;
    }
    if (modifierType === ModifierBondApplyModifiersByRaceId.type) {
      return ModifierBondApplyModifiersByRaceId;
    }
    if (modifierType === ModifierBelongsToAllRaces.type) {
      return ModifierBelongsToAllRaces;
    }
    if (modifierType === ModifierOpeningGambitGoleminate.type) {
      return ModifierOpeningGambitGoleminate;
    }
    if (modifierType === ModifierSpellWatchDrawRandomArcanyst.type) {
      return ModifierSpellWatchDrawRandomArcanyst;
    }
    if (modifierType === ModifierOpeningGambitSpawnTribal.type) {
      return ModifierOpeningGambitSpawnTribal;
    }
    if (modifierType === ModifierDyingWishSpawnTribal.type) {
      return ModifierDyingWishSpawnTribal;
    }
    if (modifierType === ModifierDrawCardWatchCopySpell.type) {
      return ModifierDrawCardWatchCopySpell;
    }
    if (modifierType === ModifierBondPutCardsInHand.type) {
      return ModifierBondPutCardsInHand;
    }
    if (modifierType === ModifierBondDrawCards.type) {
      return ModifierBondDrawCards;
    }
    if (modifierType === ModifierSpellWatchBuffAllies.type) {
      return ModifierSpellWatchBuffAllies;
    }
    if (modifierType === ModifierMyAttackWatchGetSonghaiSpells.type) {
      return ModifierMyAttackWatchGetSonghaiSpells;
    }
    if (modifierType === ModifierBondSpawnEntity.type) {
      return ModifierBondSpawnEntity;
    }
    if (modifierType === ModifierHealWatchDamageRandomEnemy.type) {
      return ModifierHealWatchDamageRandomEnemy;
    }
    if (modifierType === ModifierOpeningGambitSirocco.type) {
      return ModifierOpeningGambitSirocco;
    }
    if (modifierType === ModifierBondNightshroud.type) {
      return ModifierBondNightshroud;
    }
    if (modifierType === ModifierSpellWatchPutCardInHand.type) {
      return ModifierSpellWatchPutCardInHand;
    }
    if (modifierType === ModifierNocturne.type) {
      return ModifierNocturne;
    }
    if (modifierType === ModifierOpeningGambitDeathKnell.type) {
      return ModifierOpeningGambitDeathKnell;
    }
    if (modifierType === ModifierBondHealMyGeneral.type) {
      return ModifierBondHealMyGeneral;
    }
    if (modifierType === ModifierTakeDamageWatchJuggernaut.type) {
      return ModifierTakeDamageWatchJuggernaut;
    }
    if (modifierType === ModifierKillWatchSpawnCopyNearby.type) {
      return ModifierKillWatchSpawnCopyNearby;
    }
    if (modifierType === ModifierOnRemoveSpawnRandomDeadEntity.type) {
      return ModifierOnRemoveSpawnRandomDeadEntity;
    }
    if (modifierType === ModifierGrowPermanent.type) {
      return ModifierGrowPermanent;
    }
    if (modifierType === ModifierShatteringHeart.type) {
      return ModifierShatteringHeart;
    }
    if (modifierType === ModifierOpeningGambitEquipArtifact.type) {
      return ModifierOpeningGambitEquipArtifact;
    }
    if (modifierType === ModifierFeralu.type) {
      return ModifierFeralu;
    }
    if (modifierType === ModifierDispelAreaAttack.type) {
      return ModifierDispelAreaAttack;
    }
    if (modifierType === ModifierSummonWatchAnyPlayer.type) {
      return ModifierSummonWatchAnyPlayer;
    }
    if (modifierType === ModifierSummonWatchAnyPlayerApplyModifiers.type) {
      return ModifierSummonWatchAnyPlayerApplyModifiers;
    }
    if (modifierType === ModifierSummonWatchNearbyAnyPlayerApplyModifiers.type) {
      return ModifierSummonWatchNearbyAnyPlayerApplyModifiers;
    }
    if (modifierType === ModifierSelfDamageAreaAttack.type) {
      return ModifierSelfDamageAreaAttack;
    }
    if (modifierType === ModifierOpponentSummonWatchOpponentDrawCard.type) {
      return ModifierOpponentSummonWatchOpponentDrawCard;
    }
    if (modifierType === ModifierOpponentDrawCardWatchOverdrawSummonEntity.type) {
      return ModifierOpponentDrawCardWatchOverdrawSummonEntity;
    }
    if (modifierType === ModifierEndTurnWatchDamagePlayerBasedOnRemainingMana.type) {
      return ModifierEndTurnWatchDamagePlayerBasedOnRemainingMana;
    }
    if (modifierType === ModifierHPChange.type) {
      return ModifierHPChange;
    }
    if (modifierType === ModifierHPThresholdGainModifiers.type) {
      return ModifierHPThresholdGainModifiers;
    }
    if (modifierType === ModifierExtraDamageOnCounterattack.type) {
      return ModifierExtraDamageOnCounterattack;
    }
    if (modifierType === ModifierOnOpponentDeathWatch.type) {
      return ModifierOnOpponentDeathWatch;
    }
    if (modifierType === ModifierOnOpponentDeathWatchSpawnEntityOnSpace.type) {
      return ModifierOnOpponentDeathWatchSpawnEntityOnSpace;
    }
    if (modifierType === ModifierDyingWishSpawnEgg.type) {
      return ModifierDyingWishSpawnEgg;
    }
    if (modifierType === ModifierSummonWatchFromActionBarApplyModifiers.type) {
      return ModifierSummonWatchFromActionBarApplyModifiers;
    }
    if (modifierType === ModifierTakeDamageWatchSpawnWraithlings.type) {
      return ModifierTakeDamageWatchSpawnWraithlings;
    }
    if (modifierType === ModifierTakeDamageWatchDamageAttacker.type) {
      return ModifierTakeDamageWatchDamageAttacker;
    }
    if (modifierType === ModifierStartTurnWatchTeleportRandomSpace.type) {
      return ModifierStartTurnWatchTeleportRandomSpace;
    }
    if (modifierType === ModifierSummonWatchFromActionBarAnyPlayer.type) {
      return ModifierSummonWatchFromActionBarAnyPlayer;
    }
    if (modifierType === ModifierSummonWatchFromActionBarAnyPlayerApplyModifiers.type) {
      return ModifierSummonWatchFromActionBarAnyPlayerApplyModifiers;
    }
    if (modifierType === ModifierStartTurnWatchDamageGeneralEqualToMinionsOwned.type) {
      return ModifierStartTurnWatchDamageGeneralEqualToMinionsOwned;
    }
    if (modifierType === ModifierCannotBeReplaced.type) {
      return ModifierCannotBeReplaced;
    }
    if (modifierType === ModifierHPChangeSummonEntity.type) {
      return ModifierHPChangeSummonEntity;
    }
    if (modifierType === ModifierStartTurnWatchDamageAndBuffSelf.type) {
      return ModifierStartTurnWatchDamageAndBuffSelf;
    }
    if (modifierType === ModifierEnemyTeamMoveWatch.type) {
      return ModifierEnemyTeamMoveWatch;
    }
    if (modifierType === ModifierEnemyTeamMoveWatchSummonEntityBehind.type) {
      return ModifierEnemyTeamMoveWatchSummonEntityBehind;
    }
    if (modifierType === ModifierDyingWishLoseGame.type) {
      return ModifierDyingWishLoseGame;
    }
    if (modifierType === ModifierAttacksDamageAllEnemyMinions.type) {
      return ModifierAttacksDamageAllEnemyMinions;
    }
    if (modifierType === ModifierATKThresholdDie.type) {
      return ModifierATKThresholdDie;
    }
    if (modifierType === ModifierOpeningGambitRemoveCardsFromDecksByCost.type) {
      return ModifierOpeningGambitRemoveCardsFromDecksByCost;
    }
    if (modifierType === ModifierDyingWishAddCardToDeck.type) {
      return ModifierDyingWishAddCardToDeck;
    }
    if (modifierType === ModifierOnDyingInfest.type) {
      return ModifierOnDyingInfest;
    }
    if (modifierType === ModifierDyingWishDrawEnemyLegendaryArtifact.type) {
      return ModifierDyingWishDrawEnemyLegendaryArtifact;
    }
    if (modifierType === ModifierSynergizeDamageClosestEnemy.type) {
      return ModifierSynergizeDamageClosestEnemy;
    }
    if (modifierType === ModifierOverwatchHidden.type) {
      return ModifierOverwatchHidden;
    }
    if (modifierType === ModifierOverwatchAttackedBuffSelf.type) {
      return ModifierOverwatchAttackedBuffSelf;
    }
    if (modifierType === ModifierOverwatchMovedNearbyAttack.type) {
      return ModifierOverwatchMovedNearbyAttack;
    }
    if (modifierType === ModifierOverwatchMovedNearbyMoveBothToCorners.type) {
      return ModifierOverwatchMovedNearbyMoveBothToCorners;
    }
    if (modifierType === ModifierOverwatchMovedNearbyDispelAndProvoke.type) {
      return ModifierOverwatchMovedNearbyDispelAndProvoke;
    }
    if (modifierType === ModifierOverwatchDestroyedResummonAndDestroyOther.type) {
      return ModifierOverwatchDestroyedResummonAndDestroyOther;
    }
    if (modifierType === ModifierOverwatchMovedNearbyMiniImmolation.type) {
      return ModifierOverwatchMovedNearbyMiniImmolation;
    }
    if (modifierType === ModifierOverwatchDestroyedPutCardInHand.type) {
      return ModifierOverwatchDestroyedPutCardInHand;
    }
    if (modifierType === ModifierOverwatchAttackedDamageEnemyGeneralForSame.type) {
      return ModifierOverwatchAttackedDamageEnemyGeneralForSame;
    }
    if (modifierType === ModifierOverwatchDestroyedPutMagmarCardsInHand.type) {
      return ModifierOverwatchDestroyedPutMagmarCardsInHand;
    }
    if (modifierType === ModifierEnemyMinionAttackWatchGainKeyword.type) {
      return ModifierEnemyMinionAttackWatchGainKeyword;
    }
    if (modifierType === ModifierOpeningGambitSpawnEnemyMinionNearOpponent.type) {
      return ModifierOpeningGambitSpawnEnemyMinionNearOpponent;
    }
    if (modifierType === ModifierEnemyDealDamageWatch.type) {
      return ModifierEnemyDealDamageWatch;
    }
    if (modifierType === ModifierEnemySpellWatch.type) {
      return ModifierEnemySpellWatch;
    }
    if (modifierType === ModifierEnemySpellWatchBuffSelf.type) {
      return ModifierEnemySpellWatchBuffSelf;
    }
    if (modifierType === ModifierOpponentDrawCardWatchGainKeyword.type) {
      return ModifierOpponentDrawCardWatchGainKeyword;
    }
    if (modifierType === ModifierOpponentSummonWatchSummonEgg.type) {
      return ModifierOpponentSummonWatchSummonEgg;
    }
    if (modifierType === ModifierOpponentSummonWatchBuffMinionInHand.type) {
      return ModifierOpponentSummonWatchBuffMinionInHand;
    }
    if (modifierType === ModifierSummonWatchAnyPlayer.type) {
      return ModifierSummonWatchAnyPlayer;
    }
    if (modifierType === ModifierEndTurnWatchTransformNearbyEnemies.type) {
      return ModifierEndTurnWatchTransformNearbyEnemies;
    }
    if (modifierType === ModifierBackstabWatch.type) {
      return ModifierBackstabWatch;
    }
    if (modifierType === ModifierBackstabWatchStealSpellFromDeck.type) {
      return ModifierBackstabWatchStealSpellFromDeck;
    }
    if (modifierType === ModifierDyingWishDrawMinionsWithDyingWish.type) {
      return  ModifierDyingWishDrawMinionsWithDyingWish;
    }
    if (modifierType === ModifierOverwatchSpellTarget.type) {
      return ModifierOverwatchSpellTarget;
    }
    if (modifierType === ModifierOverwatchEndTurn.type) {
      return ModifierOverwatchEndTurn;
    }
    if (modifierType === ModifierOverwatchSpellTargetDamageEnemies.type) {
      return ModifierOverwatchSpellTargetDamageEnemies;
    }
    if (modifierType === ModifierOverwatchEndTurnPutCardInHand.type) {
      return ModifierOverwatchEndTurnPutCardInHand;
    }
    if (modifierType === ModifierDealDamageWatchControlEnemyMinionUntilEOT.type) {
      return ModifierDealDamageWatchControlEnemyMinionUntilEOT;
    }
    if (modifierType === ModifierStartTurnWatchDamageEnemiesInRow.type) {
      return ModifierStartTurnWatchDamageEnemiesInRow;
    }
    if (modifierType === ModifierStartTurnWatchDestroySelfAndEnemies.type) {
      return ModifierStartTurnWatchDestroySelfAndEnemies;
    }
    if (modifierType === ModifierSentinelHidden.type) {
      return ModifierSentinelHidden;
    }
    if (modifierType === ModifierSentinelSetup.type) {
      return ModifierSentinelSetup;
    }
    if (modifierType === ModifierSentinelOpponentSummonDamageIt.type) {
      return ModifierSentinelOpponentSummonDamageIt;
    }
    if (modifierType === ModifierSentinelOpponentGeneralAttack.type) {
      return ModifierSentinelOpponentGeneralAttack;
    }
    if (modifierType === ModifierSummonWatchIfLowAttackSummonedBuffSelf.type) {
      return ModifierSummonWatchIfLowAttackSummonedBuffSelf;
    }
    if (modifierType === ModifierMyAttackWatchBonusManaCrystal.type) {
      return ModifierMyAttackWatchBonusManaCrystal;
    }
    if (modifierType === ModifierEnemySpellWatchCopySpell.type) {
      return ModifierEnemySpellWatchCopySpell;
    }
    if (modifierType === ModifierOpeningGambitPutCardInHand.type) {
      return ModifierOpeningGambitPutCardInHand;
    }
    if (modifierType === ModifierSentinelOpponentSpellCast.type) {
      return ModifierSentinelOpponentSpellCast;
    }
    if (modifierType === ModifierStartTurnWatchPutCardInHand.type) {
      return ModifierStartTurnWatchPutCardInHand;
    }
    if (modifierType === ModifierHallowedGround.type) {
      return ModifierHallowedGround;
    }
    if (modifierType === ModifierHallowedGroundBuff.type) {
      return ModifierHallowedGroundBuff;
    }
    if (modifierType === ModifierSandPortal.type) {
      return ModifierSandPortal;
    }
    if (modifierType === ModifierDoomed.type) {
      return ModifierDoomed;
    }
    if (modifierType === ModifierOpeningGambitRemoveArtifactToDrawArtifactFromFaction.type) {
      return ModifierOpeningGambitRemoveArtifactToDrawArtifactFromFaction;
    }
    if (modifierType === ModifierEnemySpellWatchPutCardInHand.type) {
      return ModifierEnemySpellWatchPutCardInHand;
    }
    if (modifierType === ModifierSentinelOpponentSummonCopyIt.type) {
      return ModifierSentinelOpponentSummonCopyIt;
    }
    if (modifierType === ModifierDealDamageWatchTeleportEnemyToYourSide.type) {
      return ModifierDealDamageWatchTeleportEnemyToYourSide;
    }
    if (modifierType === ModifierSpellWatchDamageAllMinions.type) {
      return ModifierSpellWatchDamageAllMinions;
    }
    if (modifierType === ModifierSentinelOpponentSummonSwapPlaces.type) {
      return ModifierSentinelOpponentSummonSwapPlaces;
    }
    if (modifierType === ModifierMyAttackWatchSpawnMinionNearby.type) {
      return ModifierMyAttackWatchSpawnMinionNearby;
    }
    if (modifierType === ModifierDyingWishDrawWishCard.type) {
      return ModifierDyingWishDrawWishCard;
    }
    if (modifierType === ModifierEnemyAttackWatch.type) {
      return ModifierEnemyAttackWatch;
    }
    if (modifierType === ModifierWildTahr.type) {
      return ModifierWildTahr;
    }
    if (modifierType === ModifierEndTurnWatchGainTempBuff.type) {
      return ModifierEndTurnWatchGainTempBuff;
    }
    if (modifierType === ModifierImmuneToAttacksByMinions.type) {
      return ModifierImmuneToAttacksByMinions;
    }
    if (modifierType === ModifierOpeningGambitAlabasterTitan.type) {
      return ModifierOpeningGambitAlabasterTitan;
    }
    if (modifierType === ModifierPrimalProtection.type) {
      return ModifierPrimalProtection;
    }
    if (modifierType === ModifierPrimalTile.type) {
      return ModifierPrimalTile;
    }
    if (modifierType === ModifierSummonWatchFromActionBar.type) {
      return ModifierSummonWatchFromActionBar;
    }
    if (modifierType === ModifierMyMoveWatchAnyReason.type) {
      return ModifierMyMoveWatchAnyReason;
    }
    if (modifierType === ModifierMyMoveWatchAnyReasonDamageNearbyEnemyMinions.type) {
      return ModifierMyMoveWatchAnyReasonDamageNearbyEnemyMinions;
    }
    if (modifierType === ModifierCannotCastSpellsByCost.type) {
      return ModifierCannotCastSpellsByCost;
    }
    if (modifierType === ModifierKillWatchBounceEnemyToActionBar.type) {
      return ModifierKillWatchBounceEnemyToActionBar;
    }
    if (modifierType === ModifierMyGeneralAttackWatch.type) {
      return ModifierMyGeneralAttackWatch;
    }
    if (modifierType === ModifierMyGeneralAttackWatchSpawnEntity.type) {
      return ModifierMyGeneralAttackWatchSpawnEntity;
    }
    if (modifierType === ModifierOpeningGambitReplaceHand.type) {
      return ModifierOpeningGambitReplaceHand;
    }
    if (modifierType === ModifierDealDamageWatchDamageJoinedEnemies.type) {
      return ModifierDealDamageWatchDamageJoinedEnemies;
    }
    if (modifierType === ModifierEternalHeart.type) {
      return ModifierEternalHeart;
    }
    if (modifierType === ModifierOpeningGambitSpawnPartyAnimals.type) {
      return ModifierOpeningGambitSpawnPartyAnimals;
    }
    if (modifierType === ModifierSprigginDiesBuffSelf.type) {
      return ModifierSprigginDiesBuffSelf;
    }
    if (modifierType === ModifierSituationalBuffSelfIfSpriggin.type) {
      return ModifierSituationalBuffSelfIfSpriggin;
    }
    if (modifierType === ModifierMirage.type) {
      return ModifierMirage;
    }
    if (modifierType === ModifierCustomSpawn.type) {
      return ModifierCustomSpawn;
    }
    if (modifierType === ModifierCustomSpawnOnOtherUnit.type) {
      return ModifierCustomSpawnOnOtherUnit;
    }
    if (modifierType === ModifierOpeningGambitDagona.type) {
      return ModifierOpeningGambitDagona;
    }
    if (modifierType === ModifierDyingWishDagona.type) {
      return ModifierDyingWishDagona;
    }
    if (modifierType === ModifierMyAttackWatchGamble.type) {
      return ModifierMyAttackWatchGamble;
    }
    if (modifierType === ModifierOpeningGambitStealEnemyGeneralHealth.type) {
      return ModifierOpeningGambitStealEnemyGeneralHealth;
    }
    if (modifierType === ModifierDoomed2.type) {
      return ModifierDoomed2;
    }
    if (modifierType === ModifierDoomed3.type) {
      return ModifierDoomed3;
    }
    if (modifierType === ModifierDeathWatchDamageRandomMinionHealMyGeneral.type) {
      return ModifierDeathWatchDamageRandomMinionHealMyGeneral;
    }
    if (modifierType === ModifierStartTurnWatchSpawnTile.type) {
      return ModifierStartTurnWatchSpawnTile;
    }
    if (modifierType === ModifierDealDamageWatchIfMinionHealMyGeneral.type) {
      return ModifierDealDamageWatchIfMinionHealMyGeneral;
    }
    if (modifierType === ModifierSynergizeSummonMinionNearGeneral.type) {
      return ModifierSynergizeSummonMinionNearGeneral;
    }
    if (modifierType === ModifierSpellWatchApplyModifiers.type) {
      return ModifierSpellWatchApplyModifiers;
    }
    if (modifierType === ModifierOpeningGambitProgenitor.type) {
      return ModifierOpeningGambitProgenitor;
    }
    if (modifierType === ModifierSpellWatchDrawCard.type) {
      return ModifierSpellWatchDrawCard;
    }
    if (modifierType === ModifierSynergizeDrawBloodboundSpell.type) {
      return ModifierSynergizeDrawBloodboundSpell;
    }
    if (modifierType === ModifierOpeningGambitDrawCopyFromDeck.type) {
      return ModifierOpeningGambitDrawCopyFromDeck;
    }
    if (modifierType === ModifierBandedProvoke.type) {
      return ModifierBandedProvoke;
    }
    if (modifierType === ModifierBandingProvoke.type) {
      return ModifierBandingProvoke;
    }
    if (modifierType === ModifierKillWatchDeceptibot.type) {
      return ModifierKillWatchDeceptibot;
    }
    if (modifierType === ModifierDeathWatchBuffMinionsInHand.type) {
      return ModifierDeathWatchBuffMinionsInHand;
    }
    if (modifierType === ModifierDyingWishDestroyRandomEnemyNearby.type) {
      return ModifierDyingWishDestroyRandomEnemyNearby;
    }
    if (modifierType === ModifierSynergizeSummonMinionNearby.type) {
      return ModifierSynergizeSummonMinionNearby;
    }
    if (modifierType === ModifierBuilding.type) {
      return ModifierBuilding;
    }
    if (modifierType === ModifierBuild.type) {
      return ModifierBuild;
    }
    if (modifierType === ModifierBeforeMyAttackWatch.type) {
      return ModifierBeforeMyAttackWatch;
    }
    if (modifierType === ModifierMyAttackWatchApplyModifiersToAllies.type) {
      return ModifierMyAttackWatchApplyModifiersToAllies;
    }
    if (modifierType === ModifierSummonWatchFromActionBarByRaceBothPlayersDraw.type) {
      return ModifierSummonWatchFromActionBarByRaceBothPlayersDraw;
    }
    if (modifierType === ModifierSummonWatchApplyModifiersToBoth.type) {
      return ModifierSummonWatchApplyModifiersToBoth;
    }
    if (modifierType === ModifierSummonWatchNearbyApplyModifiersToBoth.type) {
      return ModifierSummonWatchNearbyApplyModifiersToBoth;
    }
    if (modifierType === ModifierSummonWatchTransform.type) {
      return ModifierSummonWatchTransform;
    }
    if (modifierType === ModifierSummonWatchNearbyTransform.type) {
      return ModifierSummonWatchNearbyTransform;
    }
    if (modifierType === ModifierSynergizePutCardInHand.type) {
      return ModifierSynergizePutCardInHand;
    }
    if (modifierType === ModifierSynergizeBuffSelf.type) {
      return ModifierSynergizeBuffSelf;
    }
    if (modifierType === ModifierSentinelOpponentGeneralAttackHealEnemyGeneralDrawCard.type) {
      return ModifierSentinelOpponentGeneralAttackHealEnemyGeneralDrawCard;
    }
    if (modifierType === ModifierSentinelOpponentSummonBuffItDrawCard.type) {
      return ModifierSentinelOpponentSummonBuffItDrawCard;
    }
    if (modifierType === ModifierSentinelOpponentSpellCastRefundManaDrawCard.type) {
      return ModifierSentinelOpponentSpellCastRefundManaDrawCard;
    }
    if (modifierType === ModifierTakeDamageWatchSpawnRandomHaunt.type) {
      return ModifierTakeDamageWatchSpawnRandomHaunt;
    }
    if (modifierType === ModifierCannotCastBBS.type) {
      return ModifierCannotCastBBS;
    }
    if (modifierType === ModifierStartTurnWatchPutCardInOpponentsHand.type) {
      return ModifierStartTurnWatchPutCardInOpponentsHand;
    }
    if (modifierType === ModifierSynergizeRazorArchitect.type) {
      return ModifierSynergizeRazorArchitect;
    }
    if (modifierType === ModifierDeathWatchSpawnRandomDemon.type) {
      return ModifierDeathWatchSpawnRandomDemon;
    }
    if (modifierType === ModifierWhenAttackedDestroyThis.type) {
      return ModifierWhenAttackedDestroyThis;
    }
    if (modifierType === ModifierSituationalBuffSelfIfFullHealth.type) {
      return ModifierSituationalBuffSelfIfFullHealth;
    }
    if (modifierType === ModifierEnemyAttackWatchGainAttack.type) {
      return ModifierEnemyAttackWatchGainAttack;
    }
    if (modifierType === ModifierDeathWatchFriendlyMinionSwapAllegiance.type) {
      return ModifierDeathWatchFriendlyMinionSwapAllegiance;
    }
    if (modifierType === ModifierOpeningGambitSniperZen.type) {
      return ModifierOpeningGambitSniperZen;
    }
    if (modifierType === ModifierDoubleDamageToStunnedEnemies.type) {
      return ModifierDoubleDamageToStunnedEnemies;
    }
    if (modifierType === ModifierStartTurnWatchRespawnClones.type) {
      return ModifierStartTurnWatchRespawnClones;
    }
    if (modifierType === ModifierSwitchAllegiancesGainAttack.type) {
      return ModifierSwitchAllegiancesGainAttack;
    }
    if (modifierType === ModifierOpponentSummonWatchRandomTransform.type) {
      return ModifierOpponentSummonWatchRandomTransform;
    }
    if (modifierType === ModifierOnSpawnKillMyGeneral.type) {
      return ModifierOnSpawnKillMyGeneral;
    }
    if (modifierType === ModifierDeathWatchGainAttackEqualToEnemyAttack.type) {
      return ModifierDeathWatchGainAttackEqualToEnemyAttack;
    }
    if (modifierType === ModifierDyingWishBuffEnemyGeneral.type) {
      return ModifierDyingWishBuffEnemyGeneral;
    }
    if (modifierType === ModifierBandedProvoke.type) {
      return ModifierBandedProvoke;
    }
    if (modifierType === ModifierBandingProvoke.type) {
      return ModifierBandingProvoke;
    }
    if (modifierType === ModifierOpponentSummonWatchSwapGeneral.type) {
      return ModifierOpponentSummonWatchSwapGeneral;
    }
    if (modifierType === ModifierMyAttackOrCounterattackWatchApplyModifiersToFriendlyMinions.type) {
      return ModifierMyAttackOrCounterattackWatchApplyModifiersToFriendlyMinions;
    }
    if (modifierType === ModifierMyAttackOrCounterattackWatchDamageRandomEnemy.type) {
      return ModifierMyAttackOrCounterattackWatchDamageRandomEnemy;
    }
    if (modifierType === ModifierMyAttackWatchSummonDeadMinions.type) {
      return ModifierMyAttackWatchSummonDeadMinions;
    }
    if (modifierType === ModifierMyAttackMinionWatchStealGeneralHealth.type) {
      return ModifierMyAttackMinionWatchStealGeneralHealth;
    }
    if (modifierType === ModifierDyingWishRespawnEntity.type) {
      return ModifierDyingWishRespawnEntity;
    }
    if (modifierType === ModifierBuildWatch.type) {
      return ModifierBuildWatch;
    }
    if (modifierType === ModifierBuildCompleteApplyModifiersToNearbyAllies.type) {
      return ModifierBuildCompleteApplyModifiersToNearbyAllies;
    }
    if (modifierType === ModifierBuildCompleteGainTempMana.type) {
      return ModifierBuildCompleteGainTempMana;
    }
    if (modifierType === ModifierBuildCompleteHealGeneral.type) {
      return ModifierBuildCompleteHealGeneral;
    }
    if (modifierType === ModifierMyBuildWatchDrawCards.type) {
      return ModifierMyBuildWatchDrawCards;
    }
    if (modifierType === ModifierMyBuildWatch.type) {
      return ModifierMyBuildWatch;
    }
    if (modifierType === ModifierBuildingSlowEnemies.type) {
      return ModifierBuildingSlowEnemies;
    }
    if (modifierType === ModifierMyAttackOrCounterattackWatch.type) {
      return ModifierMyAttackOrCounterattackWatch;
    }
    if (modifierType === ModifierMyAttackOrCounterattackWatchTransformIntoEgg.type) {
      return ModifierMyAttackOrCounterattackWatchTransformIntoEgg;
    }
    if (modifierType === ModifierCannotDamageGenerals.type) {
      return ModifierCannotDamageGenerals;
    }
    if (modifierType === ModifierBackstabWatchAddCardToHand.type) {
      return ModifierBackstabWatchAddCardToHand;
    }
    if (modifierType === ModifierBuildCompleteReplicateAndSummonDervish.type) {
      return ModifierBuildCompleteReplicateAndSummonDervish;
    }
    if (modifierType === ModifierBackstabWatchTransformToBuilding.type) {
      return ModifierBackstabWatchTransformToBuilding;
    }
    if (modifierType === ModifierOpeningGambitProgressBuild.type) {
      return ModifierOpeningGambitProgressBuild;
    }
    if (modifierType === ModifierAlwaysInfiltrated.type) {
      return ModifierAlwaysInfiltrated;
    }
    if (modifierType === ModifierSummonWatchMechsShareKeywords.type) {
      return ModifierSummonWatchMechsShareKeywords;
    }
    if (modifierType === ModifierSituationalBuffSelfIfHaveMech.type) {
      return ModifierSituationalBuffSelfIfHaveMech;
    }
    if (modifierType === ModifierStartTurnWatchApplyTempArtifactModifier.type) {
      return ModifierStartTurnWatchApplyTempArtifactModifier;
    }
    if (modifierType === ModifierSummonWatchByRaceSummonCopy.type) {
      return ModifierSummonWatchByRaceSummonCopy;
    }
    if (modifierType === ModifierAuraAboveAndBelow.type) {
      return ModifierAuraAboveAndBelow;
    }
    if (modifierType === ModifierDealDamageWatchApplyModifiersToAllies.type) {
      return ModifierDealDamageWatchApplyModifiersToAllies;
    }
    if (modifierType === ModifierKillWatchSpawnEgg.type) {
      return ModifierKillWatchSpawnEgg;
    }
    if (modifierType === ModifierMyAttackMinionWatch.type) {
      return ModifierMyAttackMinionWatch;
    }
    if (modifierType === ModifierProvidesAlwaysInfiltrated.type) {
      return ModifierProvidesAlwaysInfiltrated;
    }
    if (modifierType === ModifierInvulnerable.type) {
      return ModifierInvulnerable;
    }
    if (modifierType === ModifierForgedArtifactDescription.type) {
      return ModifierForgedArtifactDescription;
    }
    if (modifierType === ModifierOnDying.type) {
      return ModifierOnDying;
    }
    if (modifierType === ModifierOnDyingSpawnEntity.type) {
      return ModifierOnDyingSpawnEntity;
    }
    if (modifierType === ModifierCounter.type) {
      return ModifierCounter;
    }
    if (modifierType === ModifierCounterBuildProgress.type) {
      return ModifierCounterBuildProgress;
    }
    if (modifierType === ModifierCounterMechazorBuildProgress.type) {
      return ModifierCounterMechazorBuildProgress;
    }
    if (modifierType === ModifierCounterShadowCreep.type) {
      return ModifierCounterShadowCreep;
    }
    if (modifierType === ModifierSummonWatchAnywhereByRaceBuffSelf.type) {
      return ModifierSummonWatchAnywhereByRaceBuffSelf;
    }
    if (modifierType === ModifierDyingWishPutCardInOpponentHand.type) {
      return ModifierDyingWishPutCardInOpponentHand;
    }
    if (modifierType === ModifierEnemySpellWatchGainRandomKeyword.type) {
      return ModifierEnemySpellWatchGainRandomKeyword;
    }
    if (modifierType === ModifierAnySummonWatchGainGeneralKeywords.type) {
      return ModifierAnySummonWatchGainGeneralKeywords;
    }
    if (modifierType === ModifierMyMoveWatchAnyReasonDrawCard.type) {
      return ModifierMyMoveWatchAnyReasonDrawCard;
    }
    if (modifierType === ModifierCounterBuildProgressDescription.type) {
      return ModifierCounterBuildProgressDescription;
    }
    if (modifierType === ModifierCounterMechazorBuildProgressDescription.type) {
      return ModifierCounterMechazorBuildProgressDescription;
    }
    if (modifierType === ModifierCounterShadowCreepDescription.type) {
      return ModifierCounterShadowCreepDescription;
    }
    if (modifierType === ModifierOpeningGambitDestroyManaCrystal.type) {
      return ModifierOpeningGambitDestroyManaCrystal;
    }
    if (modifierType === ModifierDyingWishDestroyManaCrystal.type) {
      return ModifierDyingWishDestroyManaCrystal;
    }
    if (modifierType === ModifierOpeningGambitBonusManaCrystal.type) {
      return ModifierOpeningGambitBonusManaCrystal;
    }
    if (modifierType === ModifierIntensify.type) {
      return ModifierIntensify;
    }
    if (modifierType === ModifierIntensifyOneManArmy.type) {
      return ModifierIntensifyOneManArmy;
    }
    if (modifierType === ModifierCollectableCard.type) {
      return ModifierCollectableCard;
    }
    if (modifierType === ModifierDyingWishReduceManaCostOfDyingWish.type) {
      return ModifierDyingWishReduceManaCostOfDyingWish;
    }
    if (modifierType === ModifierIntensifyBuffSelf.type) {
      return ModifierIntensifyBuffSelf;
    }
    if (modifierType === ModifierBandingFlying.type) {
      return ModifierBandingFlying;
    }
    if (modifierType === ModifierBandedFlying.type) {
      return ModifierBandedFlying;
    }
    if (modifierType === ModifierDyingWishApplyModifiersToGenerals.type) {
      return ModifierDyingWishApplyModifiersToGenerals;
    }
    if (modifierType === ModifierEnemySpellWatchHealMyGeneral.type) {
      return ModifierEnemySpellWatchHealMyGeneral;
    }
    if (modifierType === ModifierMyAttackWatchAreaAttack.type) {
      return ModifierMyAttackWatchAreaAttack;
    }
    if (modifierType === ModifierReplaceWatchApplyModifiersToReplaced.type) {
      return ModifierReplaceWatchApplyModifiersToReplaced;
    }
    if (modifierType === ModifierImmuneToDamageByWeakerEnemies.type) {
      return ModifierImmuneToDamageByWeakerEnemies;
    }
    if (modifierType === ModifierMyOtherMinionsDamagedWatch.type) {
      return ModifierMyOtherMinionsDamagedWatch;
    }
    if (modifierType === ModifierMyOtherMinionsDamagedWatchDamagedMinionGrows.type) {
      return ModifierMyOtherMinionsDamagedWatchDamagedMinionGrows;
    }
    if (modifierType === ModifierBackstabWatchSummonBackstabMinion.type) {
      return ModifierBackstabWatchSummonBackstabMinion;
    }
    if (modifierType === ModifierStartOpponentsTurnWatch.type) {
      return ModifierStartOpponentsTurnWatch;
    }
    if (modifierType === ModifierStartOpponentsTurnWatchRemoveEntity.type) {
      return ModifierStartOpponentsTurnWatchRemoveEntity;
    }
    if (modifierType === ModifierMyAttackWatchApplyModifiers.type) {
      return ModifierMyAttackWatchApplyModifiers;
    }
    if (modifierType === ModifierAlwaysBackstabbed.type) {
      return ModifierAlwaysBackstabbed;
    }
    if (modifierType === ModifierFriendsguard.type) {
      return ModifierFriendsguard;
    }
    if (modifierType === ModifierMyGeneralAttackWatchSpawnRandomEntityFromDeck.type) {
      return ModifierMyGeneralAttackWatchSpawnRandomEntityFromDeck;
    }
    if (modifierType === ModifierStackingShadowsBonusDamageUnique.type) {
      return ModifierStackingShadowsBonusDamageUnique;
    }
    if (modifierType === ModifierEnemyCannotCastBBS.type) {
      return ModifierEnemyCannotCastBBS;
    }
    if (modifierType === ModifierEntersBattlefieldWatch.type) {
      return ModifierEntersBattlefieldWatch;
    }
    if (modifierType === ModifierEntersBattlefieldWatchApplyModifiers.type) {
      return ModifierEntersBattlefieldWatchApplyModifiers;
    }
    if (modifierType === ModifierSummonWatchApplyModifiersToRanged.type) {
      return ModifierSummonWatchApplyModifiersToRanged;
    }
    if (modifierType === ModifierStartsInHand.type) {
      return ModifierStartsInHand;
    }
    if (modifierType === ModifierStartTurnWatchRestoreChargeToArtifacts.type) {
      return ModifierStartTurnWatchRestoreChargeToArtifacts;
    }
    if (modifierType === ModifierIntensifyDamageEnemyGeneral.type) {
      return ModifierIntensifyDamageEnemyGeneral;
    }
    if (modifierType === ModifierOpeningGambitMoveEnemyGeneralForward.type) {
      return ModifierOpeningGambitMoveEnemyGeneralForward;
    }
    if (modifierType === ModifierBackstabWatchApplyPlayerModifiers.type) {
      return ModifierBackstabWatchApplyPlayerModifiers;
    }
    if (modifierType === ModifierSynergizeSpawnEntityFromDeck.type) {
      return ModifierSynergizeSpawnEntityFromDeck;
    }
    if (modifierType === ModifierSpellWatchAnywhereApplyModifiers.type) {
      return ModifierSpellWatchAnywhereApplyModifiers;
    }
    if (modifierType === ModifierDamageBothGeneralsOnReplace.type) {
      return ModifierDamageBothGeneralsOnReplace;
    }
    if (modifierType === ModifierStackingShadowsBonusDamageEqualNumberTiles.type) {
      return ModifierStackingShadowsBonusDamageEqualNumberTiles;
    }
    if (modifierType === ModifierPseudoRush.type) {
      return ModifierPseudoRush;
    }
    if (modifierType === ModifierIntensifyDamageNearby.type) {
      return ModifierIntensifyDamageNearby;
    }
    if (modifierType === ModifierStartTurnWatchRemoveEntity.type) {
      return ModifierStartTurnWatchRemoveEntity;
    }
    if (modifierType === ModifierOnSummonFromHand.type) {
      return ModifierOnSummonFromHand;
    }
    if (modifierType === ModifierReplaceWatchShuffleCardIntoDeck.type) {
      return ModifierReplaceWatchShuffleCardIntoDeck;
    }
    if (modifierType === ModifierEnemyStunWatch.type) {
      return ModifierEnemyStunWatch;
    }
    if (modifierType === ModifierEnemyStunWatchTransformThis.type) {
      return ModifierEnemyStunWatchTransformThis;
    }
    if (modifierType === ModifierEnemyStunWatchDamageNearbyEnemies.type) {
      return ModifierEnemyStunWatchDamageNearbyEnemies;
    }
    if (modifierType === ModifierIntensifySpawnEntitiesNearby.type) {
      return ModifierIntensifySpawnEntitiesNearby;
    }
    if (modifierType === ModifierStartTurnWatchImmolateDamagedMinions.type) {
      return ModifierStartTurnWatchImmolateDamagedMinions;
    }
    if (modifierType === ModifierTakeDamageWatchOpponentDrawCard.type) {
      return ModifierTakeDamageWatchOpponentDrawCard;
    }
    if (modifierType === ModifierMyAttackWatchScarabBlast.type) {
      return ModifierMyAttackWatchScarabBlast;
    }
    if (modifierType === ModifierEquipFriendlyArtifactWatch.type) {
      return ModifierEquipFriendlyArtifactWatch;
    }
    if (modifierType === ModifierEquipFriendlyArtifactWatchGainAttackEqualToCost.type) {
      return ModifierEquipFriendlyArtifactWatchGainAttackEqualToCost;
    }
    if (modifierType === ModifierOpponentSummonWatchSummonMinionInFront.type) {
      return ModifierOpponentSummonWatchSummonMinionInFront;
    }
    if (modifierType === ModifierIntensifyTempBuffNearbyMinion.type) {
      return ModifierIntensifyTempBuffNearbyMinion;
    }
    if (modifierType === ModifierEndTurnWatchGainLastSpellPlayedThisTurn.type) {
      return ModifierEndTurnWatchGainLastSpellPlayedThisTurn;
    }
    if (modifierType === ModifierKillWatchRefreshExhaustionIfTargetStunned.type) {
      return ModifierKillWatchRefreshExhaustionIfTargetStunned;
    }
    if (modifierType === ModifierEnemyGeneralAttackedWatch.type) {
      return ModifierEnemyGeneralAttackedWatch;
    }
    if (modifierType === ModifierOnSummonFromHandApplyEmblems.type) {
      return ModifierOnSummonFromHandApplyEmblems;
    }
    if (modifierType === ModifierOnDyingResummonAnywhere.type) {
      return ModifierOnDyingResummonAnywhere;
    }
    if (modifierType === ModifierSummonWatchBurnOpponentCards.type) {
      return ModifierSummonWatchBurnOpponentCards;
    }
    if (modifierType === ModifierEnemyStunWatchFullyHeal.type) {
      return ModifierEnemyStunWatchFullyHeal;
    }
    if (modifierType === ModifierOpeningGambitChangeSignatureCardForThisTurn.type) {
      return ModifierOpeningGambitChangeSignatureCardForThisTurn;
    }
    if (modifierType === ModifierDyingWishGoldenGuide.type) {
      return ModifierDyingWishGoldenGuide;
    }
    if (modifierType === ModifierKillWatchAndSurvive.type) {
      return ModifierKillWatchAndSurvive;
    }
    if (modifierType === ModifierKillWatchAndSurviveScarzig.type) {
      return ModifierKillWatchAndSurviveScarzig;
    }
    if (modifierType === ModifierMyGeneralDamagedWatchMiniMinion.type) {
      return ModifierMyGeneralDamagedWatchMiniMinion;
    }
    if (modifierType === ModifierEndTurnWatchAnyPlayer.type) {
      return ModifierEndTurnWatchAnyPlayer;
    }
    if (modifierType === ModifierEndTurnWatchAnyPlayerPullRandomUnits.type) {
      return ModifierEndTurnWatchAnyPlayerPullRandomUnits;
    }
    if (modifierType === ModifierFate.type) {
      return ModifierFate;
    }
    if (modifierType === ModifierFateSingleton.type) {
      return ModifierFateSingleton;
    }
    if (modifierType === ModifierToken.type) {
      return ModifierToken;
    }
    if (modifierType === ModifierTokenCreator.type) {
      return ModifierTokenCreator;
    }
    if (modifierType === ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace.type) {
      return ModifierMyAttackMinionWatchKillTargetSummonThisOnSpace;
    }
    if (modifierType === ModifierFateAbyssianDyingQuest.type) {
      return ModifierFateAbyssianDyingQuest;
    }
    if (modifierType === ModifierFateSonghaiMinionQuest.type) {
      return ModifierFateSonghaiMinionQuest;
    }
    if (modifierType === ModifierFateMagmarBuffQuest.type) {
      return ModifierFateMagmarBuffQuest;
    }
    if (modifierType === ModifierFateLyonarSmallMinionQuest.type) {
      return ModifierFateLyonarSmallMinionQuest;
    }
    if (modifierType === ModifierOpeningGambitTransformHandIntoLegendaries.type) {
      return ModifierOpeningGambitTransformHandIntoLegendaries;
    }
    if (modifierType === ModifierFateVanarTokenQuest.type) {
      return ModifierFateVanarTokenQuest;
    }
    if (modifierType === ModifierFateVetruvianMovementQuest.type) {
      return ModifierFateVetruvianMovementQuest;
    }
    if (modifierType === ModifierEndTurnWatchAnyPlayerHsuku.type) {
      return ModifierEndTurnWatchAnyPlayerHsuku;
    }
    if (modifierType === ModifierCounterIntensify.type) {
      return ModifierCounterIntensify;
    }
    if (modifierType === ModifierCounterIntensifyDescription.type) {
      return ModifierCounterIntensifyDescription;
    }
    if (modifierType === ModifierCannotBeRemovedFromHand.type) {
      return ModifierCannotBeRemovedFromHand;
    }
    if (modifierType === ModifierQuestBuffAbyssian.type) {
      return ModifierQuestBuffAbyssian;
    }
    if (modifierType === ModifierQuestBuffNeutral.type) {
      return ModifierQuestBuffNeutral;
    }
    if (modifierType === ModifierQuestBuffVanar.type) {
      return ModifierQuestBuffVanar;
    }
    if (modifierType === ModifierQuestStatusLyonar.type) {
      return ModifierQuestStatusLyonar;
    }
    if (modifierType === ModifierQuestStatusSonghai.type) {
      return ModifierQuestStatusSonghai;
    }
    if (modifierType === ModifierQuestStatusAbyssian.type) {
      return ModifierQuestStatusAbyssian;
    }
    if (modifierType === ModifierQuestStatusVetruvian.type) {
      return ModifierQuestStatusVetruvian;
    }
    if (modifierType === ModifierQuestStatusMagmar.type) {
      return ModifierQuestStatusMagmar;
    }
    if (modifierType === ModifierQuestStatusVanar.type) {
      return ModifierQuestStatusVanar;
    }
    if (modifierType === ModifierQuestStatusNeutral.type) {
      return ModifierQuestStatusNeutral;
    }

    if (modifierType === PlayerModifier.type) {
      return PlayerModifier;
    }
    if (modifierType === PlayerModifierManaModifier.type) {
      return PlayerModifierManaModifier;
    }
    if (modifierType === PlayerModifierManaModifierSingleUse.type) {
      return PlayerModifierManaModifierSingleUse;
    }
    if (modifierType === PlayerModifierAncestralPact.type) {
      return PlayerModifierAncestralPact;
    }
    if (modifierType === PlayerModifierMechazorBuildProgress.type) {
      return PlayerModifierMechazorBuildProgress;
    }
    if (modifierType === PlayerModifierMechazorSummoned.type) {
      return PlayerModifierMechazorSummoned;
    }
    if (modifierType === ModifierBackupGeneral.type) {
      return ModifierBackupGeneral;
    }
    if (modifierType === PlayerModifierSpellDamageModifier.type) {
      return PlayerModifierSpellDamageModifier;
    }
    if (modifierType === PlayerModifierDamageNextUnitPlayedFromHand.type) {
      return PlayerModifierDamageNextUnitPlayedFromHand;
    }
    if (modifierType === PlayerModifierCardDrawModifier.type) {
      return PlayerModifierCardDrawModifier;
    }
    if (modifierType === PlayerModiferCanSummonAnywhere.type) {
      return PlayerModiferCanSummonAnywhere;
    }
    if (modifierType === PlayerModifierSummonWatchApplyModifiers.type) {
      return PlayerModifierSummonWatchApplyModifiers;
    }
    if (modifierType === PlayerModifierReplaceCardModifier.type) {
      return PlayerModifierReplaceCardModifier;
    }
    if (modifierType === PlayerModifierEndTurnRespawnEntityWithBuff.type) {
      return PlayerModifierEndTurnRespawnEntityWithBuff;
    }
    if (modifierType === PlayerModifierPreventSpellDamage.type) {
      return PlayerModifierPreventSpellDamage;
    }
    if (modifierType === PlayerModifierManaModifierOncePerTurn.type) {
      return PlayerModifierManaModifierOncePerTurn;
    }
    if (modifierType === PlayerModifierMyDeathwatchDrawCard.type) {
      return PlayerModifierMyDeathwatchDrawCard;
    }
    if (modifierType === PlayerModifierBattlePetManager.type) {
      return PlayerModifierBattlePetManager;
    }
    if (modifierType === PlayerModifierCannotReplace.type) {
      return PlayerModifierCannotReplace;
    }
    if (modifierType === PlayerModifierChangeSignatureCard.type) {
      return PlayerModifierChangeSignatureCard;
    }
    if (modifierType === PlayerModifierSignatureCardAlwaysReady.type) {
      return PlayerModifierSignatureCardAlwaysReady;
    }
    if (modifierType === PlayerModifierManaModifierNextCard.type) {
      return PlayerModifierManaModifierNextCard;
    }
    if (modifierType === PlayerModifierFlashReincarnation.type) {
      return PlayerModifierFlashReincarnation;
    }
    if (modifierType === PlayerModifierFriendlyAttackWatch.type) {
      return PlayerModifierFriendlyAttackWatch;
    }
    if (modifierType === PlayerModifierSummonWatch.type) {
      return PlayerModifierSummonWatch;
    }
    if (modifierType === PlayerModifierSummonWatchIfFlyingDrawFlyingMinion.type) {
      return PlayerModifierSummonWatchIfFlyingDrawFlyingMinion;
    }
    if (modifierType === PlayerModifierOpponentSummonWatch.type) {
      return PlayerModifierOpponentSummonWatch;
    }
    if (modifierType === PlayerModifierOpponentSummonWatchSwapGeneral.type) {
      return PlayerModifierOpponentSummonWatchSwapGeneral;
    }
    if (modifierType === PlayerModifierSummonWatchFromActionBar.type) {
      return PlayerModifierSummonWatchFromActionBar;
    }
    if (modifierType === PlayerModifierEndTurnRespawnEntityAnywhere.type) {
      return PlayerModifierEndTurnRespawnEntityAnywhere;
    }
    if (modifierType === PlayerModifierTeamAlwaysBackstabbed.type) {
      return PlayerModifierTeamAlwaysBackstabbed;
    }
    if (modifierType === PlayerModifierEmblem.type) {
      return PlayerModifierEmblem;
    }
    if (modifierType === PlayerModifierEmblemSummonWatch.type) {
      return PlayerModifierEmblemSummonWatch;
    }
    if (modifierType === PlayerModifierEmblemSummonWatchSingletonQuest.type) {
      return PlayerModifierEmblemSummonWatchSingletonQuest;
    }
    if (modifierType === PlayerModifierEmblemEndTurnWatch.type) {
      return PlayerModifierEmblemEndTurnWatch;
    }
    if (modifierType === PlayerModifierEmblemEndTurnWatchLyonarSmallMinionQuest.type) {
      return PlayerModifierEmblemEndTurnWatchLyonarSmallMinionQuest;
    }
    if (modifierType === PlayerModifierSpellWatch.type) {
      return PlayerModifierSpellWatch;
    }
    if (modifierType === PlayerModifierSpellWatchHollowVortex.type) {
      return PlayerModifierSpellWatchHollowVortex;
    }
    if (modifierType === PlayerModifierEmblemSummonWatchVanarTokenQuest.type) {
      return PlayerModifierEmblemSummonWatchVanarTokenQuest;
    }
    if (modifierType === PlayerModifierEmblemSituationalVetQuestFrenzy.type) {
      return PlayerModifierEmblemSituationalVetQuestFrenzy;
    }
    if (modifierType === PlayerModifierEmblemSituationalVetQuestFlying.type) {
      return PlayerModifierEmblemSituationalVetQuestFlying;
    }
    if (modifierType === PlayerModifierEmblemSituationalVetQuestCelerity.type) {
      return PlayerModifierEmblemSituationalVetQuestCelerity;
    }
    if (modifierType === PlayerModifierEndTurnWatchRevertBBS.type) {
      return PlayerModifierEndTurnWatchRevertBBS;
    }
    if (modifierType === PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest.type) {
      return PlayerModifierEmblemSummonWatchSonghaiMeltdownQuest;
    }
    if (modifierType === PlayerModifierEmblemSummonWatchFromHandMagmarBuffQuest.type) {
      return PlayerModifierEmblemSummonWatchFromHandMagmarBuffQuest;
    }
    if (modifierType === PlayerModifierEmblemSummonWatchAbyssUndyingQuest.type) {
      return PlayerModifierEmblemSummonWatchAbyssUndyingQuest;
    }
    if (modifierType === PlayerModifierEmblemGainMinionOrLoseControlWatch.type) {
      return PlayerModifierEmblemGainMinionOrLoseControlWatch;
    }

    if (modifierType === GameSessionModifier.type) {
      return GameSessionModifier;
    }
    if (modifierType === GameSessionModifierFestiveSpirit.type) {
      return GameSessionModifierFestiveSpirit;
    }

    return console.error(`ModifierFactory:modifierForType - Unknown Modifier Type: ${modifierType}`.red);
  }
}

module.exports = ModifierFactory;
