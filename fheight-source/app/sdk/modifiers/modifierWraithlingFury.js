/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('./modifier');
const CardType = require('app/sdk/cards/cardType');
const Stringifiers = require('app/sdk/helpers/stringifiers');
const RSX = require('app/data/resources');
const i18next = require('i18next');

class ModifierWraithlingFury extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierWraithlingFury";
    this.type ="ModifierWraithlingFury";
  }

  getPrivateDefaults(gameSession) {
    const p = super.getPrivateDefaults(gameSession);

    p.animResource = {
      breathing: RSX.neutralShadow03Breathing.name,
      idle: RSX.neutralShadow03Idle.name,
      walk: RSX.neutralShadow03Run.name,
      attack: RSX.neutralShadow03Attack.name,
      attackReleaseDelay: 0.0,
      attackDelay: 0.6,
      damage: RSX.neutralShadow03Damage.name,
      death: RSX.neutralShadow03Death.name
    };

    return p;
  }

  static createContextObject(attackBuff, maxHPBuff,options) {
    if (attackBuff == null) { attackBuff = 4; }
    if (maxHPBuff == null) { maxHPBuff = 4; }
    const contextObject = super.createContextObject(options);
    contextObject.attributeBuffs = {
      atk: attackBuff,
      maxHP: maxHPBuff
    };
    contextObject.appliedName = i18next.t("modifiers.wraithling_fury_name");
    return contextObject;
  }
}
ModifierWraithlingFury.initClass();

module.exports = ModifierWraithlingFury;
