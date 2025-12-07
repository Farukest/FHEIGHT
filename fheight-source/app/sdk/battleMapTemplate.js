/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const SDKObject = require('./object');
const CONFIG = require('app/common/config');
const UtilsJavascript =     require('app/common/utils/utils_javascript');
const _ = require('underscore');

/*
  Helper class that stores properties used to create the battle map environment a game is played in (map, weather, etc).
*/
class BattleMapTemplate extends SDKObject {
  static initClass() {
  
    this.prototype.mapTemplate = {
      map: 0,
      weatherChance: 0.0,
      rainChance: 0.0,
      snowChance: 0.0,
      blueDustChance: 0.0,
      blueDustColor: null,
      sunRaysChance: 0.0,
      clouds: []
    };
    this.prototype.hasWeather = false;
    this.prototype.hasRain = false;
    this.prototype.hasSnow = false;
    this.prototype.hasBlueDust = false;
    this.prototype.hasSunRays = false;
  }

  // region INITIALIZATION

  constructor(gameSession,templateIndex) {
    super(gameSession);

    // define public properties here that must be always be serialized
    // do not define properties here that should only serialize if different from the default
    // if no templateIndex provided, choose a map at random
    if (templateIndex == null) { templateIndex = _.sample(CONFIG.BATTLEMAP_DEFAULT_INDICES); }
    // get a random battlemap template from the list of available maps
    this.mapTemplate = CONFIG.BATTLEMAP_TEMPLATES[templateIndex];

    // each map may have custom weather
    this.updateWeather();
  }

  // endregion INITIALIZATION

  // region GETTERS

  getMapTemplate() {
    return this.mapTemplate;
  }

  getMap() {
    if (this.mapTemplate != null) { return this.mapTemplate.map; } else { return BattleMapTemplate.prototype.mapTemplate.map; }
  }

  getClouds() {
    if (this.mapTemplate != null) { return this.mapTemplate.clouds; } else { return BattleMapTemplate.prototype.mapTemplate.clouds; }
  }

  getBlueDustColor() {
    if (this.mapTemplate != null) { return this.mapTemplate.blueDustColor; } else { return BattleMapTemplate.prototype.mapTemplate.blueDustColor; }
  }

  getHasWeather() {
    return this.hasWeather;
  }

  getHasRain() {
    return this.hasRain;
  }

  getHasSnow() {
    return this.hasSnow;
  }

  getHasBlueDust() {
    return this.hasBlueDust;
  }

  getHasSunRays() {
    return this.hasSunRays;
  }

  // endregion GETTERS

  // region WEATHER

  updateWeather() {
    // reset map
    this.hasSnow = false;
    this.hasRain = false;
    this.hasBlueDust = false;
    this.hasSunRays = false;
    this.hasWeather = false;

    // setup map
    const mapTemplate = this.getMapTemplate();
    const weatherChance = (mapTemplate.weatherChance != null) ? mapTemplate.weatherChance : BattleMapTemplate.prototype.mapTemplate.weatherChance;
    let rainChance = mapTemplate.rainChance ? mapTemplate.rainChance : BattleMapTemplate.prototype.mapTemplate.rainChance;
    let snowChance = mapTemplate.snowChance ? mapTemplate.snowChance : BattleMapTemplate.prototype.mapTemplate.snowChance;
    const blueDustChance = mapTemplate.blueDustChance ? mapTemplate.blueDustChance : BattleMapTemplate.prototype.mapTemplate.blueDustChance;
    const sunRaysChance = mapTemplate.sunRaysChance ? mapTemplate.sunRaysChance : BattleMapTemplate.prototype.mapTemplate.sunRaysChance;

    // check the weather
    this.hasWeather = Math.random() <= weatherChance;
    if (this.hasWeather) {
      let totalChances = ((snowChance * snowChance) + (rainChance * rainChance));
      if (totalChances !== 0.0) {
        // all individual weather chances will be normalized to add up to 100%
        // ex: if we can have rain, snow, and storm, but rain and storm have 0% chance, snow will be 100%
        totalChances = 1.0 / totalChances;
        snowChance *= totalChances;
        rainChance *= totalChances;

        const weatherTypeChance = Math.random();
        if (weatherTypeChance <= snowChance) {
          return this.hasSnow = true;
        } else if (weatherTypeChance <= (snowChance + rainChance)) {
          return this.hasRain = true;
        }
      }
    } else {
      this.hasBlueDust = Math.random() <= blueDustChance;
      return this.hasSunRays = Math.random() <= sunRaysChance;
    }
  }

  // endregion WEATHER

  // region SERIALIZATION

  deserialize(data) {
    return UtilsJavascript.fastExtend(this,data);
  }
}
BattleMapTemplate.initClass();

  // endregion SERIALIZATION

module.exports = BattleMapTemplate;
