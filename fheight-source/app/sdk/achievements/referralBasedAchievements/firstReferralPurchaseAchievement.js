/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Achievement = require('app/sdk/achievements/achievement');
const CosmeticsLookup = require('app/sdk/cosmetics/cosmeticsLookup');
const i18next = require('i18next');
// One your referrals makes a first real-money purchase at the THE ARMORY.

class FirstReferralPurchase extends Achievement {
  static initClass() {
    this.id = "first_referral_purchase";
    this.title = i18next.t("achievements.referral_title");
    this.description = i18next.t("achievements.referral_desc");
    this.progressRequired = 1;
    this.rewards =
      {cosmetics: [CosmeticsLookup.Emote.OtherRook]};
    this.enabled = true;
  }

  static progressForReferralEvent(eventType) {
    if (eventType === "purchase") {
      return 1;
    } else {
      return 0;
    }
  }
}
FirstReferralPurchase.initClass();

module.exports = FirstReferralPurchase;
