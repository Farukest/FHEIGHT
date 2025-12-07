/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const RSX = require('app/data/resources');
const i18next = require('i18next');

class ChallengeCategory {
  static initClass() {
    this.tutorial = {
      type: "tutorial",
      name: i18next.t("challenges.challenge_gate_0_title"),
      description: i18next.t("challenges.challenge_gate_0_desc"),
      img: RSX.challenge_gate_000.img,
      enabled: true
    };
    this.keywords = {
      type: "keywords",
      name: i18next.t("challenges.challenge_gate_1_title"),
      description: i18next.t("challenges.challenge_gate_1_desc"),
      img: RSX.challenge_gate_001.img,
      enabled: true
    };
    this.beginner2 = {
      type: "beginner2",
      name: i18next.t("challenges.challenge_gate_2_title"),
      description: i18next.t("challenges.challenge_gate_2_desc"),
      img: RSX.challenge_gate_002.img,
      enabled: true
    };
    this.starter = {
      type: "starter",
      name: i18next.t("challenges.challenge_gate_3_title"),
      description: i18next.t("challenges.challenge_gate_3_desc"),
      img: RSX.challenge_gate_003.img,
      enabled: true
    };
    this.beginner = {
      type: "beginner",
      name: i18next.t("challenges.challenge_gate_4_title"),
      description: i18next.t("challenges.challenge_gate_4_desc"),
      img: RSX.challenge_gate_013.img,
      enabled: true
    };
    this.advanced = {
      type: "advanced",
      name: i18next.t("challenges.challenge_gate_5_title"),
      description: i18next.t("challenges.challenge_gate_5_desc"),
      img: RSX.challenge_gate_004.img,
      enabled: true,
      gamesRequiredToUnlock: 2
    };
    this.expert = {
      type: "expert",
      name: i18next.t("challenges.challenge_gate_6_title"),
      description: i18next.t("challenges.challenge_gate_6_desc"),
      img: RSX.challenge_gate_005.img,
      enabled: true,
      gamesRequiredToUnlock: 5
    };
    this.vault1 = {
      type: "vault1",
      name: i18next.t("challenges.challenge_gate_7_title"),
      description: i18next.t("challenges.challenge_gate_7_desc"),
      img: RSX.challenge_gate_010.img,
      enabled: true,
      gamesRequiredToUnlock: 10
    };
    this.vault2 = {
      type: "vault2",
      name: i18next.t("challenges.challenge_gate_8_title"),
      description: i18next.t("challenges.challenge_gate_8_desc"),
      img: RSX.challenge_gate_007.img,
      enabled: true,
      gamesRequiredToUnlock: 15
    };
    this.contest1 = {
      type: "contest1",
      name: i18next.t("challenges.challenge_gate_9_title"),
      description: i18next.t("challenges.challenge_gate_9_desc"),
      img: RSX.challenge_gate_014.img,
      enabled: true,
      gamesRequiredToUnlock: 20
    };
    this.contest2 = {
      type: "contest2",
      name: i18next.t("challenges.challenge_gate_10_title"),
      description: i18next.t("challenges.challenge_gate_10_desc"),
      img: RSX.challenge_gate_015.img,
      enabled: true,
      gamesRequiredToUnlock: 20
    };
  }
}
ChallengeCategory.initClass();




module.exports = ChallengeCategory;
