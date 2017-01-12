const i18n = require('i18n');
const sortActivities = require('./activity-sorter');

module.exports = class ActivityViewModel {

  constructor(unsorted, lastSortedActivity) {
    this.activities = [].concat(unsorted.map(x => this.activityModel(x, false)));
    this.activities = sortActivities(this.activities);
    if (lastSortedActivity) {
      this.categorisedActivity = this.activityModel(lastSortedActivity);
    }
  }

  activityModel(activity) {
    return Object.assign(
      {
        // eslint-disable-next-line no-underscore-dangle
        title: i18n.__(`activity.${activity.activity}.title`),
        // eslint-disable-next-line no-underscore-dangle
        details: i18n.__(`activity.${activity.activity}.details`),
      }, activity);
  }
};
