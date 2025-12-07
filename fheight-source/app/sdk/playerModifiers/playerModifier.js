/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('app/sdk/modifiers/modifier');

class PlayerModifier extends Modifier {
  static initClass() {
  
    this.prototype.type ="PlayerModifier";
    this.type ="PlayerModifier";
  
    // don't allow player modifiers to be dispelled off of the General
    this.prototype.isRemovable = false;
  
    // player modifiers are not cloneable
    this.prototype.isCloneable = false;
  
    // player modifiers should be hidden from UI by default
    this.isHiddenToUI = true;
  
    //region PLAYER
  
    this.prototype.getPlayer = this.prototype.getOwner;
  
    this.prototype.getPlayerId = this.prototype.getOwnerId;
  }
}
PlayerModifier.initClass();

  // endregion PLAYER

module.exports = PlayerModifier;
