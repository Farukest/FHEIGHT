/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class RankDivisionLookup {
  static initClass() {
  
    // Do not change key names!
    // Any changes to user facing names should be done in rank factory
    // From here on these should remain untouched:
    // any reference to a division for an internal asset name should use RankFactory.rankedDivisionAssetNameForRank
    // any user facing reference to a division should use RankFactory.rankedDivisionNameForRank
    this.Bronze = 30;
    this.Silver = 20;
    this.Gold = 10;
    this.Diamond = 5;
    this.Elite = 0;
  }
}
RankDivisionLookup.initClass();

module.exports = RankDivisionLookup;
