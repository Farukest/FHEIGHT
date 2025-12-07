/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const CONFIG = require('app/common/config');
const Logger = require('app/common/logger');
const Entity = require('./entity');
const CardType = require('app/sdk/cards/cardType');
const ModifierStrikeback = require('app/sdk/modifiers/modifierStrikeback');
const PlayerModifierBattlePetManager = require('app/sdk/playerModifiers/playerModifierBattlePetManager');

const _ = require('underscore');

class Unit extends Entity {
  static initClass() {
  
    this.prototype.type = CardType.Unit;
    this.type = CardType.Unit;
    this.prototype.name = "Unit";
  
    this.prototype.isTargetable = true;
    this.prototype.isObstructing = true;
    this.prototype.hp = 1;
    this.prototype.maxHP = 1;
    this.prototype.speed = CONFIG.SPEED_BASE;
    this.prototype.reach = CONFIG.REACH_MELEE;
  }

  onApplyToBoard(board,x,y,sourceAction) {
    super.onApplyToBoard(board, x, y, sourceAction);

    // spawn units as exhausted
    return this.applyExhaustion();
  }

  onApplyModifiersForApplyToNewLocation() {
    if (this.getGameSession().getIsRunningAsAuthoritative()) {
      // unit base modifiers should always be applied first
      // they should always react before any card specific modifiers

      // generals manage their battle pets
      let contextObject;
      if (this.getIsGeneral() && !this.hasModifierClass(PlayerModifierBattlePetManager)) {
        contextObject = PlayerModifierBattlePetManager.createContextObject();
        contextObject.isInherent = true;
        this.getGameSession().applyModifierContextObject(contextObject, this);
      }

      // all units strikeback
      if (!this.hasModifierClass(ModifierStrikeback)) {
        contextObject = ModifierStrikeback.createContextObject();
        contextObject.isInherent = true;
        this.getGameSession().applyModifierContextObject(contextObject, this);
      }
    }

    // apply card specific modifiers
    return super.onApplyModifiersForApplyToNewLocation();
  }
}
Unit.initClass();

module.exports = Unit;
