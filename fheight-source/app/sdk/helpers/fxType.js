/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class FXType {
  static initClass() {
  
    /*
      Units
    */
    // one time fx when unit spawns
    this.UnitSpawnFX = "UnitSpawnFX";
    // one time fx when unit dies
    this.UnitDiedFX = "UnitDiedFX";
    // one time fx on a unit's explicit attack only (ex: blast should only show a single fire beam, but will not show for strikeback)
    this.UnitPrimaryAttackedFX = "UnitPrimaryAttackedFX";
    // fx shown each time a unit makes an attack
    this.UnitAttackedFX = "UnitAttackedFX";
    // one time fx when unit is damaged
    this.UnitDamagedFX = "UnitDamagedFX";
    // one time fx when unit is healed
    this.UnitHealedFX = "UnitHealedFX";
  
    /*
      Spells
    */
    // one time fx where spell is cast
    this.SpellCastFX = "SpellCastFX";
    // pre-cast fx at each position spell does ANYTHING
    this.SpellAutoFX = "SpellAutoFX";
    // one time fx at each position spell does ANYTHING
    this.SpellAppliedFX = "SpellAppliedFX";
    // one time fx at each position spell does ANYTHING to friendly units
    // TODO: disabled temporarily
    //@SpellAppliedFriendFX: "SpellAppliedFriendFX"
    // one time fx at each position spell does ANYTHING to enemy units
    // TODO: disabled temporarily
    //@SpellAppliedEnemyFX: "SpellAppliedEnemyFX"
    // one time fx at each position spell damages or kills
    // TODO: disabled temporarily
    //@SpellDamagedFX: "SpellDamagedFX"
    // one time fx at each position spell heals
    // TODO: disabled temporarily
    //@SpellHealedFX: "SpellHealedFX"
  
    /*
      Artifacts
    */
    // one time fx where artifact is applied
    this.ArtifactAppliedFX = "ArtifactAppliedFX";
    // continuous fx on entity artifact applied to
    this.ArtifactFX = "ArtifactFX";
  
    /*
      Modifiers
    */
    // persistent fx to altered unit
    this.ModifierFX = "ModifierFX";
    // one time fx to altered unit when modifier applied
    this.ModifierAppliedFX = "ModifierAppliedFX";
    // one time fx when modifier triggers
    this.ModifierTriggeredFX = "ModifierTriggeredFX";
    // one time fx to source of a modifier when it triggers
    this.ModifierTriggeredSourceFX = "ModifierTriggeredSourceFX";
    // one time fx to target of a modifier when it triggers
    this.ModifierTriggeredTargetFX = "ModifierTriggeredTargetFX";
    // one time fx to removed unit when modifier removed
    this.ModifierRemovedFX = "ModifierRemovedFX";
  
    /*
      Actions (not usually used)
    */
    // one time fx for any action at the source position to target position
    this.GameFX = "GameFX";
    // one time fx for any action at the source position
    this.SourceFX = "SourceFX";
    // one time fx for any action at the target position
    this.TargetFX = "TargetFX";
    // teleport type actions show at source of movement before moving
    this.MoveSourceFX = "MoveSourceFX";
    // teleport type actions show at target of movement after moving
    this.MoveTargetFX = "MoveTargetFX";
    // teleport type actions show moving from source to target
    this.MoveFX = "MoveFX";
  }
}
FXType.initClass();

module.exports = FXType;
