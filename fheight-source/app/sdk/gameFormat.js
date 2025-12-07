/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
class GameFormat {
  static initClass() {
  
    this.Standard = 0;
    this.Legacy = 1;
  }

  static isLegacyFormat(type) {
    return type === GameFormat.Legacy;
  }
}
GameFormat.initClass();

module.exports = GameFormat;
