/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const _ = require('underscore');
const LoggerAnalyticsModule = require('app/common/analyticsModules/loggerAnalyticsModule');
const AnalyticsEventPriority = require('app/common/analyticsModules/analyticsEventPriority');
const AnalyticsEventCategory = require('app/common/analyticsModules/analyticsEventCategory');

/*
Tracking options:
  -labelKey: String key of value in event parameters to treat as event label
  -valueKey: String key of value in event parameters to treat as event value
  -sendUTMData: Boolean of whether or not to send utm data with event (assumed false)
  -nonInteraction: Boolean of whether or not this event is automated or stems from user interaction
The above are all optional
*/


class Analytics {
  static initClass() {
  
    this.EventPriority = AnalyticsEventPriority;
    this.EventCategory = AnalyticsEventCategory;
    // @_groupPriority - allows the user of a predefined priority for a group of hits,
    // set with @setGroupPriority, and always clear with @clearGroupPriority after group is complete
    this._groupPriority = undefined;
    this._defaultPriority = AnalyticsEventPriority.High;
     // The priority used for events tracked when there is no priority passed, or group priority set
  }

  static _getAnalyticsModules() {
    const analyticsModules = [];

    if (LoggerAnalyticsModule.isActive()) {
      analyticsModules.push(LoggerAnalyticsModule);
    }

    return analyticsModules;
  }


  static identify(id,params,utmParams) {
    return (() => {
      const result = [];
      for (var module of Array.from(this._getAnalyticsModules())) {
        if (module.identify !== undefined) {
          result.push(module.identify(id,params,utmParams));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  static page(title,params) {
    return (() => {
      const result = [];
      for (var module of Array.from(this._getAnalyticsModules())) {
        if (module.page !== undefined) {
          result.push(module.page(title,params));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  static screen(title,params) {
    return (() => {
      const result = [];
      for (var module of Array.from(this._getAnalyticsModules())) {
        if (module.screen !== undefined) {
          result.push(module.screen(title, params));
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  /**
   * Completes a challenge for a user and unlocks any rewards !if! it's not already completed
   * @public
   * @param  {String}  eventName        Name of event to be tracked
   * @param  {Object}  params          Context data of event being tracked (per event metrics and attributes) (optional)
   * @param  {Object}  trackOptions    Contains options for how to be tracked, SEE TOP OF FILE FOR DEFINITIONS (optional)
   * @param  {EventPriority}  priority  Priority of event, used to filter which modules receive this event, defaults to Analytics._defaultPriority (optional)
   * @return  No returned value
   */
  static track(eventName,params,trackOptions, priority) {
    // Uses passed in priority, if none passed uses set group priority, if no group priority uses default priority
    if (_.isUndefined(priority)) {
      priority = this._defaultPriority;
      if (!_.isUndefined(this._groupPriority)) {
        priority = this._groupPriority;
      }
    }

    return (() => {
      const result = [];
      for (var module of Array.from(this._getAnalyticsModules())) {
        if (module.track !== undefined) {
          // Check priority filter
          if (_.isUndefined(module.minPriorityToReportEvent) || (priority >= module.minPriorityToReportEvent)) {
            result.push(module.track(eventName,params,trackOptions));
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  static trackMonetizationEvent(productSku,price, priority) {

    // Uses passed in priority, if none passed uses set group priority, if no group priority uses default priority
    if (_.isUndefined(priority)) {
      priority = this._defaultPriority;
      if (!_.isUndefined(this._groupPriority)) {
        priority = this._groupPriority;
      }
    }

    return (() => {
      const result = [];
      for (var module of Array.from(this._getAnalyticsModules())) {
        if (module.trackMonetizationEvent !== undefined) {
          // Check priority filter
          if (_.isUndefined(module.minPriorityToReportEvent) || (priority >= module.minPriorityToReportEvent)) {
            result.push(module.trackMonetizationEvent(productSku,price));
          } else {
            result.push(undefined);
          }
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  static reset() {
    return (() => {
      const result = [];
      for (var module of Array.from(this._getAnalyticsModules())) {
        if (module.reset !== undefined) {
          result.push(module.reset());
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }

  static setGroupPriority(groupPriority) {
    return this._groupPriority = groupPriority;
  }

  static clearGroupPriority() {
    return this._groupPriority = undefined;
  }

  // Toggles each modules logging if logging is enableable
  static toggleLoggingEnabled() {
    return (() => {
      const result = [];
      for (var module of Array.from(this._getAnalyticsModules())) {
        if (module.toggleLoggingEnabled !== undefined) {
          result.push(module.toggleLoggingEnabled());
        } else {
          result.push(undefined);
        }
      }
      return result;
    })();
  }
}
Analytics.initClass();

module.exports = Analytics;
