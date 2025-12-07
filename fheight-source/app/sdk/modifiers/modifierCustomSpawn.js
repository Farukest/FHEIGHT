/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier =   require('./modifier');

/*
  Base class for any modifier that will cause a unit to have custom spawn positions
  (other than Airdrop, as Airdrop is pre-defined)

*/
class ModifierCustomSpawn extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierCustomSpawn";
    this.type ="ModifierCustomSpawn";
  
    this.modifierName ="Custom Spawn";
    this.description = "";
  
    this.prototype.fxResource = ["FX.Modifiers.ModifierCustomSpawn"];
  }


  getCustomSpawnPositions() {
    // return an array of valid spawn positions
    // override this is sub-class with actual spawn positions
    return [];
  }
}
ModifierCustomSpawn.initClass();

module.exports = ModifierCustomSpawn;
