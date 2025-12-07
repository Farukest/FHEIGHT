/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CardType = require('app/sdk/cards/cardType');
const PlayerModifier = require('app/sdk/playerModifiers/playerModifier');
const ModifierAirdrop = require('app/sdk/modifiers/modifierAirdrop');

class PlayerModiferCanSummonAnywhere extends PlayerModifier {
  static initClass() {
  
    this.prototype.type ="PlayerModiferCanSummonAnywhere";
    this.type ="PlayerModiferCanSummonAnywhere";
  
    this.prototype.isAura = true;
    this.prototype.auraIncludeAlly = true;
    this.prototype.auraIncludeBoard = false;
    this.prototype.auraIncludeEnemy = false;
    this.prototype.auraIncludeGeneral = false;
    this.prototype.auraIncludeHand = true;
    this.prototype.auraIncludeSelf = false;
    this.prototype.modifiersContextObjects = [ModifierAirdrop.createContextObject()];
  }
}
PlayerModiferCanSummonAnywhere.initClass();

module.exports = PlayerModiferCanSummonAnywhere;
