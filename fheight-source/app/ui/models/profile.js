/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const Logger = require('app/common/logger');
const EventBus = require('app/common/eventbus');
const EVENTS = require('app/common/event_types');
const Scene = require('app/view/Scene');
const FHEIGHTFirebase = require('app/ui/extensions/fheight_firebase');
const CONFIG = require('app/common/config');
const audio_engine = require('app/audio/audio_engine');
const NotificationsManager = require('app/ui/managers/notifications_manager');
const Analytics = require('app/common/analytics');
const Storage = require('app/common/storage');
const moment = require('moment');
const CosmeticsLookup = require(('app/sdk/cosmetics/cosmeticsLookup'));

const Profile = FHEIGHTFirebase.Model.extend({

  initialize() {
    Logger.module("UI").log("initialize a Profile model");
    // listen for changes to settings
    this.on("sync", this.onSync, this);
    this.on("change:gameSpeed", this.onGameSpeedChange, this);
    this.on("change:lightingQuality", this.onLightingQualityChange, this);
    this.on("change:shadowQuality", this.onShadowQualityChange, this);
    this.on("change:boardQuality", this.onBoardQualityChange, this);
    this.on("change:bloom", this.onBloomChange, this);
    this.on("change:doNotDisturb", this.onDoNotDisturbChange, this);
    this.on("change:showLoreNotifications", this.onShowLoreNotificationsChange, this);
    this.on("change:alwaysShowStats", this.onAlwaysShowStatsChange, this);
    this.on("change:showBattleLog", this.onShowBattleLogChange, this);
    this.on("change:stickyTargeting", this.onStickyTargetingChange, this);
    this.on("change:showInGameTips", this.onShowInGameTipsChange, this);
    this.on("change:razerChromaEnabled", this.onRazerChromaEnabled, this);
    this.on("change:fheEnabled", this.onFHEEnabledChange, this);
    this.on("change:masterVolume", this.onMasterVolumeChange, this);
    this.on("change:musicVolume", this.onMusicVolumeChange, this);
    this.on("change:voiceVolume", this.onVoiceVolumeChange, this);
    this.on("change:effectsVolume", this.onEffectsVolumeChange, this);

    this.onSyncOrReady().then(()=> {
      // certain event handlers should only happen after first sync
      return this.on("change:ltv", this.onLtvChanged, this);
    });

    // trigger initial changes
    this.onGameSpeedChange();
    this.onLightingQualityChange();
    this.onShadowQualityChange();
    this.onBoardQualityChange();
    this.onBloomChange();
    this.onDoNotDisturbChange();
    this.onShowLoreNotificationsChange();
    this.onAlwaysShowStatsChange();
    this.onShowBattleLogChange();
    this.onStickyTargetingChange();
    this.onShowInGameTipsChange();
    this.onMasterVolumeChange();
    this.onMusicVolumeChange();
    return this.onEffectsVolumeChange();
  },

  defaults: {
    id: 0,
    username: "FHEIGHT",
    gameSpeed: 0.0,
    lightingQuality: CONFIG.LIGHTING_QUALITY_HIGH,
    shadowQuality: CONFIG.SHADOW_QUALITY_HIGH,
    boardQuality: CONFIG.BOARD_QUALITY_HIGH,
    bloom: CONFIG.BLOOM_DEFAULT,
    doNotDisturb: false,
    showLoreNotifications: true,
    alwaysShowStats: true,
    selectedScene: null,
    showBattleLog: true,
    showPlayerDetails: false,
    stickyTargeting: false,
    showInGameTips: true,
    razerChromaEnabled: false,
    fheEnabled: true, // FHE Secure Mode - default enabled for maximum security
    showPrismaticsInCollection: true,
    showPrismaticsWhileCrafting: false,
    showSkinsInCollection: true,
    filterCollectionCardSet: 0,
    masterVolume: CONFIG.DEFAULT_MASTER_VOLUME,
    musicVolume: CONFIG.DEFAULT_MUSIC_VOLUME,
    voiceVolume: CONFIG.DEFAULT_VOICE_VOLUME,
    effectsVolume: CONFIG.DEFAULT_SFX_VOLUME
  },

  getFullName() {
    return this.get('username');
  },

  onSync() {
    // ensure volume isn't super loud
    const masterVolume = parseFloat(this.get("masterVolume"));
    if (masterVolume > 1.0) { this.set("masterVolume", masterVolume / 100.0); }
    const musicVolume = parseFloat(this.get("musicVolume"));
    if (musicVolume > 1.0) { this.set("musicVolume", musicVolume / 100.0); }
    const voiceVolume = parseFloat(this.get("voiceVolume"));
    if (voiceVolume > 1.0) { this.set("voiceVolume", voiceVolume / 100.0); }
    const effectsVolume = parseFloat(this.get("effectsVolume"));
    if (effectsVolume > 1.0) { return this.set("effectsVolume", effectsVolume / 100.0); }
  },

  onGameSpeedChange() {
    return this.setGameSpeed(this.get('gameSpeed'));
  },

  onLightingQualityChange() {
    return this.setLightingQuality(this.get('lightingQuality'));
  },

  onShadowQualityChange() {
    return this.setShadowQuality(this.get('shadowQuality'));
  },

  onBoardQualityChange() {
    return this.setBoardQuality(this.get('boardQuality'));
  },

  onBloomChange() {
    return this.setBloom(this.get('bloom'));
  },

  onAlwaysShowStatsChange() {
    return this.setAlwaysShowStats(this.get('alwaysShowStats'));
  },

  onShowBattleLogChange() {
    return this.setShowBattleLog(this.get('showBattleLog'));
  },

  onStickyTargetingChange() {
    return this.setStickyTargeting(this.get('stickyTargeting'));
  },

  onShowInGameTipsChange() {
    return this.setShowInGameTips(this.get('showInGameTips'));
  },

  onRazerChromaEnabled() {
    return this.setRazerChromaEnabled(this.get('razerChromaEnabled'));
  },

  onFHEEnabledChange() {
    return this.setFHEEnabled(this.get('fheEnabled'));
  },

  onMasterVolumeChange() {
    return this.setMasterVolume(this.get('masterVolume'));
  },

  onMusicVolumeChange() {
    return this.setMusicVolume(this.get('musicVolume'));
  },

  onVoiceVolumeChange() {
    return this.setVoiceVolume(this.get('voiceVolume'));
  },

  onEffectsVolumeChange() {
    return this.setEffectsVolume(this.get('effectsVolume'));
  },

  onDoNotDisturbChange() {
    return this.setDoNotDisturb(this.get('doNotDisturb'));
  },

  onShowLoreNotificationsChange() {
    return this.setShowLoreNotifications(this.get('showLoreNotifications'));
  },

  setGameSpeed(val) {
    return CONFIG.gameSpeed = parseFloat(val);
  },

  setLightingQuality(val) {
    return CONFIG.lightingQuality = parseFloat(val);
  },

  setShadowQuality(val) {
    return CONFIG.shadowQuality = parseFloat(val);
  },

  setBoardQuality(val) {
    CONFIG.boardQuality = parseFloat(val);

    // update board quality
    const scene = Scene.getInstance();
    const gameLayer = scene && scene.getGameLayer();
    if (gameLayer != null) {
      return gameLayer.getTileLayer().updateBoardQuality();
    }
  },

  setBloom(val) {
    return CONFIG.bloom = parseFloat(val);
  },

  setAlwaysShowStats(val) {
    CONFIG.alwaysShowStats = val;

    // update stats
    const scene = Scene.getInstance();
    const gameLayer = scene && scene.getGameLayer();
    if (gameLayer != null) {
      return gameLayer.updateShowingSdkNodeStats();
    }
  },

  setShowBattleLog(val) {
    CONFIG.showBattleLog = val;

    // update battle log
    const scene = Scene.getInstance();
    const gameLayer = scene && scene.getGameLayer();
    const battleLog = gameLayer && gameLayer.getBattleLog();
    if (battleLog != null) {
      return battleLog.setVisible(CONFIG.showBattleLog);
    }
  },

  setStickyTargeting(val) {
    return CONFIG.stickyTargeting = val;
  },

  setShowInGameTips(val) {
    return CONFIG.showInGameTips = val;
  },

  setRazerChromaEnabled(val) {
    return CONFIG.razerChromaEnabled = window.isDesktop && val;
  },

  setFHEEnabled(val) {
    CONFIG.fheEnabled = val;
    Logger.module("UI").log("FHE Secure Mode:", val ? "ENABLED" : "DISABLED");
    return CONFIG.fheEnabled;
  },

  setMasterVolume(val) {
    audio_engine.current().set_master_volume(val);

    // TODO: remove this when audio_engine takes over on playing sfx
    return this.onEffectsVolumeChange();
  },

  setMusicVolume(val) {
    return audio_engine.current().set_music_volume(val);
  },

  setVoiceVolume(val) {
    return audio_engine.current().set_voice_volume(val);
  },

  setEffectsVolume(val) {
    return audio_engine.current().set_sfx_volume(val);
  },

  setDoNotDisturb(val) {
    if (val) {
      return NotificationsManager.getInstance().dismissNotificationsThatCantBeShown();
    }
  },

  setSelectedScene(scene) {
    if ((scene != null) && (CONFIG.selectedScene !== scene)) {
      if (scene !== CosmeticsLookup.Scene.Frostfire) {
        this.set("selectedScene", scene);
        Storage.set("selectedScene", scene);
      }
      const lastSelectedScene = CONFIG.selectedScene;
      CONFIG.selectedScene = scene;
      return EventBus.getInstance().trigger(EVENTS.change_scene, {type: EVENTS.change_scene, from: lastSelectedScene, to: scene});
    }
  },

  setShowLoreNotifications(val) {},
    // nothing yet

  getRegistrationDate() {
    return this.get('created_at');
  },

  onLtvChanged(val){
    const currentLtv = val.get("ltv");
    Analytics.identify(null,{ltv:currentLtv});

    // Detect first monetization event
    const previousLtv = val.previous("ltv") || 0;
    if ((previousLtv === 0) && (currentLtv !== 0)) {
      // TODO: There are probably better ways to track this now?
      return Analytics.track("first purchase made", {
        category: Analytics.EventCategory.FTUE,
        price: currentLtv,
      },{
        sendUTMData:true,
        valueKey: "price",
        nonInteraction: 1
      });
    }
  }
});

module.exports = Profile;
