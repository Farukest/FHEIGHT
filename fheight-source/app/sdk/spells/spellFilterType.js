/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class SpellFilterType {
  static initClass() {
  
    this.None =0; // spell can be applied anywhere, affects every board position
    this.EnemyDirect =1; // spell must be applied directly to an enemy, affects enemies only
    this.EnemyIndirect =2; // spell can be applied anywhere, affects enemies only
    this.AllyDirect =3; // spell must be applied to ally, affects allies only
    this.AllyIndirect =4; // spell can be applied anywhere, affects allies only
    this.NeutralDirect =5; // spell must be applied to unit, affects all units
    this.NeutralIndirect =6; // spell can be applied anywhere, affects all units
    this.SpawnSource =7;
  }
}
SpellFilterType.initClass(); // spell can be applied in any standard spawn location (near your General or other friendly units)

module.exports = SpellFilterType;
