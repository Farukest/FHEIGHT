/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const _ = require('underscore');
const Logger = require('app/common/logger');
const AnalyticsEventPriority = require('./analyticsEventPriority');

class LoggerAnalyticsModule {
  static initClass() {
  
    this._deactivate = true;
  }

  static isActive() {
    if (!this._deactivate) {
      return true;
    } else {
      return false;
    }
  }

  static identify(id,params) {
    return Logger.module("Analytics").log(`identify() -> id: ${id}. params: ${JSON.stringify(params)}`);
  }

  static page(title,params) {
    return Logger.module("Analytics").log(`page() -> title: ${title}. params: ${JSON.stringify(params)}`);
  }

  static screen(title,params) {
    return Logger.module("Analytics").log(`screen() -> title: ${title}. params: ${JSON.stringify(params)}`);
  }

  static track(eventName,params) {
    return Logger.module("Analytics").log(`track() -> eventName: ${eventName}. params: ${JSON.stringify(params)}`);
  }

  static reset() {
    return Logger.module("Analytics").log("reset().");
  }
}
LoggerAnalyticsModule.initClass();


module.exports = LoggerAnalyticsModule;
