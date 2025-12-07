/*
 * decaffeinate suggestions:
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/main/docs/suggestions.md
 */
// Enum for the different types of Analytics Event Priority
// Lower numbers are lower priority, actual interger values are arbitrary


class AnalyticsEventPriority {
  static initClass() {
  
    this.Critical = 5;
    this.High = 4;
    this.Medium = 3;
    this.Low = 2;
    this.Optional = 1;
  }
}
AnalyticsEventPriority.initClass();


module.exports = AnalyticsEventPriority;
