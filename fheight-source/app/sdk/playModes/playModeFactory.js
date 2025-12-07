/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const _ = require('underscore');
const RSX = require('app/data/resources');
const PlayModes = require('./playModesLookup');
const moment = require('moment');
const i18next = require('i18next');

class PlayModeFactory {
  static initClass() {
  
    this.playModes = null;
  }

  static playModeForIdentifier(identifier) {
    this._initCache();
    const playMode = this.playModes[identifier];
    if (playMode) {
      return playMode;
    } else {
      // no play mode found
      return console.error(`PlayModeFactory.playModeForIdentifier - Unknown play mode identifier: ${identifier}`.red);
    }
  }

  static getAllVisiblePlayModes() {
    const playModes = [];

    const playModeIdentifiers = Object.keys(PlayModeFactory.playModes);
    for (var playModeIdentifier of Array.from(playModeIdentifiers)) {
      var playMode = this.playModeForIdentifier(playModeIdentifier);
      if (!playMode.isHiddenInUI) { playModes.push(playMode); }
    }

    return playModes;
  }

  static getAllEnabledPlayModes() {
    const playModes = [];

    const playModeIdentifiers = Object.keys(PlayModeFactory.playModes);
    for (var playModeIdentifier of Array.from(playModeIdentifiers)) {
      var playMode = this.playModeForIdentifier(playModeIdentifier);
      if (playMode.enabled && !playMode.isHiddenInUI) { playModes.push(playMode); }
    }

    return playModes;
  }

  static _initCache(){
    if (!this.playModes) {
      // setup play mode data
      if (this.playModes == null) { this.playModes = {}; }
      const pm = this.playModes;

      pm[PlayModes.Practice] = {
        id: PlayModes.Practice,
        name: i18next.t("main_menu.play_mode_practice_name"),
        description: i18next.t("main_menu.play_mode_practice_description"),
        img: RSX.play_mode_sandbox.img,
        enabled: true,
        isHiddenInUI: false
      };

      pm[PlayModes.Ranked] = {
        id: PlayModes.Ranked,
        name: i18next.t("main_menu.play_mode_ranked_name"),
        description: i18next.t("main_menu.play_mode_ranked_description"),
        img: RSX.play_mode_rankedladder.img,
        enabled: true,
        isHiddenInUI: false
      };

      pm[PlayModes.Challenges] = {
        id: PlayModes.Challenges,
        name: i18next.t("main_menu.play_mode_solo_challenges_name"),
        description: i18next.t("main_menu.play_mode_solo_challenges_description"),
        img: RSX.challenge_gate_010.img,
        enabled: true,
        isHiddenInUI: false
      };

      pm[PlayModes.Casual] = {
        id: PlayModes.Casual,
        name: "Unranked Play",
        description: "Find an online opponent and play for fun!",
        img: RSX.play_mode_unranked.img,
        enabled: false,
        isHiddenInUI: true
      };

      pm[PlayModes.Gauntlet] = {
        id: PlayModes.Gauntlet,
        name: i18next.t("main_menu.play_mode_gauntlet_name"),
        description: i18next.t("main_menu.play_mode_gauntlet_description"),
        img: RSX.play_mode_arenagauntlet.img,
        enabled: true,
        isHiddenInUI: false
        // availableOnDaysOfWeek: [0,3,5,6] # 0-6 indexed Sun-Sat
      };

      pm[PlayModes.Rift] = {
        id: PlayModes.Rift,
        name: i18next.t("main_menu.play_mode_rift_name"),
        description: i18next.t("main_menu.play_mode_rift_description"),
        img: RSX.play_mode_rift.img,
        enabled: false,
        isHiddenInUI: true
        // availableOnDaysOfWeek: [0,3,5,6] # 0-6 indexed Sun-Sat
        // gamesRequiredToUnlock: 20
        // softDisableOnDate: "2017-03-15" # UTC Time
      };

      pm[PlayModes.BossBattle] = {
        id: PlayModes.BossBattle,
        name: "Boss Battle",
        description: "",
        img: RSX.play_mode_bossbattle.img,
        enabled: true,
        isHiddenInUI: true
      };

      pm[PlayModes.Friend] = {
        id: PlayModes.Friend,
        name: "Friendly Match",
        description: "Play against a friend.",
        img: RSX.play_mode_sandbox.img,
        enabled: true,
        isHiddenInUI: true
      };

      pm[PlayModes.Sandbox] = {
        id: PlayModes.Sandbox,
        name: "Sandbox",
        description: "Play against yourself as both Player 1 and Player 2.",
        img: RSX.play_mode_sandbox.img,
        enabled: true,
        isHiddenInUI: true
      };

      return pm[PlayModes.Developer] = {
        id: PlayModes.Developer,
        name: "Developer Sandbox",
        description: "Shuffle free. Mulligan free.",
        img: RSX.play_mode_sandbox.img,
        enabled: true,
        isHiddenInUI: true
      };
    }
  }
}
PlayModeFactory.initClass();

module.exports = PlayModeFactory;
