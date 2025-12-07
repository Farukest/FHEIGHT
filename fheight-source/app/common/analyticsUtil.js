/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
const _ = require('underscore');
const moment = require('moment');


class AnalyticsUtil {
  static initClass() {
    this.RecordedDaysSeenOn = [1,3,7,15,30,60];
  }

  /**
   * Converts representation of the days a user was seen on from an array to an object
   * @public
   * @param  {Array}        daysSeenOn  User ID for which to update.
   * @param  {Object}      dataTarget  (optional) An object to set the values on to
   * @return  {Object}  Either dataTarget passed in or a new object with days seen on recorded as named key values
   */
  static convertDaysSeenOnFromArrayToObject(daysSeenOn,dataTarget){
    if ((dataTarget == null)) {
      dataTarget = {};
    }

    for (var recordedDayIndex of Array.from(this.RecordedDaysSeenOn)) {
      if (_.contains(daysSeenOn,recordedDayIndex)) {
        dataTarget[this.nameForSeenOnDay(recordedDayIndex)] = 1;
      }
    }

    return dataTarget;
  }

  /**
   * Given two moments returns the registered cohort day this represents, if one exists
   * @public
   * @param  {Moment}  registrationMoment  moment object representing when a user registered
   * @param  {Moment}  seenOnMoment        moment object representing time user was seen
   * @return  {Integer||Null}  Either the integer value for the recorded day or null
   */
  static recordedDayIndexForRegistrationAndSeenOn(registrationMoment,seenOnMoment){
    const daysSinceRegistration = seenOnMoment.clone().diff(registrationMoment.clone(),'days');

    const isRecordedDay = _.contains(this.RecordedDaysSeenOn,daysSinceRegistration);

    if (isRecordedDay) {
      return daysSinceRegistration;
    } else {
      return null;
    }
  }

  static nameForSeenOnDay(dayIndex){
    return "seen_on_d" + dayIndex;
  }
}
AnalyticsUtil.initClass();


module.exports = AnalyticsUtil;
