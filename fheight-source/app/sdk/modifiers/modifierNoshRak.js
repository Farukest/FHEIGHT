/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const RSX = require('app/data/resources');
const i18next = require('i18next');

class ModifierNoshRak extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierNoshRak";
    this.type ="ModifierNoshRak";
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.animResource = {
      // TODO: set these to the right sprites when nosh-rak is loaded up
      breathing : RSX.f3OnyxPantheranBreathing.name,
      idle : RSX.f3OnyxPantheranIdle.name,
      walk : RSX.f3OnyxPantheranRun.name,
      attack : RSX.f3OnyxPantheranAttack.name,
      attackReleaseDelay: 0.0,
      attackDelay: 1.1,
      damage : RSX.f3OnyxPantheranDamage.name,
      death : RSX.f3OnyxPantheranDeath.name
    };
    p.originalDamage = 0;

    return p;
  }

  static createContextObject(attackBuff, maxHPBuff,options) {
    if (attackBuff == null) { attackBuff = 4; }
    if (maxHPBuff == null) { maxHPBuff = 9; }
    const contextObject = super.createContextObject(options);
    contextObject.attributeBuffs = {
      atk: attackBuff,
      maxHP: maxHPBuff
    };
    contextObject.attributeBuffsRebased = ["atk", "maxHP"];
    contextObject.appliedName = i18next.t("modifiers.noshrak_name");

    return contextObject;
  }

  onApplyToCardBeforeSyncState() {
    // treating this as a 'fake' transform so we're going to store damage done to originalDamage
    // unit before we rebase their HP
    return this._private.originalDamage = this.getCard().getDamage();
  }

  onRemoveFromCardBeforeSyncState() {
    // when this buff expires, restore original damage done to this unit
    // ignore damage done during the 'fake transform' duration
    return this.getCard().setDamage(this._private.originalDamage);
  }
}
ModifierNoshRak.initClass();

module.exports = ModifierNoshRak;
