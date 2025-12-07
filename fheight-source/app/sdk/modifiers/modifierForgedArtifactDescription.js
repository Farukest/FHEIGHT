/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Modifier = require('app/sdk/modifiers/modifier');

const i18next = require('i18next');

class ModifierForgedArtifactDescription extends Modifier {
  static initClass() {
  
    this.prototype.type ="ModifierForgedArtifactDescription";
    this.type ="ModifierForgedArtifactDescription";
  
    this.modifierName = "";
    this.isHiddenToUI = false;
    this.prototype.isRemovable = false;
    this.prototype.isInherent = true; // show description on card text
  
    this.prototype.maxStacks = 1;
  }

  static createContextObject(factionId, attack) {
    const contextObject = super.createContextObject();
    contextObject.factionId = factionId;
    contextObject.attack = attack;
    return contextObject;
  }

  static getDescription(modifierContextObject) {
    if (modifierContextObject) {
      if (modifierContextObject.factionId === 1) {
        return i18next.t("modifiers.forged_artifact_lyonar",{numericValue: modifierContextObject.attack});
      } else if (modifierContextObject.factionId === 2) {
        return i18next.t("modifiers.forged_artifact_songhai",{numericValue: modifierContextObject.attack});
      } else if (modifierContextObject.factionId === 3) {
        return i18next.t("modifiers.forged_artifact_vetruvian",{numericValue: modifierContextObject.attack});
      } else if (modifierContextObject.factionId === 4) {
        return i18next.t("modifiers.forged_artifact_abyssian",{numericValue: modifierContextObject.attack});
      } else if (modifierContextObject.factionId === 5) {
        return i18next.t("modifiers.forged_artifact_magmar",{numericValue: modifierContextObject.attack});
      } else if (modifierContextObject.factionId === 6) {
        return i18next.t("modifiers.forged_artifact_vanar",{numericValue: modifierContextObject.attack});
      } else {
        return i18next.t("modifiers.forged_artifact_neutral",{numericValue: modifierContextObject.attack});
      }
    }
  }
}
ModifierForgedArtifactDescription.initClass();

module.exports = ModifierForgedArtifactDescription;
